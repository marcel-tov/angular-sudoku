import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {Difficulty, getSudoku} from 'fake-sudoku-puzzle-generator';
import {CreationDialogComponent} from '../../core/creation-dialog/creation-dialog.component';
import {IFinishDialogData, FinishDialogComponent} from '../../core/finish-dialog/finish-dialog.component';
import {
    IOnFinishGridEvent,
    GridComponent,
    timerFormatter,
} from '../../grid/grid.component';
import {IShareDialogData, ShareDialogComponent} from '../../share-dialog/share-dialog.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {SudokuGrid, SudokuRow} from '../../grid-helper/types';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        GridComponent,
        ClipboardModule,
        MatDialogModule,
        FinishDialogComponent,
        CreationDialogComponent,
        ShareDialogComponent,
    ],
})
class HomeComponent implements OnInit {
    protected sudokuGrid: SudokuGrid = getSudoku('Medium');
    private readonly lengthOfGridParameter: number = 81;

    constructor(
        private route: ActivatedRoute,
        private changeDetector: ChangeDetectorRef,
        private dialog: MatDialog,
    ) { }

    public ngOnInit(): void {
        // Load sudoku by share link
        if (this.route.snapshot.paramMap.has('grid')) {
            const gridString: string | null = this.route.snapshot.paramMap.get('grid');
            if (gridString.length === this.lengthOfGridParameter) {
                const grid: SudokuGrid = urlParamToGrid(gridString);
                this.sudokuGrid = grid;
                this.changeDetector.markForCheck();
            }
        }
    }

    public openShareDialog(grid: SudokuGrid): void {
        this.dialog
            .open<ShareDialogComponent, IShareDialogData>(
            ShareDialogComponent,
            {
                data: {
                    grid,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // do nothing
            });
    }

    public openCreationDialog(): void {
        this.dialog
            .open<CreationDialogComponent>(
            CreationDialogComponent,
            {
                data: {},
            })
            .afterClosed()
            .subscribe((difficulty: Difficulty | undefined) => {
                this.createRandomSudoku(difficulty);
            });
    }

    public openFinishDialog(event: IOnFinishGridEvent): void {
        const time: string = timerFormatter(event.time);
        const description: string = event.isGridValid
            ? `You solved the puzzle in ${time}`
            : `You did not solve the puzzle in ${time}`;

        this.dialog
            .open<FinishDialogComponent, IFinishDialogData>(
            FinishDialogComponent,
            {
                data: {
                    title: event.isGridValid
                        ? 'Skrrr skrrr'
                        : 'Dang',
                    description,
                    icon: event.isGridValid
                        ? 'sentiment_very_satisfied'
                        : 'sentiment_dissatisfied',
                },
            })
            .afterClosed()
            .subscribe(() => {
                // do nothing
            });
    }

    public createRandomSudoku(difficulty: Difficulty | undefined): void {
        if (!difficulty) {
            return;
        }

        this.sudokuGrid = getSudoku(difficulty);
        this.changeDetector.markForCheck();
    }
}

function urlParamToGrid(gridString: string): SudokuGrid {
    return gridString
        .match(/.{1,9}/g)
        .reduce((list: SudokuGrid, value: string) => {
            const row: SudokuRow = value
                .split('')
                .map((item: string) => Number(item) || null);

            list.push(row);

            return list;
        }, []);
}

export {HomeComponent};
