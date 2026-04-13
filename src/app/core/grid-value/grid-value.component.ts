import {ChangeDetectionStrategy, Component, InputSignal, input} from '@angular/core';
import {NgClass} from '@angular/common';
import {SudokuValue} from '../grid-helper/types';
import {getEmptyRow} from '../grid-helper/empty-row';

@Component({
    selector: 'grid-value',
    templateUrl: './grid-value.component.html',
    styleUrls: ['./grid-value.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
    ],
})
export class GridValueComponent {
    public readonly value: InputSignal<SudokuValue> = input<SudokuValue>(null);
    public readonly nomineeValues: InputSignal<Array<SudokuValue>> = input<Array<SudokuValue>>(getEmptyRow());
    public readonly isSelected: InputSignal<boolean> = input(false);
    public readonly isReadOnly: InputSignal<boolean> = input(false);
    public readonly hasError: InputSignal<boolean> = input(false);
    public readonly hasSuccess: InputSignal<boolean> = input(false);
    public readonly showNominees: InputSignal<boolean> = input(false);
}
