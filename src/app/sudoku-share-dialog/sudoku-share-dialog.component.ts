import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { SudokuGrid, SudokuRow, SudokuValue } from '../sudoku-grid/sudoku-grid.component';

@Component({
  selector: 'app-sudoku-share-dialog',
  templateUrl: './sudoku-share-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SudokuShareDialogComponent {
  public readonly shareLink: string;

  constructor(
    public dialogRef: MatDialogRef<SudokuShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISudokuShareDialogData,
    private clipboard: Clipboard,
  ) {
    const url: string = location.protocol + '//' + location.host + location.pathname;
    this.shareLink = `${url}?grid=${gridToConfig(this.data.grid)}`;
  }

  public close(): void {
    this.dialogRef.close();
  }

  public copyLink(): void {
    this.clipboard.copy(this.shareLink);
  }
}

interface ISudokuShareDialogData {
  grid: SudokuGrid;
}

function gridToConfig(grid: SudokuGrid): string {
  return grid.reduce((value: string, row: SudokuRow) => {

    value += row
      .map((value: SudokuValue) => value === null ? '.' : value)
      .join('');

    return value;
  }, '');
}

export { SudokuShareDialogComponent, ISudokuShareDialogData }
