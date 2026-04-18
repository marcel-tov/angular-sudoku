import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Signal,
    WritableSignal,
    effect,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import {MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule} from '@angular/forms';
import {createWorker, Worker as TesseractWorker} from 'tesseract.js';
import {SudokuGrid, SudokuValue} from '../grid-helper/types';

type ScanPhase = 'camera' | 'processing' | 'review';

@Component({
    selector: 'scan-dialog',
    templateUrl: './scan-dialog.component.html',
    styleUrls: ['./scan-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormsModule,
    ],
})
class ScanDialogComponent implements OnInit, OnDestroy {
    public readonly phase: WritableSignal<ScanPhase> = signal<ScanPhase>('camera');
    public readonly processingProgress: WritableSignal<number> = signal<number>(0);
    public readonly processingMessage: WritableSignal<string> = signal<string>('Initialising OCR engine…');
    public readonly reviewGrid: WritableSignal<Array<Array<string>>> = signal<Array<Array<string>>>(
        Array.from({length: 9}, (): Array<string> => Array<string>(9).fill('')),
    );
    public readonly cameraError: WritableSignal<string | null> = signal<string | null>(null);

    // Overlay dimensions updated each draw frame
    protected overlayLeft: number = 0;
    protected overlayTop: number = 0;
    protected overlaySize: number = 0;

    // Signal-based view queries — reactive, works correctly with @if blocks
    private readonly videoEl: Signal<ElementRef<HTMLVideoElement> | undefined> =
        viewChild<ElementRef<HTMLVideoElement>>('videoEl');
    private readonly overlayCanvas: Signal<ElementRef<HTMLCanvasElement> | undefined> =
        viewChild<ElementRef<HTMLCanvasElement>>('overlayCanvas');
    private readonly stream: WritableSignal<MediaStream | null> = signal<MediaStream | null>(null);
    private animFrameId: number | null = null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    private readonly dialogRef: MatDialogRef<ScanDialogComponent, SudokuGrid | null> =
        inject(MatDialogRef<ScanDialogComponent, SudokuGrid | null>);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    public constructor() {
        // Attach the stream to the video element as soon as both become available.
        // Using signal-based viewChild() means this effect re-runs whenever the
        // @if block adds/removes the video element from the DOM.
        effect((): void => {
            const el: HTMLVideoElement | undefined = this.videoEl()?.nativeElement;
            const stream: MediaStream | null = this.stream();

            if (!el || !stream) {
                return;
            }

            el.srcObject = stream;
            void el.play().then((): void => {
                this.scheduleOverlayDraw();
            }).catch((): void => {
                this.cameraError.set('Could not start video playback.');
                this.cdr.markForCheck();
            });
        });
    }

    public async ngOnInit(): Promise<void> {
        // Safari on iOS requires HTTPS (or localhost) for getUserMedia
        if (!this.isSecureContext()) {
            this.cameraError.set('Camera access requires a secure connection (HTTPS). Please open the app via HTTPS.');
            this.cdr.markForCheck();

            return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            this.cameraError.set('Your browser does not support camera access. Try Safari on iOS 14.3+ or Chrome on Android.');
            this.cdr.markForCheck();

            return;
        }

        const stream: MediaStream | null = await this.openCamera();

        if (stream) {
            // Setting the signal triggers the effect above, which attaches it to the
            // video element once Angular renders (or immediately if already rendered).
            this.stream.set(stream);
        }

        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.stopStream();

        if (this.animFrameId !== null) {
            cancelAnimationFrame(this.animFrameId);
        }
    }

    public async capture(): Promise<void> {
        const videoEl: HTMLVideoElement | undefined = this.videoEl()?.nativeElement;
        const overlayCanvas: HTMLCanvasElement | undefined = this.overlayCanvas()?.nativeElement;

        if (!videoEl || !overlayCanvas) {
            return;
        }

        // Scale overlay back to video's natural resolution
        const scaleX: number = videoEl.videoWidth / videoEl.clientWidth;
        const scaleY: number = videoEl.videoHeight / videoEl.clientHeight;
        const scale: number = Math.min(scaleX, scaleY);

        const captureX: number = Math.round(this.overlayLeft * scaleX);
        const captureY: number = Math.round(this.overlayTop * scaleY);
        const captureSize: number = Math.round(this.overlaySize * scale);

        const offscreen: HTMLCanvasElement = document.createElement('canvas');
        offscreen.width = captureSize;
        offscreen.height = captureSize;
        const offCtx: CanvasRenderingContext2D | null = offscreen.getContext('2d');

        if (!offCtx) {
            return;
        }

        offCtx.drawImage(videoEl, captureX, captureY, captureSize, captureSize, 0, 0, captureSize, captureSize);

        this.stopStream();

        if (this.animFrameId !== null) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }

        this.phase.set('processing');
        this.cdr.markForCheck();

