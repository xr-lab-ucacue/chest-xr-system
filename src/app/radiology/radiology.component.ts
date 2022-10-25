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

/*   public getNamedColor = (statName: string) => {
    console.log(statName);
    switch (statName) {
      case 'Antelectasis':
          return '#00ff00';
      case 'Trend':
          return '#D33F93';
      case 'Average':
          return '#9fa1a9';
      case 'Total':
          return '#CECB62';
      default:
          return '#1f3165';
    }
  }; */

 /*  customColors = (name: string, value: any) => {
    console.log(name, value);
    return "#9CCC65";
  } */

  customColors(){}

  ngOnInit(): void {
    this.myColor();
  }

  // grafica con colores por el valor: (lento rendimiento)
  /* setCustomColors() {
    let result: any[] = [];
    for (let i = 0; i < this.diseasesService.diseasesData.length; i++) {
       if (this.diseasesService.diseasesData[i].value <= 20) {
          result.push({"name": this.diseasesService.diseasesData[i].name,"value": "#9CCC65"});
       }
       else if (this.diseasesService.diseasesData[i].value >= 21 && this.diseasesService.diseasesData[i].value <= 50){
        result.push({"name": this.diseasesService.diseasesData[i].name,"value": "#FFEE58"});
       }
       else{
          result.push({"name": this.diseasesService.diseasesData[i].name,"value": "#EF5350"});
       }
    }
    return result;
  } */

  // grafica con colores por el valor: (lento rendimiento)
  /* setCustomColors() {
    let result: any[] = [];
    this.diseases.forEach( resp =>{
      if (resp.value <= 20) {
        return result.push({"name": resp.name,"value": "#9CCC65"});
      }else if (resp.value >= 21 && resp.value <= 50){
       return result.push({"name": resp.name,"value": "#FFEE58"});
      }else{
       return result.push({"name": resp.name,"value": "#EF5350"});
      }
    });
    return result;
  } */
}
