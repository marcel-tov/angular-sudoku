import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getEmptyRow, SudokuValue } from '../sudoku-grid/sudoku-grid.component';

@Component({
  selector: 'app-sudoku-grid-value',
  templateUrl: './sudoku-grid-value.component.html',
  styleUrls: ['./sudoku-grid-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SudokuGridValueComponent {
  @Input() public value: SudokuValue = null;
  @Input() public nomineeValues: Array<SudokuValue> = getEmptyRow();
  @Input() public isSelected: boolean = false;
  @Input() public isReadOnly: boolean = false;
  @Input() public hasError: boolean = false;
  @Input() public hasSuccess: boolean = false;
  @Input() public showNominees: boolean = false;
}
