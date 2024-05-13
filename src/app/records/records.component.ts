import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Records } from '../Modeles/Records';
import { RecordsService } from '../Services/Records.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { PatientService } from '../Services/Patient.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
AjouterRecord() {
throw new Error('Method not implemented.');
}
openDialogForEdit(arg0: any) {
throw new Error('Method not implemented.');
}
  constructor(private PS: PatientService,private RS: RecordsService, private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) { }
  displayedColumns: string[] = ['id', 'patient_id', 'diagnosis', 'prescription', 'notes','actions'];
  Records: Records[] = []; 
  dataSource = new MatTableDataSource<Records>(this.Records);
  form!: FormGroup;


  ngOnInit(): void {
    const idFromUrl = this.activatedRoute.snapshot.params['id'];

    if (!!idFromUrl) {
      this.RS.GetRecordByID(idFromUrl).subscribe((record) => {
        this.getRecords();
        this.initFormForEdit(record);
      });
    } else {
      this.getRecords();
      this.initFormForAdd();
    }
  }

  addRecord(): void {
    const recordToSave = this.form.value;
    this.RS.AjouterRecordMedical(recordToSave).subscribe(() => {
      this.router.navigate(['/records']);
    });
  }

  deleteRecord(id: string): void {
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      height: '1000',
      width: '3000',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.RS.SupprimerRecordMedical(id).subscribe(() => {
          this.getRecords();
        });
      }
    });
    
  }

  updateRecord(): void {
    const updatedRecord = this.form.value;
    this.RS.EditAppointment(updatedRecord).subscribe(() => {
      this.router.navigate(['/records']);
    });
  }

  
  getRecords(): void {
    this.RS.GetRecords().subscribe((records) => {
      // Loop through each record
      records.forEach((record) => {
        // Retrieve patient details for each record
        this.PS.GetPatientByID(record.patient_id).subscribe((patient) => {
          // Assign patient name to the record object
          record.patient_id = patient.first_name + " " + patient.last_name;
          // Add the record to the array
          this.Records.push(record);
          // Update the data source
          this.dataSource.data = this.Records;
        });
      });
    });
  }

  


  initFormForAdd(): void {
    this.form = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      patient_id: new FormControl(null, [Validators.required]),
      appointment_id: new FormControl(null, [Validators.required]),
      diagnosis: new FormControl(null, [Validators.required]),
      prescription: new FormControl(null, [Validators.required]),
      notes: new FormControl(null, [Validators.required]),
    });
  }

  initFormForEdit(record: Records): void {
    this.form = new FormGroup({
      id: new FormControl(record.id, [Validators.required]),
      patient_id: new FormControl(record.patient_id, [Validators.required]),
      appointment_id: new FormControl(record.appointment_id, [Validators.required]),
      diagnosis: new FormControl(record.diagnosis, [Validators.required]),
      prescription: new FormControl(record.prescription, [Validators.required]),
      notes: new FormControl(record.notes, [Validators.required]),
    });
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
}
