
import {HomeComponent} from './home.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';
import {RouterModule} from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {of} from 'rxjs';
import {ShareDialogComponent} from '../../core/share-dialog/share-dialog.component';
import {CreationDialogComponent} from '../../core/creation-dialog/creation-dialog.component';
import {FinishDialogComponent} from '../../core/finish-dialog/finish-dialog.component';
import {Difficulty} from 'fake-sudoku-puzzle-generator';
import {SudokuGrid} from '../../core/grid-helper/types';
import {getEmptyRow} from '../../core/grid-helper/empty-row';

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

    it('On share button does share grid', () => {
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('share', {selector: 'button'});
        spectator.click(selector);
        expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
            ShareDialogComponent,
            {
                data: {
                    grid: spectator.component.sudokuGrid,
                },
            },
        );
    });

    it('On create button does create grid', () => {
        const selector: DOMSelector = byTextContent('autorenew', {selector: 'button'});
        spectator.click(selector);
        expect(spectator.inject(MatDialog).open).toHaveBeenCalledWith(
            CreationDialogComponent,
            {
                data: {},
            },
        );
    });

    it('On click lock button changes lock value', () => {
        spectator.component.sudokuGrid = grid;
        spectator.detectChanges();
        expect(spectator.component.lockValues).toBe(true);
        spectator.click(byTextContent('lock', {selector: 'button'}));
        expect(spectator.component.lockValues).toBe(false);
        spectator.click(byTextContent('lock_open', {selector: 'button'}));
        expect(spectator.component.lockValues).toBe(true);
    });
});
