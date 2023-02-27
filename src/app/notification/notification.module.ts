import {NgModule} from '@angular/core';
import {NotificationService} from './notification.service';
import {NotificationComponent} from './notification.component';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    imports: [
        MatSnackBarModule,
        MatIconModule,
    ],
    declarations: [
        NotificationComponent,
    ],
    providers: [
        NotificationService,
    ],
})
export class NotificationModule {}
