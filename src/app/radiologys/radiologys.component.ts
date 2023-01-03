import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

// import * as cornerstoneMath from "cornerstone-math";
// import * as cornerstoneTools from "cornerstone-tools";
// import Hammer from "hammerjs";
// import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
// declare const cornerstone;
// import cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from 'dicom-parser';


var config = {
  webWorkerPath: '/assets/cornerstone/webworkers/cornerstoneWADOImageLoaderWebWorker.js',
  taskConfiguration: {
      'decodeTask': {
          codecsPath: '/assets/cornerstone/codecs/cornerstoneWADOImageLoaderCodecs.js'
      }
  }
}

cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

import { RenderingEngine } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';

import CornerstoneModule from "cornerstone-core"


@Component({
  selector: 'app-radiologys',
  templateUrl: './radiologys.component.html',
  styleUrls: ['./radiologys.component.css'],
})
export class RadiologysComponent implements OnInit {
  @ViewChild('testpod') canvasDiv!: ElementRef;


  // -----------Segunda Forma----------

  // ngOnInit() {
  //   // Get Cornerstone imageIds and fetch metadata into RAM
  //   // const imageIds = await createImageIdsAndCacheMetaData({
  //   //   StudyInstanceUID:
  //   //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
  //   //   SeriesInstanceUID:
  //   //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
  //   //   wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
  //   //   type: 'STACK',
  //   // });

  //   // Final code
  //   const content = document.getElementById('content');
  //   const element = document.createElement('div');
  //   element.style.width = '500px';
  //   element.style.height = '500px';

  //   content.appendChild(element);

  //   const renderingEngineId = 'myRenderingEngine';
  //   const viewportId = 'CT_AXIAL_STACK';
  //   const renderingEngine = new RenderingEngine(renderingEngineId);

  //   const viewportInput = {
  //     viewportId,
  //     element,
  //     type: ViewportType.STACK,
  //   };

  //   renderingEngine.enableElement(viewportInput);

  //   const viewport = renderingEngine.getViewport(viewportInput.viewportId);

  //   viewport.setStack('https://d3t6nz73ql33tx.cloudfront.net/dicomweb', 60);

  //   viewport.render();
  // }



  //--------- Tercera Fomra ----------
  ngOnInit(): void {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    var element = document.getElementById('element');

    // Injects cornerstone "enabled" canvas into DOM
    cornerstone.enable(element);

    cornerstone.loadAndCacheImage("wadouri:" + '../../assets/Im221.dcm').then(imageData => {
      console.log(imageData);
      cornerstone.displayImage(element, imageData);

        var viewport = {
        invert: false,
        pixelReplication: false,
        voi: {
          windowWidth: 400,
          windowCenter: 200,
          windowHeight: 900,
        },
        scale: 0.7,
        translation: {
          x: 0,
          y: 0,
        },
        colormap: 'hot',    
      };

      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);

    }).catch( error => { console.error(error) });

  }

}

// modificado --> node_modules/dicom-parser/index.d.ts:104:92