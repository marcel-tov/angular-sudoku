import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { cloneDeep } from 'lodash';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-sudoku-grid',
  templateUrl: './sudoku-grid.component.html',
  styleUrls: ['./sudoku-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SudokuGridComponent implements OnChanges {
  @Input('grid') public originalGrid!: SudokuGrid;
  public grid!: SudokuGrid;
  public solvedGrid: SudokuGrid | null = null;
  public showNominees: boolean = false;
  public selectedRowIndex: number | null = null;
  public selectedColIndex: number | null = null;
  public isHelpEnabled: boolean = false;
  public nomineeValueSubject: ReplaySubject<SudokuItem> = new ReplaySubject();
  public lockValues: boolean = true;
  public readonly touchValues: SudokuRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  @Output() private onShareGrid: EventEmitter<SudokuGrid> = new EventEmitter();
  @Output() private onCreateGrid: EventEmitter<void> = new EventEmitter();
  private iterations: number = 0;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.originalGrid && changes.originalGrid.currentValue !== undefined) {
      this.grid = cloneDeep(this.originalGrid);
    }
  }

  public isItemReadOnly(row: number, col: number): boolean {
    if (!this.lockValues) {
      return false;
    }

    const item: SudokuItem = this.originalGrid[row][col];

    return item !== null && item > 0;
  }

  public isGroupTop(row: number): boolean {
    return row % 3 === 0;
  }

  public isGroupEnd(col: number): boolean {
    return col % 3 === 0;
  }

  public isGridBottom(row: number): boolean {
    return row === 8;
  }

  public isGridEnd(col: number): boolean {
    return col  === 8;
  }

  public onValueChange(row: number, col: number, value: SudokuItem): void {
    value = Number(value);

    this.grid[row][col] = (value > 0 && value <= 9)
      ? value
      : null;
  }

  /**
   * Checks if a given number can be placed in a row/column.
   */
  public isItemValid(row: number, col: number, value: SudokuItem): boolean {
    value = Number(value);

    return !this.usedInColumn(col, value)
        && !this.usedInRow(row, value)
        && !this.usedInSquare(row, col, value);
  }

  public isItemSelected(row: number, col: number): boolean {
    return !!(this.selectedRowIndex === row && this.selectedColIndex === col);
  }

  public toogleSelectedItem(row: number, col: number, showNominees: boolean = false): void {
    if (this.isItemReadOnly(row, col)) {
      return;
    }

    this.selectedRowIndex = row;
    this.selectedColIndex = col;
    this.showNominees = showNominees;
  }

  public hasSelectedItem(): boolean {
    return this.selectedRowIndex !== null && this.selectedColIndex !== null;
  }

  public deleteSelectedItem(): void {
    if (!this.hasSelectedItem()) {
      return;
    }

    this.onValueChange(this.selectedRowIndex, this.selectedColIndex, null);
  }

  public hasItemError(row: number, col: number, value: SudokuItem): boolean {
    return this.solvedGrid[row][col] !== value;
  }

  public onHelpChange(event: MatSlideToggleChange): void {
    this.isHelpEnabled = event.checked;

    if (!this.isHelpEnabled) {
      return;
    }

    const savedGrid: SudokuGrid = cloneDeep(this.grid);
    this.grid = cloneDeep(this.originalGrid);

    this.iterations = 0;
    this.solve();

    this.solvedGrid = cloneDeep(this.grid);
    this.grid = cloneDeep(savedGrid);
  }

  public onSelectValue(value: SudokuItem): void {
    if (!this.hasSelectedItem()) {
      return;
    }

    if (this.showNominees) {
      this.nomineeValueSubject.next(value);
    } else {
      this.onValueChange(this.selectedRowIndex, this.selectedColIndex, value);
    }
  }

  public onChangeLockValues(): void {
    this.lockValues = !this.lockValues;

    if (this.lockValues) {
      this.selectedRowIndex = null;
      this.selectedColIndex = null;
      this.originalGrid = cloneDeep(this.grid);
    }
  }

  public shareGrid(): void {
    this.onShareGrid.emit(this.originalGrid);
  }

  public trackByIndex(index: number) {
    return index;
  }

  public createGrid(): void {
    this.onCreateGrid.emit();
  }

  private usedInSquare(row: number, col: number, value: SudokuItem): boolean {
    row -= row % 3;
    col -= col % 3;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (this.grid[x + row][y + col] === value) {
          return true;
        }
      }
    }

    return false;
  }

  private usedInColumn(col: number, value: SudokuItem): boolean {
    for (let y = 0; y < 9; y++) {
      if (this.grid[y][col] === value) {
        return true;
      }
    }
    return false;
  }

  private usedInRow(row: number, value: SudokuItem): boolean {
    for (let x = 0; x < 9; x++) {
      if (this.grid[row][x] === value) {
        return true;
      }
    }
    return false;
  }

  private findEmptyCell(): [SudokuItem, SudokuItem] {
    let coords: [SudokuItem, SudokuItem] = [-1, -1];
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (this.grid[x][y] === null) {
          coords[0] = x;
          coords[1] = y;

          return coords;
        }
      }
    }
    return coords;
  }

  private solve(): boolean | SudokuGrid {
    this.iterations++;

    // Find the next empty cell
    let [row, column] = this.findEmptyCell();
    // If no empty cell was found then the sudoku has been solved
    if (row === -1 && column === -1) {
      return true;
    }

    // Try numbers from 1 to 9
    for (let number = 1; number <= 9; number++) {
      // Make sure the location is safe for the current number
      if (this.isItemValid(row, column, number)) {
        // Seems good! Store the number in the grid
        this.grid[row][column] = number;

        // Recursively try the next cell with numbers from 1 to 9
        // If it returns true, the sudoku has been solved
        if (this.solve()) {
          return this.grid;
        }

        // Looks like we were wrong, revert back and try again
        this.grid[row][column] = null;
      }
    }

    return false;
  }
}

type SudokuGrid = [SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow];
type SudokuRow = [SudokuItem, SudokuItem, SudokuItem, SudokuItem, SudokuItem, SudokuItem, SudokuItem, SudokuItem, SudokuItem];
type SudokuItem = number | null;

export { SudokuGridComponent, SudokuGrid, SudokuRow, SudokuItem }
