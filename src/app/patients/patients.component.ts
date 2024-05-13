import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Patients } from '../Modeles/Patients';
import { PatientService } from '../Services/Patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { CreatePatientComponent } from '../create-patient/create-patient.component';
import { response } from 'express';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'address', 'phone', 'email', 'actions'];
  Patients: Patients[] = [];
  dataSource = new MatTableDataSource<Patients>(this.Patients);
  form!: FormGroup;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private PS: PatientService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const IdDansLeNavigateur = this.activatedRoute.snapshot.params['id'];
    if (!!IdDansLeNavigateur) {
      this.getPatients();
      this.PS.GetPatientByID(IdDansLeNavigateur).subscribe((x) => {
        this.FormForModifications(x);
      });
    } else {
      this.getPatients();
      this.FormForDisplaying();
    }
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
    const dialogRef = this.dialog.open(CreatePatientComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result === 'success') {
        this.getPatients();
      }
    });

  }

  AjouterPatient(): void {
    console.log('Entering AjouterPatient() method');
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '1000';
    dialogConfig.height = '1000';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'center-dialog';
    console.log('Dialog configuration set up');

    const dialogRef = this.dialog.open(CreatePatientComponent, dialogConfig);
    console.log('Dialog opened');

    dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result === 'success') {
            console.log('Result is success. Calling getPatients()');
            this.getPatients();
        } else {
            console.log('Result is not success.');
        }
    });
}


  getPatients(): void {
    this.PS.GetPatients().subscribe((Patients) => {
      this.Patients = Patients;
      this.dataSource.data = this.Patients;
    });
  }

  deletePatient(id: string): void {
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      height: '500',
      width: '500',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('delete');
        this.PS.SupprimerPatient(id).subscribe(() => {
          this.getPatients();
        });
      }
    });
  }

 

  FormForDisplaying(): void {
    this.form = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      date_of_birth: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
    });
  }

  FormForModifications(P: Patients): void {
    this.form = new FormGroup({
      id: new FormControl(P.id, [Validators.required]),
      first_name: new FormControl(P.first_name, [Validators.required]),
      last_name: new FormControl(P.last_name, [Validators.required]),
      date_of_birth: new FormControl(P.date_of_birth, [Validators.required]),
      gender: new FormControl(P.gender, [Validators.required]),
      address: new FormControl(P.address, [Validators.required]),
      phone: new FormControl(P.phone, [Validators.required]),
      email: new FormControl(P.email, [Validators.required]),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
  
    dialogConfig.width = '400px';
    dialogConfig.height = '400px';
  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'center-dialog';
  
    const dialogRef = this.dialog.open(CreatePatientComponent, dialogConfig);
  
    dialogRef.afterOpened().subscribe(() => {
      this.cdr.detectChanges(); 
    });
  }


 
 
  
  
  
}
