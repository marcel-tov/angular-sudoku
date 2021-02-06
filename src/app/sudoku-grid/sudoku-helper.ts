import { SudokuGrid, SudokuValue } from './sudoku-grid.component';

export class SudokuHelper {
  constructor(private grid: SudokuGrid) { }

  get sudoku() {
    return this.grid;
  }

  /**
   * Checks if a given number can be placed in a row/column.
   */
  public isValueValid(row: number, col: number, value: SudokuValue): boolean {
    value = Number(value);

    return !this.usedInColumn(col, value)
        && !this.usedInRow(row, value)
        && !this.usedInSquare(row, col, value);
  }

  public solve(iterations: number = 0): boolean | SudokuGrid {
    // Find the next empty cell
    const [row, column] = this.findEmptyCell();
    // If no empty cell was found then the sudoku has been solved
    if (row === -1 && column === -1) {
      return true;
    }

    // Try numbers from 1 to 9
    for (let num = 1; num <= 9; num++) {
      // Make sure the location is safe for the current number
      if (this.isValueValid(row, column, num)) {
        // Seems good! Store the number in the grid
        this.grid[row][column] = num;

        // Recursively try the next cell with numbers from 1 to 9
        // If it returns true, the sudoku has been solved
        if (this.solve(iterations + 1)) {
          return this.grid;
        }

        // Looks like we were wrong, revert back and try again
        this.grid[row][column] = null;
      }
    }

    return false;
  }

  private usedInSquare(row: number, col: number, value: SudokuValue): boolean {
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

    private usedInColumn(col: number, value: SudokuValue): boolean {
      for (let y = 0; y < 9; y++) {
        if (this.grid[y][col] === value) {
          return true;
        }
      }
      return false;
    }

    private usedInRow(row: number, value: SudokuValue): boolean {
      for (let x = 0; x < 9; x++) {
        if (this.grid[row][x] === value) {
          return true;
        }
      }
      return false;
    }

    private findEmptyCell(): [SudokuValue, SudokuValue] {
      const coords: [SudokuValue, SudokuValue] = [-1, -1];
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
}
