import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Patients } from '../Modeles/Patients';

@Injectable({
    providedIn: 'root'
})

export class PatientService {

    constructor(private httpClient: HttpClient) { }

    GetPatients(): Observable<Patients[]> {
        return this.httpClient.get<Patients[]>('http://localhost:8000/api/Patient')
    }
    SupprimerPatient(id: string): Observable<void> {
        return this.httpClient.delete<void>(`http://localhost:8000/api/Patient/${id}`);
    }

    AjouterPatient(Patient: any): Observable<any> {

        const PatientAajouter = {
            ...Patient,
            id: Math.ceil(Math.random() * 1000),
            createdDate: new Date().toISOString()
        }
        return this.httpClient.post<any>('http://localhost:8000/api/Patient', PatientAajouter);

    }

    GetPatientByID(id: string): Observable<Patients> {
        return this.httpClient.get<Patients>(`http://localhost:8000/api/Patient/${id}`)
    }

    EditAppointment(Patient: Patients): Observable<Patients> {
        return this.httpClient.put<Patients>(`http://localhost:8000/api/Appointment/${Patient.id}`, Patient);
    }





}
