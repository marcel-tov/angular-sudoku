
import {HomeComponent} from './home.component';
import {Spectator, createComponentFactory, SpectatorFactory} from '@ngneat/spectator/jest';
import {RouterModule} from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {of} from 'rxjs';
import {ShareDialogComponent} from '../../share-dialog/share-dialog.component';
import {CreationDialogComponent} from '../../core/creation-dialog/creation-dialog.component';
import {FinishDialogComponent} from '../../core/finish-dialog/finish-dialog.component';
import {Difficulty} from 'fake-sudoku-puzzle-generator';
import {SudokuGrid} from '../../grid-helper/types';
import {getEmptyRow} from '../../grid-helper/empty-row';

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
        spectator.inject(MatDialog).open.andReturn({afterClosed: () => of(void 0)});
        spectator.component.openShareDialog(grid);
        expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
            ShareDialogComponent,
            {data: {grid}},
        );
    });

    it('should open creation dialog', () => {
        const difficulty: Difficulty = 'Easy';
        const createRandomSudokuSpy: jest.SpyInstance = jest.spyOn(spectator.component, 'createRandomSudoku');
        spectator.inject(MatDialog).open.andReturn({afterClosed: () => of(difficulty)});
        spectator.component.openCreationDialog();
        expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
            CreationDialogComponent,
            {data: {}},
        );
        expect(createRandomSudokuSpy).toHaveBeenCalledWith(difficulty);
    });

    it('should open finish dialog with solved parameters', (() => {
        spectator.inject(MatDialog).open.andReturn({afterClosed: () => of(void 0)});
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
        spectator.inject(MatDialog).open.andReturn({afterClosed: () => of(void 0)});
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
});
