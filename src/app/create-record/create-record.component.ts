import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecordsService } from '../Services/Records.service';
import { Records } from '../Modeles/Records';

@Component({
  selector: 'app-create-record',
  templateUrl: './create-record.component.html',
  styleUrls: ['./create-record.component.css']
})
export class CreateRecordComponent {
  form!: FormGroup;
  title: string = "Ajouter un nouveau Record Medical";

  constructor(
    public dialogRef: MatDialogRef<CreateRecordComponent>, 
    private fb: FormBuilder, 
    private RS: RecordsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initializeForm(); 
    console.log('Form initialized:', this.form);
    if (this.data && this.data.id) {
      console.log('Editing existing Record with ID:', this.data.id);
      this.title = "Modifier le Record"; 
      this.RS.GetRecordByID(this.data.id).subscribe((record: Records) => {
          console.log('Retrieved Record details:', record);
          this.patch(record); 
        },
        (error) => {
          console.error('Error retrieving Record details:', error);
        }
      );
    } else {
      console.log('No Record ID provided, adding new Record.');
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      patient_id: ['', Validators.required],
      doctor_id: [1],
      appointment_id: [45],
      diagnosis: ['', Validators.required],
      prescription: ['', Validators.required],
      notes: ['', Validators.required]
    });
  }

  patch(record: Records): void {
    console.log('Record data to patch:', record);
    console.log('Patient ID:', record.patient_id);
    console.log('Diagnosis:', record.diagnosis);
    console.log('Prescription:', record.prescription);
    console.log('Notes:', record.notes);
    this.form = this.fb.group({
      patient_id: [record.patient_id, Validators.required],
      doctor_id: [1],
      appointment_id: [45],
      diagnosis: [record.diagnosis, Validators.required],
      prescription: [record.prescription, Validators.required],
      notes: [record.notes, Validators.required]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      if (this.data && this.data.id) {
        console.log("test id" ,this.data.id);
        const updatedRecord = this.form.value; 
        this.RS.EditMedicalRecord(this.data.id ,updatedRecord ).subscribe({
          next: (response: any) => {
            this.dialogRef.close('success'); 
            console.log("success modifying");
          },
          error: (error: any) => {
            console.error('Error updating Record:', error);
          }
        });
      } else {
        const newRecord = this.form.value;
        console.log(this.form.value);
        this.RS.AjouterRecordMedical(newRecord).subscribe({
          next: (response: any) => {
            this.dialogRef.close('success'); 
            console.log("success adding");
          },
          error: (error: any) => {
            console.error('Error adding Record:', error);
          }
        });
      }
    }
  }
}
