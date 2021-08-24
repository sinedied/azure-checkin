import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { VersionComponent } from './version.component';

@NgModule({
  declarations: [LoginComponent, LogoutComponent, VersionComponent],
  imports: [CommonModule, MaterialModule],
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    LoginComponent,
    LogoutComponent,
    VersionComponent,
  ],
})
export class SharedModule {}
