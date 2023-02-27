import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
            ],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        const app: AppComponent = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    // it('should have as title \'angular-sudoku\'', () => {
    //     const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    //     const app: AppComponent = fixture.debugElement.componentInstance;
    //     expect(app.title).toEqual('angular-sudoku');
    // });

    it('should render title in a h1 tag', () => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled: any = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Welcome to angular-sudoku!');
    });
});
