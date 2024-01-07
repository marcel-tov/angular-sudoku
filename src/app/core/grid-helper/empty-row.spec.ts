import {getEmptyRow} from './empty-row';

describe('getEmptyRow', () => {
    it('getEmptyRow does correctly return value', () => {
        expect(getEmptyRow()).toEqual([null, null, null, null, null, null, null, null, null]);
    });
});
