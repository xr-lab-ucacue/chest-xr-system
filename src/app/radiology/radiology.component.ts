import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DiseasesService } from '../services/diseases.service';
import { ViewChild, ElementRef } from '@angular/core';
//Alertas sweealert
import Swal from 'sweetalert2'

//Cornerstone
import cornerstoneTools from 'cornerstone-tools';
import * as cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import cornerstoneMath from 'cornerstone-math';
import 'hammerjs';

//Config Cornestone
var config = {
  webWorkerPath:
    '/assets/cornerstone/webworkers/cornerstoneWADOImageLoaderWebWorker.js',
  taskConfiguration: {
    decodeTask: {
      codecsPath:
        '/assets/cornerstone/codecs/cornerstoneWADOImageLoaderCodecs.js',
    },
  },
};
cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

@Component({
  selector: 'app-radiology',
  templateUrl: './radiology.component.html',
  styleUrls: ['./radiology.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RadiologyComponent implements OnInit {

  /* @ViewChild('valueInput') valueInput!: ElementRef;
  const urlPhoto =  this.valueInput.nativeElement.value;
  console.log(urlPhoto); */

  constructor(private diseasesService: DiseasesService) {
      // this.view = [innerWidth / 1.60, 600];
  }

  diseases: any[] = [];

  // Options Horizontal Bar
  view: [number, number] = [550, 660];
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
      this.photo = "../../assets/imgs/radiologyDiseases.jpeg";
      this.showDiseases = data.name;
    } else if (data.name === 'Edema' && data.value > 49) {
      this. photo = "../../assets/imgs/radiologyDiseases2.jpeg";
      this.showDiseases = data.name;
    } else if (data.name === 'Effusion' && data.value > 49) {
      this. photo = "../../assets/imgs/radiologyDiseases3.jpg";
      this.showDiseases = data.name;
    } else if (data.name === 'Cardiomegaly' && data.value > 49) {
      this. photo = "../../assets/imgs/radiologyDiseases4.jpg";
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

  onlyDiseases: any[]=[];
  diaseasesOnly(){
    this.diseases.forEach( disease => {
      if ( disease.value >= 51){
        this.onlyDiseases.push(disease)
      }
    })
  }

  expandCardRadiology(urlPhoto: string, nameDisease:string, percent: number){
        Swal.fire({
          html: //html
          `<hr style="color: white;">
          <h1 class="text-center" style="color: white; line-height:0.1;">${nameDisease}</h1>
          <p class="text-start"  style="color: rgb(59, 86, 134); font-size: 15px; line-height:0.1;">Percent: ${percent}%</p>
          `,
          imageUrl:`${urlPhoto}`,
          backdrop: 'rgba(0, 0, 0, 0.7)',
          imageHeight: 600,
          imageWidth: 600,
          showConfirmButton: false,
          imageAlt: 'Radiology',
          background: '#000000',
        })
  }

  activateTools(toolActive: string) {
    const element = document.getElementById('element');

    const LengthTool = cornerstoneTools.LengthTool;
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
    const RotateTool = cornerstoneTools.RotateTool;
    const WwwcTool = cornerstoneTools.WwwcTool; // brillo
    const PanTool = cornerstoneTools.PanTool; // mover img por el canvas
    const AngleTool = cornerstoneTools.AngleTool;
    const BidirectionalTool = cornerstoneTools.BidirectionalTool; // crea una cruz tipo lenghtTool
    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool; // crea lineas a partir de otras (no para hatsa llegar al punto de inico)
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool; // rectangulo calcula el area

    cornerstone.enable(element);

    switch (toolActive) {
      case 'Length':
        cornerstoneTools.addTool(LengthTool);
        cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
        break;

      case 'EllipticalRoi':
        cornerstoneTools.addTool(EllipticalRoiTool);
        cornerstoneTools.setToolActive('EllipticalRoi', { mouseButtonMask: 1 });
        break;

      case 'ArrowAnnotate':
        cornerstoneTools.addTool(ArrowAnnotateTool);
        cornerstoneTools.setToolActive('ArrowAnnotate', { mouseButtonMask: 1 });
        break;

      case 'FreehandRoi':
        cornerstoneTools.addTool(FreehandRoiTool);
        cornerstoneTools.setToolActive('FreehandRoi', { mouseButtonMask: 1 });
        break;

      case 'Rotate':
        cornerstoneTools.addTool(RotateTool);
        cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 1 });
        break;

      case 'Wwwc':
        cornerstoneTools.addTool(WwwcTool);
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
        break;

      case 'Pan':
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
        break;

      case 'Angle':
        cornerstoneTools.addTool(AngleTool);
        cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 });
        break;

      case 'Bidirectional':
        cornerstoneTools.addTool(BidirectionalTool);
        cornerstoneTools.setToolActive('Bidirectional', { mouseButtonMask: 1 });
        break;

      case 'RectangleRoi':
        cornerstoneTools.addTool(RectangleRoiTool);
        cornerstoneTools.setToolActive('RectangleRoi', { mouseButtonMask: 1 });
        break;

      case 'FreehandRoi':
        cornerstoneTools.addTool(FreehandRoiTool );
        cornerstoneTools.setToolActive('FreehandRoi', { mouseButtonMask: 1 });
        break;

      default:
        console.log('No such day exists!');
        break;
    }
  }

  Tools() {
    // Style de tools
    const fontFamily =
      'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
    cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);
    // Set the tool width
    cornerstoneTools.toolStyle.setToolWidth(1);
    // Set color for inactive tools
    cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
    // Set color for active tools
    cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

    // Despligue de herramientas
    const element = document.getElementById('element');

    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool; // zoom
    const EraserTool = cornerstoneTools.EraserTool; // borrador
    const MagnifyTool = cornerstoneTools.MagnifyTool; // lupa
    const ScaleOverlayTool = cornerstoneTools.ScaleOverlayTool; // escala
    const OrientationMarkersTool = cornerstoneTools.OrientationMarkersTool; // letras de orientacion

    //toll activa
    const LengthTool = cornerstoneTools.LengthTool;

    cornerstone.enable(element);

    //primera toll activa
    cornerstoneTools.addTool(LengthTool);
    cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });

    cornerstoneTools.addTool(ZoomMouseWheelTool);
    cornerstoneTools.addTool(EraserTool);
    cornerstoneTools.addTool(MagnifyTool);
    cornerstoneTools.addTool(ScaleOverlayTool);
    cornerstoneTools.addTool(OrientationMarkersTool);


    //herramientas activas por defecto
    cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 0 }); // rueda de maus
    cornerstoneTools.setToolActive('Magnify', { mouseButtonMask: 4 }); // boton rueda
    cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 2 }); //  click derecho
    cornerstoneTools.setToolActive('ScaleOverlay', { mouseButtonMask: 0 });
    cornerstoneTools.setToolActive('OrientationMarkers', {
      mouseButtonMask: 0,
    });
  }

  initCornerstone() {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init();

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    var element = document.getElementById('element');

    cornerstone.enable(element);
    this.Tools();

    cornerstone
      .loadAndCacheImage('wadouri:' + '../../assets/IM222')
      .then((imageData) => {
        console.log(imageData);
        cornerstone.displayImage(element, imageData);

        //   var viewport = {
        //   invert: false,
        //   pixelReplication: false,
        //   voi: {
        //     windowWidth: 400,
        //     windowCenter: 60,
        //   },
        //   scale: 1.1,
        //   translation: {
        //     x: 0,
        //     y: 0,
        //   },
        //   // colormap: 'hot',
        // };

        // cornerstone.setViewport(element, viewport);
        // cornerstone.updateImage(element);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ngOnInit(): void {
    this.myColor();
    this.diaseasesOnly();
    this.initCornerstone();
  }
}
