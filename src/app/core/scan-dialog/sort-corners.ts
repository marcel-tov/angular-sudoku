/**
 * Orders 4 corner points as [top-left, top-right, bottom-right, bottom-left].
 *
 * Sorting strategy:
 *  - top-left  → smallest (x + y) sum
 *  - bottom-right → largest  (x + y) sum
 *  - top-right → largest  (x - y) diff
 *  - bottom-left → smallest (x - y) diff
 */
function sortCorners(pts: Array<[number, number]>): Array<[number, number]> {
    const bySum: Array<[number, number]> = [...pts].sort(
        ([ax, ay]: [number, number], [bx, by]: [number, number]): number => (ax + ay) - (bx + by),
    );
    const byDiff: Array<[number, number]> = [...pts].sort(
        ([ax, ay]: [number, number], [bx, by]: [number, number]): number => (ax - ay) - (bx - by),
    );

    const tl: [number, number] = bySum[0] ?? [0, 0];
    const br: [number, number] = bySum[bySum.length - 1] ?? [0, 0];
    const tr: [number, number] = byDiff[byDiff.length - 1] ?? [0, 0];
    const bl: [number, number] = byDiff[0] ?? [0, 0];

    return [tl, tr, br, bl];
}

export {sortCorners};
