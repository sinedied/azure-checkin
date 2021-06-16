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
import { LoginComponent } from './event/login.component';
import { LogoutComponent } from './event/logout.component';

@NgModule({
  declarations: [AppComponent, AdminComponent, EventComponent, HomeComponent, LoginComponent, LogoutComponent],
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
