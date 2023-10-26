import { LostPasswordComponent } from './lost-password/lost-password.component';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RadiologyComponent } from './radiology/radiology.component';
import { RadiologysComponent } from './radiologys/radiologys.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { PageUserComponent } from './page-user/page-user.component';
import { ProfileComponent } from './profile/profile.component';
import { CanDeactivateGuardGuard } from './auth/can-deactivate-guard.guard';
import { ReferenceLinesToolComponent } from './reference-lines-tool/reference-lines-tool.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'lostPassword', component: LostPasswordComponent },
  {
    path: 'register',
    component: RegisterComponent,
    canDeactivate: [CanDeactivateGuardGuard],
  },
  {
    path: 'radiology',
    component: RadiologyComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuardGuard],
  },
  { path: 'admin', component: AdminComponent, canActivate: [RoleGuard] },
  {
    path: 'userPage/:id',
    component: PageUserComponent,
    canActivate: [RoleGuard],
    canDeactivate: [CanDeactivateGuardGuard],
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'radiologys',
    component: RadiologysComponent,
    canActivate: [RoleGuard],
  },
  {
    path: 'referenceLines',
    component: ReferenceLinesToolComponent,
  },
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: '**', pathMatch: 'full', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard, AuthService],
  exports: [RouterModule],
})
export class AppRoutingModule {}
