import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { HomeComponent } from './home.component';
import { PassCardComponent } from './event/pass-card.component';
import { NoPassCardComponent } from './event/no-pass-card.component';

@NgModule({
  declarations: [AppComponent, EventComponent, HomeComponent, PassCardComponent, NoPassCardComponent],
  imports: [BrowserModule, BrowserAnimationsModule, SharedModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
