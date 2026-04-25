import {SudokuGrid, SudokuRow} from './types';

function getEmptyRow(): SudokuRow {
    return [null, null, null, null, null, null, null, null, null];
}

function getEmptyGrid(): SudokuGrid {
    return [
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
    ];
}

export {getEmptyRow, getEmptyGrid};
