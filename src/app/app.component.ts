import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SudokuGrid, SudokuRow, SudokuValue, IOnFinishGridEvent, timerFormatter } from './sudoku-grid/sudoku-grid.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { getSudoku, Difficulty } from "fake-sudoku-puzzle-generator";
import { MatDialog } from '@angular/material/dialog';
import { ISudokuDialogData, SudokuDialogComponent } from './sudoku-dialog/sudoku-dialog.component';
import { ISudokuCreationDialogData, SudokuCreationDialogComponent } from './sudoku-creation-dialog/sudoku-creation-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public sudokuGrid: SudokuGrid = [
    [8, null, null, null, null, null, null, null, null],
    [null, null, 3, 6, null, null, null, null, null],
    [null, 7, null, null, 9, null, 2, null, null],
    [null, 5, null, null, null, 7, null, null, null],
    [null, null, null, null, 4, 5, 7, null, null],
    [null, null, null, 1, null, null, null, 3, null],
    [null, null, 1, null, null, null, null, 6, 8],
    [null, null, 8, 5, null, null, null, 1, null],
    [null, 9, null, null, null, null, 4, null, null],
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
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

  public onShareGrid(grid: SudokuGrid): void {
      const queryParams: Params = {
        grid: gridToConfig(grid),
      };

      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: queryParams,
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        });

      this.clipboard.copy(window.location.href);
  }

  public showCreationDialog(): void {
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

  public showFinishDialog(event: IOnFinishGridEvent): void {
    const time: string = timerFormatter(event.time);
    const description: string = event.isGridValid
      ? `You solved the puzzle in ${time}`
      : `You did not solve the puzzle in ${time}`

    this.dialog
      .open<SudokuDialogComponent, ISudokuDialogData>(
        SudokuDialogComponent,
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

function gridToConfig(grid: SudokuGrid): string {
  return grid.reduce((value: string, row: SudokuRow) => {

    value += row
      .map((value: SudokuValue) => value === null ? '.' : value)
      .join('');

    return value;
  }, '');
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
