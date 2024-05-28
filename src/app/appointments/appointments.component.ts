import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppointmentsService } from '../Services/Appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Appointments } from '../Modeles/Appointments';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator'; 
import { MatSort } from '@angular/material/sort'; 
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { PatientService } from '../Services/Patient.service';
import { CreateRDVComponent } from '../create-rdv/create-rdv.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'] // Utilise `styleUrls` au lieu de `styleUrl`
})

export class AppointmentsComponent implements OnInit {

  constructor(private PS: PatientService , private AS: AppointmentsService, private router: Router, private activatedRoute: ActivatedRoute, private dialog: MatDialog) { }

  displayedColumns: string[] = ['id', 'patient_id', 'appointment_date', 'reason', 'status' , 'actions'];
  form!: FormGroup;
  appointments: Appointments[] = []; 
  dataSource = new MatTableDataSource<Appointments>(); // Ne pas initialiser avec `this.appointments`
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  onPageChange(event: PageEvent): void {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.getAppointments();
  } 

  getAppointments(): void {
    this.AS.getAppointments().subscribe((appointments) => {
      const observables = appointments.map(appointment =>
        this.PS.GetPatientByID(appointment.patient_id)
      );
  
      forkJoin(observables).subscribe(patients => {
        appointments.forEach((appointment, index) => {
          appointment.patient_id = patients[index].first_name + " " + patients[index].last_name;
        });
  
        // Assign appointments to the array
        this.appointments = appointments;
  
        // Update the data source after populating appointments
        this.dataSource.data = this.appointments;
        this.dataSource.paginator = this.paginator;
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

  AjouterRDV() {
    console.log('Entering AjouterPatient() method');
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '1000';
    dialogConfig.height = '1000';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'center-dialog';
    console.log('Dialog configuration set up');

    const dialogRef = this.dialog.open(CreateRDVComponent, dialogConfig);
    console.log('Dialog opened');

    dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result === 'success') {
            console.log('Result is success. Calling getAppointments()');
            this.getAppointments();
        } else {
            console.log('Result is not success.');
        }
    });
  }

  openDialogForEdit(id: string): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '1000';
    dialogConfig.height = '3000';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'center-dialog';
    dialogConfig.data = { id: id }; 
    const dialogRef = this.dialog.open(CreateRDVComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result === 'success') {
        this.getAppointments();
      }
    });
  }

}
