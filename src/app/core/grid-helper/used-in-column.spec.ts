import {SudokuGrid} from './types';
import {getEmptyRow} from './empty-row';
import {usedInColumn} from './used-in-column';

describe('usedInColumn', () => {
    test.each([
        {col: 0, expected: true},
        {col: 1, expected: false},
        {col: 2, expected: false},
        {col: 3, expected: false},
        {col: 4, expected: false},
        {col: 5, expected: false},
        {col: 6, expected: false},
        {col: 7, expected: false},
    ])('usedInColumn does correctly return for row($row)', ({col, expected}: {col: number; expected: boolean}) => {
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
        expect(usedInColumn(grid, col, 1)).toBe(expected);
    });
});
