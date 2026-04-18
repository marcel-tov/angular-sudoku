
import {HomeComponent} from './home.component';
import {Spectator, createComponentFactory, SpectatorFactory, createSpyObject} from '@ngneat/spectator/jest';
import {RouterModule} from '@angular/router';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';
import {ShareDialogComponent} from '../../core/share-dialog/share-dialog.component';
import {CreationDialogComponent} from '../../core/creation-dialog/creation-dialog.component';
import {FinishDialogComponent} from '../../core/finish-dialog/finish-dialog.component';
import {Difficulty} from '../../core/sudoku-generator/sudoku-generator';
import {SudokuGrid} from '../../core/grid-helper/types';
import {getEmptyRow} from '../../core/grid-helper/empty-row';

interface IMockRoute {
    snapshot: {paramMap: {has: (key: string) => boolean; get: (key: string) => string | null}};
}

describe('HomeComponent', () => {
    const grid: SudokuGrid = [
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        [null, 4, null, null, 0, null, null, 4, null],
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
    ];
    let spectator: Spectator<HomeComponent>;
    const createComponent: SpectatorFactory<HomeComponent> = createComponentFactory({
        component: HomeComponent,
        imports: [
            RouterModule.forRoot([]),
        ],
        mocks: [
            MatDialog,
            MatDialogRef,
        ],
        overrideComponents: [
            [
                HomeComponent,
                {
                    remove: {
                        imports: [
                            MatDialogModule,
                            FinishDialogComponent,
                            CreationDialogComponent,
                            ShareDialogComponent,
                        ],
                    },
                },
            ],
        ],
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

    it('should create component', () => {
        expect(spectator.query('div')).toHaveClass('home');
    });

    it('should contain router-outlet', () => {
        expect(spectator.query('div.home')).toHaveDescendant('grid.home__grid');
    });

    it('should open share dialog', () => {
        const matDialogRef: MatDialogRef<void> = createSpyObject(MatDialogRef, {
            afterClosed: () => of(void 0),
        });
        spectator.inject(MatDialog).open.mockReturnValue(matDialogRef);
        spectator.component.openShareDialog(grid);
        expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
            ShareDialogComponent,
            {data: {grid}},
        );
    });

    it('should open creation dialog', () => {
        const difficulty: Difficulty = 'Easy';
        const createRandomSudokuSpy: jest.SpyInstance = jest.spyOn(spectator.component, 'createRandomSudoku');
        const matDialogRef: MatDialogRef<unknown> = createSpyObject(MatDialogRef, {
            afterClosed: () => of(difficulty),
        });
        spectator.inject(MatDialog).open.mockReturnValue(matDialogRef);
        spectator.component.openCreationDialog();
        expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
            CreationDialogComponent,
            {data: {}},
        );
        expect(createRandomSudokuSpy).toHaveBeenCalledWith(difficulty);
    });

    it('should open finish dialog with solved parameters', (() => {
        const matDialogRef: MatDialogRef<void> = createSpyObject(MatDialogRef, {
            afterClosed: () => of(void 0),
        });
        spectator.inject(MatDialog).open.mockReturnValue(matDialogRef);
        spectator.detectChanges();
        spectator.component.openFinishDialog({
            grid,
            isGridValid: true,
            time: 0,
        });
        spectator.detectChanges();
        expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
            FinishDialogComponent,
            {
                data: {
                    title: 'Skrrr skrrr',
                    description: 'You solved the puzzle in 00:00:00',
                    icon: 'sentiment_very_satisfied',
                },
            },
        );
    }));

    it('should open finish dialog with unsolved parameters', () => {
        const matDialogRef: MatDialogRef<void> = createSpyObject(MatDialogRef, {
            afterClosed: () => of(void 0),
        });
        spectator.inject(MatDialog).open.mockReturnValue(matDialogRef);
        spectator.component.openFinishDialog({
            grid,
            isGridValid: false,
            time: 0,
        });
        expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
            FinishDialogComponent,
            {
                data: {
                    title: 'Dang',
                    description: 'You did not solve the puzzle in 00:00:00',
                    icon: 'sentiment_dissatisfied',
                },
            },
        );
    });

    describe('ngOnInit with grid param', () => {
        it('should load grid from 81-character route param', () => {
            const gridString: string = '123456789'.repeat(9);
            // Manually call ngOnInit with mocked ActivatedRoute
            const mockRoute: IMockRoute = {
                snapshot: {
                    paramMap: {
                        has: (key: string) => key === 'grid',
                        get: (key: string) => key === 'grid' ? gridString : null,
                    },
                },
            };
            (spectator.component as any).route = mockRoute;
            spectator.component.ngOnInit();
            const sudokuGrid: SudokuGrid = (spectator.component as any).sudokuGrid();
            expect(sudokuGrid).toHaveLength(9);
            expect(sudokuGrid[0]).toHaveLength(9);
        });

        it('should not load grid when param length is not 81', () => {
            const mockRoute: IMockRoute = {
                snapshot: {
                    paramMap: {
                        has: (key: string) => key === 'grid',
                        get: (key: string) => key === 'grid' ? 'tooshort' : null,
                    },
                },
            };
            const gridBefore: SudokuGrid = (spectator.component as any).sudokuGrid();
            (spectator.component as any).route = mockRoute;
            spectator.component.ngOnInit();
            const sudokuGrid: SudokuGrid = (spectator.component as any).sudokuGrid();
            // Grid should not have changed from invalid param length
            expect(sudokuGrid).toEqual(gridBefore);
        });

        it('should not load grid when param is not present', () => {
            const mockRoute: IMockRoute = {
                snapshot: {
                    paramMap: {
                        has: (_key: string) => false,
                        get: (_key: string) => null,
                    },
                },
            };
            const gridBefore: SudokuGrid = (spectator.component as any).sudokuGrid();
            (spectator.component as any).route = mockRoute;
            spectator.component.ngOnInit();
            const sudokuGrid: SudokuGrid = (spectator.component as any).sudokuGrid();
            // Grid should not have changed
            expect(sudokuGrid).toEqual(gridBefore);
        });
    });

    describe('createRandomSudoku', () => {
        it('should not update grid when difficulty is undefined', () => {
            spectator.detectChanges();
            const gridBefore: SudokuGrid = (spectator.component as any).sudokuGrid();
            spectator.component.createRandomSudoku(undefined);
            const gridAfter: SudokuGrid = (spectator.component as any).sudokuGrid();
            expect(gridAfter).toBe(gridBefore);
        });

        it('should update grid when valid difficulty is provided', () => {
            spectator.detectChanges();
            const difficulty: Difficulty = 'Easy';
            spectator.component.createRandomSudoku(difficulty);
            const gridAfter: SudokuGrid = (spectator.component as any).sudokuGrid();
            expect(gridAfter).toHaveLength(9);
            expect(gridAfter[0]).toHaveLength(9);
        });
    });
});
