import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SudokuGrid, SudokuRow, SudokuValue, IOnFinishGridEvent, timerFormatter } from './sudoku-grid/sudoku-grid.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { getSudoku, Difficulty } from "fake-sudoku-puzzle-generator";
import { MatDialog } from '@angular/material/dialog';
import { ISudokuFinishDialogData, SudokuFinishDialogComponent } from './sudoku-finish-dialog/sudoku-finish-dialog.component';
import { ISudokuCreationDialogData, SudokuCreationDialogComponent } from './sudoku-creation-dialog/sudoku-creation-dialog.component';
import { ISudokuShareDialogData, SudokuShareDialogComponent } from './sudoku-share-dialog/sudoku-share-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public sudokuGrid: SudokuGrid = getSudoku('Medium');

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.grid) {
        const grid: SudokuGrid = configToGrid(params.grid);
        this.sudokuGrid = grid;

        this.changeDetector.detectChanges();
      }
    });
  }

  public openShareDialog(grid: SudokuGrid): void {

    this.dialog
      .open<SudokuShareDialogComponent, ISudokuShareDialogData>(
        SudokuShareDialogComponent,
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
      .open<SudokuCreationDialogComponent, ISudokuCreationDialogData>(
        SudokuCreationDialogComponent,
        {
          data: {},
        })
      .afterClosed()
      .subscribe((difficulty: Difficulty | undefined) => {
          if (difficulty) {
            this.sudokuGrid = getSudoku(difficulty);
            this.changeDetector.detectChanges();
          }
      });
  }

  public openFinishDialog(event: IOnFinishGridEvent): void {
    const time: string = timerFormatter(event.time);
    const description: string = event.isGridValid
      ? `You solved the puzzle in ${time}`
      : `You did not solve the puzzle in ${time}`

    this.dialog
      .open<SudokuFinishDialogComponent, ISudokuFinishDialogData>(
        SudokuFinishDialogComponent,
        {
          data: {
            title: event.isGridValid
              ? 'Skrrr skrrr'
              : 'Dang',
            description,
            icon: event.isGridValid
              ? 'sentiment_very_satisfied'
              : 'sentiment_dissatisfied',
          }
        })
      .afterClosed()
      .subscribe(() => {
        // do nothing
      });
  }
}

function configToGrid(value: string): SudokuGrid {
  return value
    .match(/.{1,9}/g)
    .reduce((list: SudokuGrid, value: string) => {
      const row: SudokuRow = value
        .split('')
        .map((value: string) => Number(value) || null);

      list.push(row);

      return list;
    }, []);
}
