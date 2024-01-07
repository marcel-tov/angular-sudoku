import {SudokuGrid, SudokuRow} from './types';
import {getEmptyRow} from './empty-row';
import {findEmptyCell} from './find-empty-cell';

describe('findEmptyCell', () => {
    test.each([
        {firstRow: [null, null, null, null, null, null, null, null, null], expectedCell: [0, 0]},
        {firstRow: [1, null, null, null, null, null, null, null, null], expectedCell: [0, 1]},
        {firstRow: [1, 2, null, null, null, null, null, null, null], expectedCell: [0, 2]},
        {firstRow: [1, 2, 3, null, null, null, null, null, null], expectedCell: [0, 3]},
        {firstRow: [1, 2, 3, 4, null, null, null, null, null], expectedCell: [0, 4]},
        {firstRow: [1, 2, 3, 4, 5, null, null, null, null], expectedCell: [0, 5]},
        {firstRow: [1, 2, 3, 4, 5, 6, null, null, null], expectedCell: [0, 6]},
        {firstRow: [1, 2, 3, 4, 5, 6, 7, null, null], expectedCell: [0, 7]},
        {firstRow: [1, 2, 3, 4, 5, 6, 7, 8, null], expectedCell: [0, 8]},
        {firstRow: [1, 2, 3, 4, 5, 6, 7, 8, 9], expectedCell: [1, 0]},
    ])('findEmptyCell does correctly find empty cell first row($row)', ({firstRow, expectedCell}: {firstRow: SudokuRow; expectedCell: [number, number]}) => {
        const grid: SudokuGrid = [
            firstRow,
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
        ];
        expect(findEmptyCell(grid)).toEqual(expectedCell);
    });

    it('findEmptyCell does correctly find no empty cell', () => {
        const grid: SudokuGrid = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
        ];
        expect(findEmptyCell(grid)).toEqual([-1, -1]);
    });
});
