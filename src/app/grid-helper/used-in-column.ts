import {SudokuGrid, SudokuValue} from './types';

export function usedInColumn(grid: SudokuGrid, col: number, value: SudokuValue): boolean {
    for (let y: number = 0; y < 9; y++) {
        if (grid[y][col] === value) {
            return true;
        }
    }

    return false;
}
