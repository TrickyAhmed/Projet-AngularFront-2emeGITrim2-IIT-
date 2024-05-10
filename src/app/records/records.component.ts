import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Records } from '../Modeles/Records';
import { RecordsService } from '../Services/Records.service';


@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  constructor(private RS: RecordsService, private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) { }
  displayedColumns: string[] = ['id', 'patient_id', 'appointment_id', 'diagnosis', 'prescription', 'notes','actions'];

  form!: FormGroup;


  ngOnInit(): void {
    const idFromUrl = this.activatedRoute.snapshot.params['id'];

    if (!!idFromUrl) {
      this.RS.GetRecordByID(idFromUrl).subscribe((record) => {
        this.initFormForEdit(record);
      });
    } else {
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
    this.RS.SupprimerRecordMedical(id).subscribe(() => {
      this.router.navigate(['/records']);
    });
  }

  updateRecord(): void {
    const updatedRecord = this.form.value;
    this.RS.EditAppointment(updatedRecord).subscribe(() => {
      this.router.navigate(['/records']);
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
}
