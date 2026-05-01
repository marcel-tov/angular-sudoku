import {GridFooterNavigationComponent} from './grid-footer-navigation.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/vitest';
import {type MockInstance} from 'vitest';

describe('GridFooterNavigationComponent', () => {
    let spectator: Spectator<GridFooterNavigationComponent>;
    const createComponent: SpectatorFactory<GridFooterNavigationComponent> = createComponentFactory({
        component: GridFooterNavigationComponent,
        detectChanges: false,
        shallow: true,
    });

    it('Does show container', () => {
        spectator = createComponent({props: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        spectator.detectChanges();
        expect(spectator.queryAll('div.grid-footer-navigation')[0]).toHaveClass('grid-footer-navigation');
    });

    it('Does disable delete button when no value is selected', () => {
        spectator = createComponent({props: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Delete a selected value"]')).toBeDisabled();
    });

    it('Does enable delete button when value is selected', () => {
        spectator = createComponent({props: {hasSelectedValue: true, showNominees: false, isHelpEnabled: false}});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Delete a selected value"]')).not.toBeDisabled();
    });

    it('Does emit deleteValue on delete button click', () => {
        spectator = createComponent({props: {hasSelectedValue: true, showNominees: false, isHelpEnabled: false}});
        const deleteSpy: MockInstance = vi.spyOn(spectator.component.deleteValue, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('Delete number', {selector: 'button'});
        spectator.click(selector);
        expect(deleteSpy).toHaveBeenCalledWith();
    });

    it('Does emit nomineeToggle on nominees button click', () => {
        spectator = createComponent({props: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        const nomineeSpy: MockInstance = vi.spyOn(spectator.component.nomineeToggle, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('Nominees', {selector: 'button'});
        spectator.click(selector);
        expect(nomineeSpy).toHaveBeenCalledWith();
    });

    it('Does show delete button text', () => {
        spectator = createComponent({props: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Delete a selected value"]')).toHaveText('Delete number');
    });

    it('Does show nominees button text', () => {
        spectator = createComponent({props: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Toggle field edit nominees"]')).toHaveText('Nominees');
    });

    it('Does show help slide toggle', () => {
        spectator = createComponent({props: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        spectator.detectChanges();
        expect(spectator.query('mat-slide-toggle')).toHaveText('Help');
    });

    it('Does contain nominee values', () => {
        spectator = createComponent({props: {hasSelectedValue: false, showNominees: false, isHelpEnabled: false}});
        spectator.detectChanges();
        expect(spectator.element).toHaveDescendant('nominee-values');
    });
});
