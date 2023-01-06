import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

// import * as cornerstoneMath from "cornerstone-math";
// import Hammer from "hammerjs";
// declare const cornerstone;
// import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
// import cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstoneTools from '@cornerstonejs/tools';
import * as cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from 'dicom-parser';


// var config = {
//   webWorkerPath: '/assets/cornerstone/webworkers/cornerstoneWADOImageLoaderWebWorker.js',
//   taskConfiguration: {
//       'decodeTask': {
//           codecsPath: '/assets/cornerstone/codecs/cornerstoneWADOImageLoaderCodecs.js'
//       }
//   }
// }
// cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

// import uids from './uids';
import { init as csRenderInit } from '@cornerstonejs/core';
import { init as csToolsInit } from '@cornerstonejs/tools';
import { RenderingEngine, Types, Enums, metaData } from '@cornerstonejs/core';
// import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';

@Component({
  selector: 'app-radiologys',
  templateUrl: './radiologys.component.html',
  styleUrls: ['./radiologys.component.css'],
})
export class RadiologysComponent implements OnInit {
  @ViewChild('testpod') canvasDiv!: ElementRef;







  // -----------Segunda Forma----------

 async ngOnInit() {

  await csRenderInit(), csToolsInit();

    const {
      PanTool,
      WindowLevelTool,
      StackScrollMouseWheelTool,
      ZoomTool,
      ToolGroupManager,
      Enums: csToolsEnums,
    } = cornerstoneTools;

    const { MouseBindings } = csToolsEnums;
    const { ViewportType } = Enums;

    let viewport;
    const toolGroupId = 'myToolGroup';

    // aqui
    // cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    // cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    // var content = document.getElementById('content');
    // const element = document.createElement('div');

    // cornerstone.enable(element);
    // cornerstone.loadAndCacheImage("wadouri:" + '../../assets/Im221.dcm').then(imageData => {
    //   console.log(imageData);
    //   loadAndViewImage(imageData);
    //   cornerstone.displayImage(element, imageData);

    //   cornerstone.setViewport(element, viewport);
    //   cornerstone.updateImage(element);

    // }).catch( error => { console.error(error) });


    document
  .getElementById('selectFile')
  .addEventListener('change', function (e: any) {
    // Add the file to the cornerstoneFileImageLoader and get unique
    // number for that file
    const file = e.target.files[0];
    console.log('FILE >: ', file);

    // const file = '../../assets/Im221.dcm'
    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    loadAndViewImage(imageId);
  });

  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(WindowLevelTool);
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.addTool(ZoomTool);

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  // Add tools to the tool group
  toolGroup.addTool(WindowLevelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);

  // Set the initial state of the tools, here all tools are active and bound to
  // Different mouse inputs
  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary, // Middle Click
      },
    ],
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary, // Right Click
      },
    ],
  });
  // As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
  // hook instead of mouse buttons, it does not need to assign any mouse button.
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);





    // Get Cornerstone imageIds and fetch metadata into RAM
    // const imageIds = ({
    //   StudyInstanceUID:
    //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
    //   SeriesInstanceUID:
    //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    //   wadoRsRoot: '../../assets/Im221.dcm',
    //   type: 'STACK',
    // });

    //Final code
    const content = document.getElementById('content');
    const element = document.createElement('div');
    element.style.width = '500px';
    element.style.height = '500px';

    content.appendChild(element);

    const renderingEngineId = 'myRenderingEngine';
    const  renderingEngine = new  RenderingEngine(renderingEngineId);

    // const viewportId = 'CT_AXIAL_STACK';
    const viewportId = 'CT_STACK';

    const viewportInput = {
      viewportId,
      element,
      type: ViewportType.STACK,
    };

    renderingEngine.enableElement(viewportInput);

    // const viewport = renderingEngine.getViewport(viewportInput.viewportId);

    viewport = <Types.IStackViewport>renderingEngine.getViewport(viewportId);

    // viewport.setStack(['../../assets/Im221.dcm','../../assets/Im221.dcm',], 60 );

    toolGroup.addViewport(viewportId, renderingEngineId);

    // viewport.render();





    // this function gets called once the user drops the file onto the div
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  // Get the FileList object that contains the list of files that were dropped
  const files = evt.dataTransfer.files;

  // this UI is only built for a single file so just dump the first one
  const file = files[0];
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
  loadAndViewImage(imageId);
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function loadAndViewImage(imageId) {
  const stack = [imageId];
  // Set the stack on the viewport
  viewport.setStack(stack).then(() => {
    // Set the VOI of the stack
    // viewport.setProperties({ voiRange: ctVoiRange });
    // Render the image
    viewport.render();

    const imageData = viewport.getImageData();

    const {
      pixelRepresentation,
      bitsAllocated,
      bitsStored,
      highBit,
      photometricInterpretation,
    } = metaData.get('imagePixelModule', imageId);

    const voiLutModule = metaData.get('voiLutModule', imageId);

    const sopCommonModule = metaData.get('sopCommonModule', imageId);
    const transferSyntax = metaData.get('transferSyntax', imageId);

    document.getElementById('transfersyntax').innerHTML =
      transferSyntax.transferSyntaxUID;
    // document.getElementById('sopclassuid').innerHTML = `${
    //   sopCommonModule.sopClassUID
    // } [${uids[sopCommonModule.sopClassUID]}]`;
    document.getElementById('sopinstanceuid').innerHTML =
      sopCommonModule.sopInstanceUID;
    document.getElementById('rows').innerHTML = imageData.dimensions[0];
    document.getElementById('columns').innerHTML = imageData.dimensions[1];
    document.getElementById('spacing').innerHTML = imageData.spacing.join('\\');
    document.getElementById('direction').innerHTML = imageData.direction
      .map((x) => Math.round(x * 100) / 100)
      .join(',');

    document.getElementById('origin').innerHTML = imageData.origin
      .map((x) => Math.round(x * 100) / 100)
      .join(',');
    document.getElementById('modality').innerHTML = imageData.metadata.Modality;

    document.getElementById('pixelrepresentation').innerHTML =
      pixelRepresentation;
    document.getElementById('bitsallocated').innerHTML = bitsAllocated;
    document.getElementById('bitsstored').innerHTML = bitsStored;
    document.getElementById('highbit').innerHTML = highBit;
    document.getElementById('photometricinterpretation').innerHTML =
      photometricInterpretation;
    document.getElementById('windowcenter').innerHTML =
      voiLutModule.windowCenter;
    document.getElementById('windowwidth').innerHTML = voiLutModule.windowWidth;
  });
}
  }



  //--------- Tercera Fomra ----------
  // ngOnInit(): void {
  //   cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  //   cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

  //   var element = document.getElementById('element');

  //   // Injects cornerstone "enabled" canvas into DOM
  //   cornerstone.enable(element);

  //   cornerstone.loadAndCacheImage("wadouri:" + '../../assets/Im221.dcm').then(imageData => {
  //     console.log(imageData);
  //     cornerstone.displayImage(element, imageData);

  //       var viewport = {
  //       invert: false,
  //       pixelReplication: false,
  //       voi: {
  //         windowWidth: 400,
  //         windowCenter: 200,
  //         // windowHeight: 900,
  //       },
  //       scale: 1.2,
  //       translation: {
  //         x: 0,
  //         y: 0,
  //       },
  //       colormap: 'hot',
  //     };

  //     cornerstone.setViewport(element, viewport);
  //     cornerstone.updateImage(element);

  //   }).catch( error => { console.error(error) });

  // }




  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>




}

// modificado --> node_modules/dicom-parser/index.d.ts:104:92
