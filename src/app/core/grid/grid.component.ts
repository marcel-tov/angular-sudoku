import {
    ChangeDetectionStrategy,
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
import {NgFor, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {GridValueComponent} from '../grid-value/grid-value.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {SudokuGrid, SudokuRow, SudokuValue} from '../grid-helper/types';
import {getEmptyRow} from '../grid-helper/empty-row';
import {isValueValid} from '../grid-helper/is-value-valid';
import {solveSudoku} from '../grid-helper/solve-sudoku';
import {GridService} from './grid.service';

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
        // MatSlideToggleModule,
        GridValueComponent,
        MatGridListModule,
    ],
})
class GridComponent implements OnChanges {
    // @Input() public originalGrid!: SudokuGrid;
    // @Input() public showFooterNavigation: boolean = true;
    @Input() public lockValues: boolean = true;
    // @Input()  public showNominees: boolean = false;
    // @Output() public onChange: EventEmitter<SudokuGrid> = new EventEmitter<SudokuGrid>();
    // protected grid!: SudokuGrid;
    // protected solvedGrid: SudokuGrid | null = null;

    // @Input()  protected isHelpEnabled: boolean = false;
    // protected readonly nomineeValues: SudokuRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // @Output() protected finish: EventEmitter<IOnFinishGridEvent> = new EventEmitter<IOnFinishGridEvent>();
    public get grid(): SudokuGrid {
        return this.gridService.grid;
    }

    public get gridNomineeValues(): Array<Array<Array<SudokuValue>>> {
        return this.gridService.gridNomineeValues;
    }

    public get isHelpEnabled(): boolean {
        return this.gridService.isHelpEnabled;
    }

    public get showNominees(): boolean {
        return this.gridService.showNominees;
    }

    constructor(private gridService: GridService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.originalGrid && changes.originalGrid.currentValue !== undefined) {
            this.gridService.grid = cloneDeep(this.originalGrid);
            this.initalizeGrid();
        }
    }

    public isValueReadOnly(row: number, col: number): boolean {
        if (!this.lockValues) {
            return false;
        }

        const value: SudokuValue = this.gridService.originalGrid[row][col];

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
  		return isValueValid(this.gridService.grid, row, col, value);
    }

    public isValueSelected(row: number, col: number): boolean {
  		return !!(this.gridService.selectedRowIndex === row && this.gridService.selectedColIndex === col);
    }

    public toogleSelectedValue(row: number, col: number): void {
        if (this.isValueReadOnly(row, col)) {
            return;
        }

        if (this.isValueSelected(row, col)) {
            this.gridService.showNominees = !this.gridService.showNominees;
        }

        this.gridService.selectedRowIndex = row;
        this.gridService.selectedColIndex = col;
    }

    // public onHelpChange(event: MatSlideToggleChange): void {
  	// 	this.isHelpEnabled = event.checked;
    // }

    public trackByIndex(index: number) {
  		return index;
    }

    public isValueErroneous(row: number, col: number, value: SudokuValue): boolean {
        return this.gridService.isValueErroneous(row, col, value);
    }

    private initalizeGrid(): void {
        for (const row of Object.keys(this.gridService.grid)) {
            for (const col of Object.keys(this.gridService.grid[row])) {
                if (!this.gridService.gridNomineeValues[row]) {
                    this.gridService.gridNomineeValues[row] = [];
                }

                this.gridService.gridNomineeValues[row][col] = getEmptyRow();
            }
        }

        this.gridService.selectedRowIndex = null;
        this.gridService.selectedColIndex = null;
        this.gridService.showNominees = false;
        this.gridService.isHelpEnabled = false;
        this.solvedGrid = null;
    }

    /**
	 * @deprecated https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
	 */
    @HostListener('window:keydown', ['$event'])
    private onKeydown(event: KeyboardEvent): void {
        const value: number = Number(event.key);
        if (value > 0 && value <= 9) {
            this.gridService.onSelectValue(value);
        }

        if (event.key === 'Backspace' || event.key === 'Delete') {
            this.gridService.onSelectValue(null);
        }
    }
}

export {GridComponent};
