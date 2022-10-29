import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Modelo1Component } from './modelo1/modelo1.component';
import { RadiologyComponent } from './radiology/radiology.component';
import { RadiologysComponent } from './radiologys/radiologys.component';

const routes: Routes = [
  { path: 'modelo1', component: Modelo1Component },
  { path: 'radiology', component: RadiologyComponent },
  { path: 'radiologys', component: RadiologysComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', pathMatch: 'full', component: Modelo1Component },
  { path: '**', pathMatch: 'full', component: Modelo1Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
