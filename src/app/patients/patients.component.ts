import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Patients } from '../Modeles/Patients';
import { PatientService } from '../Services/Patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { CreatePatientComponent } from '../create-patient/create-patient.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'address', 'phone', 'email', 'actions'];
  patients: Patients[] = [];
  dataSource = new MatTableDataSource<Patients>(this.patients);
  form!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cdr: ChangeDetectorRef,
    private PS: PatientService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getPatients();
    this.setupForm();
  }

  getPatients(): void {
    this.PS.GetPatients().subscribe((patients) => {
      this.patients = patients;
      this.dataSource.data = this.patients;
      this.dataSource.paginator = this.paginator;
    });
  }

  setupForm(): void {
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

  openDialogForEdit(id: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '3000';
    dialogConfig.height = '1000';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'center-dialog';
    dialogConfig.data = { id: id }; 

    const dialogRef = this.dialog.open(CreatePatientComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getPatients();
      }
    });
  }

  AjouterPatient(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '3000';
    dialogConfig.height = '500';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'center-dialog';

    const dialogRef = this.dialog.open(CreatePatientComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getPatients();
      }
    });
  }

  deletePatient(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      height: '500px',
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.PS.SupprimerPatient(id).subscribe(() => {
          this.getPatients();
        });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.getPatients();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
