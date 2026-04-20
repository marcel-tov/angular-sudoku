import {validateReviewGrid} from './validate-review-grid';

const emptyGrid = (): Array<Array<string>> =>
    Array.from({length: 9}, (): Array<string> => Array<string>(9).fill(''));

describe('validateReviewGrid', () => {
    it('should return a 9×9 all-false matrix for an empty grid', () => {
        const result: Array<Array<boolean>> = validateReviewGrid(emptyGrid());
        expect(result).toHaveLength(9);
        result.forEach((row: Array<boolean>) => {
            expect(row).toHaveLength(9);
            row.forEach((cell: boolean) => expect(cell).toBe(false));
        });
    });

    it('should return all-false for a grid with no duplicates', () => {
        const grid: Array<Array<string>> = emptyGrid();
        ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((v: string, i: number) => {
            grid[0][i] = v;
        });
        const result: Array<Array<boolean>> = validateReviewGrid(grid);
        result[0].forEach((cell: boolean) => expect(cell).toBe(false));
    });

    it('should flag both cells when the same value appears twice in a row', () => {
        const grid: Array<Array<string>> = emptyGrid();
        grid[0][0] = '5';
        grid[0][5] = '5';
        const result: Array<Array<boolean>> = validateReviewGrid(grid);
        expect(result[0][0]).toBe(true);
        expect(result[0][5]).toBe(true);
        expect(result[0][1]).toBe(false);
    });

    it('should flag both cells when the same value appears twice in a column', () => {
        const grid: Array<Array<string>> = emptyGrid();
        grid[0][3] = '7';
        grid[7][3] = '7';
        const result: Array<Array<boolean>> = validateReviewGrid(grid);
        expect(result[0][3]).toBe(true);
        expect(result[7][3]).toBe(true);
    });

    it('should flag both cells when the same value appears twice in a 3×3 box', () => {
        const grid: Array<Array<string>> = emptyGrid();
        grid[3][3] = '4';
        grid[5][5] = '4';
        const result: Array<Array<boolean>> = validateReviewGrid(grid);
        expect(result[3][3]).toBe(true);
        expect(result[5][5]).toBe(true);
    });

    it('should not flag cells in different boxes with the same value', () => {
        const grid: Array<Array<string>> = emptyGrid();
        grid[0][0] = '3';
        grid[5][5] = '3';
        const result: Array<Array<boolean>> = validateReviewGrid(grid);
        expect(result[0][0]).toBe(false);
        expect(result[5][5]).toBe(false);
    });

    it('should not flag empty string cells', () => {
        const grid: Array<Array<string>> = emptyGrid();
        const result: Array<Array<boolean>> = validateReviewGrid(grid);
        result.forEach((row: Array<boolean>) => row.forEach((cell: boolean) => expect(cell).toBe(false)));
    });

    it('should handle multiple conflicts at once', () => {
        const grid: Array<Array<string>> = emptyGrid();
        grid[0][0] = '1';
        grid[0][1] = '1';
        grid[1][0] = '1';
        const result: Array<Array<boolean>> = validateReviewGrid(grid);
        expect(result[0][0]).toBe(true);
        expect(result[0][1]).toBe(true);
        expect(result[1][0]).toBe(true);
    });
});
