import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {SudokuValue} from '../core/grid-helper/types';
import {getEmptyRow} from '../core/grid-helper/empty-row';

@Component({
    selector: 'grid-value',
    templateUrl: './grid-value.component.html',
    styleUrls: ['./grid-value.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        NgClass,
    ],
})
export class GridValueComponent {
    @Input() public value: SudokuValue = null;
    @Input() public nomineeValues: Array<SudokuValue> = getEmptyRow();
    @Input() public isSelected: boolean = false;
    @Input() public isReadOnly: boolean = false;
    @Input() public hasError: boolean = false;
    @Input() public hasSuccess: boolean = false;
    @Input() public showNominees: boolean = false;
}
