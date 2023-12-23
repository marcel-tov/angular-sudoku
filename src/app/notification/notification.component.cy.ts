import {INotificationData, NotificationComponent} from './notification.component';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule} from '@angular/material/snack-bar';
import {mount} from 'cypress/angular';

describe('NotificationComponent', () => {
    beforeEach(() => {
        const data: INotificationData = {
            icon: 'test-icon',
            message: 'test-message',
        };

        mount(NotificationComponent, {
            imports: [
                MatSnackBarModule,
            ],
            providers: [
                {provide: MAT_SNACK_BAR_DATA, useValue: data},
            ],
        });
    });

    it('should be created', () => {
        cy.get('div').should('have.class', 'notification');
    });

    it('should contain icon', () => {
        cy.get('div.notification > mat-icon.notification__icon')
            .should('contain.text', 'test-icon');
    });

    it('should contain message  ', () => {
        cy.get('div.notification > span')
            .should('contain.text', 'test-message');
    });
});
