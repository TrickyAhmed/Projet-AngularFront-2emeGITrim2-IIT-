import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsComponent } from './patients/patients.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { RecordsComponent } from './records/records.component';
import { AppointmentsComponent } from './appointments/appointments.component';

const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    component:AcceuilComponent 
  },
  {
    path:'not',
    pathMatch:'full',
    component:NotFoundComponent 
  },
  {
    path:'patients',
    pathMatch:'full',
    component:PatientsComponent 
  },
  {
    path:'records',
    pathMatch:'full',
    component:RecordsComponent 
  },
  {
    path:'appointments',
    pathMatch:'full',
    component:AppointmentsComponent
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
