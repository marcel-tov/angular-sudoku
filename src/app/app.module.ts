import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SudokuGridModule } from './sudoku-grid/sudoku-grid.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SudokuDialogModule } from './sudoku-dialog/sudoku-dialog.module';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    SudokuGridModule,
    AppRoutingModule,
    ClipboardModule,
    FlexLayoutModule,
    SudokuDialogModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
