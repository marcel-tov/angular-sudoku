
import {HomeComponent} from './home.component';
import {Spectator, createComponentFactory, SpectatorFactory} from '@ngneat/spectator/jest';
import {RouterModule} from '@angular/router';
import {SudokuGrid, getEmptyRow} from '../sudoku-grid/sudoku-grid.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {of} from 'rxjs';
import {SudokuShareDialogComponent} from '../sudoku-share-dialog/sudoku-share-dialog.component';
import {SudokuCreationDialogComponent} from '../sudoku-creation-dialog/sudoku-creation-dialog.component';
import {SudokuFinishDialogComponent} from '../sudoku-finish-dialog/sudoku-finish-dialog.component';

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
        ],
        overrideComponents: [
            [
                HomeComponent,
                {
                    remove: {
                        imports: [
                            MatDialogModule,
                            SudokuFinishDialogComponent,
                            SudokuCreationDialogComponent,
                            SudokuShareDialogComponent,
                        ],
                    },
                },
            ],
        ],
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('should create component', () => {
        expect(spectator.query('div')).toHaveClass('home');
    });

    it('should contain router-outlet', () => {
        expect(spectator.query('div.home')).toHaveDescendant('app-sudoku-grid.home__grid');
    });

    // it('should open share dialog', () => {
    //     spectator.inject(MatDialog).open.andReturn({afterClosed: () => of(void 0)});
    //     spectator.component.openShareDialog(grid);
    //     expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
    //         SudokuShareDialogComponent,
    //         {data: {grid}},
    //     );
    // });

    // it('should open creation dialog', () => {
    //     const difficulty: Difficulty = 'Easy';
    //     const createRandomSudokuSpy: jest.SpyInstance = jest.spyOn(spectator.component, 'createRandomSudoku');
    //     spectator.inject(MatDialog).open.andReturn({afterClosed: () => of(difficulty)});
    //     spectator.component.openCreationDialog();
    //     expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
    //         SudokuCreationDialogComponent,
    //         {data: {}},
    //     );
    //     expect(createRandomSudokuSpy).toHaveBeenCalledWith(difficulty);
    // });

    // it('should open finish dialog with solved parameters', (() => {
    //     spectator.inject(MatDialog).open.andReturn({afterClosed: () => of(void 0)});
    //     spectator.detectChanges();
    //     spectator.component.openFinishDialog({
    //         grid,
    //         isGridValid: true,
    //         time: 0,
    //     });
    //     spectator.detectChanges();
    //     expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
    //         SudokuFinishDialogComponent,
    //         {
    //             data: {
    //                 title: 'Skrrr skrrr',
    //                 description: 'You solved the puzzle in 00:00:00',
    //                 icon: 'sentiment_very_satisfied',
    //             },
    //         },
    //     );
    // }));


    it('should open finish dialog with unsolved parameters', () => {
        spectator.inject(MatDialog).open.andReturn({afterClosed: () => of(void 0)});
        spectator.component.openFinishDialog({
            grid,
            isGridValid: false,
            time: 0,
        });
        expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
            SudokuFinishDialogComponent,
            {
                data: {
                    title: 'Dang',
                    description: 'You did not solve the puzzle in 00:00:00',
                    icon: 'sentiment_dissatisfied',
                },
            },
        );
    });
});
