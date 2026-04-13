import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
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
    protected readonly data: IFinishDialogData = inject<IFinishDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef: MatDialogRef<FinishDialogComponent> = inject(MatDialogRef<FinishDialogComponent>);

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