        await this.runOcr(offscreen);
    }

    public importGrid(): void {
        const grid: SudokuGrid = this.reviewGrid().map(
            (row: Array<string>): Array<SudokuValue> => row.map(
                (cell: string): SudokuValue => {
                    const n: number = parseInt(cell, 10);

                    return (n >= 1 && n <= 9) ? (n as SudokuValue) : null;
                },
            ),
        );

        this.dialogRef.close(grid);
    }

    public close(): void {
        this.dialogRef.close(null);
    }

    public trackByIndex(index: number): number {
        return index;
    }

    // Extracted for testability — jsdom cannot redefine window.location
    protected isSecureContext(): boolean {
        return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private async openCamera(): Promise<MediaStream | null> {
        // Try rear camera first, fall back to any available camera
        const constraints: Array<MediaStreamConstraints> = [
            {video: {facingMode: {ideal: 'environment'}}},
            {video: true},
        ];

        for (const constraint of constraints) {
            try {
                return await navigator.mediaDevices.getUserMedia(constraint);
            } catch (err: unknown) {
                const isDenied: boolean =
                    err instanceof DOMException &&
                    (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');

                if (isDenied) {
                    this.cameraError.set('Camera permission was denied. Please allow camera access in your browser settings and try again.');

                    return null;
                }
                // NotFoundError / OverconstrainedError → try next constraint
            }
        }

        this.cameraError.set('No camera was found on this device.');

        return null;
    }

    private scheduleOverlayDraw(): void {
        const draw: () => void = (): void => {
            this.drawOverlay();
            this.animFrameId = requestAnimationFrame(draw);
        };

        this.animFrameId = requestAnimationFrame(draw);
    }

    private drawOverlay(): void {
        const videoEl: HTMLVideoElement | undefined = this.videoEl()?.nativeElement;
        const canvas: HTMLCanvasElement | undefined = this.overlayCanvas()?.nativeElement;

        if (!videoEl || !canvas) {
            return;
        }

        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        canvas.width = videoEl.clientWidth;
        canvas.height = videoEl.clientHeight;

        const size: number = Math.min(videoEl.clientWidth, videoEl.clientHeight) * 0.85;
        const left: number = (videoEl.clientWidth - size) / 2;
        const top: number = (videoEl.clientHeight - size) / 2;

        this.overlayLeft = left;
        this.overlayTop = top;
        this.overlaySize = size;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dim outside the grid area
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(left, top, size, size);

        // Thin grid lines
        ctx.strokeStyle = 'rgba(100,200,100,0.9)';
        ctx.lineWidth = 1;

        for (let i: number = 0; i <= 9; i++) {
            const xPos: number = left + (size / 9) * i;
            ctx.beginPath();
            ctx.moveTo(xPos, top);
            ctx.lineTo(xPos, top + size);
            ctx.stroke();

            const yPos: number = top + (size / 9) * i;
            ctx.beginPath();
            ctx.moveTo(left, yPos);
            ctx.lineTo(left + size, yPos);
            ctx.stroke();
        }

        // Thick 3×3 box borders
        ctx.strokeStyle = 'rgba(100,230,100,1)';
        ctx.lineWidth = 3;

        for (let i: number = 0; i <= 3; i++) {
            const xPos: number = left + (size / 3) * i;
            ctx.beginPath();
            ctx.moveTo(xPos, top);
            ctx.lineTo(xPos, top + size);
            ctx.stroke();

            const yPos: number = top + (size / 3) * i;
            ctx.beginPath();
            ctx.moveTo(left, yPos);
            ctx.lineTo(left + size, yPos);
            ctx.stroke();
        }
    }

    private async runOcr(source: HTMLCanvasElement): Promise<void> {
        const cellSize: number = Math.floor(source.width / 9);
        const parsedGrid: Array<Array<string>> = Array.from(
            {length: 9},
            (): Array<string> => Array<string>(9).fill(''),
        );

        this.processingMessage.set('Loading OCR engine…');
        this.cdr.markForCheck();

        const worker: TesseractWorker = await createWorker('eng', 1, {
            logger: (): void => undefined,
        });

        // Tesseract parameter keys use snake_case by API convention
        /* eslint-disable @typescript-eslint/naming-convention */
        await worker.setParameters({
            tessedit_char_whitelist: '123456789',
        });
        /* eslint-enable @typescript-eslint/naming-convention */

        let processed: number = 0;
        const total: number = 81;

        for (let row: number = 0; row < 9; row++) {
            for (let col: number = 0; col < 9; col++) {
                const cellCanvas: HTMLCanvasElement = document.createElement('canvas');
                const padding: number = Math.floor(cellSize * 0.1);
                const innerSize: number = cellSize - padding * 2;
                cellCanvas.width = innerSize;
                cellCanvas.height = innerSize;
                const cellCtx: CanvasRenderingContext2D | null = cellCanvas.getContext('2d');

                if (!cellCtx) {
                    continue;
                }

                cellCtx.fillStyle = '#fff';
                cellCtx.fillRect(0, 0, innerSize, innerSize);
                cellCtx.drawImage(
                    source,
                    col * cellSize + padding,
                    row * cellSize + padding,
                    innerSize,
                    innerSize,
                    0,
                    0,
                    innerSize,
                    innerSize,
                );

                const result: Tesseract.RecognizeResult = await worker.recognize(cellCanvas);
                const digit: string = result.data.text.trim().replace(/[^1-9]/g, '');
                parsedGrid[row][col] = digit.length === 1 ? digit : '';

                processed++;
                this.processingProgress.set(Math.round((processed / total) * 100));
                this.processingMessage.set(`Scanning cell ${processed} of ${total}…`);
                this.cdr.markForCheck();
            }
        }

        await worker.terminate();

        this.reviewGrid.set(parsedGrid);
        this.phase.set('review');
        this.cdr.markForCheck();
    }

    private stopStream(): void {
        const stream: MediaStream | null = this.stream();

        if (stream) {
            stream.getTracks().forEach((t: MediaStreamTrack): void => t.stop());
            this.stream.set(null);
        }
    }
}

export {ScanDialogComponent};
