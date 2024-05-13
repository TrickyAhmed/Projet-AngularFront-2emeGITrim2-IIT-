import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Appointments } from '../Modeles/Appointments';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  constructor(private httpClient: HttpClient) { }

  getAppointments(): Observable<Appointments[]> {
    return this.httpClient.get<Appointments[]>('http://localhost:8000/api/Appointment').pipe(
      catchError(this.handleError)
    );
  }

  supprimerAppointment(id: string): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:8000/api/Appointment/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  ajouterAppointment(appointment: Appointments): Observable<Appointments> {
    return this.httpClient.post<Appointments>('http://localhost:8000/api/Appointment', appointment).pipe(
      catchError(this.handleError)
    );
  }

  getAppointmentByID(id: string): Observable<Appointments> {
    return this.httpClient.get<Appointments>(`http://localhost:8000/api/Appointment/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  editAppointment(appointment: Appointments): Observable<Appointments> {
    return this.httpClient.put<Appointments>(`http://localhost:8000/api/Appointment/${appointment.id}`, appointment).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
