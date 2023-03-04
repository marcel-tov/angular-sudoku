import {INotificationData} from './notification.component';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {Component} from '@angular/core';
import {NotificationService} from './notification.service';
import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

@Component({
    selector: 'host-component',
    template: '',
})
export class HostComponent {}

describe('NotificationService', () => {
    beforeEach(() => {
        // const data: INotificationData = {
        //     icon: 'test-icon',
        //     message: 'test-message',
        // };

        cy.mount(HostComponent, {
            imports: [
                MatSnackBarModule,
                NoopAnimationsModule,
            ],
            providers: [
                NotificationService,
            //     {provide: MAT_SNACK_BAR_DATA, useValue: data},
            ],
        });
    });

    it('should be created', () => {
        console.log(TestBed.inject(NotificationService).showError('foobar'));
        // cy.inject();
        // cy.get('div').should('have.class', 'notification');
    });

    // it('should contain icon', () => {
    //     cy.get('div.notification > mat-icon.notification__icon')
    //         .should('contain.text', 'test-icon');
    // });

    // it('should contain message  ', () => {
    //     cy.get('div.notification > span')
    //         .should('contain.text', 'test-message');
    // });
});
