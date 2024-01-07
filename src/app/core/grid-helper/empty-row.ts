import {SudokuValue} from './types';

export function getEmptyRow(): Array<SudokuValue> {
    return [null, null, null, null, null, null, null, null, null];
}
