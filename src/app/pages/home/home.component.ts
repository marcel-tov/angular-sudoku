import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {Difficulty, getSudoku} from 'fake-sudoku-puzzle-generator';
import {CreationDialogComponent} from '../../core/creation-dialog/creation-dialog.component';
import {IFinishDialogData, FinishDialogComponent} from '../../core/finish-dialog/finish-dialog.component';
import {GridComponent} from '../../core/grid/grid.component';
import {IShareDialogData, ShareDialogComponent} from '../../core/share-dialog/share-dialog.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {SudokuGrid, SudokuRow, SudokuValue} from '../../core/grid-helper/types';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgIf} from '@angular/common';
import {Subscription, timer} from 'rxjs';
import {NomineeValuesComponent} from '../../core/nominee-values/nominee-values.component';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {GridService, IOnFinishGridEvent} from '../../core/grid/grid.service';

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
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NgIf,
        NomineeValuesComponent,
        MatSlideToggleModule,
    ],
})
class HomeComponent implements OnInit {
    public lockValues: boolean = true;
    public sudokuGrid: SudokuGrid = getSudoku('Medium');
    public showNominees: boolean = false;
    protected isHelpEnabled: boolean = false;
    private readonly lengthOfGridParameter: number = 81;
    private time: number = 0;
    private subscription: Subscription | null = null;

    constructor(
        private route: ActivatedRoute,
        private changeDetector: ChangeDetectorRef,
        private dialog: MatDialog,
        private gridService: GridService,
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

        this.startTime();
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
                if (difficulty) {
                    this.createRandomSudoku(difficulty);
                    this.startTime();
                }
            });
    }

    public openFinishDialog(event: IOnFinishGridEvent): void {
        this.cancelTimer();
        const time: string = timerFormatter(this.time);
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

    public timeFormatter(): string {
  	  return timerFormatter(this.time);
    }

    public clearAllValues(): void {
        this.sudokuGrid = [];
        for (let i: number = 0; i < 9; i++) {
            this.sudokuGrid[i] = [];

            for (let k: number = 0; k < 9; k++) {
                this.sudokuGrid[i].push(null);
            }
        }
    }

    public onChangeLockValues(): void {
        this.lockValues = !this.lockValues;
    }

    public onChangeGrid(grid: SudokuGrid): void {
        if (!this.lockValues) {
            this.sudokuGrid = grid;
        }
    }

    public onHelpChange(event: MatSlideToggleChange): void {
        this.isHelpEnabled = event.checked;
    }

    public hasSelectedValue(): boolean {
        return this.gridService.hasSelectedValue();
    }

    public onSelectValue(value: SudokuValue): void {
        this.gridService.onSelectValue(value);
    }

    public deleteSelectedValue(): void {
        this.deleteSelectedValue();
    }

    private cancelTimer(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private startTime(): void {
        this.time = 0;
        this.cancelTimer();
        this.subscription = timer(0, 1000).subscribe(() => {
            this.time++;
            this.changeDetector.markForCheck();
        });
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

function timerFormatter(time: number): string {
    const hours: string = Math
        .floor(time / 3600)
        .toString()
        .padStart(2, '0');
    const minutes: string = Math
        .floor(time % 3600 / 60)
        .toString()
        .padStart(2, '0');
    const seconds: string = Math
        .floor(time % 3600 % 60)
        .toString()
        .padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export {HomeComponent};
