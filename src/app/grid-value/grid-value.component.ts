import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {getEmptyRow, SudokuValue} from '../grid/grid.component';
import {NgClass, NgFor, NgIf} from '@angular/common';

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
    @Input() protected value: SudokuValue = null;
    @Input() protected nomineeValues: Array<SudokuValue> = getEmptyRow();
    @Input() protected isSelected: boolean = false;
    @Input() protected isReadOnly: boolean = false;
    @Input() protected hasError: boolean = false;
    @Input() protected hasSuccess: boolean = false;
    @Input() protected showNominees: boolean = false;
}
