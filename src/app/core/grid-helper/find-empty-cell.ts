import {SudokuGrid, SudokuValue} from './types';

export function findEmptyCell(grid: SudokuGrid): [SudokuValue, SudokuValue] {
    const coords: [SudokuValue, SudokuValue] = [-1, -1];
    for (let x: number = 0; x < 9; x++) {
        for (let y: number = 0; y < 9; y++) {
            if (grid[x][y] === null) {
                coords[0] = x;
                coords[1] = y;

                return coords;
            }
        }
    }

    return coords;
}
