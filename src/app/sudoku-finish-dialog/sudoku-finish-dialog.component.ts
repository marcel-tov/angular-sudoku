import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-sudoku-finish-dialog',
    templateUrl: './sudoku-finish-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
    ],
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

export {SudokuFinishDialogComponent, ISudokuFinishDialogData};
