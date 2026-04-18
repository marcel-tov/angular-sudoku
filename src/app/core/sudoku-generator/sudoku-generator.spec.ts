import {Difficulty, getSudoku} from './sudoku-generator';
import {SudokuGrid, SudokuValue} from '../grid-helper/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasNoDuplicates(values: Array<SudokuValue>): boolean {
    const filled: Array<SudokuValue> = values.filter((v: SudokuValue) => v !== null);

    return filled.length === new Set(filled).size;
}

function countGivens(grid: SudokuGrid): number {
    return grid.reduce(
        (sum: number, row: Array<SudokuValue>) => sum + row.filter((v: SudokuValue) => v !== null).length,
        0,
    );
}

function isValidPartialGrid(grid: SudokuGrid): boolean {
    for (let r: number = 0; r < 9; r++) {
        if (!hasNoDuplicates(grid[r])) return false;
    }

    for (let c: number = 0; c < 9; c++) {
        if (!hasNoDuplicates(grid.map((row: Array<SudokuValue>) => row[c]))) return false;
    }

    for (let br: number = 0; br < 3; br++) {
        for (let bc: number = 0; bc < 3; bc++) {
            const box: Array<SudokuValue> = [];

            for (let r: number = 0; r < 3; r++) {
                for (let c: number = 0; c < 3; c++) {
                    box.push(grid[br * 3 + r][bc * 3 + c]);
                }
            }

            if (!hasNoDuplicates(box)) return false;
        }
    }

    return true;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('getSudoku', () => {

    it('defaults to VeryEasy when called without arguments', () => {
        const grid: SudokuGrid = getSudoku();
        const givens: number = countGivens(grid);

        expect(givens).toBeGreaterThanOrEqual(46);
        expect(givens).toBeLessThanOrEqual(51);
    });

    it('returns a 9x9 grid', () => {
        const grid: SudokuGrid = getSudoku();

        expect(grid).toHaveLength(9);
        grid.forEach((row: Array<SudokuValue>) => {
            expect(row).toHaveLength(9);
        });
    });

    it('only contains null or numbers between 1 and 9', () => {
        const grid: SudokuGrid = getSudoku();
        const filledValues: Array<number> = grid
            .flat()
            .filter((v: SudokuValue): v is number => v !== null);

        filledValues.forEach((value: number) => {
            expect(value).toBeGreaterThanOrEqual(1);
            expect(value).toBeLessThanOrEqual(9);
        });
    });

    it('has no duplicate givens in any row, column or 3x3 box', () => {
        const grid: SudokuGrid = getSudoku();

        expect(isValidPartialGrid(grid)).toBe(true);
    });

    it('contains at least one null cell', () => {
        const grid: SudokuGrid = getSudoku();

        expect(countGivens(grid)).toBeLessThan(81);
    });

    it('produces different puzzles on subsequent calls', () => {
        const first: SudokuGrid = getSudoku();
        const second: SudokuGrid = getSudoku();

        expect(first).not.toEqual(second);
    });

    describe('difficulty levels', () => {

        test.each([
            {difficulty: 'VeryEasy' as Difficulty, min: 46, max: 51},
            {difficulty: 'Easy' as Difficulty, min: 36, max: 45},
            {difficulty: 'Medium' as Difficulty, min: 28, max: 35},
            {difficulty: 'Hard' as Difficulty, min: 22, max: 27},
        ])('$difficulty returns a valid puzzle with $min–$max givens', ({difficulty, min, max}: {difficulty: Difficulty; min: number; max: number}) => {
            const grid: SudokuGrid = getSudoku(difficulty);
            const givens: number = countGivens(grid);

            expect(grid).toHaveLength(9);
            expect(isValidPartialGrid(grid)).toBe(true);
            expect(givens).toBeGreaterThanOrEqual(min);
            expect(givens).toBeLessThanOrEqual(max);
        });

    });

});
