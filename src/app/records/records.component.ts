import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Records } from '../Modeles/Records';
import { RecordsService } from '../Services/Records.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { PatientService } from '../Services/Patient.service';
import { CreateRecordComponent } from '../create-record/create-record.component';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  AjouterRecord() {
    console.log('Entering AjouterPatient() method');
    const dialogConfig = new MatDialogConfig();
  
    dialogConfig.width = '1000';
    dialogConfig.height = '1000';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'center-dialog';
    console.log('Dialog configuration set up');
  
    const dialogRef = this.dialog.open(CreateRecordComponent, dialogConfig);
    console.log('Dialog opened');
  
    dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result === 'success') {
            console.log('Result is success. Calling getRecord()');
            this.getRecords();
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
    const dialogRef = this.dialog.open(CreateRecordComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result === 'success') {
        this.getRecords();
      }
    });
  
  }
  constructor(private PS: PatientService,private RS: RecordsService, private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) { }
  displayedColumns: string[] = ['id', 'patient_id', 'diagnosis', 'prescription', 'notes','actions'];
  Records: Records[] = []; 
  dataSource = new MatTableDataSource<Records>(this.Records);
  form!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  onPageChange(event: PageEvent): void {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.getRecords();
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

  getRecords(): void {
    this.RS.GetRecords().subscribe((records) => {
      const observables = records.map(record =>
        this.PS.GetPatientByID(record.patient_id)
      );
  
      forkJoin(observables).subscribe(patients => {
        records.forEach((record, index) => {
          record.patient_id = patients[index].first_name + " " + patients[index].last_name;
        });
  
        // Assign records to the array
        this.Records = records;
  
        // Update the data source
        this.dataSource.data = this.Records;
        this.dataSource.paginator = this.paginator;
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
