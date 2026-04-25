type Tuple<T, N extends number, R extends ReadonlyArray<T> = []> =
    R['length'] extends N ? R : Tuple<T, N, [...R, T]>;

type SudokuValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
type SudokuRow = Tuple<SudokuValue, 9>;
type SudokuGrid = Tuple<SudokuRow, 9>;

export {SudokuGrid, SudokuRow, SudokuValue, Tuple};
