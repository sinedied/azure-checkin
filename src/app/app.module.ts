import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { EventComponent } from './event/event.component';
import { HomeComponent } from './home.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './shared/login.component';
import { LogoutComponent } from './shared/logout.component';
import { PassCardComponent } from './event/pass-card.component';
import { NoPassCardComponent } from './event/no-pass-card.component';
import { EventListComponent } from './admin/event-list.component';
import { LocalDatePipe } from './shared/local-date.pipe';
import { VersionComponent } from './shared/version.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    EventComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    PassCardComponent,
    NoPassCardComponent,
    EventListComponent,
    LocalDatePipe,
    VersionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
