import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { HomeComponent } from './home/home.component';
import { PassCardComponent } from './event/pass-card.component';
import { NoPassCardComponent } from './event/no-pass-card.component';
import { PassengerComponent } from './home/passenger.component';
import { LockedCardComponent } from './event/locked-card.component';

@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    HomeComponent,
    PassCardComponent,
    NoPassCardComponent,
    PassengerComponent,
    LockedCardComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, SharedModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
