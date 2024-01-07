
/**
 * Checks if a given number can be placed in a row/column.
 */
import {SudokuGrid, SudokuValue} from './types';
import {usedInColumn} from './used-in-column';
import {usedInRow} from './used-in-row';
import {usedInSquare} from './used-in-square';

export function isValueValid(grid: SudokuGrid, row: number, col: number, value: SudokuValue): boolean {
    value = Number(value);

    return !usedInColumn(grid, col, value)
    && !usedInRow(grid, row, value)
    && !usedInSquare(grid, row, col, value);
}
