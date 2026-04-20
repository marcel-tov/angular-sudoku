import {isValidGrid} from './is-valid-grid';

const emptyRow = (): Array<null> => Array<null>(9).fill(null);
const validGrid = (): Array<Array<null>> => Array.from({length: 9}, emptyRow);

describe('isValidGrid', () => {
    it('should return true for a 9×9 all-null grid', () => {
        expect(isValidGrid(validGrid())).toBe(true);
    });

    it('should return true for a grid with valid integers (1–9)', () => {
        const mixed: Array<Array<number | null>> = validGrid() as Array<Array<number | null>>;
        mixed[0][0] = 1;
        mixed[4][4] = 9;
        mixed[8][8] = 5;
        expect(isValidGrid(mixed)).toBe(true);
    });

    it('should return false for null', () => {
        expect(isValidGrid(null)).toBe(false);
    });

    it('should return false for a non-array', () => {
        expect(isValidGrid('hello')).toBe(false);
        expect(isValidGrid(42)).toBe(false);
        expect(isValidGrid({})).toBe(false);
    });

    it('should return false for an array with fewer than 9 rows', () => {
        expect(isValidGrid(Array.from({length: 8}, emptyRow))).toBe(false);
    });

    it('should return false for an array with more than 9 rows', () => {
        expect(isValidGrid(Array.from({length: 10}, emptyRow))).toBe(false);
    });

    it('should return false when a row has fewer than 9 cells', () => {
        const grid: Array<Array<null>> = validGrid();
        (grid[3] as unknown) = Array<null>(8).fill(null);
        expect(isValidGrid(grid)).toBe(false);
    });

    it('should return false when a cell contains 0', () => {
        const grid: Array<Array<number | null>> = validGrid() as Array<Array<number | null>>;
        grid[0][0] = 0;
        expect(isValidGrid(grid)).toBe(false);
    });

    it('should return false when a cell contains 10', () => {
        const grid: Array<Array<number | null>> = validGrid() as Array<Array<number | null>>;
        grid[0][0] = 10;
        expect(isValidGrid(grid)).toBe(false);
    });

    it('should return false when a cell contains a string digit', () => {
        const grid: Array<Array<unknown>> = validGrid() as Array<Array<unknown>>;
        grid[0][0] = '5';
        expect(isValidGrid(grid)).toBe(false);
    });

    it('should return false when a row is not an array', () => {
        const grid: Array<unknown> = validGrid() as Array<unknown>;
        grid[2] = 'not-an-array';
        expect(isValidGrid(grid)).toBe(false);
    });
});
