jest.mock('../scan-dialog/firebase-status', () => ({
    isFirebaseConfigured: true,
}));

import {GridComponent, IOnFinishGridEvent} from './grid.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';
import {
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import {SudokuGrid} from '../grid-helper/types';
import {getEmptyRow} from '../grid-helper/empty-row';

describe('GridComponent', () => {
    const grid: SudokuGrid = [
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
    ];
    let spectator: Spectator<GridComponent>;
    const createComponent: SpectatorFactory<GridComponent> = createComponentFactory({
        component: GridComponent,
        imports: [
            MatDialogModule,
        ],
        mocks: [
            MatDialogRef,
        ],
        declareComponent: false,
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => {
        spectator = createComponent();
        jest.useFakeTimers({
            legacyFakeTimers: true,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('Does show grid container', () => {
        spectator.setInput('originalGrid', grid);
        spectator.detectChanges();
        expect(spectator.query('div')).toHaveClass('grid');
    });

    it('Does show top navigation', () => {
        spectator.setInput({originalGrid: grid, showTopNavigation: false, showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).not.toHaveDescendant('grid-top-navigation');

        spectator.setInput({showTopNavigation: true, showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).toHaveDescendant('grid-top-navigation');
    });

    it('Does show footer navigation', () => {
        spectator.setInput({originalGrid: grid, showTopNavigation: false, showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).not.toHaveDescendant('grid-footer-navigation');

        spectator.setInput({showTopNavigation: false, showFooterNavigation: true});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).toHaveDescendant('grid-footer-navigation');
    });

    it('On share button does share grid', () => {
        spectator.setInput('originalGrid', grid);
        const shareSpy: jest.SpyInstance = jest.spyOn(spectator.component.share, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('share', {selector: 'button'});
        spectator.click(selector);
        expect(shareSpy).toHaveBeenCalledWith(spectator.component.originalGrid());
    });

    it('On create button does create grid', () => {
        spectator.setInput('originalGrid', grid);
        const createSpy: jest.SpyInstance = jest.spyOn(spectator.component.create, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('autorenew', {selector: 'button'});
        spectator.click(selector);
        expect(createSpy).toHaveBeenCalledWith();
    });

    it('On scan button does emit scan event', () => {
        spectator.setInput('originalGrid', grid);
        const scanSpy: jest.SpyInstance = jest.spyOn(spectator.component.scan, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('photo_camera', {selector: 'button'});
        spectator.click(selector);
        expect(scanSpy).toHaveBeenCalledWith();
    });

    it('On click lock button changes lock value', () => {
        spectator.setInput('originalGrid', grid);
        spectator.detectChanges();
        expect(spectator.component.lockValues()).toBe(true);
        spectator.click(byTextContent('lock', {selector: 'button'}));
        expect(spectator.component.lockValues()).toBe(false);
        spectator.click(byTextContent('lock_open', {selector: 'button'}));
        expect(spectator.component.lockValues()).toBe(true);
    });

    it('On click nominees button changes nominees value', () => {
        spectator.setInput('originalGrid', grid);
        spectator.detectChanges();
        expect(spectator.component.showNominees()).toBe(false);
        spectator.click(byTextContent('Nominees', {selector: 'button'}));
        expect(spectator.component.showNominees()).toBe(true);
        spectator.click(byTextContent('Nominees', {selector: 'button'}));
        expect(spectator.component.showNominees()).toBe(false);
    });

    describe('solvedGrid computed', () => {
        it('should return null when isHelpEnabled is false', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            expect((spectator.component as any).solvedGrid()).toBeNull();
        });

        it('should return solved grid when isHelpEnabled is true', () => {
            spectator.setInput('originalGrid', grid);
            (spectator.component as any).isHelpEnabled.set(true);
            spectator.detectChanges();
            const solved: SudokuGrid | null = (spectator.component as any).solvedGrid();
            expect(solved).not.toBeNull();
            // Check that it's a valid grid structure
            expect(solved).toHaveLength(9);
        });
    });

    describe('isValueValid', () => {
        it('should return validity check for a value at row/col', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            const result: boolean = spectator.component.isValueValid(0, 0, 5);
            expect(typeof result).toBe('boolean');
        });
    });

    describe('toogleSelectedValue', () => {
        it('should select a cell when it is not read-only', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            expect((spectator.component as any).selectedRowIndex()).toBe(0);
            expect((spectator.component as any).selectedColIndex()).toBe(0);
        });

        it('should not select a read-only cell', () => {
            const almostCompleteGrid: SudokuGrid = [
                [5, 3, 4, 6, 7, 8, 9, 1, 2],
                [6, 7, 2, 1, 9, 5, 3, 4, 8],
                [1, 9, 8, 3, 4, 2, 5, 6, 7],
                [8, 5, 9, 7, 6, 1, 4, 2, 3],
                [4, 2, 6, 8, 5, 3, 7, 9, 1],
                [7, 1, 3, 9, 2, 4, 8, 5, 6],
                [9, 6, 1, 5, 3, 7, 2, 8, 4],
                [2, 8, 7, 4, 1, 9, 6, 3, 5],
                [3, 4, 5, 2, 8, 6, 1, 7, null],
            ];
            spectator.setInput('originalGrid', almostCompleteGrid);
            spectator.detectChanges();
            const previousRow: number | null = (spectator.component as any).selectedRowIndex();
            const previousCol: number | null = (spectator.component as any).selectedColIndex();
            // Try to select a read-only cell at (0,0) which has value 5
            spectator.component.toogleSelectedValue(0, 0);
            expect((spectator.component as any).selectedRowIndex()).toBe(previousRow);
            expect((spectator.component as any).selectedColIndex()).toBe(previousCol);
        });

        it('should toggle nominees when selecting already selected cell', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            expect(spectator.component.showNominees()).toBe(false);
            spectator.component.toogleSelectedValue(0, 0);
            expect(spectator.component.showNominees()).toBe(true);
        });
    });

    describe('isValuePeer', () => {
        it('returns false when no cell is selected', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            expect(spectator.component.isValuePeer(0, 0)).toBe(false);
            expect(spectator.component.isValuePeer(4, 4)).toBe(false);
        });

        it('returns false for the selected cell itself', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(4, 4);
            expect(spectator.component.isValuePeer(4, 4)).toBe(false);
        });

        it('returns true for cells in the same row as the selected cell', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(4, 4);
            // Different column, same row -> peer
            expect(spectator.component.isValuePeer(4, 0)).toBe(true);
            expect(spectator.component.isValuePeer(4, 8)).toBe(true);
        });

        it('returns true for cells in the same column as the selected cell', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(4, 4);
            // Different row, same column -> peer
            expect(spectator.component.isValuePeer(0, 4)).toBe(true);
            expect(spectator.component.isValuePeer(8, 4)).toBe(true);
        });

        it('returns true for cells in the same 3x3 block as the selected cell', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            // Select center cell (4,4) — its block is rows 3-5, cols 3-5.
            spectator.component.toogleSelectedValue(4, 4);
            // Different row and column, same block -> peer
            expect(spectator.component.isValuePeer(3, 3)).toBe(true);
            expect(spectator.component.isValuePeer(3, 5)).toBe(true);
            expect(spectator.component.isValuePeer(5, 3)).toBe(true);
            expect(spectator.component.isValuePeer(5, 5)).toBe(true);
        });

        it('returns false for cells unrelated to the selected cell', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(4, 4);
            // Different row, column, and block
            expect(spectator.component.isValuePeer(0, 0)).toBe(false);
            expect(spectator.component.isValuePeer(0, 8)).toBe(false);
            expect(spectator.component.isValuePeer(8, 0)).toBe(false);
            expect(spectator.component.isValuePeer(8, 8)).toBe(false);
        });

        it('covers the 3x3 block-boundary branch exhaustively', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            // Selecting a corner cell exercises the boxRow/boxCol math
            // (non-zero offsets → selRow - selRow % 3 lands on a group boundary).
            spectator.component.toogleSelectedValue(8, 8);

            // A cell just outside the bottom-right block on both axes is not a peer.
            expect(spectator.component.isValuePeer(5, 5)).toBe(false);
            // A cell in the block (different row/col) is a peer.
            expect(spectator.component.isValuePeer(6, 6)).toBe(true);
            expect(spectator.component.isValuePeer(7, 7)).toBe(true);
        });
    });

    describe('deleteSelectedValue', () => {
        it('should delete value when cell is selected in normal mode', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            spectator.component.onSelectValue(5);
            expect((spectator.component as any).grid()[0][0]).toBe(5);
            spectator.component.deleteSelectedValue();
            expect((spectator.component as any).grid()[0][0]).toBeNull();
        });

        it('should delete nominee when cell is selected in nominee mode', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            spectator.component.showNominees.set(true);
            spectator.component.onSelectValue(5);
            spectator.component.deleteSelectedValue();
            const nominees: Array<number | null> = (spectator.component as any).gridNomineeValues()[0][0];
            expect(nominees[4]).toBeNull();
        });

        it('should do nothing when no cell is selected', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            const gridBefore: SudokuGrid = (spectator.component as any).grid();
            spectator.component.deleteSelectedValue();
            const gridAfter: SudokuGrid = (spectator.component as any).grid();
            expect(gridBefore).toEqual(gridAfter);
        });
    });

    describe('isValueErroneous', () => {
        it('should return false when isHelpEnabled is false', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            const result: boolean = spectator.component.isValueErroneous(0, 0, 5);
            expect(result).toBe(false);
        });

        it('should check if value is erroneous when isHelpEnabled is true', () => {
            spectator.setInput('originalGrid', grid);
            (spectator.component as any).isHelpEnabled.set(true);
            spectator.detectChanges();
            const result: boolean = spectator.component.isValueErroneous(0, 0, 5);
            expect(typeof result).toBe('boolean');
        });
    });

    describe('onSelectValue', () => {
        it('should not do anything when no cell is selected', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.onSelectValue(5);
            expect((spectator.component as any).grid()[0][0]).toBeNull();
        });

        it('should select value in normal mode', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            spectator.component.onSelectValue(5);
            expect((spectator.component as any).grid()[0][0]).toBe(5);
        });

        it('should toggle nominee value in nominee mode', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            spectator.component.showNominees.set(true);
            spectator.component.onSelectValue(5);
            const nominees: Array<number | null> = (spectator.component as any).gridNomineeValues()[0][0];
            expect(nominees[4]).toBe(5);
        });

        it('should emit finish event when grid is completed with valid solution', () => {
            const almostCompleteGrid: SudokuGrid = [
                [5, 3, 4, 6, 7, 8, 9, 1, 2],
                [6, 7, 2, 1, 9, 5, 3, 4, 8],
                [1, 9, 8, 3, 4, 2, 5, 6, 7],
                [8, 5, 9, 7, 6, 1, 4, 2, 3],
                [4, 2, 6, 8, 5, 3, 7, 9, 1],
                [7, 1, 3, 9, 2, 4, 8, 5, 6],
                [9, 6, 1, 5, 3, 7, 2, 8, 4],
                [2, 8, 7, 4, 1, 9, 6, 3, 5],
                [3, 4, 5, 2, 8, 6, 1, 7, null],
            ];
            spectator.setInput('originalGrid', almostCompleteGrid);
            spectator.detectChanges();
            const finishSpy: jest.SpyInstance = jest.spyOn(spectator.component.finish, 'emit');
            spectator.component.toogleSelectedValue(8, 8);
            spectator.component.onSelectValue(9);
            expect(finishSpy).toHaveBeenCalled();
            const emitCall: IOnFinishGridEvent = finishSpy.mock.calls[0][0];
            expect(emitCall.isGridValid).toBe(true);
        });

        it('should update affected nominee values when positive value is selected', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            spectator.component.onSelectValue(5);
            // Check that nominees in same row are updated
            expect((spectator.component as any).gridNomineeValues()[0][1][4]).toBeNull();
        });
    });

    describe('clearAllValues', () => {
        it('should clear all grid values', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            spectator.component.onSelectValue(5);
            spectator.component.clearAllValues();
            const clearedGrid: SudokuGrid = (spectator.component as any).grid();
            expect(clearedGrid.every((row: Array<number | null>) => row.every((cell: number | null) => cell === null))).toBe(true);
        });
    });

    describe('onKeydown', () => {
        it('should select value when number key 1-9 is pressed', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            (spectator.component as any).onKeydown({key: '5'} as KeyboardEvent);
            expect((spectator.component as any).grid()[0][0]).toBe(5);
        });

        it('should delete value when Backspace is pressed', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            spectator.component.onSelectValue(5);
            (spectator.component as any).onKeydown({key: 'Backspace'} as KeyboardEvent);
            expect((spectator.component as any).grid()[0][0]).toBeNull();
        });

        it('should delete value when Delete is pressed', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            spectator.component.onSelectValue(5);
            (spectator.component as any).onKeydown({key: 'Delete'} as KeyboardEvent);
            expect((spectator.component as any).grid()[0][0]).toBeNull();
        });

        it('should ignore keys outside 1-9', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            spectator.component.toogleSelectedValue(0, 0);
            (spectator.component as any).onKeydown({key: 'a'} as KeyboardEvent);
            expect((spectator.component as any).grid()[0][0]).toBeNull();
        });
    });

    describe('timer', () => {
        it('should start timer on grid initialization', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            // Check that timerSubscription was created and is not null
            expect((spectator.component as any).timerSubscription).not.toBeNull();
        });

        it('should reset time to 0 when grid is reinitialized with different grid', () => {
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            (spectator.component as any).time.set(100);
            // Reinitialize with a different grid
            const newGrid: SudokuGrid = [
                getEmptyRow(),
                getEmptyRow(),
                getEmptyRow(),
                getEmptyRow(),
                getEmptyRow(),
                getEmptyRow(),
                getEmptyRow(),
                getEmptyRow(),
                [null, null, 1, null, null, null, null, null, null],
            ];
            spectator.setInput('originalGrid', newGrid);
            spectator.detectChanges();
            expect((spectator.component as any).time()).toBe(0);
        });

        it('should call time.update in timer callback (line 245)', async () => {
            jest.useRealTimers();
            spectator.setInput('originalGrid', grid);
            spectator.detectChanges();
            const initialTime: number = (spectator.component as any).time();

            await new Promise<void>((resolve: () => void) => {
                setTimeout(() => {
                    const finalTime: number = (spectator.component as any).time();
                    expect(finalTime).toBeGreaterThan(initialTime);
                    jest.useFakeTimers({legacyFakeTimers: true});
                    resolve();
                }, 1100);
            });
        });
    });
});
