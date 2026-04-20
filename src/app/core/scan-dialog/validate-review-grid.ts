/**
 * Returns a 9×9 boolean matrix where `true` means the cell's value clashes
 * with another filled cell in the same row, column, or 3×3 box.
 *
 * Empty string cells are ignored.
 */
function validateReviewGrid(grid: Array<Array<string>>): Array<Array<boolean>> {
    const conflicts: Array<Array<boolean>> = Array.from(
        {length: 9},
        (): Array<boolean> => Array<boolean>(9).fill(false),
    );

    for (let r: number = 0; r < 9; r++) {
        for (let c: number = 0; c < 9; c++) {
            const val: string = grid[r][c];

            if (!val) {
                continue;
            }

            // Row
            for (let cc: number = 0; cc < 9; cc++) {
                if (cc !== c && grid[r][cc] === val) {
                    conflicts[r][c] = true;
                    conflicts[r][cc] = true;
                }
            }

            // Column
            for (let rr: number = 0; rr < 9; rr++) {
                if (rr !== r && grid[rr][c] === val) {
                    conflicts[r][c] = true;
                    conflicts[rr][c] = true;
                }
            }

            // 3×3 box
            const boxRow: number = Math.floor(r / 3) * 3;
            const boxCol: number = Math.floor(c / 3) * 3;

            for (let br: number = boxRow; br < boxRow + 3; br++) {
                for (let bc: number = boxCol; bc < boxCol + 3; bc++) {
                    if ((br !== r || bc !== c) && grid[br][bc] === val) {
                        conflicts[r][c] = true;
                        conflicts[br][bc] = true;
                    }
                }
            }
        }
    }

    return conflicts;
}

export {validateReviewGrid};
