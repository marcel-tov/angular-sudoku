import {ScanDialogComponent} from './scan-dialog.component';
import {Spectator, createComponentFactory, SpectatorFactory} from '@ngneat/spectator/jest';
import {MatDialogRef} from '@angular/material/dialog';
import {SudokuGrid} from '../grid-helper/types';

// Stub getUserMedia so tests work in jsdom (no real camera)
Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
        getUserMedia: jest.fn().mockResolvedValue({
            getTracks: (): Array<{stop: jest.Mock}> => [{stop: jest.fn()}],
        } as unknown as MediaStream),
    },
    writable: true,
    configurable: true,
});

// jsdom uses http://localhost — that passes the HTTPS guard in ngOnInit
describe('ScanDialogComponent', () => {
    let spectator: Spectator<ScanDialogComponent>;

    const createComponent: SpectatorFactory<ScanDialogComponent> = createComponentFactory({
        component: ScanDialogComponent,
        mocks: [MatDialogRef],
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue({
            getTracks: (): Array<{stop: jest.Mock}> => [{stop: jest.fn()}],
        } as unknown as MediaStream);
        spectator = createComponent();
    });

    // ── Initial state ──────────────────────────────────────────────────────────

    it('should create the component', () => {
        spectator.detectChanges();
        expect(spectator.component).toBeTruthy();
    });

    it('should start in the camera phase', () => {
        expect(spectator.component.phase()).toBe('camera');
    });

    it('should initialise with empty review grid (9×9 empty strings)', () => {
        const grid: Array<Array<string>> = spectator.component.reviewGrid();
        expect(grid).toHaveLength(9);
        grid.forEach((row: Array<string>) => {
            expect(row).toHaveLength(9);
            row.forEach((cell: string) => {
                expect(cell).toBe('');
            });
        });
    });

    it('should initialise with no camera error', () => {
        expect(spectator.component.cameraError()).toBeNull();
    });

    it('should initialise processingProgress at 0', () => {
        expect(spectator.component.processingProgress()).toBe(0);
    });

    // ── close() ───────────────────────────────────────────────────────────────

    it('should close dialog with null when close() is called', () => {
        spectator.component.close();
        expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledWith(null);
    });

    // ── importGrid() ──────────────────────────────────────────────────────────

    it('should convert reviewGrid strings to SudokuGrid and close dialog on importGrid()', () => {
        const reviewGrid: Array<Array<string>> = Array.from({length: 9}, (): Array<string> => Array<string>(9).fill(''));
        reviewGrid[0][0] = '5';
        reviewGrid[4][4] = '9';
        reviewGrid[8][8] = '3';

        spectator.component.reviewGrid.set(reviewGrid);
        spectator.component.importGrid();

        const closeArg: SudokuGrid = spectator.inject(MatDialogRef).close.mock.calls[0][0] as SudokuGrid;
        expect(closeArg[0][0]).toBe(5);
        expect(closeArg[4][4]).toBe(9);
        expect(closeArg[8][8]).toBe(3);
    });

    it('should map empty cells to null in importGrid()', () => {
        spectator.component.importGrid();
        const closeArg: SudokuGrid = spectator.inject(MatDialogRef).close.mock.calls[0][0] as SudokuGrid;
        expect(closeArg[0][0]).toBeNull();
    });

    it('should map out-of-range values to null in importGrid()', () => {
        const reviewGrid: Array<Array<string>> = Array.from({length: 9}, (): Array<string> => Array<string>(9).fill(''));
        reviewGrid[0][0] = '0'; // 0 is invalid
        reviewGrid[1][0] = 'x'; // non-digit
        spectator.component.reviewGrid.set(reviewGrid);
        spectator.component.importGrid();
        const closeArg: SudokuGrid = spectator.inject(MatDialogRef).close.mock.calls[0][0] as SudokuGrid;
        expect(closeArg[0][0]).toBeNull();
        expect(closeArg[1][0]).toBeNull();
    });

    // ── trackByIndex() ────────────────────────────────────────────────────────

    it('should return the index from trackByIndex()', () => {
        expect(spectator.component.trackByIndex(0)).toBe(0);
        expect(spectator.component.trackByIndex(7)).toBe(7);
    });

    // ── ngOnInit – camera access ───────────────────────────────────────────────

    it('should request camera access on init', async () => {
        await spectator.component.ngOnInit();
        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(
            expect.objectContaining({video: expect.anything()}),
        );
    });

    it('should set permission-denied error when getUserMedia throws NotAllowedError', async () => {
        const err: DOMException = new DOMException('denied', 'NotAllowedError');
        (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValueOnce(err);
        await spectator.component.ngOnInit();
        expect(spectator.component.cameraError()).toContain('permission');
    });

    it('should fall back and set no-camera error when all constraints are overcontrained', async () => {
        // Both constraints throw OverconstrainedError (not a permission error)
        const err: DOMException = new DOMException('overconstrained', 'OverconstrainedError');
        (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValue(err);
        await spectator.component.ngOnInit();
        expect(spectator.component.cameraError()).toContain('No camera');
    });

    it('should set HTTPS error when isSecureContext returns false', async () => {
        // isSecureContext is extracted for testability so we don't need to redefine window.location
        jest.spyOn(spectator.component as any, 'isSecureContext').mockReturnValue(false);
        await spectator.component.ngOnInit();
        expect(spectator.component.cameraError()).toContain('HTTPS');
    });
});
