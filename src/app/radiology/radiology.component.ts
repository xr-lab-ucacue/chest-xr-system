import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DiseasesService } from '../services/diseases.service';

//Alertas sweealert
import Swal from 'sweetalert2'

@Component({
  selector: 'app-radiology',
  templateUrl: './radiology.component.html',
  styleUrls: ['./radiology.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RadiologyComponent implements OnInit {

  constructor(private diseasesService: DiseasesService) {}

  diseases: any[] = [];

  // Options Horizontal Bar
  view: [number, number] = [575, 600];
  gradient: boolean = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Diseases';
  showYAxisLabel = true;
  yAxisLabel = 'Percent';
  //Labels de los ejes X,Y
  showYAxisVertical=  'Diseases';
  showXAxisHorizontal=  'Percent';
  //Nuemros al final de barras
  showDataLabel = true;
  //Desactiva los Poops de barras
  tooltipDisabled = false;
  //Recortar labels eje Y
  trimYAxisTicks = false;
  //(No funcional)
  activeEntries = [{name: 'Edema', label: "Edema", value: 50}]


  backgroundColor:any[] = [];
   //Custom Color
   myColor(){
    this.diseases = [...this.diseasesService.diseasesData];
    console.log("diseases", this.diseases);

    const rojo = "rgb(255, 0, 0)";
    const verde = "rgb(0, 255, 14)";
    const amarillo = "rgb(255, 242, 0)";

    this.diseases.forEach( disease =>{
      if( disease.value >= 51 ){
        this.backgroundColor.push(rojo);
      }else if(disease.value >= 21 && disease.value <= 50){
        this.backgroundColor.push(amarillo);
      }else{
        this.backgroundColor.push(verde);
      }
    });
   }
  // Apply Color
  colorScheme: Color = {
    name: 'mycolor',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: this.backgroundColor
  };

  // Obtener datos
  get single() {
    return this.diseasesService.diseasesData;
  }

  // Ejes X labels formateado a 0%
  formatPercent(val:any) {
      return val + '%';
  }

  // Datos seleccionados
  showDiseases = ''
  photo: string = ""
  diseasesSelect: string = "";
  onSelect(data: any): void {
    console.log('Item clicked: ', JSON.parse(JSON.stringify(data)));
    console.log("data", data.name);
    if (data.name === 'Infiltration' && data.value > 49) {
      this.photo = "../../assets/radiologyDiseases.jpeg";
      this.showDiseases = data.name;
    } else if (data.name === 'Edema' && data.value > 49) {
      this. photo = "../../assets/radiologyDiseases2.jpeg";
      this.showDiseases = data.name;
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#000000',
        color: '#ccc',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'error',
        title: 'Menor del 50%'
      })
    }
  }

  customColors(){}

  ngOnInit(): void {
    this.myColor();
  }
}
