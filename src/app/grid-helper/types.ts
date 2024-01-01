// TODO: https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript
type SudokuGrid = Array<SudokuRow>;
type SudokuRow = Array<SudokuValue>;
type SudokuValue = number | null;

export {SudokuGrid, SudokuRow, SudokuValue};
