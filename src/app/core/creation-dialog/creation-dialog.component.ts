import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {Difficulty} from '../sudoku-generator/sudoku-generator';
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

    public close(): void {
        this.dialogRef.close();
    }

    public onSelectDifficulty(difficulty: Difficulty): void {
        this.dialogRef.close(difficulty);
    }
}

export {CreationDialogComponent};
