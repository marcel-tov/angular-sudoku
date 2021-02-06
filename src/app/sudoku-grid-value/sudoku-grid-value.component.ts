import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  @Input() public isSelected = false;
  @Input() public isReadOnly = false;
  @Input() public hasError = false;
  @Input() public hasSuccess = false;
  @Input() public showNominees = false;
}
