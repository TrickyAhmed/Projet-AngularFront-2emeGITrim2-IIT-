import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Appointments } from '../Modeles/Appointments';

@Injectable({
    providedIn: 'root'
})

export class AppointmentsService {
    constructor(private httpClient: HttpClient) { }

    GetAppointments(): Observable<Appointments[]> {
        return this.httpClient.get<Appointments[]>('http://localhost:8000/api/Appointment')
    }
    SupprimerAppointment(id: string): Observable<void> {
        return this.httpClient.delete<void>(`http://localhost:8000/api/Appointment/${id}`);
    }


    AjouterAppointment(Appointment: any): Observable<any> {

        const AppointmentToSave = {
            ...Appointment,
            id: Math.ceil(Math.random() * 1000),
            createdDate: new Date().toISOString()
        }
        return this.httpClient.post<any>('http://localhost:3000/api/Appointment', AppointmentToSave);

    }

    GetAppointmentByID(id: string): Observable<Appointments> {
        return this.httpClient.get<Appointments>(`http://localhost:8000/api/Appointment/${id}`)
    }

    EditAppointment(appointment: Appointments): Observable<Appointments> {
        return this.httpClient.put<Appointments>(`http://localhost:8000/api/Appointment/${appointment.id}`, appointment);
    }





}
