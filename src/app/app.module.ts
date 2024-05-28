import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientsComponent } from './patients/patients.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatIconModule} from '@angular/material/icon';
import { LayoutComponent } from './layout/layout.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { RecordsComponent } from './records/records.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table'  
import { provideHttpClient , withFetch  } from '@angular/common/http';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { CreateRDVComponent } from './create-rdv/create-rdv.component';
import { CreateRecordComponent } from './create-record/create-record.component';
import { ChangeDetectorRef } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core'; // Import MatNativeDateModule
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard'; 
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { LineChartComponent } from './components/line-chart/line-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientsComponent,
    NotFoundComponent,
    LayoutComponent,
    AcceuilComponent,
    AppointmentsComponent,  
    RecordsComponent,
    ConfirmationComponent,
    CreatePatientComponent,
    CreateRDVComponent,
    CreateRecordComponent,
    LoginComponent,
    LineChartComponent
    

   
  ],
  imports: [
    BaseChartDirective,
    FormsModule,
    MatPaginatorModule,
    FontAwesomeModule,
    MatSelectModule,
    MatDatepickerModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule,
    CommonModule

  ],
  providers: [
    AuthGuard,
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
