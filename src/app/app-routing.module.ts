import { AuthService } from 'src/app/services/auth.service';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Modelo1Component } from './modelo1/modelo1.component';
import { RadiologyComponent } from './radiology/radiology.component';
import { RadiologysComponent } from './radiologys/radiologys.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'modelo1', component: Modelo1Component },
  { path: 'radiology', component: RadiologyComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent },
  { path: 'radiologys', component: RadiologysComponent },
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: '**', pathMatch: 'full', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers:[AuthGuard, AuthService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
