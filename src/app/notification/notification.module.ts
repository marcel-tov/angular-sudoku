import {NgModule} from '@angular/core';
import {NotificationService} from './notification.service';
import {NotificationComponent} from './notification.component';

@NgModule({
    imports: [
        NotificationComponent,
    ],
    providers: [
        NotificationService,
    ],
})
export class NotificationModule {}
