import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {cloneDeep} from 'lodash';
import {Subscription, timer} from 'rxjs';
import {NgFor, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {GridValueComponent} from '../grid-value/grid-value.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list';
import {SudokuGrid, SudokuRow, SudokuValue} from '../grid-helper/types';
import {getEmptyRow} from '../grid-helper/empty-row';
import {isValueValid} from '../grid-helper/is-value-valid';
import {solveSudoku} from '../grid-helper/solve-sudoku';
import {NomineeValuesComponent} from '../../nominee-values/nominee-values.component';

@Component({
    selector: 'grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        MatButtonModule,
        MatSlideToggleModule,
        GridValueComponent,
        MatIconModule,
        MatTooltipModule,
        MatGridListModule,
        NomineeValuesComponent,
    ],
})
class GridComponent implements OnChanges {
    @Input() public originalGrid!: SudokuGrid;
    @Input() public showTopNavigation: boolean = true;
    @Input() public showFooterNavigation: boolean = true;
    @Output() public share: EventEmitter<SudokuGrid> = new EventEmitter<SudokuGrid>();
    @Output() public create: EventEmitter<void> = new EventEmitter<void>();
    public lockValues: boolean = true;
    public showNominees: boolean = false;
    protected grid!: SudokuGrid;
    protected solvedGrid: SudokuGrid | null = null;
    protected selectedRowIndex: number | null = null;
    protected selectedColIndex: number | null = null;
    protected isHelpEnabled: boolean = false;
    protected gridNomineeValues: Array<Array<Array<SudokuValue>>> = [];
    protected readonly nomineeValues: SudokuRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    @Output() protected finish: EventEmitter<IOnFinishGridEvent> = new EventEmitter<IOnFinishGridEvent>();
    private time: number = 0;
    private subscription: Subscription | null = null;

