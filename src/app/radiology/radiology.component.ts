import { UploadFileService } from './../services/upload-file.service';
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
import { Observable, async, connect, map } from 'rxjs';
import { Diaseases } from '../interfaces/Diseases';
import { CanDeactivateGuardGuard } from '../auth/can-deactivate-guard.guard';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  constructor(
    private diseasesService: DiseasesService,
    private uploadFileService: UploadFileService,
    private sanitizer: DomSanitizer
  ) {
    // this.view = [innerWidth / 1.60, 600];
  }

  file!: File;
  diseasesAll: Diaseases[] = [];
  diseasesNGX: any[] = [];
  photoSelected!: string | ArrayBuffer | null;
  hiddenTxt: boolean = true;
  hiddenSpinner: boolean = false;
  displayButton: boolean = true;
  displayButton2: boolean = true;
  fileNmae: string;
  hiddenTxtDicom: boolean = true;
  photoSelectedDicom!: any;
  viewConveret: boolean = false;
  cubeloading: boolean = false;
  controlImg: any = "cursor: pointer;"

  //Metodos de vizualisacion Card-Convert-Dicom
  getSafeUrl(photo: File): SafeUrl {
    return (this.photoSelectedDicom = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(photo)
    ));
  }
  onFileSelectedDicomConvert(event: any): void {
    this.selectedFile = event.target.files[0];
    if (event.target.files[0]) {
      this.getSafeUrl(this.selectedFile);
      this.displayButton2 = false;
      this.hiddenTxtDicom = false;
      this.fileNmae = event.target.files[0].name;
    } else {
      this.displayButton2 = true;
      this.hiddenTxtDicom = true;
      this.fileNmae = 'File Name';
      return (this.photoSelectedDicom = null);
    }
  }

  viewCardConvert(estado: boolean) {
    this.viewConveret = estado;
  }

  //Cobertir a formato .dcm
  convertedDicomFile: Blob; // Variable para almacenar el archivo DICOM convertido
  convertedDicomFileList: FileList; // Variable para almacenar el archivo DICOM convertido como tipo FileList
  selectedFile: File; //archivo por procesar a dicom (jpg, png, jpeg)
  convertAndDownload(): void {
    this.cubeloading = true;
    setTimeout(() => {
      if (this.selectedFile) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExtension = this.selectedFile.name
          .toLowerCase()
          .substring(this.selectedFile.name.lastIndexOf('.'));

        if (allowedExtensions.includes(fileExtension)) {
          this.uploadFileService
            .convertToDicom2(this.selectedFile)
            .then((convertedFile: File) => {
              console.log('Archivo DICOM convertido:', convertedFile);

              //cargar Predicciones
              this.uploadFileService.uploadFile(this.selectedFile).subscribe(
                async (res: any) => {
                  // Guardo todo los datos del servidor
                  console.log('res', res);

                  const resultAllArray = res.map((obj: Diaseases) => ({
                    imagen: obj.imagen,
                    nombre: obj.nombre,
                    porcentaje: (obj.porcentaje * 100).toFixed(2),
                  }));
                  this.diseasesAll = resultAllArray;

                  //Guardo datos solo para grafico de Barras
                  const resultArray = res.map((obj: any) => ({
                    name: obj.nombre,
                    value: obj.porcentaje * 100,
                  }));
                  this.diseasesNGX = resultArray;
                  await this.myColor();

                  //Cargo los datos y cambio el Placeholders
                  this.isDataLoaded = true;
                  this.isDataLoadedBar = true;
                },
                (err) => {
                  console.log('ERROR: ', err);
                  if (err.error.error === 'Internal Server Error') {
                    Swal.fire({
                      title: 'An error occurred',
                      text: 'Server Error',
                      icon: 'warning',
                      showCancelButton: false,
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'Ok',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        location.reload();
                      }
                    });
                  } else {
                    Swal.fire('An error occurred', `${err.error}`, 'warning').then(
                      (result) => {
                        if (result.isConfirmed) {
                          location.reload();
                        }
                      }
                    );
                  }
                  this.isDataLoaded = true;
                  this.isDataLoadedBar = true;
                }
              );

              //cargar cornerstone
              this.hiddenSpinner = true;
              setTimeout(() => {
                this.stackDicom(convertedFile);
              }, 2500);
              this.viewUpload = true;
              this.MiniTutorial();
            })
            .catch((error) => {
              console.error('Error al convertir el archivo:', error);
              Swal.fire('An error occurred', 'Error converting file', 'error');
            });
        } else {
          Swal.fire('Error', 'Only JPG,PNG,JPEG files are allowed', 'warning');
        }
      }
      this.cubeloading = false;
      this.viewConveret = false;
    }, 2000);
  }

  //Cargar al sevidor de predicciones
  UploadServicePrediction(fileUpload: File) {
  this.uploadFileService.uploadFile(fileUpload[0]).subscribe(
    async (res: any) => {
      // Guardo todo los datos del servidor
      console.log('res', res);

      const resultAllArray = res.map((obj: Diaseases) => ({
        imagen: obj.imagen,
        nombre: obj.nombre,
        porcentaje: (obj.porcentaje * 100).toFixed(2),
      }));
      this.diseasesAll = resultAllArray;

      //Guardo datos solo para grafico de Barras
      const resultArray = res.map((obj: any) => ({
        name: obj.nombre,
        value: obj.porcentaje * 100,
      }));
      this.diseasesNGX = resultArray;
      await this.myColor();

      //Cargo los datos y cambio el Placeholders
      this.isDataLoaded = true;
      this.isDataLoadedBar = true;
    },
    (err) => {
      console.log('ERROR: ', err);
      if (err.error.error === 'Internal Server Error') {
        Swal.fire({
          title: 'An error occurred',
          text: 'Server Error',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      } else {
        Swal.fire('An error occurred', `${err.error}`, 'warning').then(
          (result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          }
        );
      }
      this.isDataLoaded = true;
      this.isDataLoadedBar = true;
    }
  );
  }

  // Upload photo
  isDataLoaded = false; //Placeholder Card
  isDataLoadedBar = false; //Placeholder Grafica Barras
  onPhotoSelected(event: any): any {
    /* //Metodo para subir archivos JPG (Cambiar a app.py original)
      this.file = <File>event.target.files;
      this.photoSelected = '../../assets/imgs/giphy.gif';

      // hiddens
      this.hiddenTxt = false;
      this.displayButton = false;

      //Consumo el servicio de Flask
      this.uploadFileService.uploadFile(this.file[0]).subscribe(
        async (res: any) => {
          // Guardo todo los datos del servidor
          console.log('res', res);

          const resultAllArray = res.map((obj: Diaseases) => ({
            imagen: obj.imagen,
            nombre: obj.nombre,
            porcentaje: (obj.porcentaje * 100).toFixed(2),
          }));
          this.diseasesAll = resultAllArray;

          //Guardo datos solo para grafico de Barras
          const resultArray = res.map((obj: any) => ({
            name: obj.nombre,
            value: obj.porcentaje * 100,
          }));
          this.diseasesNGX = resultArray;
          await this.myColor();

          //Cargo los datos y cambio el Placeholders
          this.isDataLoaded = true;
          this.isDataLoadedBar = true;
        },
        (err) => {
          console.log('ERROR: ', err);
          if (err.error.error === 'Internal Server Error') {
            Swal.fire({
              title: 'An error occurred',
              text: 'Server Error',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          } else {
            Swal.fire('An error occurred', `${err.error}`, 'warning').then(
              (result) => {
                if (result.isConfirmed) {
                  location.reload();
                }
              }
            );
          }
          this.isDataLoaded = true;
          this.isDataLoadedBar = true;
        }
      ); */

    if (event.target.files && event.target.files[0]) {
      const files: File[] = event.target.files;
      const invalidFiles: File[] = [];

      //Recorremos todo los archivos y obtenemos los invalidos
      for (const file of files) {
        const fileName: string = file.name;
        //Acepto solo archivos con extension .dcm o sin extension
        if (fileName.endsWith('.dcm') || fileName.indexOf('.') === -1) {
          ///
        } else {
          // Obtengo los archivos invalidos
          invalidFiles.push(file);
        }
      }

      //metodo para subir archivos
      if (invalidFiles.length === 0) {
        //Metodo para subir archivos
        this.file = <File>event.target.files;
        this.photoSelected = '../../assets/imgs/8ZBI.gif';
        this.controlImg = "cursor: pointer; height: 100%; width: 100%;"

        // hiddens
        this.hiddenTxt = false;
        this.displayButton = false;

        //Consumo el servicio de Flask
        /* this.uploadFileService.uploadFile(this.file[0]).subscribe(
          async (res: any) => {
            // Guardo todo los datos del servidor
            console.log('res', res);

            const resultAllArray = res.map((obj: Diaseases) => ({
              imagen: obj.imagen,
              nombre: obj.nombre,
              porcentaje: (obj.porcentaje * 100).toFixed(2),
            }));
            this.diseasesAll = resultAllArray;

            //Guardo datos solo para grafico de Barras
            const resultArray = res.map((obj: any) => ({
              name: obj.nombre,
              value: obj.porcentaje * 100,
            }));
            this.diseasesNGX = resultArray;
            await this.myColor();

            //Cargo los datos y cambio el Placeholders
            this.isDataLoaded = true;
            this.isDataLoadedBar = true;
          },
          (err) => {
            console.log('ERROR: ', err);
            if (err.error.error === 'Internal Server Error') {
              Swal.fire({
                title: 'An error occurred',
                text: 'Server Error',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
              }).then((result) => {
                if (result.isConfirmed) {
                  location.reload();
                }
              });
            } else {
              Swal.fire('An error occurred', `${err.error}`, 'warning').then(
                (result) => {
                  if (result.isConfirmed) {
                    location.reload();
                  }
                }
              );
            }
            this.isDataLoaded = true;
            this.isDataLoadedBar = true;
          }
        ); */
        this.UploadServicePrediction(this.file)
      } else {
        const nameInvalids = invalidFiles
          .map((element) => element.name)
          .join(',\n');

        Swal.fire(
          'Invalid file format',
          `Only ."dcm" formats are accepted and you have: ${nameInvalids}`,
          'warning'
        );
      }
    } else {
      // hiddens
      this.hiddenTxt = true;
      this.displayButton = true;
      this.photoSelected = null;
      this.controlImg = "cursor: pointer;"
    }
  }

  //variables subida de archivo y interfaz de radiologia
  viewUpload: boolean = false;

  loading() {
    this.hiddenSpinner = true;
    setTimeout(() => {
      this.stackDicom(this.file);
    }, 500);
    this.viewUpload = true;
    this.MiniTutorial();
  }
  //   *ngIf="viewUpload; else radiologyInterfaz" #radiologyInterfaz

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

  backgroundColor: any[] = [];
  //Custom Color
  async myColor() {
    const rojo = 'rgb(255, 0, 0)';
    const verde = 'rgb(0, 255, 14)';
    const amarillo = 'rgb(255, 242, 0)';

    this.diseasesNGX.forEach((disease) => {
      if (parseFloat(disease.value) >= 51) {
        this.backgroundColor.push(rojo);
      } else if (
        parseFloat(disease.value) >= 21 &&
        parseFloat(disease.value) <= 50
      ) {
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

  //Obtener datos de emfermedades para la grafica
  get single() {
    return this.diseasesService.diseasesData;
  }

  // Ejes X labels formateado a 0%
  formatPercent(val: any) {
    return val + '%';
  }

  // Datos seleccionados en la grafica de Barras (Por ve par aq usar)
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

  //Tarjetas de predicion de enfermedades
  expandCardRadiology(urlPhoto: string, nameDisease: string, percent: number) {
    const urlPhoto64 = 'data:image/png;base64,' + urlPhoto;
    Swal.fire({
      imageUrl: urlPhoto64,
      imageWidth: '200%',
      imageHeight: 750,
      imageAlt: nameDisease,
      html: `

        <hr style="color: white;">
        <h1 class="text-center" style="color: white; line-height:0.1;">${nameDisease}</h1>
        <p class="text-start"  style="color: rgb(59, 86, 134); font-size: 15px; line-height:0.1;">Percent: ${percent}%</p>
      `,
      backdrop: 'rgba(0, 0, 0, 0.7)',
      showConfirmButton: false,
      background: '#000000',
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
      },
    });
  }

  //Bandera para activar el stack de imagenes y para desactivarlo
  CtrlActive: boolean = false;
  desactiveAltKey() {
    this.CtrlActive = false;

    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool; // zoom

    cornerstoneTools.addTool(ZoomMouseWheelTool);
    cornerstoneTools.setToolActive('ZoomMouseWheel', {});
  }

  //Borra las herramientas selecionadas (Tool Management)
  opciones = [
    { texto: 'All', seleccionado: false },
    { texto: 'Length', seleccionado: false },
    { texto: 'EllipticalRoi', seleccionado: false },
    { texto: 'Angle', seleccionado: false },
    { texto: 'Bidirectional', seleccionado: false },
    { texto: 'RectangleRoi', seleccionado: false },
    { texto: 'ArrowAnnotate', seleccionado: false },
    { texto: 'TextMarker', seleccionado: false },
    { texto: 'FreehandRoi', seleccionado: false },
    { texto: 'CobbAngle', seleccionado: false },
    { texto: 'Probe', seleccionado: false },
  ];
  seleccionados: any[] = [];
  toolSelectToDelete() {
    this.seleccionados = this.opciones.filter((opcion) => opcion.seleccionado);
    var element = document.getElementById('element');
    cornerstone.enable(element);

    if (this.opciones[0].seleccionado == true) {
      this.opciones.forEach((e) => {
        cornerstoneTools.clearToolState(element, e.texto);
      });
    } else {
      this.seleccionados.forEach((e) => {
        cornerstoneTools.clearToolState(element, e.texto);
      });
    }
    cornerstone.updateImage(element);

    this.opciones.forEach((e) => (e.seleccionado = false));
  }

  //Activa las herramientas selecionadas (Tool Management)
  activateTools(toolActive: string) {
    const LengthTool = cornerstoneTools.LengthTool;
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
    const RotateTool = cornerstoneTools.RotateTool;
    const WwwcTool = cornerstoneTools.WwwcTool; // brillo
    const AngleTool = cornerstoneTools.AngleTool;
    const BidirectionalTool = cornerstoneTools.BidirectionalTool; // crea una cruz tipo lenghtTool
    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool; // crea lineas a partir de otras (no para hatsa llegar al punto de inico)
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool; // rectangulo calcula el area
    const EraserTool = cornerstoneTools.EraserTool; // borrador
    const StackScrollTool = cornerstoneTools.StackScrollTool; // Add our tool, and set it's mode
    const CobbAngleTool = cornerstoneTools.CobbAngleTool; // amgules cobb
    const TextMarkerTool = cornerstoneTools.TextMarkerTool; // mark perzonalites
    const ProbeTool = cornerstoneTools.ProbeTool; // marks
    const WwwcRegionTool = cornerstoneTools.WwwcRegionTool;

    try {
      switch (toolActive) {
        case 'Length':
          cornerstoneTools.addTool(LengthTool);
          cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
          break;

        case 'EllipticalRoi':
          cornerstoneTools.addTool(EllipticalRoiTool);
          cornerstoneTools.setToolActive('EllipticalRoi', {
            mouseButtonMask: 1,
          });
          break;

        case 'ArrowAnnotate':
          cornerstoneTools.addTool(ArrowAnnotateTool);
          cornerstoneTools.setToolActive('ArrowAnnotate', {
            mouseButtonMask: 1,
          });
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

        case 'Eraser':
          cornerstoneTools.addTool(EraserTool);
          cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 1 });
          break;

        case 'Angle':
          cornerstoneTools.addTool(AngleTool);
          cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 });
          break;

        case 'Bidirectional':
          cornerstoneTools.addTool(BidirectionalTool);
          cornerstoneTools.setToolActive('Bidirectional', {
            mouseButtonMask: 1,
          });
          break;

        case 'RectangleRoi':
          cornerstoneTools.addTool(RectangleRoiTool);
          cornerstoneTools.setToolActive('RectangleRoi', {
            mouseButtonMask: 1,
          });
          break;

        case 'FreehandRoi':
          cornerstoneTools.addTool(FreehandRoiTool);
          cornerstoneTools.setToolActive('FreehandRoi', { mouseButtonMask: 1 });
          break;

        case 'CobbAngle':
          cornerstoneTools.addTool(CobbAngleTool);
          cornerstoneTools.setToolActive('CobbAngle', { mouseButtonMask: 1 });
          break;

        case 'StackScroll':
          cornerstoneTools.addTool(StackScrollTool);
          cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
          break;

        case 'Probe':
          cornerstoneTools.addTool(ProbeTool);
          cornerstoneTools.setToolActive('Probe', { mouseButtonMask: 1 });
          break;

        case 'WwwcRegion':
          cornerstoneTools.addTool(WwwcRegionTool);
          cornerstoneTools.setToolActive('WwwcRegion', { mouseButtonMask: 1 });
          break;

        case 'TextMarker':
          const configuration = {
            markers: ['F5', 'F4', 'F3', 'F2', 'F1'],
            current: 'Double click to change text',
            ascending: true,
            loop: true,
          };
          cornerstoneTools.addTool(TextMarkerTool, { configuration });
          cornerstoneTools.setToolActive('TextMarker', { mouseButtonMask: 1 });
          break;

        default:
          Swal.fire(
            "Don't found",
            'Tool not found / or could an error occur',
            'error'
          );
          break;
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  //Herramientas por defecto activas
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
    cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 8 }); // Browser Back No funciona
    cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 16 }); // Browser Forward No funciona

    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 }); // mover
    cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 0 }); // rueda de maus
    cornerstoneTools.setToolActive('Magnify', { mouseButtonMask: 4 }); // boton rueda
    cornerstoneTools.setToolActive('ScaleOverlay', { mouseButtonMask: 0 });
    cornerstoneTools.setToolActive('OrientationMarkers', {
      mouseButtonMask: 0,
    });
  }

  // funcion de ver por stack varios dicom
  stackDicom(uploadFiles: any): any {
    this.hiddenSpinner = false;

    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init({
      showSVGCursors: true,
    });

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
    cornerstone.enable(element);
    this.Tools();

    const imageIds = [];
    Array.prototype.forEach.call(uploadFiles, function (file) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      imageIds.push(imageId);
    });

    if (uploadFiles.length > 1) {
      // Hacer algo cuando haya más de un archivo
      console.log('Hay más de un archivo');
      Array.prototype.forEach.call(uploadFiles, function (file) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      imageIds.push(imageId);
    });
    } else {
      // Hacer algo cuando no haya más de un archivo
      console.log('No hay más de un archivo');
      const file = uploadFiles; // Obtén el primer archivo de la lista
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      imageIds.push(imageId);
    }

    console.log("ImageIDS: ", imageIds);

    // Add our tool, and set it's mode
    const StackScrollMouseWheelTool =
      cornerstoneTools.StackScrollMouseWheelTool;

    //define the stack
    const stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds,
      options: {
        opacity: 0.7,
      },
    };

    // load images and set the stack
    cornerstone
      .loadImage(imageIds[0])
      .then((image) => {
        cornerstone.displayImage(element, image);
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
      })
      .catch((e) => {
        Swal.fire(
          'Error',
          'Something is wrong when loading the x-ray',
          'error'
        );
        console.log(e);
      });

    if (imageIds.length > 1) {
      window.addEventListener('keydown', (event) => {
        // Agrega un event listener para el evento 'keydown' en el objeto window.
        if (event.key === 'Control') {
          // Verifica si la tecla presionada es la tecla "Ctrl".
          this.CtrlActive = !this.CtrlActive;
          console.log(
            this.CtrlActive ? 'Frames Habilitado' : 'Frames Deshabilitado'
          );

          if (this.CtrlActive) {
            cornerstoneTools.addTool(StackScrollMouseWheelTool);
            cornerstoneTools.setToolActive('StackScrollMouseWheel', {});
          } else {
            const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool; // zoom
            cornerstoneTools.addTool(ZoomMouseWheelTool);
            cornerstoneTools.setToolActive('ZoomMouseWheel', {});
          }
        }
      });
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'warning',
        title: "You only uploaded a .dcm, you won't be able to use the Stack tool"
      })
    }
  }

  changeColorXray(color: string) {
    var element = document.getElementById('element');
    var viewport = {
      // invert: false,
      // pixelReplication: false,
      // voi: {
      //   windowWidth: 400,
      //   windowCenter: 60,
      // },
      // scale: 1.0,
      // translation: {
      //   x: 0,
      //   y: 0,
      // },
      colormap: color,
    };

    cornerstone.setViewport(element, viewport);
    cornerstone.updateImage(element);
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

  ResetRotate() {
    var element = document.getElementById('element');
    var viewport = {
      rotation: 0,
    };

    cornerstone.setViewport(element, viewport);
    cornerstone.updateImage(element);
  }

  // dropdown de switchs
  isInvierte: boolean = false;
  // invierte colores de negro y blanco
  invertXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
      var viewport = {
        invert: this.isInvierte,
        // translation: {
        //   x: 0,
        //   y: 0,
        // },
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
        // translation: {
        //   x: 0,
        //   y: 0,
        // },
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
        // translation: {
        //   x: 0,
        //   y: 0,
        // },
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
        // translation: {
        //   x: 0,
        //   y: 0,
        // },
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }

  //Imagen to Default
  defaultXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
    cornerstone.reset(element);
    }, 100);
  }

  //ejemplos de perzonalizacion de herramienta
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

  //tutoriales de los botones y herramientas a usar
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
          showCancelButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
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
              showCancelButton: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  html: `<h2 style="color: white;">By clicking on the three points you can access the options for flipping, pixel and inverting the colors of the radiograph.</h2>`,
                  imageUrl: '../../assets/imgs/captura-switch.png',
                  imageWidth: 500,
                  imageHeight: 400,
                  imageAlt: 'three points Sttings',
                  background: '#212529',
                  confirmButtonText: 'Next >',
                  showCancelButton: true,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      html: `
                      <h2 style="color: white;">You can clear all tools from the radiograph by selecting it.</h2>
                      `,
                      imageUrl: '../../assets/imgs/SelectToolTuto.png',
                      imageWidth: 500,
                      imageHeight: 400,
                      imageAlt: 'Clean radiograph',
                      background: '#212529',
                      confirmButtonText: 'Next >',
                      showCancelButton: true,
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      allowEnterKey: false,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire({
                          html: `
                            <h2 style="color: white;">To see the frames you can do them in two ways:</h2>
                            <ol >
                              <li style="color: white;">Press <kbd style="background: grey;">CTRL</kbd> to activate or deactivate it and use the mouse wheel.</li>
                              <li style="color: white;">Click on the Stack button and left click to use.</li>
                            </ol>
                            <br>
                            <h4 style="color: white;">If activated by keyboard, the zoom tool on the mouse wheel will be replaced by it. To deactivate it, press the red blinking button.</h4>
                          `,
                          imageUrl: '../../assets/imgs/tutorial-Ctrl.png',
                          imageWidth: 500,
                          imageHeight: 400,
                          imageAlt: 'Ctrl Stack Frames Settings',
                          background: '#212529',
                          confirmButtonText: 'Next >',
                          showCancelButton: true,
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          allowEnterKey: false,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire({
                              html: `<h1 style="color: white;">🎊🎉Congratulations!🎉🎊</h1> <br> <h4 style="color: white;">Now you can start working.</h4>`,
                              background: '#212529',
                              imageUrl: '../../assets/imgs/PortadaX-Ray.jpg',
                              imageWidth: 400,
                              imageHeight: 200,
                              imageAlt: 'Congratulations For end turial',
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  ngOnInit(): void {}
}
