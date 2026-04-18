import {SudokuGrid, SudokuValue} from '../grid-helper/types';

type Difficulty = 'VeryEasy' | 'Easy' | 'Medium' | 'Hard';

// Range of givens (filled cells) kept per difficulty.
// Fewer givens = harder puzzle.
const TARGET_GIVENS: Record<Difficulty, [number, number]> = {
    VeryEasy: [46, 51],
    Easy:     [36, 45],
    Medium:   [28, 35],
    Hard:     [22, 27],
};

// ── Utilities ────────────────────────────────────────────────────────────────

function rand(max: number): number {
    return Math.floor(Math.random() * max);
}

function shuffle<T>(arr: Array<T>): Array<T> {
    const a: Array<T> = [...arr];

    for (let i: number = a.length - 1; i > 0; i--) {
        const j: number = rand(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

// ── Constraint checking ───────────────────────────────────────────────────────

function canPlace(grid: SudokuGrid, row: number, col: number, num: number): boolean {
    for (let i: number = 0; i < 9; i++) {
        if (grid[row][i] === num) { return false; }
        if (grid[i][col] === num) { return false; }
    }

    const br: number = Math.floor(row / 3) * 3;
    const bc: number = Math.floor(col / 3) * 3;

    for (let r: number = br; r < br + 3; r++) {
        for (let c: number = bc; c < bc + 3; c++) {
            if (grid[r][c] === num) { return false; }
        }
    }

    return true;
}

function candidatesFor(grid: SudokuGrid, row: number, col: number): Array<number> {
    const result: Array<number> = [];

    for (let n: number = 1; n <= 9; n++) {
        if (canPlace(grid, row, col, n)) { result.push(n); }
    }

    return result;
}

// ── Solution generator ────────────────────────────────────────────────────────
// Fills an empty grid with a valid, random complete solution.

function fillSolution(grid: SudokuGrid): boolean {
    for (let r: number = 0; r < 9; r++) {
        for (let c: number = 0; c < 9; c++) {
            if (grid[r][c] !== null) { continue; }

            for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
                if (canPlace(grid, r, c, num)) {
                    grid[r][c] = num;

                    if (fillSolution(grid)) { return true; }

                    grid[r][c] = null;
                }
            }

            return false; // No valid number found — backtrack
        }
    }

    return true; // All cells filled
}

// ── Uniqueness checker ────────────────────────────────────────────────────────
// Counts solutions up to `limit`. Uses MRV (Minimum Remaining Values):
// always picks the cell with fewest candidates to minimise branching.

function countSolutions(grid: SudokuGrid, limit: number = 2): number {
    let bestRow: number = -1;
    let bestCol: number = -1;
    let bestCandidates: Array<number> = [];
    let minCount: number = 10;

    for (let r: number = 0; r < 9; r++) {
        for (let c: number = 0; c < 9; c++) {
            if (grid[r][c] !== null) { continue; }

            const cands: Array<number> = candidatesFor(grid, r, c);

            if (cands.length === 0) { return 0; }   // Contradiction — dead end

            if (cands.length < minCount) {
                minCount = cands.length;
                bestRow = r;
                bestCol = c;
                bestCandidates = cands;

                if (minCount === 1) { break; }       // Forced move — can't do better
            }
        }

        if (minCount === 1) { break; }
    }

    if (bestRow === -1) { return 1; } // No empty cells — solution found

    let count: number = 0;

    for (const num of bestCandidates) {
        grid[bestRow][bestCol] = num;
        count += countSolutions(grid, limit);
        grid[bestRow][bestCol] = null;

        if (count >= limit) { break; }
    }

    return count;
}

// ── Puzzle generator ──────────────────────────────────────────────────────────

function getSudoku(difficulty: Difficulty = 'VeryEasy'): SudokuGrid {
    // 1. Build a complete random solution
    const solution: SudokuGrid = Array.from({length: 9}, () => Array(9).fill(null) as Array<SudokuValue>);
    fillSolution(solution);

    // 2. Pick a random target number of givens within the difficulty range
    const [min, max]: [number, number] = TARGET_GIVENS[difficulty];
    const target: number = min + rand(max - min + 1);

    // 3. Remove cells in random order, keeping the solution unique
    const puzzle: SudokuGrid = solution.map((row: Array<SudokuValue>) => [...row]);
    let givens: number = 81;

    const cells: Array<[number, number]> = Array.from(
        {length: 81},
        (_: unknown, i: number): [number, number] => [Math.floor(i / 9), i % 9],
    );

    for (const [r, c] of shuffle(cells)) {
        if (givens <= target) { break; }

        const backup: SudokuValue = puzzle[r][c];
        puzzle[r][c] = null;

        if (countSolutions(puzzle.map((row: Array<SudokuValue>) => [...row])) === 1) {
            givens--;
        } else {
            puzzle[r][c] = backup; // Removal broke uniqueness — restore
        }
    }

    return puzzle;
}

export {Difficulty, getSudoku};
