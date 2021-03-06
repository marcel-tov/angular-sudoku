import { NgModule } from '@angular/core';
import { NotificationService } from './notification.service';
import { NotificationComponent } from './notification.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        MatSnackBarModule,
        MatIconModule,
        FlexLayoutModule,
    ],
    declarations: [
        NotificationComponent,
    ],
    providers: [
        NotificationService,
    ],
})
export class NotificationModule {}
