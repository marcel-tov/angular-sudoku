import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-sudoku-finish-dialog',
  templateUrl: './sudoku-finish-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SudokuFinishDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SudokuFinishDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISudokuFinishDialogData,
  ) { }

  public close(): void {
    this.dialogRef.close();
  }
}

interface ISudokuFinishDialogData {
  title: string;
  description: string;
  icon: string;
}


export { SudokuFinishDialogComponent, ISudokuFinishDialogData }
