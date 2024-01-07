import {SudokuGrid, SudokuValue} from './types';

export function usedInRow(grid: SudokuGrid, row: number, value: SudokuValue): boolean {
    for (let x: number = 0; x < 9; x++) {
        if (grid[row][x] === value) {
            return true;
        }
    }

    return false;
}
