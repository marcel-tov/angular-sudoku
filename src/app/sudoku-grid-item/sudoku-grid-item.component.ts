import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SudokuItem } from '../sudoku-grid/sudoku-grid.component';

@Component({
  selector: 'app-sudoku-grid-item',
  templateUrl: './sudoku-grid-item.component.html',
  styleUrls: ['./sudoku-grid-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SudokuGridItemComponent implements OnInit {
  @Input() public value: SudokuItem = null;
  @Input() public nomineeValue: ReplaySubject<SudokuItem> = new ReplaySubject();
  @Input() public isSelected: boolean = false;
  @Input() public isReadOnly: boolean = false;
  @Input() public hasError: boolean = false;
  @Input() public showNominees: boolean = false;
  public nominees: Array<SudokuItem> = [];
  @Output() private onChange: EventEmitter<SudokuItem> = new EventEmitter();

  constructor(
    private changeDetector: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.initializeNominees();

    this.nomineeValue.subscribe((nomineeValue: SudokuItem) => {
      if (this.isSelected && this.showNominees) {
        this.toggleNomineeValue(nomineeValue);

        this.changeDetector.detectChanges();
      }
    });
  }

  /**
   * @deprecated https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  private onKeydown(event: KeyboardEvent) {
    if (!this.isSelected) {
      return;
    }

    const value: number = Number(event.key);
    if (value > 0 && value <= 9) {
      if (this.showNominees) {
        this.toggleNomineeValue(value);

        return;
      }

      this.initializeNominees(); // reset nominees
      this.onChange.emit(value);
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.onChange.emit(null);
    }
  }

  private toggleNomineeValue(value: SudokuItem): void {
    value = Number(value);
    const indexValue: number = value - 1;

    this.nominees[indexValue] = this.nominees[indexValue] === null
      ? value
      : null;
  }

  private initializeNominees(): void {
    const nominees: Array<SudokuItem> = [];
    for (let i: number = 0; i < 9; i++) {
      nominees.push(null);
    }
    this.nominees = nominees;
  }
}
