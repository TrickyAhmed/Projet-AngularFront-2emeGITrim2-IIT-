import { Component } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { OnInit } from '@angular/core';
import { AppointmentsService } from '../../Services/Appointment.service';
import { PatientService } from '../../Services/Patient.service';
import { RecordsService } from '../../Services/Records.service';
import { map } from 'rxjs/operators';
import { app } from '../../../../server';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  Nb_Appointments!: number;
  Nb_Patients!: number;
  Nb_Recoreds!: number;
  Nb_Tools!: number;

  diagnosisCount: { [key: string]: number } = {};
  appointmentCounts: { [key: string]: number } = {};
  GenderCounts: { [key: string]: number } = {};

  chartData: ChartDataset[] = [];
  chartLabels: string[] = [];
  chartOptions: ChartOptions = {};

  chartData1: ChartDataset[] = [];
  chartLabels1: string[] = [];
  chartOptions1: ChartOptions = {};

  
  chartData2: ChartDataset[] = [];
  chartLabels2: string[] = [];
  chartOptions2: ChartOptions = {};

  constructor(private AS: AppointmentsService, private PS: PatientService, private RS: RecordsService) { }

  ngOnInit(): void {
    this.PS.GetPatients().subscribe(res => {
      this.Nb_Patients = res.length;
      console.log(this.Nb_Patients);
      res.forEach(patients => {
        const sum = patients.gender;
        this.GenderCounts[sum] = (this.GenderCounts[sum] || 0) + 1;
      });
    
      this.chartLabels2 = Object.keys(this.GenderCounts); // Use GenderCounts instead of appointmentCounts
      const data2 = Object.values(this.GenderCounts);     // Use GenderCounts instead of appointmentCounts
    
      this.chartData2 = [{  // Use chartData2 instead of chartData1
        data: data2,
        backgroundColor: [
           // Reddish
          'rgba(54, 162, 235, 0.6)',
          'rgba(0, 206, 86, 0.6)',   
          'rgba(222, 00, 71, 0.6)',  // Deep Sky Blue
          'rgba(0, 206, 86, 0.6)',   // Light Goldenrod Yellow
          'rgba(75, 192, 192, 0.6)',   // Dark Cyan
          'rgba(153, 102, 255, 0.6)',  // Light Purple
          'rgba(100, 159, 64, 0.6)'    // Brownish Orange
            // Orangeish
          // Add more colors as needed
        ],
        label: 'Patients par Sexe'
      }];
    });
    


    this.AS.getAppointments().subscribe(res => { this.Nb_Appointments = res.length;
      res.forEach(appointment => {
        const date  = appointment.appointment_date ;
        this.appointmentCounts[date] = (this.appointmentCounts[date] || 0) + 1;});
        
        this.chartLabels1 = Object.keys(this.appointmentCounts);
        const data1 = Object.values(this.appointmentCounts);
        this.chartData1 = [{
          data: data1,
          backgroundColor: [
            'rgba(255, 99, 71, 0.6)',   // Reddish
'rgba(54, 162, 75, 0.6)',   // Greenish
'rgba(255, 206, 86, 0.6)',  // Yellowish
'rgba(75, 255, 255, 0.6)',  // Extreme Cyan
'rgba(153, 102, 255, 0.6)', // Purplish
'rgba(233, 159, 64, 0.6)'   // Orangeish

            // Add more colors as needed
          ],
          label: 'RDV Par jours'
      }];
    });

    this.RS.GetRecords().subscribe(res => {
      this.Nb_Recoreds = res.length;
      console.log(this.Nb_Appointments, "-", this.Nb_Patients, "-", this.Nb_Recoreds);

      // Count diagnosis
      res.forEach(record => {
        const diagnosis = record.diagnosis;
        this.diagnosisCount[diagnosis] = (this.diagnosisCount[diagnosis] || 0) + 1;
      });

      // Extract labels and data for chart
      this.chartLabels = Object.keys(this.diagnosisCount);
      const data = Object.values(this.diagnosisCount);

      // Prepare chart data
      this.chartData = [{
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(233, 159, 64, 0.6)'
          // Add more colors as needed
        ],
        label: 'Diagnosis Count'
      }];

      });
    }
  }
  