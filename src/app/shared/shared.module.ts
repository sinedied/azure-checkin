import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { VersionComponent } from './version.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  declarations: [LoginComponent, LogoutComponent, VersionComponent],
  imports: [CommonModule, MaterialModule],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
  ],
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
