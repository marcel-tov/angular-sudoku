import {SudokuGrid, SudokuValue} from './types';
import {findEmptyCell} from './find-empty-cell';
import {isValueValid} from './is-value-valid';

export function solveSudoku(grid: SudokuGrid, iterations: number = 0): boolean | SudokuGrid {
    // Find the next empty cell
    const [row, column]: [SudokuValue, SudokuValue] = findEmptyCell(grid);
    // If no empty cell was found then the sudoku has been solved
    if (row === -1 && column === -1) {
        return true;
    }

    // Try numbers from 1 to 9
    for (let num: number = 1; num <= 9; num++) {
    // Make sure the location is safe for the current number
        if (isValueValid(grid, row, column, num)) {
            // Seems good! Store the number in the grid
            grid[row][column] = num;

            // Recursively try the next cell with numbers from 1 to 9
            // If it returns true, the sudoku has been solved
            if (this.solve(iterations + 1)) {
                return grid;
            }

            // Looks like we were wrong, revert back and try again
            grid[row][column] = null;
        }
    }

    return false;
}
