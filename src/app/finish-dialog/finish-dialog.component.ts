import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-sudoku-finish-dialog',
    templateUrl: './finish-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
    ],
})
class FinishDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<FinishDialogComponent>,
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

export {FinishDialogComponent, ISudokuFinishDialogData};
