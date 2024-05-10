import { Component, OnInit, ViewChild} from '@angular/core';
import { AppointmentsService } from '../Services/Appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Appointments } from '../Modeles/Appointments';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSort } from '@angular/material/sort'; 


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})

export class AppointmentsComponent implements OnInit {
  constructor(private AS: AppointmentsService, private router: Router, private activatedRoute: ActivatedRoute) { }
  displayedColumns: string[] = ['id', 'patient_id', 'doctor_id', 'appointment_date', 'reason', 'status' , 'actions'];
  form!: FormGroup;
  appointments: Appointments[] = []; 
  dataSource = new MatTableDataSource<Appointments>(this.appointments);
  ngOnInit(): void {
    const idFromUrl = this.activatedRoute.snapshot.params['id'];

    if (!!idFromUrl) {
      this.AS.GetAppointmentByID(idFromUrl).subscribe((appointment) => {
        this.initFormForEdit(appointment);
      });
    } else {
      this.initFormForAdd();
    }
  }

  addAppointment(): void {
    const appointmentToSave = this.form.value;
    this.AS.AjouterAppointment(appointmentToSave).subscribe(() => {
      this.router.navigate(['/appointments']);
    });
  }

  getAppointments(): void {
    this.AS.GetAppointments().subscribe((appointments) => {
      this.appointments = appointments;
      this.dataSource.data = this.appointments; 
    });
  }


  deleteAppointment(id: string): void {
    this.AS.SupprimerAppointment(id).subscribe(() => {
      this.router.navigate(['/appointments'])
    });
  }

  UpdateAppointment(): void {
    const UpdateAppointment = this.form.value;
    this.AS.EditAppointment(UpdateAppointment).subscribe(() => {
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