    constructor(private changeDetector: ChangeDetectorRef) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.originalGrid && changes.originalGrid.currentValue !== undefined) {
            this.grid = cloneDeep(this.originalGrid);
            this.initalizeGrid();
        }
    }

    public isValueReadOnly(row: number, col: number): boolean {
        if (!this.lockValues) {
            return false;
        }

        const value: SudokuValue = this.originalGrid[row][col];

        return value !== null;
    }

    public isGroupTop(row: number): boolean {
  		return row % 3 === 0;
    }

    public isGroupEnd(col: number): boolean {
  		return col % 3 === 0;
    }

    public isGridBottom(row: number): boolean {
  		return row === 8;
    }

    public isGridEnd(col: number): boolean {
  		return col  === 8;
    }

    /**
	 * Checks if a given number can be placed in a row/column.
	 */
    public isValueValid(row: number, col: number, value: SudokuValue): boolean {
  		return isValueValid(this.grid, row, col, value);
    }

    public isValueSelected(row: number, col: number): boolean {
  		return !!(this.selectedRowIndex === row && this.selectedColIndex === col);
    }

    public toogleSelectedValue(row: number, col: number): void {
        if (this.isValueReadOnly(row, col)) {
            return;
        }

        if (this.isValueSelected(row, col)) {
            this.showNominees = !this.showNominees;
        }

        this.selectedRowIndex = row;
        this.selectedColIndex = col;
    }

    public hasSelectedValue(): boolean {
  		return this.selectedRowIndex !== null && this.selectedColIndex !== null;
    }

    public deleteSelectedValue(): void {
        if (!this.hasSelectedValue()) {
            return;
        }

        if (this.showNominees) {
            this.toggleNomineeValue(this.selectedRowIndex, this.selectedColIndex, null);
        } else {
            this.onValueChange(this.selectedRowIndex, this.selectedColIndex, null);
        }
    }

    public isValueErroneous(row: number, col: number, value: SudokuValue): boolean {
        if (this.isHelpEnabled && this.solvedGrid === null) {
            const clonedGrid: SudokuGrid = cloneDeep(this.originalGrid);
            solveSudoku(clonedGrid);
            this.solvedGrid = clonedGrid;
        }

        return this.solvedGrid[row][col] !== value;
    }

    public onHelpChange(event: MatSlideToggleChange): void {
  		this.isHelpEnabled = event.checked;
    }

    public onSelectValue(value: SudokuValue): void {
        if (!this.hasSelectedValue()) {
            return;
        }

        if (this.showNominees) {
            this.toggleNomineeValue(this.selectedRowIndex, this.selectedColIndex, value);
        } else {
            this.onValueChange(this.selectedRowIndex, this.selectedColIndex, value);

            if (value > 0) {
                this.updateAffectedNomineeValue(value);
            }

            // If the last value was added
            if (this.isGridFinish()) {
                this.onFinishGrid();
            }
        }
    }

    public onChangeLockValues(): void {
        this.lockValues = !this.lockValues;

        if (this.lockValues) {
            this.originalGrid = cloneDeep(this.grid);
            this.initalizeGrid();
        }
    }

    public onShareGrid(): void {
  		this.share.emit(this.originalGrid);
    }

    public trackByIndex(index: number) {
  		return index;
    }

    public onCreateGrid(): void {
  		this.create.emit();
    }

    public timeFormatter(): string {
  		return timerFormatter(this.time);
    }

    public clearAllValues(): void {
        this.grid = [];
        for (let i: number = 0; i < 9; i++) {
            this.grid[i] = [];

            for (let k: number = 0; k < 9; k++) {
                this.grid[i].push(null);
            }
        }
    }

    private initalizeGrid(): void {
        for (const row of Object.keys(this.grid)) {
            for (const col of Object.keys(this.grid[row])) {
                if (!this.gridNomineeValues[row]) {
                    this.gridNomineeValues[row] = [];
                }

                this.gridNomineeValues[row][col] = getEmptyRow();
            }
        }

        this.selectedRowIndex = null;
        this.selectedColIndex = null;
        this.showNominees = false;
        this.isHelpEnabled = false;
        this.time = 0;
        this.solvedGrid = null;

        this.cancelTimer();
        this.subscription = timer(0, 1000).subscribe(() => {
            this.time++;

            this.changeDetector.markForCheck();
        });
    }

    private onValueChange(row: number, col: number, value: SudokuValue): void {
        value = Number(value);

        this.grid[row][col] = (value > 0 && value <= 9)
            ? value
            : null;
    }

    private toggleNomineeValue(row: number, col: number, value: SudokuValue): void {
        let modifiedNomineeValue: Array<SudokuValue> = cloneDeep(this.gridNomineeValues[row][col]);

        if (value === null) {
            modifiedNomineeValue = getEmptyRow();
        } else {
            value = Number(value);
            const indexValue: number = value - 1;

            modifiedNomineeValue[indexValue] = modifiedNomineeValue[indexValue] === null
                ? value
                : null;
        }

        this.gridNomineeValues[row][col] = modifiedNomineeValue;
    }

    private removeNomineeValue(row: number, col: number, value: SudokuValue): void {
        if (value === null) {
            return;
        }

        const modifiedNomineeValue: Array<SudokuValue> = cloneDeep(this.gridNomineeValues[row][col]);

        value = Number(value);
        if (modifiedNomineeValue.includes(value)) {
            const indexValue: number = value - 1;

            modifiedNomineeValue[indexValue] = null;

            this.gridNomineeValues[row][col] = modifiedNomineeValue;
        }
    }

    /**
	 * @deprecated https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
	 */
    @HostListener('window:keydown', ['$event'])
    private onKeydown(event: KeyboardEvent): void {
        const value: number = Number(event.key);
        if (value > 0 && value <= 9) {
            this.onSelectValue(value);
        }

        if (event.key === 'Backspace' || event.key === 'Delete') {
            this.onSelectValue(null);
        }
    }

    private updateAffectedNomineeValue(value: SudokuValue): void {
        if (!this.hasSelectedValue()) {
            return;
        }

        // Empty nominees of selected value
        this.gridNomineeValues[this.selectedRowIndex][this.selectedColIndex] = getEmptyRow();

        // Remove same nominee values of same row
        for (const colValue of Object.keys(this.grid[this.selectedRowIndex])) {
            this.removeNomineeValue(this.selectedRowIndex, Number(colValue), value);
        }

        // Remove same nominee values of same col
        for (const rowValue of Object.keys(this.grid)) {
            this.removeNomineeValue(Number(rowValue), this.selectedColIndex, value);
        }

        // Remove same nominee values of same square
        const row: number = this.selectedRowIndex - this.selectedRowIndex % 3;
        const col: number = this.selectedColIndex - this.selectedColIndex % 3;

        for (let x: number = 0; x < 3; x++) {
            for (let y: number = 0; y < 3; y++) {
                this.removeNomineeValue(x + row, y + col, value);
            }
        }
    }

    private onFinishGrid(): void {
        this.cancelTimer();

        let isGridValid: boolean = true;
        for (const row of Object.keys(this.grid)) {
            for (const col of Object.keys(this.grid[row])) {
                if (this.isValueErroneous(Number(row), Number(col), this.grid[row][col])) {
                    isGridValid = false;
                }
            }
        }

        this.finish.emit({
            grid: this.grid,
            isGridValid,
            time: this.time,
        });
    }

    private cancelTimer(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private isGridFinish(): boolean {
        for (const row of Object.keys(this.grid)) {
            for (const col of Object.keys(this.grid[row])) {
                const value: SudokuValue = this.grid[row][col];

                if (value === null) {
                    return false;
                }
            }
        }

        return true;
    }
}

function timerFormatter(time: number): string {
    const hours: string = Math
        .floor(time / 3600)
        .toString()
        .padStart(2, '0');
    const minutes: string = Math
        .floor(time % 3600 / 60)
        .toString()
        .padStart(2, '0');
    const seconds: string = Math
        .floor(time % 3600 % 60)
        .toString()
        .padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

interface IOnFinishGridEvent {
    grid: SudokuGrid;
    isGridValid: boolean;
    time: number;
}

export {GridComponent, IOnFinishGridEvent, timerFormatter};
