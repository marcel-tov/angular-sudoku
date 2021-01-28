import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sudoku-dialog',
  templateUrl: './sudoku-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SudokuDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SudokuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISudokuDialogData,
  ) { }

  public close(): void {
    this.dialogRef.close();
  }
}

interface ISudokuDialogData {
  title: string;
  description: string;
  icon: string;
}


export { SudokuDialogComponent, ISudokuDialogData }
