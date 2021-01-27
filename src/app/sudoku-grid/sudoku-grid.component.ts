import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { cloneDeep } from 'lodash';
import { ReplaySubject } from 'rxjs';
import { SudokuHelper } from './sudoku-helper';

@Component({
  selector: 'app-sudoku-grid',
  templateUrl: './sudoku-grid.component.html',
  styleUrls: ['./sudoku-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SudokuGridComponent implements OnChanges {
  @Input('grid') public originalGrid!: SudokuGrid;
  public grid!: SudokuGrid;
  public solvedGrid: SudokuGrid | null = null;
  public showNominees: boolean = false;
  public selectedRowIndex: number | null = null;
  public selectedColIndex: number | null = null;
  public isHelpEnabled: boolean = false;
  public gridNomineeValues: Array<Array<Array<SudokuValue>>> = [];
  public lockValues: boolean = true;
  public sudokuHelper: SudokuHelper = new SudokuHelper(this.grid);
  public readonly touchValues: SudokuRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  @Output() private onShareGrid: EventEmitter<SudokuGrid> = new EventEmitter();
  @Output() private onCreateGrid: EventEmitter<void> = new EventEmitter();

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.originalGrid && changes.originalGrid.currentValue !== undefined) {
      this.grid = cloneDeep(this.originalGrid);
      this.sudokuHelper = new SudokuHelper(this.grid);
      this.initalizeGrid();
    }
  }

  public isValueReadOnly(row: number, col: number): boolean {
    if (!this.lockValues) {
      return false;
    }

    const value: SudokuValue = this.originalGrid[row][col];

    return value > 0;
  }

  public isGroupTop(row: number): boolean {
    return row % 3 === 0;
  }

  public isGroupEnd(col: number): boolean {
    return col % 3 === 0;
  }

  public isGridBottom(row: number): boolean {
    return row === 8;
  }

  public isGridEnd(col: number): boolean {
    return col  === 8;
  }

  /**
   * Checks if a given number can be placed in a row/column.
   */
  public isValueValid(row: number, col: number, value: SudokuValue): boolean {
    return this.sudokuHelper.isValueValid(row, col, value);
  }

  public isValueSelected(row: number, col: number): boolean {
    return !!(this.selectedRowIndex === row && this.selectedColIndex === col);
  }

  public toogleSelectedValue(row: number, col: number, showNominees: boolean = false): void {
    if (this.isValueReadOnly(row, col)) {
      return;
    }

    this.selectedRowIndex = row;
    this.selectedColIndex = col;
    this.showNominees = showNominees;
  }

  public hasSelectedValue(): boolean {
    return this.selectedRowIndex !== null && this.selectedColIndex !== null;
  }

  public deleteSelectedValue(): void {
    if (!this.hasSelectedValue()) {
      return;
    }

    if (this.showNominees) {
      this.toggleNomineeValue(this.selectedRowIndex, this.selectedColIndex, null);
    } else {
      this.onValueChange(this.selectedRowIndex, this.selectedColIndex, null);
    }
  }

  public isValueErroneous(row: number, col: number, value: SudokuValue): boolean {
    return this.solvedGrid[row][col] !== value;
  }

  public onHelpChange(event: MatSlideToggleChange): void {
    this.isHelpEnabled = event.checked;

    if (!this.isHelpEnabled) {
      return;
    }

    const sudokuHelper: SudokuHelper = new SudokuHelper(cloneDeep(this.originalGrid))
    sudokuHelper.solve();
    this.solvedGrid = sudokuHelper.sudoku;
  }

  public onSelectValue(value: SudokuValue): void {
    if (!this.hasSelectedValue()) {
      return;
    }

    if (this.showNominees) {
      this.toggleNomineeValue(this.selectedRowIndex, this.selectedColIndex, value);
    } else {
      this.onValueChange(this.selectedRowIndex, this.selectedColIndex, value);

      if (value > 0) {
        this.updateAffectedNomineeValue(value);
      }
    }
  }

  public onChangeLockValues(): void {
    this.lockValues = !this.lockValues;

    if (this.lockValues) {
      this.originalGrid = cloneDeep(this.grid);
      this.initalizeGrid();
    }
  }

  public shareGrid(): void {
    this.onShareGrid.emit(this.originalGrid);
  }

  public trackByIndex(index: number) {
    return index;
  }

  public createGrid(): void {
    this.onCreateGrid.emit();
  }

  private initalizeGrid(): void {
    for (const row of Object.keys(this.grid)) {
      for (const col of Object.keys(this.grid[row])) {
        if (!this.gridNomineeValues[row]) {
          this.gridNomineeValues[row] = [];
        }

        this.gridNomineeValues[row][col] = [null, null, null, null, null, null, null, null, null];
      }
    }

    this.selectedRowIndex = null;
    this.selectedColIndex = null;
    this.showNominees = false;
    this.isHelpEnabled = false;
  }

  private onValueChange(row: number, col: number, value: SudokuValue): void {
    value = Number(value);

    this.grid[row][col] = (value > 0 && value <= 9)
      ? value
      : null;
  }

  private toggleNomineeValue(row: number, col: number, value: SudokuValue): void {
    let modifiedNomineeValue: Array<SudokuValue> = cloneDeep(this.gridNomineeValues[row][col]);

    if (value === null) {
      modifiedNomineeValue = getEmptyRow();
    } else {
      value = Number(value);
      const indexValue: number = value - 1;

      modifiedNomineeValue[indexValue] = modifiedNomineeValue[indexValue] === null
        ? value
        : null;
    }

    this.gridNomineeValues[row][col] = modifiedNomineeValue;
  }

  private removeNomineeValue(row: number, col: number, value: SudokuValue): void {
    if (value === null) {
      return;
    }

    let modifiedNomineeValue: Array<SudokuValue> = cloneDeep(this.gridNomineeValues[row][col]);

    value = Number(value);
    if (modifiedNomineeValue.includes(value)) {
      const indexValue: number = value - 1;

      modifiedNomineeValue[indexValue] = null;

      this.gridNomineeValues[row][col] = modifiedNomineeValue;
    }
  }

  /**
   * @deprecated https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  private onKeydown(event: KeyboardEvent) {
    const value: number = Number(event.key);
    if (value > 0 && value <= 9) {
      this.onSelectValue(value);
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.onSelectValue(null);
    }
  }

  private updateAffectedNomineeValue(value: SudokuValue): void {
    if (!this.hasSelectedValue()) {
      return;
    }

    // Empty nominees of selected value
    this.gridNomineeValues[this.selectedRowIndex][this.selectedColIndex] = getEmptyRow();

    // Remove same nominee values of same row
    for (const col of Object.keys(this.grid[this.selectedRowIndex])) {
      this.removeNomineeValue(this.selectedRowIndex, Number(col), value);
    }

    // Remove same nominee values of same col
    for (const row of Object.keys(this.grid)) {
      this.removeNomineeValue(Number(row), this.selectedColIndex, value);
    }

    // Remove same nominee values of same square
    const row: number = this.selectedRowIndex - this.selectedRowIndex % 3;
    const col: number = this.selectedColIndex - this.selectedColIndex % 3;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        this.removeNomineeValue(x + row, y + col, value);
      }
    }
  }
}

function getEmptyRow(): Array<SudokuValue> {
  return [null, null, null, null, null, null, null, null, null];
}

type SudokuGrid = Array<SudokuRow>;
type SudokuRow = Array<SudokuValue>;
type SudokuValue = number | null;

export { SudokuGridComponent, SudokuGrid, SudokuRow, SudokuValue, getEmptyRow }
