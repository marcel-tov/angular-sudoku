import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Difficulty } from "fake-sudoku-puzzle-generator";

@Component({
  selector: 'app-sudoku-creation-dialog',
  templateUrl: './sudoku-creation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SudokuCreationDialogComponent {
  public difficulties: Array<Difficulty> = [
    'VeryEasy',
    'Easy',
    'Medium',
    'Hard',
  ]
  constructor(
    public dialogRef: MatDialogRef<SudokuCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISudokuCreationDialogData,
  ) { }

  public close(): void {
    this.dialogRef.close();
  }

  public onSelectDifficulty(difficulty: Difficulty): void {
    this.dialogRef.close(difficulty);
  }
}

interface ISudokuCreationDialogData {}

export { SudokuCreationDialogComponent, ISudokuCreationDialogData }
