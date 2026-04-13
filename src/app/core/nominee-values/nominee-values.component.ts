import {ChangeDetectionStrategy, Component, OutputEmitterRef, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {SudokuRow, SudokuValue} from '../grid-helper/types';

@Component({
    selector: 'nominee-values',
    templateUrl: './nominee-values.component.html',
    styleUrls: ['./nominee-values.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
    ],
})
export class NomineeValuesComponent {
    public readonly onSelectValue: OutputEmitterRef<SudokuValue> = output<SudokuValue>();
    protected readonly nomineeValues: SudokuRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    protected selectValue(value: SudokuValue): void {
        this.onSelectValue.emit(value);
    }
}
