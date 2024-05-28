import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsComponent } from './patients/patients.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { RecordsComponent } from './records/records.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';  
import { LineChartComponent } from './components/line-chart/line-chart.component';

const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    component:LoginComponent 
  },
  {
    path:'not',
    pathMatch:'full',
    component:NotFoundComponent 
  },
  {
    path:'patients',
    pathMatch:'full',
    component:PatientsComponent ,
   canActivate : [AuthGuard] 
  },
  {
    path:'records',
    pathMatch:'full',
    component:RecordsComponent ,
    canActivate : [AuthGuard] 
  },
  {
    path:'appointments',
    pathMatch:'full',
    component:AppointmentsComponent,
    canActivate : [AuthGuard] 
  },
  {
    path:'login',
    pathMatch:'full',
    component:LoginComponent
  },
  {
    path:'dashbored',
    pathMatch:'full',
    component:LineChartComponent
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
