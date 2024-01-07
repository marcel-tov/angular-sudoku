import {SudokuGrid} from './types';
import {getEmptyRow} from './empty-row';
import {usedInRow} from './used-in-row';

describe('usedInRow', () => {
    test.each([
        {row: 0, expected: true},
        {row: 1, expected: false},
        {row: 2, expected: false},
        {row: 3, expected: false},
        {row: 4, expected: false},
        {row: 5, expected: false},
        {row: 6, expected: false},
        {row: 7, expected: false},
    ])('usedInRow does correctly return for row($row)', ({row, expected}: {row: number; expected: boolean}) => {
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
        expect(usedInRow(grid, row, 1)).toBe(expected);
    });
});
