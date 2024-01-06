import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: ':grid', component: HomeComponent},
    // Wildcard route for a 404 page
    {path: '**', component: PageNotFoundComponent},
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HomeComponent,
        PageNotFoundComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
