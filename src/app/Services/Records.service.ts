import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Records } from '../Modeles/Records';

@Injectable({
    providedIn: 'root'
})

export class RecordsService {

    constructor(private httpClient: HttpClient) { }

    GetRecords(): Observable<Records[]> {
        return this.httpClient.get<Records[]>('http://localhost:8000/api/MedicalRecord')
    }
    SupprimerRecordMedical(id: string): Observable<void> {
        return this.httpClient.delete<void>(`http://localhost:8000/api/MedicalRecord/${id}`);
    }

    AjouterRecordMedical(Record: any): Observable<any> {

        const RecordAAjouter = {
            ...Record,
            id: Math.ceil(Math.random() * 1000),
            createdDate: new Date().toISOString()
        }
        return this.httpClient.post<any>('http://localhost:8000/api/MedicalRecord', RecordAAjouter);

    }

    GetRecordByID(id: string): Observable<Records> {
        return this.httpClient.get<Records>(`http://localhost:8000/api/MedicalRecord/${id}`)
    }

    EditAppointment(Record: Records): Observable<Records> {
        return this.httpClient.put<Records>(`http://localhost:8000/api/Appointment/${Record.id}`, Record);
    }

}
