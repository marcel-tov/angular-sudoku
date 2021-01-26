import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SudokuGrid, SudokuRow, SudokuItem } from './sudoku-grid/sudoku-grid.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  getSudoku,
} from "fake-sudoku-puzzle-generator";

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

  public onCreateGrid(): void {
    // @ts-ignore
    this.sudokuGrid = getSudoku('Medium');

    this.changeDetector.detectChanges();
  }
}

function gridToConfig(grid: SudokuGrid): string {
  return grid.reduce((value: string, row: SudokuRow) => {

    value += row
      .map((item: SudokuItem) => {
        return item === null ? '.' : item;
      })
      .join('');

    return value;
  }, '');
}

function configToGrid(value: string): SudokuGrid {
  // @ts-ignore
  return value
    .match(/.{1,9}/g)
    .reduce((list: SudokuGrid, value: string) => {
      // @ts-ignore
      const row: SudokuRow = value
        .split('')
        .map((item: string) => Number(item) || null);

      list.push(row);

      return list;
    }, []);
}
