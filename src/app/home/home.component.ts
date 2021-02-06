import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Difficulty, getSudoku } from 'fake-sudoku-puzzle-generator';
import { SudokuCreationDialogComponent } from '../sudoku-creation-dialog/sudoku-creation-dialog.component';
import { ISudokuFinishDialogData, SudokuFinishDialogComponent } from '../sudoku-finish-dialog/sudoku-finish-dialog.component';
import { IOnFinishGridEvent, SudokuGrid, SudokuRow, timerFormatter } from '../sudoku-grid/sudoku-grid.component';
import { ISudokuShareDialogData, SudokuShareDialogComponent } from '../sudoku-share-dialog/sudoku-share-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HomeComponent implements OnInit {
  public sudokuGrid: SudokuGrid = getSudoku('Medium');

  constructor(
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }


  public ngOnInit(): void {
    // Load sudoku by share link
    if (this.route.snapshot.paramMap.has('grid')) {
      const gridString = this.route.snapshot.paramMap.get('grid');
      const grid: SudokuGrid = urlParamToGrid(gridString);

      this.sudokuGrid = grid;
      this.changeDetector.detectChanges();
    }
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
      .open<SudokuCreationDialogComponent, {}>(
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

export { HomeComponent }
