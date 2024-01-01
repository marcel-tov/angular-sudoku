import {SudokuGrid, SudokuValue} from './types';

export function usedInSquare(grid: SudokuGrid, row: number, col: number, value: SudokuValue): boolean {
    row -= row % 3;
    col -= col % 3;

    for (let x: number = 0; x < 3; x++) {
        for (let y: number = 0; y < 3; y++) {
            if (grid[x + row][y + col] === value) {
                return true;
            }
        }
    }

    return false;
}
