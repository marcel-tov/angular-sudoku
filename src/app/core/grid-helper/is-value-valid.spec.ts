import {isValueValid} from './is-value-valid';
import {SudokuGrid} from './types';
import {getEmptyRow} from './empty-row';

describe('isValueValid', () => {
    test.each([
        {row: 0, col: 0, expected: false},
        {row: 0, col: 1, expected: false},
        {row: 0, col: 2, expected: false},
        {row: 0, col: 3, expected: false},
        {row: 0, col: 4, expected: false},
        {row: 0, col: 5, expected: false},
        {row: 0, col: 6, expected: false},
        {row: 0, col: 7, expected: false},
        {row: 0, col: 8, expected: false},
        {row: 1, col: 0, expected: false},
        {row: 1, col: 1, expected: false},
        {row: 1, col: 2, expected: false},
        {row: 1, col: 3, expected: true},
        {row: 1, col: 4, expected: true},
        {row: 1, col: 5, expected: true},
        {row: 1, col: 6, expected: true},
        {row: 1, col: 7, expected: true},
        {row: 1, col: 8, expected: true},
        {row: 2, col: 0, expected: false},
        {row: 2, col: 1, expected: false},
        {row: 2, col: 2, expected: false},
        {row: 2, col: 3, expected: true},
        {row: 2, col: 4, expected: true},
        {row: 2, col: 5, expected: true},
        {row: 2, col: 6, expected: true},
        {row: 2, col: 7, expected: true},
        {row: 2, col: 8, expected: true},
        {row: 3, col: 0, expected: false},
        {row: 3, col: 1, expected: true},
        {row: 3, col: 2, expected: true},
        {row: 3, col: 3, expected: true},
        {row: 3, col: 4, expected: true},
        {row: 3, col: 5, expected: true},
        {row: 3, col: 6, expected: true},
        {row: 3, col: 7, expected: true},
        {row: 3, col: 8, expected: true},
        {row: 4, col: 0, expected: false},
        {row: 4, col: 1, expected: true},
        {row: 4, col: 2, expected: true},
        {row: 4, col: 3, expected: true},
        {row: 4, col: 4, expected: true},
        {row: 4, col: 5, expected: true},
        {row: 4, col: 6, expected: true},
        {row: 4, col: 7, expected: true},
        {row: 4, col: 8, expected: true},
        {row: 5, col: 0, expected: false},
        {row: 5, col: 1, expected: true},
        {row: 5, col: 2, expected: true},
        {row: 5, col: 3, expected: true},
        {row: 5, col: 4, expected: true},
        {row: 5, col: 5, expected: true},
        {row: 5, col: 6, expected: true},
        {row: 5, col: 7, expected: true},
        {row: 5, col: 8, expected: true},
        {row: 6, col: 0, expected: false},
        {row: 6, col: 1, expected: true},
        {row: 6, col: 2, expected: true},
        {row: 6, col: 3, expected: true},
        {row: 6, col: 4, expected: true},
        {row: 6, col: 5, expected: true},
        {row: 6, col: 6, expected: true},
        {row: 6, col: 7, expected: true},
        {row: 6, col: 8, expected: true},
        {row: 7, col: 0, expected: false},
        {row: 7, col: 1, expected: true},
        {row: 7, col: 2, expected: true},
        {row: 7, col: 3, expected: true},
        {row: 7, col: 4, expected: true},
        {row: 7, col: 5, expected: true},
        {row: 7, col: 6, expected: true},
        {row: 7, col: 7, expected: true},
        {row: 7, col: 8, expected: true},
        {row: 8, col: 0, expected: false},
        {row: 8, col: 1, expected: true},
        {row: 8, col: 2, expected: true},
        {row: 8, col: 3, expected: true},
        {row: 8, col: 4, expected: true},
        {row: 8, col: 5, expected: true},
        {row: 8, col: 6, expected: true},
        {row: 8, col: 7, expected: true},
        {row: 8, col: 8, expected: true},
    ])('isValueValid does correctly return row($row); col($col)', ({row, col, expected}: {row: number; col: number; expected: boolean}) => {
        const grid: SudokuGrid = [
            [1, null, null, null, null, null, null, null, null],
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
        ];
        expect(isValueValid(grid, row, col, 1)).toBe(expected);
    });
});