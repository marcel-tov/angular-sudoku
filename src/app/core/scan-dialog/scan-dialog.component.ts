import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Signal,
    WritableSignal,
    computed,
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
import {initializeApp, FirebaseApp} from 'firebase/app';
import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend,
    AI,
    GenerativeModel,
    GenerateContentResult,
} from 'firebase/ai';
import {firebaseConfig} from './firebase.config';
import {isValidGrid} from './is-valid-grid';
import {validateReviewGrid} from './validate-review-grid';
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
    public readonly processingMessage: WritableSignal<string> = signal<string>('Initialising…');
    public readonly reviewGrid: WritableSignal<Array<Array<string>>> = signal<Array<Array<string>>>(
        Array.from({length: 9}, (): Array<string> => Array<string>(9).fill('')),
    );
    public readonly cameraError: WritableSignal<string | null> = signal<string | null>(null);

    // 9×9 matrix — true where a cell value conflicts with another in its row/col/box
    public readonly conflictCells: Signal<Array<Array<boolean>>> = computed(
        (): Array<Array<boolean>> => validateReviewGrid(this.reviewGrid()),
    );
    public readonly hasConflicts: Signal<boolean> = computed(
        (): boolean => this.conflictCells().some(
            (row: Array<boolean>): boolean => row.some(Boolean),
        ),
    );

    protected overlayLeft: number = 0;
    protected overlayTop: number = 0;
    protected overlaySize: number = 0;

    // Signal-based view queries — reactive with @if blocks
    private readonly videoEl: Signal<ElementRef<HTMLVideoElement> | undefined> =
        viewChild<ElementRef<HTMLVideoElement>>('videoEl');
    private readonly overlayCanvas: Signal<ElementRef<HTMLCanvasElement> | undefined> =
        viewChild<ElementRef<HTMLCanvasElement>>('overlayCanvas');

    private readonly stream: WritableSignal<MediaStream | null> = signal<MediaStream | null>(null);
    private animFrameId: number | null = null;
    private firebaseApp: FirebaseApp | null = null;
    private firebaseAI: AI | null = null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    private readonly dialogRef: MatDialogRef<ScanDialogComponent, SudokuGrid | null> =
        inject(MatDialogRef<ScanDialogComponent, SudokuGrid | null>);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    public constructor() {
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

        if (!videoEl) {
            return;
        }

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

        await this.recognizeWithGemini(offscreen);
    }

    public importGrid(): void {
        const grid: SudokuGrid = this.reviewGrid().map(
            (row: Array<string>): Array<SudokuValue> => row.map(
                (cell: string): SudokuValue => {
                    const n: number = parseInt(cell, 10);

                    return (n >= 1 && n <= 9) ? (n as SudokuValue) : null;
                },
            ),
        ) as unknown as SudokuGrid;

        this.dialogRef.close(grid);
    }

    public close(): void {
        this.dialogRef.close(null);
    }

    public async retry(): Promise<void> {
        this.stopStream();

        if (this.animFrameId !== null) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }

        this.cameraError.set(null);
        this.processingProgress.set(0);
        this.reviewGrid.set(Array.from({length: 9}, (): Array<string> => Array<string>(9).fill('')));
        this.phase.set('camera');
        this.cdr.markForCheck();

        const stream: MediaStream | null = await this.openCamera();

        if (stream) {
            this.stream.set(stream);
        }

        this.cdr.markForCheck();
    }

    public trackByIndex(index: number): number {
        return index;
    }

    protected isSecureContext(): boolean {
        return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private async openCamera(): Promise<MediaStream | null> {
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

        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(left, top, size, size);

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

    // ── Gemini via Firebase AI Logic ──────────────────────────────────────────

    /**
     * Sends the captured grid image to Gemini 2.5 Flash via Firebase AI Logic.
     * Gemini returns the full 9×9 grid as a JSON array which is then loaded
     * directly into the review grid.
     */
    private async recognizeWithGemini(gridCanvas: HTMLCanvasElement): Promise<void> {
        try {
            this.processingProgress.set(40);
            this.processingMessage.set('Sending image to Gemini…');
            this.cdr.markForCheck();

            // Lazy-init Firebase (safe to call multiple times)
            if (!this.firebaseApp) {
                this.firebaseApp = initializeApp(firebaseConfig);
            }

            if (!this.firebaseAI) {
                this.firebaseAI = getAI(this.firebaseApp, {backend: new GoogleAIBackend()});
            }

            const model: GenerativeModel = getGenerativeModel(this.firebaseAI, {
                model: 'gemini-2.5-flash',
                generationConfig: {responseMimeType: 'application/json'},
            });

            // Convert the canvas to a base64 PNG for the inline image part
            const base64: string = gridCanvas.toDataURL('image/png').split(',')[1] ?? '';

            const prompt: string = [
                'This image shows a sudoku puzzle grid (9×9 cells, 3×3 boxes).',
                'Read every cell carefully.',
                'Return ONLY a valid JSON 2D array: 9 rows, each with 9 values.',
                'Use null for empty cells and the integer (1–9) for filled cells.',
                'Example: [[5,3,null,null,7,null,null,null,null],[6,null,null,1,9,5,null,null,null],...]',
                'Return only the JSON array — no explanation, no markdown.',
            ].join(' ');

            this.processingProgress.set(55);
            this.cdr.markForCheck();

            const result: GenerateContentResult = await model.generateContent([
                prompt,
                {inlineData: {mimeType: 'image/png', data: base64}},
            ]);

            this.processingProgress.set(85);
            this.processingMessage.set('Parsing result…');
            this.cdr.markForCheck();

            const responseText: string = result.response.text().trim();
            const parsed: unknown = JSON.parse(responseText);

            if (!isValidGrid(parsed)) {
                throw new Error('Gemini returned an unexpected grid format.');
            }

            const reviewGrid: Array<Array<string>> = (parsed as Array<Array<number | null>>).map(
                (row: Array<number | null>): Array<string> =>
                    row.map((cell: number | null): string => (cell !== null ? String(cell) : '')),
            );

            this.reviewGrid.set(reviewGrid);
            this.processingProgress.set(100);
            this.phase.set('review');
        } catch (err: unknown) {
            const message: string = err instanceof Error ? err.message : 'Unknown error';
            this.cameraError.set(`AI recognition failed: ${message}`);
            this.phase.set('camera');
        } finally {
            this.cdr.markForCheck();
        }
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
