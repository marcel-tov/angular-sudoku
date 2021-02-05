import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
  ],
  exports: [
    PageNotFoundComponent,
  ],
  imports: [
    FlexLayoutModule,
  ],
})
export class PageNotFoundModule { }
