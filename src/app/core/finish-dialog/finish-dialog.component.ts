import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'finish-dialog',
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
        private dialogRef: MatDialogRef<FinishDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IFinishDialogData,
    ) { }

    public close(): void {
        this.dialogRef.close();
    }
}

interface IFinishDialogData {
    title: string;
    description: string;
    icon: string;
}

export {FinishDialogComponent, IFinishDialogData};
