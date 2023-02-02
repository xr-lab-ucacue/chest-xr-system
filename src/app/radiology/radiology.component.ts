import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DiseasesService } from '../services/diseases.service';
import { ViewChild, ElementRef } from '@angular/core';
//Alertas sweealert
import Swal from 'sweetalert2';

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
  constructor(private diseasesService: DiseasesService) {
    // this.view = [innerWidth / 1.60, 600];
  }

  //>>>>>>> Variables photo
  viewUpload: boolean = true;
  viewRadiology: boolean = false;

  file!: File;
  photoSelected!: string | ArrayBuffer | null;
  hiddenTxt: boolean = true;
  hiddenSpinner: boolean = false;
  displayButton: boolean = true;
  // Upload photo
  onPhotoSelected(event: any): any {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      // image preview
      const reader = new FileReader();
      // reader.onload = e => this.photoSelected = reader.result;
      reader.onload = (e) =>
        (this.photoSelected = '../../assets/imgs/giphy.gif');
      reader.readAsDataURL(this.file);
      // hiddens
      this.hiddenTxt = false;
      this.displayButton = false;
      //retorno file
    }
  }

  // Bar progress
  loading() {
    this.hiddenSpinner = true;
    setTimeout(() => {
      // console.log('hello');
      this.files(this.file);
    }, 1500);
    this.viewUpload = false;
    this.viewRadiology = true;
    this.MiniTutorial();
  }
  // <<<<<<<<<

  diseases: any[] = [];

  // Options Horizontal Bar
  view: [number, number]; // [view]="view" 
  onResize(event) {
    this.view = [event.target.innerWidth / 1.35, 400];
  }
  gradient: boolean = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Diseases';
  showYAxisLabel = true;
  yAxisLabel = 'Percent';
  //Labels de los ejes X,Y
  showYAxisVertical = 'Diseases';
  showXAxisHorizontal = 'Percent';
  //Nuemros al final de barras
  showDataLabel = true;
  //Desactiva los Poops de barras
  tooltipDisabled = false;
  //Recortar labels eje Y
  trimYAxisTicks = false;
  //(No funcional)
  activeEntries = [{ name: 'Edema', label: 'Edema', value: 50 }];

  backgroundColor: any[] = [];
  //Custom Color
  myColor() {
    this.diseases = [...this.diseasesService.diseasesData];
    console.log('diseases', this.diseases);

    const rojo = 'rgb(255, 0, 0)';
    const verde = 'rgb(0, 255, 14)';
    const amarillo = 'rgb(255, 242, 0)';

    this.diseases.forEach((disease) => {
      if (disease.value >= 51) {
        this.backgroundColor.push(rojo);
      } else if (disease.value >= 21 && disease.value <= 50) {
        this.backgroundColor.push(amarillo);
      } else {
        this.backgroundColor.push(verde);
      }
    });
  }
  // Apply Color
  colorScheme: Color = {
    name: 'mycolor',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: this.backgroundColor,
  };

  // Obtener datos
  get single() {
    return this.diseasesService.diseasesData;
  }

  // Ejes X labels formateado a 0%
  formatPercent(val: any) {
    return val + '%';
  }

  // Datos seleccionados
  showDiseases = '';
  photo: string = '';
  diseasesSelect: string = '';
  onSelect(data: any): void {
    console.log('Item clicked: ', JSON.parse(JSON.stringify(data)));
    console.log('data', data.name);
    if (data.name === 'Infiltration' && data.value > 49) {
      this.photo = '../../assets/imgs/radiologyDiseases.jpeg';
      this.showDiseases = data.name;
    } else if (data.name === 'Edema' && data.value > 49) {
      this.photo = '../../assets/imgs/radiologyDiseases2.jpeg';
      this.showDiseases = data.name;
    } else if (data.name === 'Effusion' && data.value > 49) {
      this.photo = '../../assets/imgs/radiologyDiseases3.jpg';
      this.showDiseases = data.name;
    } else if (data.name === 'Cardiomegaly' && data.value > 49) {
      this.photo = '../../assets/imgs/radiologyDiseases4.jpg';
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
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'error',
        title: 'Menor del 50%',
      });
    }
  }

  onlyDiseases: any[] = [];
  diaseasesOnly() {
    this.diseases.forEach((disease) => {
      if (disease.value >= 51) {
        this.onlyDiseases.push(disease);
      }
    });
  }

  expandCardRadiology(urlPhoto: string, nameDisease: string, percent: number) {
    Swal.fire({
      //html
      html: `<hr style="color: white;">
          <h1 class="text-center" style="color: white; line-height:0.1;">${nameDisease}</h1>
          <p class="text-start"  style="color: rgb(59, 86, 134); font-size: 15px; line-height:0.1;">Percent: ${percent}%</p>
          `,
      imageUrl: `${urlPhoto}`,
      backdrop: 'rgba(0, 0, 0, 0.7)',
      imageHeight: 600,
      imageWidth: 600,
      showConfirmButton: false,
      imageAlt: 'Radiology',
      background: '#000000',
    });
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
        cornerstoneTools.addTool(FreehandRoiTool);
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

    // herramientas activadas
    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool; // zoom
    const EraserTool = cornerstoneTools.EraserTool; // borrador
    const MagnifyTool = cornerstoneTools.MagnifyTool; // lupa
    const ScaleOverlayTool = cornerstoneTools.ScaleOverlayTool; // escala
    const OrientationMarkersTool = cornerstoneTools.OrientationMarkersTool; // letras de orientacion

    //para mouse avanzaados
    const RotateTool = cornerstoneTools.RotateTool; // rotar imagen
    const PanTool = cornerstoneTools.PanTool; // mover img por el canvas

    //toll activa por defecto
    const LengthTool = cornerstoneTools.LengthTool;

    cornerstone.enable(element);

    //primera toll activa
    cornerstoneTools.addTool(LengthTool);
    cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });

    cornerstoneTools.addTool(RotateTool);
    cornerstoneTools.addTool(PanTool);

    cornerstoneTools.addTool(ZoomMouseWheelTool);
    cornerstoneTools.addTool(EraserTool);
    cornerstoneTools.addTool(MagnifyTool);
    cornerstoneTools.addTool(ScaleOverlayTool);
    cornerstoneTools.addTool(OrientationMarkersTool);

    //herramientas activas por defecto
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 16 }); // Browser Forward
    cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 8 }); // Browser Back

    cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 0 }); // rueda de maus
    cornerstoneTools.setToolActive('Magnify', { mouseButtonMask: 4 }); // boton rueda
    cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 2 }); //  click derecho
    cornerstoneTools.setToolActive('ScaleOverlay', { mouseButtonMask: 0 });
    cornerstoneTools.setToolActive('OrientationMarkers', {
      mouseButtonMask: 0,
    });
  }

  files(fileUp: any): any {
    this.hiddenSpinner = false;

    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init();

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      maxWebWorkers: navigator.hardwareConcurrency || 1,
      startWebWorkersOnDemand: true,
      webWorkerPath: 'cornerstoneWADOImageLoaderWebWorker.min.js',
      taskConfiguration: {
        decodeTask: {
          loadCodecsOnStartup: true,
          initializeCodecsOnStartup: false,
          codecsPath: 'cornerstoneWADOImageLoaderCodecs.min.js',
        },
      },
    });

    var element = document.getElementById('element');

    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileUp);

    cornerstone.enable(element);
    this.Tools();

    cornerstone
      .loadImage(imageId)
      .then((image) => {
        image.windowWidth = 400;
        image.windowCenter = 60;

        cornerstone.displayImage(element, image);
        console.log(image);
      })
      .catch((e) => {
        Swal.fire('Error', 'Algo Fallo!!', 'error');
        console.log(e);
      });
  }

  changeColorXray(color: string) {
    var element = document.getElementById('element');

    // cornerstone.displayImage(element, image);
    var viewport = {
      invert: false,
      pixelReplication: false,
      voi: {
        windowWidth: 400,
        windowCenter: 60,
      },
      scale: 1.0,
      translation: {
        x: 0,
        y: 0,
      },
      colormap: color,
    };

    cornerstone.setViewport(element, viewport);
    cornerstone.updateImage(element);

    this.isInvierte = false
    this.isPixel = false
  }

  colorToolsInactive: any = '#FFFF00';
  colorToolsActive: any = '#00FF00';
  changeColorTools() {
    // Set color for inactive tools
    cornerstoneTools.toolColors.setToolColor(this.colorToolsInactive);
    // Set color for active tools
    cornerstoneTools.toolColors.setActiveColor(this.colorToolsActive);
  }

  fuenteSelecioanda: string = '';
  sizeFont: number = 16;
  lineWidhtTool: number = 1;
  changeTextCornerstone() {
    switch (this.fuenteSelecioanda) {
      case 'Aboreto':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Aboreto`);
        break;
      case 'Audiowide':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Audiowide`);
        break;
      case 'Bangers':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Bangers`);
        break;
      case 'Bungee Shade':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Bungee Shade`);
        break;
      case 'Londrina Outline':
        cornerstoneTools.textStyle.setFont(
          `${this.sizeFont}px Londrina Outline`
        );
        break;
      case 'Megrim':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Megrim`);
        break;
      case 'Metamorphous':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Metamorphous`);
        break;
      case 'Noto Serif HK':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Noto Serif HK`);
        break;
      case 'Play':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Play`);
        break;
      case 'Poiret One':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Poiret One`);
        break;
      case 'Redacted Script':
        cornerstoneTools.textStyle.setFont(
          `${this.sizeFont}px Redacted Script`
        );
        break;
      case 'Slackey':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Slackey`);
        break;
      case 'Solitreo':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Solitreo`);
        break;
      case 'UnifrakturMaguntia':
        cornerstoneTools.textStyle.setFont(
          `${this.sizeFont}px UnifrakturMaguntia`
        );
        break;
      case 'Zilla Slab Highlight':
        cornerstoneTools.textStyle.setFont(
          `${this.sizeFont}px Zilla Slab Highlight`
        );
        break;

      default:
        const fontFamily =
          'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px ${fontFamily}`);
        break;
    }
  }
  onlyLineWidthToolCornerstone() {
    cornerstoneTools.toolStyle.setToolWidth(this.lineWidhtTool);
  }

  // dropdown de switchs
  isInvierte: boolean = false;
  // invierte colores de negro y blanco
  invertXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
      var viewport = {
        invert: this.isInvierte,
        translation: {
          x: 0,
          y: 0,
        },
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }
  isPixel: boolean = false;
  // pixela la imagen (se usa para distinguir cuando hay mucho zoom)
  pixelXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
      var viewport = {
        pixelReplication: this.isPixel,
        translation: {
          x: 0,
          y: 0,
        },
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }
  isFlipH: boolean = false;
  // imagen se voltea horizontalmente
  flipHXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
      var viewport = {
        hflip: this.isFlipH, // verdadero si la imagen se voltea horizontalmente
        translation: {
          x: 0,
          y: 0,
        },
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }
  isFlipV: boolean = false;
  // imagen se voltea verticalmente
  flipVXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
      var viewport = {
        vflip: this.isFlipV, // si la imagen se voltea verticalmente
        translation: {
          x: 0,
          y: 0,
        },
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }

  infoToolModal(tipo: string) {
    if (tipo === 'Inactive') {
      Swal.fire({
        html: `<h2 style="color: white;">Tool Inactive</h2>`,
        imageUrl: '../../assets/imgs/ExampleToolInactive.png',
        imageWidth: 500,
        imageHeight: 400,
        imageAlt: 'Tool Inactive example image:',
        background: '#212529',
      });
    } else if (tipo === 'Active') {
      Swal.fire({
        html: `<h2 style="color: white;">Tool Active</h2>`,
        imageUrl: '../../assets/imgs/ExampleToolActive.gif',
        imageWidth: 500,
        imageHeight: 400,
        imageAlt: 'Tool Active example image',
        background: '#212529',
      });
    } else if (tipo === 'MausClassic') {
      Swal.fire({
        html: `<h2 style="color: white;">Classic mouse buttons</h2>`,
        imageUrl: '../../assets/imgs/Tutorial-Maus1.png',
        imageWidth: 500,
        imageHeight: 400,
        imageAlt: 'Classic mouse tutorial',
        background: '#212529',
      });
    } else if (tipo === 'MausAdvanced') {
      Swal.fire({
        html: `<h2 style="color: white;">Advanced mouse buttons</h2>`,
        imageUrl: '../../assets/imgs/Tutorial-Maus2.png',
        imageWidth: 500,
        imageHeight: 400,
        imageAlt: 'Advanced mouse tutorial',
        background: '#212529',
      });
    }
  }

  MiniTutorial() {
    // BOTTOM DRAWER
    Swal.fire({
      title: 'Hello 👋, Watch this little tutorial before you start.',
      position: 'top-start',
      width: '600px',
      showClass: {
        popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `,
      },
      hideClass: {
        popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `,
      },
      grow: 'row',
      showConfirmButton: true,
      showCloseButton: true,
      confirmButtonColor: '#71D4AD',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "OK, let's go",
      cancelButtonText: "I don't need it",
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: `<h2 style="color: white;">Classic mouse buttons</h2>`,
          imageUrl: '../../assets/imgs/Tutorial-Maus1.png',
          imageWidth: 500,
          imageHeight: 400,
          imageAlt: 'Classic mouse tutorial',
          background: '#212529',
          confirmButtonText: 'Next >',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              html: `<h2 style="color: white;">
          You can access the tool settings by clicking on the nut.</h2>`,
              imageUrl: '../../assets/imgs/config-tutorial.png',
              imageWidth: 500,
              imageHeight: 400,
              imageAlt: 'Tool Sttings',
              background: '#212529',
              confirmButtonText: 'Next >',
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  html: `<h2 style="color: white;">By clicking on the three points you can access the options for flipping, pixel and inverting the colors of the radiograph.</h2>`,
                  imageUrl: '../../assets/imgs/captura-switch.png',
                  imageWidth: 500,
                  imageHeight: 400,
                  imageAlt: 'Tool Sttings',
                  background: '#212529',
                  confirmButtonText: 'Next >',
                });
              }
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  ngOnInit(): void {
    this.myColor();
    this.diaseasesOnly();
  }
}
