import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuGridValueComponent } from './sudoku-grid-value.component';

describe('SudokuGridValueComponent', () => {
  let component: SudokuGridValueComponent;
  let fixture: ComponentFixture<SudokuGridValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuGridValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SudokuGridValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
