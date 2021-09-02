import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { EventListComponent } from './event-list.component';
import { EventEditComponent } from './event-edit.component';
import { LocalDatePipe } from './local-date.pipe';
import { UnauthorizedComponent } from './unauthorized.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [AdminComponent, EventListComponent, EventEditComponent, LocalDatePipe, UnauthorizedComponent],
  imports: [SharedModule, AdminRoutingModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: navigator.language || 'en-US' }],
})
export class AdminModule {}
