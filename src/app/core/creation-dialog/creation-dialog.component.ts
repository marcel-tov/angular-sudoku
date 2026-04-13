import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {Difficulty} from 'fake-sudoku-puzzle-generator';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'creation-dialog',
    templateUrl: './creation-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
    ],
})
class CreationDialogComponent {
    public readonly difficulties: Array<Difficulty> = [
        'VeryEasy',
        'Easy',
        'Medium',
        'Hard',
    ];

    private readonly dialogRef: MatDialogRef<CreationDialogComponent> = inject(MatDialogRef<CreationDialogComponent>);
    private readonly data: {} = inject<{}>(MAT_DIALOG_DATA);

    public close(): void {
        this.dialogRef.close();
    }

    public onSelectDifficulty(difficulty: Difficulty): void {
        this.dialogRef.close(difficulty);
    }
}

export {CreationDialogComponent};
