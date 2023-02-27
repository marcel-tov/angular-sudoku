import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Difficulty } from 'fake-sudoku-puzzle-generator';

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
    @Inject(MAT_DIALOG_DATA) public data: {},
  ) { }

  public close(): void {
    this.dialogRef.close();
  }

  public onSelectDifficulty(difficulty: Difficulty): void {
    this.dialogRef.close(difficulty);
  }
}

export { SudokuCreationDialogComponent }
