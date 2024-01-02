import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {NgClass, NgFor} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {SudokuRow, SudokuValue} from '../grid-helper/types';

@Component({
    selector: 'nominee-values',
    templateUrl: './nominee-values.component.html',
    styleUrls: ['./nominee-values.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgFor,
        NgClass,
        MatButtonModule,
    ],
})
export class NomineeValuesComponent {
    protected readonly nomineeValues: SudokuRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    @Output() protected onSelectValue: EventEmitter<SudokuValue> = new EventEmitter<SudokuValue>();

    protected selectValue(value: SudokuValue): void {
        this.onSelectValue.emit(value);
    }
}
