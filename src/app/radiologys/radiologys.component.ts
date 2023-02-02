import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild, OnInit, HostListener } from '@angular/core';

import cornerstoneTools from 'cornerstone-tools';
import * as cornerstone from 'cornerstone-core';
import * as dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
// import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader/dist/dynamic-import/cornerstoneWADOImageLoader.min.js';
import cornerstoneMath from 'cornerstone-math';
import 'hammerjs';
import { UploadFileService } from '../services/upload-file.service';

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
  selector: 'app-radiologys',
  templateUrl: './radiologys.component.html',
  styleUrls: ['./radiologys.component.css'],
})
export class RadiologysComponent implements OnInit {

  constructor(private router:Router,  private uploadService: UploadFileService){}
  conditionView: number = 1;


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

      default:
        console.log('No such day exists!');
        break;
    }
  }

  colorToolsInactive:any;
  colorToolsActive:any ;
  changeColorTools(){
    // Set color for inactive tools
    cornerstoneTools.toolColors.setToolColor(this.colorToolsInactive);
    // Set color for active tools
    cornerstoneTools.toolColors.setActiveColor(this.colorToolsActive);
  }

  fuenteSelecioanda: string = '';
  sizeFont: number = 16;
  lineWidhtTool: number = 1;
  changeTextCornerstone(){
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
    cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Londrina Outline`);
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
    cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Redacted Script`);
    break;
  case 'Slackey':
    cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Slackey`);
    break;
  case 'Solitreo':
    cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Solitreo`);
    break;
  case 'UnifrakturMaguntia':
    cornerstoneTools.textStyle.setFont(`${this.sizeFont}px UnifrakturMaguntia`);
    break;
  case 'Zilla Slab Highlight':
    cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Zilla Slab Highlight`);
    break;

    default:
      const fontFamily ='Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
      cornerstoneTools.textStyle.setFont(`${this.sizeFont}px ${fontFamily}`);
      break;

}
  }
  onlyLineWidthToolCornerstone(){
    cornerstoneTools.toolStyle.setToolWidth(this.lineWidhtTool);
  }


  Tools() {
    // Style de tools
    const fontFamily ='Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';

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

    cornerstone.enable(element);

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



file: File ;

  files(event: any): any {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init();

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      maxWebWorkers: navigator.hardwareConcurrency || 1,
      startWebWorkersOnDemand: true,
      webWorkerPath: "cornerstoneWADOImageLoaderWebWorker.min.js",
      taskConfiguration: {
        'decodeTask': {
          loadCodecsOnStartup : true,
          initializeCodecsOnStartup: false,
          codecsPath: "cornerstoneWADOImageLoaderCodecs.min.js"
        }
      }
    });

    var element = document.getElementById('element');


    this.file = <File>event.target.files[0];

      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(this.file);


      cornerstone.enable(element);
      this.Tools();

      cornerstone
      .loadImage(imageId)
      .then((image) => {
        // image.windowWidth = 400;
        // image.windowCenter = 60;


        cornerstone.displayImage(element, image);
        console.log(image);
      })
      .catch((e) => console.log(e));
  }

  changeColorXray(color : string){
    var element = document.getElementById('element');

    // cornerstone.displayImage(element, image);
        var viewport = {
          invert: false,
          pixelReplication: false,
          voi: {
            windowWidth: 400,
            windowCenter: 60
          },
          scale: 1.4,
          translation: {
            x: 0,
            y: 0
          },
          colormap: color
        };

        cornerstone.setViewport(element, viewport);
        cornerstone.updateImage(element);
  }

  isInvierte: boolean = false;
  // invierte colores de negro y blanco
  invertXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
    var viewport = {
      invert: this.isInvierte,
      translation: {
        x: 0,
        y: 0
      }
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
          y: 0
        }
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }


isFlipH : boolean = false;
  // imagen se voltea horizontalmente
flipHXray(){
  var element = document.getElementById('element');
  setTimeout(() => {
    var viewport = {
      hflip : this.isFlipH, // verdadero si la imagen se voltea horizontalmente
      translation: {
        x: 0,
        y: 0
      }
    };
    cornerstone.setViewport(element, viewport);
    cornerstone.updateImage(element);
  }, 100);
}

isFlipV: boolean = false;
  // imagen se voltea verticalmente
flipVXray(){
  var element = document.getElementById('element');
  setTimeout(() => {
    var viewport = {
      vflip : this.isFlipV, // si la imagen se voltea verticalmente
      translation: {
        x: 0,
        y: 0
      }
    };
    cornerstone.setViewport(element, viewport);
    cornerstone.updateImage(element);
  }, 100);
}




  //prueba inicial de cornestrone EN DESUSO
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
  }



}

/* modificado --> node_modules/dicom-parser/index.d.ts:104:92
 */
