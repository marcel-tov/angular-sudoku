import {SudokuGrid} from './types';
import {solveSudoku} from './solve-sudoku';

describe('solveSudoku', () => {
    it('Does correctly solve sudoku', () => {
        const grid: SudokuGrid = [
            [null, null, null, null, null, null, 4, 5, 8],
            [null, null, null, null, null, null, null, 1, null],
            [null, 7, null, null, null, 8, 3, null, null],
            [null, null, 4, null, null, 5, null, null, 6],
            [9, 3, null, 7, 6, null, null, 4, null],
            [8, null, null, null, null, null, 1, null, null],
            [null, 6, null, null, 1, null, null, null, null],
            [null, null, 8, null, 2, null, null, null, null],
            [2, 5, 9, null, null, null, 6, null, null],
        ];
        expect(solveSudoku(grid)).toEqual([
            [6, 9, 1, 3, 7, 2, 4, 5, 8],
            [5, 8, 3, 6, 9, 4, 2, 1, 7],
            [4, 7, 2, 1, 5, 8, 3, 6, 9],
            [7, 1, 4, 2, 8, 5, 9, 3, 6],
            [9, 3, 5, 7, 6, 1, 8, 4, 2],
            [8, 2, 6, 9, 4, 3, 1, 7, 5],
            [3, 6, 7, 8, 1, 9, 5, 2, 4],
            [1, 4, 8, 5, 2, 6, 7, 9, 3],
            [2, 5, 9, 4, 3, 7, 6, 8, 1],
        ]);
    });
});
