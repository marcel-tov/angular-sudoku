import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuGridItemComponent } from './sudoku-grid-item.component';

describe('SudokuGridItemComponent', () => {
  let component: SudokuGridItemComponent;
  let fixture: ComponentFixture<SudokuGridItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuGridItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SudokuGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
