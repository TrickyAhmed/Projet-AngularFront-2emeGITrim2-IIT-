import { Component } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import {  OnInit } from '@angular/core';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit {
  chartData: ChartDataset[] = [
    {
      // ⤵️ Add these
      label: '$ in millions',
      data: [ 1551, 1688, 1800, 1895, 2124, 2124 ]
    }
  ];
  chartLabels: string[] = [];
  chartOptions: ChartOptions = {};

constructor() { }

ngOnInit(): void {
}
}
