import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {Difficulty} from 'fake-sudoku-puzzle-generator';
import {NgFor} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-sudoku-creation-dialog',
    templateUrl: './sudoku-creation-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgFor,
        MatDialogModule,
        MatButtonModule,
    ],
})
class SudokuCreationDialogComponent {
    public difficulties: Array<Difficulty> = [
        'VeryEasy',
        'Easy',
        'Medium',
        'Hard',
    ];
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

export {SudokuCreationDialogComponent};
