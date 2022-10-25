import { Component, OnInit, ViewChild } from '@angular/core';
import { DiseasesService } from '../services/diseases.service';
import {
  ActiveElement,
  Chart,
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartType,
} from 'chart.js';

@Component({
  selector: 'app-radiologys',
  templateUrl: './radiologys.component.html',
  styleUrls: ['./radiologys.component.css']
})
export class RadiologysComponent implements OnInit {

  constructor(private diseasesService: DiseasesService) {}

  photo: string = ""
  showDiseases = ''
  
  title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];

  public backgroundColor:any[] = [];
  public rojo = "rgb(255, 0, 0)";
  public verde = "rgb(0, 255, 14)";
  public amarillo = "rgb(255, 242, 0)";


  diseases = [...this.diseasesService.diseasesData];


  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.diseases.map( d => d.name),
    datasets: [
      { data: this.diseases.map( d => d.value), label: 'Diseases' },
    ],
  };


  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: 100
      }
    },
    indexAxis: 'y',
    onHover: (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<'bar'>
    ) => {
      chart.canvas.style.cursor = elements.length !== 0 ? 'pointer' : 'default';
    },
    onClick: (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<'bar'>
    ) => {
      if (elements[0]) {
        console.log(
          'Clicked on ',
          this.barChartData.labels![elements[0].index]
        );
        console.log(
          'this.barChartData',
          this.barChartData.datasets[elements[0].index]
        );
        console.log(
          'this.barChartData val',
          this.barChartData.datasets[elements[0].index].data[elements[0].index]
        );
      }
    },
  };


  ngOnInit(): void {






    

    /* this.diseases = [...this.diseasesService.diseasesData];
    console.log("diseases", this.diseases);
    
    let backgroundColor:any[] = [];

    const rojo = "rgb(255, 0, 0)";
    const verde = "rgb(0, 255, 14)";
    const amarillo = "rgb(255, 242, 0)";

    this.diseases.forEach( disease =>{
      if( disease.value >= 51 ){
        backgroundColor.push(rojo);
      }else if(disease.value >= 21 && disease.value <= 50){
        backgroundColor.push(amarillo);
      }else{
        backgroundColor.push(verde);
      }
    });

    setTimeout(() => {
      this.canvas = this.mychart.nativeElement; 
    this.ctx = this.canvas.getContext('2d');
    let subPerf = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.diseases.map( d => d.name),
        datasets: [{
          label: 'My Dataset',
          backgroundColor,
          borderColor: backgroundColor,
          data: this.diseases.map( d => d.value)
        }]
      },
      options: {
        responsive: true,
        onClick: event => {
          let point = Chart.helpers.getRelativePosition(event, subPerf.chart);
          let xIndex = subPerf.scales['x-axis-0'].getValueForPixel(point.x);
          let label = subPerf.data.labels[xIndex];
          console.log(label + ' at index ' + xIndex);
        },
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true
        //     }
        //   }]
        // }
      }
    });
    }, 2000); */

    

    /*const barCanvasEle: any = document.getElementById('bar_chart')
    const barChart = new Chart(barCanvasEle.getContext('2d'), {
      type: 'bar',
        data: {
          labels: this.diseases.map( d => d.name),
          datasets: [{
            label: 'Sales',
            data: this.diseases.map( d => d.value),
            backgroundColor,
            borderColor: backgroundColor,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          
          onClick: function (e) {
            var element = this.getElementAtEvent(e);
            if (element.length) {
              console.log(element[0])
            };
          }
        }
      });*/
  }

}
