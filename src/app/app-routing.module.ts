import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Modelo1Component } from './modelo1/modelo1.component';
import { RadiologyComponent } from './radiology/radiology.component';
import { RadiologysComponent } from './radiologys/radiologys.component';

const routes: Routes = [
  { path: 'modelo1', component: Modelo1Component },
  { path: 'radiology', component: RadiologyComponent },
  { path: 'radiologys', component: RadiologysComponent },
  { path: '', pathMatch: 'full', component: Modelo1Component },
  { path: '**', pathMatch: 'full', component: Modelo1Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
