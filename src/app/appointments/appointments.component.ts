import { Component, OnInit, ViewChild} from '@angular/core';
import { AppointmentsService } from '../Services/Appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Appointments } from '../Modeles/Appointments';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSort } from '@angular/material/sort'; 
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { PatientService } from '../Services/Patient.service';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})

export class AppointmentsComponent implements OnInit {
AjouterRDV() {
throw new Error('Method not implemented.');
}
openDialogForEdit(arg0: any) {
throw new Error('Method not implemented.');
}
  constructor(private PS: PatientService , private AS: AppointmentsService, private router: Router, private activatedRoute: ActivatedRoute, private dialog:MatDialog) { }
  displayedColumns: string[] = ['id', 'patient_id', 'appointment_date', 'reason', 'status' , 'actions'];
  form!: FormGroup;
  appointments: Appointments[] = []; 
  dataSource = new MatTableDataSource<Appointments>(this.appointments);
  ngOnInit(): void {
    const idFromUrl = this.activatedRoute.snapshot.params['id'];

    if (!!idFromUrl) {
      this.getAppointments();
      this.AS.getAppointmentByID(idFromUrl).subscribe((appointment) => {
        this.initFormForEdit(appointment);
      });
    } else {
      this.getAppointments();
      this.initFormForAdd();
      
    }
  }

  addAppointment(): void {
    const appointmentToSave = this.form.value;
    this.AS.ajouterAppointment(appointmentToSave).subscribe(() => {
      this.router.navigate(['/appointments']);
    });
  }

  getAppointments(): void {
    this.AS.getAppointments().subscribe((appointments) => {
      // Loop through each appointment
      appointments.forEach((appointment) => {
        // Retrieve patient details for each appointment
        this.PS.GetPatientByID(appointment.patient_id).subscribe((patient) => {
          // Assign patient name and last name to the appointment object
          appointment.patient_id = patient.first_name  + " " + patient.last_name;;
        
          // Add the appointment to the array
          this.appointments.push(appointment);
          // Update the data source
          this.dataSource.data = this.appointments;
        });
      });
    });
  }


  deleteAppointment(id: string): void {
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      height: '1000',
      width: '3000',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.AS.supprimerAppointment(id).subscribe(() => {
          this.getAppointments();
        });
      }
    });
    
  }
  

  UpdateAppointment(): void {
    const UpdateAppointment = this.form.value;
    this.AS.editAppointment(UpdateAppointment).subscribe(() => {
      this.router.navigate(['/appointments']);
    });
  }

  initFormForAdd(): void {
    this.form = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      patient_id: new FormControl(null, [Validators.required]),
      doctor_id: new FormControl(null, [Validators.required]),
      appointment_date: new FormControl(null, [Validators.required]),
      reason: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
    });
  }

  initFormForEdit(appointment: Appointments): void {
    this.form = new FormGroup({
      id: new FormControl(appointment.id, [Validators.required]),
      patient_id: new FormControl(appointment.patient_id, [Validators.required]),
      doctor_id: new FormControl(appointment.doctor_id, [Validators.required]),
      appointment_date: new FormControl(appointment.appointment_date, [Validators.required]),
      reason: new FormControl(appointment.reason, [Validators.required]),
      status: new FormControl(appointment.appointment_date, [Validators.required]),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
}
