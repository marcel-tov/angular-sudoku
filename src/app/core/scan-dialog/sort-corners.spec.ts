import {sortCorners} from './sort-corners';

describe('sortCorners', () => {
    it('should return [tl, tr, br, bl] for an axis-aligned square', () => {
        const pts: Array<[number, number]> = [[0, 0], [100, 0], [100, 100], [0, 100]];
        const [tl, tr, br, bl]: Array<[number, number]> = sortCorners(pts);
        expect(tl).toEqual([0, 0]);
        expect(tr).toEqual([100, 0]);
        expect(br).toEqual([100, 100]);
        expect(bl).toEqual([0, 100]);
    });

    it('should handle input points given in reverse order', () => {
        const pts: Array<[number, number]> = [[0, 100], [100, 100], [100, 0], [0, 0]];
        const [tl, tr, br, bl]: Array<[number, number]> = sortCorners(pts);
        expect(tl).toEqual([0, 0]);
        expect(tr).toEqual([100, 0]);
        expect(br).toEqual([100, 100]);
        expect(bl).toEqual([0, 100]);
    });

    it('should handle input points given in a random order', () => {
        const pts: Array<[number, number]> = [[100, 0], [0, 100], [100, 100], [0, 0]];
        const [tl, tr, br, bl]: Array<[number, number]> = sortCorners(pts);
        expect(tl).toEqual([0, 0]);
        expect(tr).toEqual([100, 0]);
        expect(br).toEqual([100, 100]);
        expect(bl).toEqual([0, 100]);
    });

    it('should return 4 points', () => {
        const pts: Array<[number, number]> = [[10, 20], [200, 15], [195, 210], [5, 215]];
        expect(sortCorners(pts)).toHaveLength(4);
    });

    it('should place the point with the smallest x+y sum at index 0 (top-left)', () => {
        const pts: Array<[number, number]> = [[50, 10], [300, 20], [290, 400], [10, 380]];
        const [tl]: Array<[number, number]> = sortCorners(pts);
        expect(tl).toEqual([50, 10]);
    });

    it('should place the point with the largest x+y sum at index 2 (bottom-right)', () => {
        const pts: Array<[number, number]> = [[50, 10], [300, 20], [290, 400], [10, 380]];
        const [, , br]: Array<[number, number]> = sortCorners(pts);
        expect(br).toEqual([290, 400]);
    });
});
