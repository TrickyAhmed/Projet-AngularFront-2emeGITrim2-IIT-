import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { PatientService } from '../Services/Patient.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Patients } from '../Modeles/Patients';


@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  constructor(private PS:PatientService , private dialog:MatDialog , private router:Router, private activatedRoute:ActivatedRoute){}
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'address', 'phone','email'];
  Patients: Patients[] = []; 
  form!:FormGroup
 
  ngOnInit():void{
  const IdDansLeNavigateur =this.activatedRoute.snapshot.params['id']
    if(!!IdDansLeNavigateur){
      this.PS.GetPatientByID(IdDansLeNavigateur).subscribe((x)=>{
        this.FormForModifications(x);
      })
    }
    else this.FormForDisplaying();
  }

  AjouterPatient():void{
    const PatientToSave=this.form.value;
    this.PS.AjouterPatient(PatientToSave).subscribe(()=>{
      this.router.navigate(['/patients'])
     })

  }

  deletePatient(id: string): void {
    this.PS.SupprimerPatient(id).subscribe(() => {
      this.router.navigate(['/patients'])
    });
  }

  UpdatePatient(): void {
    const UpdatePatient = this.form.value;
    this.PS.EditAppointment(UpdatePatient).subscribe(() => {
      this.router.navigate(['/patients']);
    });
  }

  FormForDisplaying():void
  {
    this.form=new FormGroup({
      id:new FormControl(null,[Validators.required]) ,
      first_name: new FormControl(null,[Validators.required]) ,
      last_name: new FormControl(null,[Validators.required]) ,
      date_of_birth: new FormControl(null,[Validators.required]) ,
      gender: new FormControl(null,[Validators.required]) ,
      address: new FormControl(null,[Validators.required]) ,
      phone: new FormControl(null,[Validators.required]) ,
      email: new FormControl(null,[Validators.required]) ,
    })
  }

  FormForModifications(P:Patients):void
  {
    this.form=new FormGroup({
      id:new FormControl(P.id,[Validators.required]) ,
      first_name: new FormControl(P.first_name,[Validators.required]) ,
      last_name: new FormControl(P.last_name,[Validators.required]) ,
      date_of_birth: new FormControl(P.date_of_birth,[Validators.required]) ,
      gender: new FormControl(P.gender,[Validators.required]) ,
      address: new FormControl(P.address,[Validators.required]) ,
      phone: new FormControl(P.phone,[Validators.required]) ,
      email: new FormControl(P.email,[Validators.required]) ,
    })
  }
}
