import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patients } from '../Modeles/Patients';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientService } from '../Services/Patient.service';
import { AppointmentsService } from '../Services/Appointment.service';
import { Appointments } from '../Modeles/Appointments';

@Component({
  selector: 'app-create-rdv',
  templateUrl: './create-rdv.component.html',
  styleUrl: './create-rdv.component.css'
})

export class CreateRDVComponent {
  form!: FormGroup;
  title: string = "Ajouter un nouveau Rendez-Vous";
  patientName!: string;
  patientSurname!: string;
  constructor(
    public dialogRef: MatDialogRef<CreateRDVComponent>, 
    private fb: FormBuilder, 
    private AP: AppointmentsService,
    private patientService: PatientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initializeForm(); 
    console.log('Form initialized:', this.form);
    if (this.data && this.data.id) {
      console.log('Editing existing RDV with ID:', this.data.id);
      this.title = "Modifier le RDV"; 
      this.AP.getAppointmentByID(this.data.id).subscribe((Appointment: Appointments) => {
          console.log('Retrieved patient details:', Appointment);
          this.Patch(Appointment); 
        },
        (error) => {
          console.error('Error retrieving Appointment details:', error);
        }
      );
    } else {
      console.log('No Appointment ID provided, adding new Appointment.');
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      patient_id: ['', Validators.required],
      doctor_id: [1],
      appointment_date: ['', Validators.required],
      reason: ['', Validators.required],
      status: ['', Validators.required]
    });
  }
  
  Patch(appointment: Appointments): void {
    
    // Fetch patient details using patient_id from the appointment
    this.patientService.GetPatientByID(appointment.patient_id).subscribe((patient: Patients) => {
      // Update patientName and patientSurname properties with patient details
      this.patientName = patient.last_name;
      this.patientSurname = patient.first_name;

      // Patch the form with appointment details
      this.form.patchValue({
        patient_id: `${this.patientName} ${this.patientSurname}`, // Assuming you want to display both name and surname concatenated
        doctor_id: appointment.doctor_id,
        appointment_date: appointment.appointment_date,
        reason: appointment.reason,
        status: appointment.status
      });
    }, (error) => {
      console.error('Error retrieving Patient details:', error);
    });
  }

  

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      if (this.data && this.data.id) {
        const updatedAppointmentData = this.form.value;
        const dateOfAppointment = new Date(this.form.value.appointment_date);
        const formattedDateOfAppointment = this.formatDate(dateOfAppointment);
        updatedAppointmentData.appointment_date = formattedDateOfAppointment;
  
        this.AP.editAppointment(this.data.id, updatedAppointmentData).subscribe({
          next: (response: any) => {
            this.dialogRef.close('success');
            console.log("success modifying");
          },
          error: (error: any) => {
            console.error('Error updating Appointment:', error);
          }
        });
      } else {
        const newAppointment = this.form.value;
        const dateOfAppointment = new Date(this.form.value.appointment_date);
        const formattedDateOfAppointment = this.formatDate(dateOfAppointment);
        newAppointment.appointment_date = formattedDateOfAppointment;
  
        this.AP.ajouterAppointment(newAppointment).subscribe({
          next: (response: any) => {
            this.dialogRef.close('success');
            console.log("success adding");
          },
          error: (error: any) => {
            console.error('Error adding Appointment:', error);
          }
        });
      }
    }
  }
  
  

  // Function to format date to YYYY-MM-DD format
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  
}
