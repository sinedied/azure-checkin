import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { EventComponent } from './event/event.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'event/:id', component: EventComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
