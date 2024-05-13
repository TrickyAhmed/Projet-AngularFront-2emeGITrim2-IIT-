import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientService } from '../Services/Patient.service';
import { Patients } from '../Modeles/Patients'; // Import the Patients model

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {
  form!: FormGroup;
  title: string = "Ajouter un nouveau patient";

  constructor(
    public dialogRef: MatDialogRef<CreatePatientComponent>, 
    private fb: FormBuilder, 
    private PS: PatientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initializeForm(); 
    console.log('Form initialized:', this.form);
    if (this.data && this.data.id) {
      console.log('Editing existing patient with ID:', this.data.id);
      this.title = "Modifier le patient"; 
      this.PS.GetPatientByID(this.data.id).subscribe((patient: Patients) => {
          console.log('Retrieved patient details:', patient);
          this.Patch(patient); 
        },
        (error) => {
          console.error('Error retrieving patient details:', error);
        }
      );
    } else {
      console.log('No patient ID provided, adding new patient.');
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  Patch(patients: Patients): void {
    const patient = patients; // Access the first element of the array
    console.log('Patient data to patch:', patient);
    this.form = this.fb.group({
      first_name: [patient.first_name, Validators.required],
      last_name: [patient.last_name, Validators.required],
      date_of_birth: [patient.date_of_birth, Validators.required],
      gender: [patient.gender, Validators.required],
      address: [patient.address, Validators.required],
      phone: [patient.phone, Validators.required],
      email: [patient.email, [Validators.required, Validators.email]]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const dateOfBirth = new Date(this.form.value.date_of_birth);
      const formattedDateOfBirth = this.formatDate(dateOfBirth);

      this.form.patchValue({ date_of_birth: formattedDateOfBirth });

      if (this.data && this.data.id) {
        console.log("test id" ,this.data.id);
        const updatedPatientData = this.form.value; 
        this.PS.EditPatient(this.data.id ,updatedPatientData ).subscribe({
          next: (response: any) => {
            this.dialogRef.close('success'); 
            console.log("success modifying");
          },
          error: (error: any) => {
            console.error('Error updating patient:', error);
          }
        });
      } else {
        const newPatientData = this.form.value;
        console.log(this.form.value);
        this.PS.AjouterPatient(newPatientData).subscribe({
          next: (response: any) => {
            this.dialogRef.close('success'); 
            console.log("success adding");
          },
          error: (error: any) => {
            console.error('Error adding patient:', error);
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
