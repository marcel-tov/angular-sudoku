/**
 * Validates that a parsed JSON value is a 9×9 array of (number|null) cells,
 * where numbers are integers in the range 1–9.
 */
function isValidGrid(value: unknown): boolean {
    if (!Array.isArray(value) || value.length !== 9) {
        return false;
    }

    return value.every(
        (row: unknown): boolean =>
            Array.isArray(row) &&
            row.length === 9 &&
            row.every(
                (cell: unknown): boolean =>
                    cell === null || (typeof cell === 'number' && cell >= 1 && cell <= 9),
            ),
    );
}

export {isValidGrid};
