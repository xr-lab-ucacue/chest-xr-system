import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

import cornerstoneTools from 'cornerstone-tools';
import * as cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from 'dicom-parser';
import cornerstoneMath from 'cornerstone-math';
import  'hammerjs'


var config = {
  webWorkerPath: '/assets/cornerstone/webworkers/cornerstoneWADOImageLoaderWebWorker.js',
  taskConfiguration: {
      'decodeTask': {
          codecsPath: '/assets/cornerstone/codecs/cornerstoneWADOImageLoaderCodecs.js'
      }
  }
}
cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

// import uids from './uids';
import { init as csRenderInit } from '@cornerstonejs/core';
import { init as csToolsInit } from '@cornerstonejs/tools';
import { RenderingEngine, Types, Enums, metaData } from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';

// import {
//   initDemo,
//   createImageIdsAndCacheMetaData,
//   setTitleAndDescription,
//   ctVoiRange,
// } from 'helpers';


@Component({
  selector: 'app-radiologys',
  templateUrl: './radiologys.component.html',
  styleUrls: ['./radiologys.component.css'],
})
export class RadiologysComponent implements OnInit {
  @ViewChild('testpod') canvasDiv!: ElementRef;

//   async ngOnInit(){
//     // await csRenderInit(), csToolsInit();

//     //     const {
//     //       PanTool,
//     //       WindowLevelTool,
//     //       StackScrollMouseWheelTool,
//     //       ZoomTool,
//     //       ToolGroupManager,
//     //       Enums: csToolsEnums,
//     //     } = cornerstoneTools;

//     //     const { MouseBindings } = csToolsEnums;
//     //     const { ViewportType } = Enums;



// // Get Cornerstone imageIds and fetch metadata into RAM
// const imageIds = await createImageIdsAndCacheMetaData({
//   StudyInstanceUID:
//     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
//   SeriesInstanceUID:
//     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
//   wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
//   type: 'STACK',
// });

// const content = document.getElementById('content');

// const element = document.createElement('div');

// // Disable the default context menu
// element.oncontextmenu = (e) => e.preventDefault();
// element.style.width = '500px';
// element.style.height = '500px';

// content.appendChild(element);

// await csRenderInit();

// const renderingEngineId = 'myRenderingEngine';
// const renderingEngine = new RenderingEngine(renderingEngineId);

// const viewportId = 'CT_AXIAL_STACK';

// const viewportInput = {
//   viewportId,
//   element,
//   type: ViewportType.STACK,
// };

// renderingEngine.enableElement(viewportInput);

// const viewport = <Types.IStackViewport>renderingEngine.getViewport(viewportId);

//  viewport.setStack(imageIds);
// viewport.render();

// // cornerstoneTools.addTool(ZoomTool);
// // cornerstoneTools.addTool(WindowLevelTool);

// // const toolGroupId = 'myToolGroup';
// // const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

// // // Add tools to the ToolGroup
// // toolGroup.addTool(ZoomTool.toolName);
// // toolGroup.addTool(WindowLevelTool.toolName);

// // toolGroup.addViewport(viewportId, renderingEngineId);

// // // Set the windowLevel tool to be active when the mouse left button is pressed
// // toolGroup.setToolActive(WindowLevelTool.toolName, {
// //   bindings: [
// //     {
// //       mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
// //     },
// //   ],
// // });

// // toolGroup.setToolActive(ZoomTool.toolName, {
// //   bindings: [
// //     {
// //       mouseButton: csToolsEnums.MouseBindings.Secondary, // Right Click
// //     },
// //   ],
// // });
//   }





  // -----------Segunda Forma----------

//  async ngOnInit() {

//   await csRenderInit(), csToolsInit();

//     const {
//       PanTool,
//       WindowLevelTool,
//       StackScrollMouseWheelTool,
//       ZoomTool,
//       ToolGroupManager,
//       Enums: csToolsEnums,
//     } = cornerstoneTools;

//     const { MouseBindings } = csToolsEnums;
//     const { ViewportType } = Enums;

//     // let viewport;
//     const toolGroupId = 'myToolGroup';

//   //   document
//   // .getElementById('selectFile')
//   // .addEventListener('change', function (e: any) {
//   //   // Add the file to the cornerstoneFileImageLoader and get unique
//   //   // number for that file
//   //   console.log('E >: ', e);
//   //   const file = e.target.files[0];
//   //   console.log('FILE >: ', file);

//   //   // const file = '../../assets/Im221.dcm'
//   //   const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
//   //   loadAndViewImage(imageId);
//   // });

//   cornerstoneTools.addTool(PanTool);
//   cornerstoneTools.addTool(WindowLevelTool);
//   cornerstoneTools.addTool(StackScrollMouseWheelTool);
//   cornerstoneTools.addTool(ZoomTool);

//   // Define a tool group, which defines how mouse events map to tool commands for
//   // Any viewport using the group
//   const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

//   // Add tools to the tool group
//   toolGroup.addTool(WindowLevelTool.toolName);
//   toolGroup.addTool(PanTool.toolName);
//   toolGroup.addTool(ZoomTool.toolName);
//   toolGroup.addTool(StackScrollMouseWheelTool.toolName);

//   // Set the initial state of the tools, here all tools are active and bound to
//   // Different mouse inputs
//   toolGroup.setToolActive(WindowLevelTool.toolName, {
//     bindings: [
//       {
//         mouseButton: MouseBindings.Primary, // Left Click
//       },
//     ],
//   });
//   toolGroup.setToolActive(PanTool.toolName, {
//     bindings: [
//       {
//         mouseButton: MouseBindings.Auxiliary, // Middle Click
//       },
//     ],
//   });
//   toolGroup.setToolActive(ZoomTool.toolName, {
//     bindings: [
//       {
//         mouseButton: MouseBindings.Secondary, // Right Click
//       },
//     ],
//   });
//   // As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
//   // hook instead of mouse buttons, it does not need to assign any mouse button.
//   toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);




//     //Final code
//     const content = document.getElementById('content');
//     const element = document.createElement('div');
//     element.style.width = '500px';
//     element.style.height = '500px';

//     content.appendChild(element);

//     const renderingEngineId = 'myRenderingEngine';
//     const  renderingEngine = new  RenderingEngine(renderingEngineId);

//     // const viewportId = 'CT_AXIAL_STACK';
//     const viewportId = 'CT_STACK';

//     const viewportInput = {
//       viewportId,
//       type: ViewportType.STACK,
//       element,
//       defaultOptions: {
//         background: <Types.Point3>[0.2, 0, 0.2],
//       },
//     };

//     renderingEngine.enableElement(viewportInput);

//     const viewport = <Types.IStackViewport>renderingEngine.getViewport(viewportId);

//     // viewport.setStack(['../../assets/Im221.dcm','../../assets/Im221.dcm',], 60 );

//     toolGroup.addViewport(viewportId, renderingEngineId);


//        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
//        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
//        cornerstone.enable(element);

//     cornerstone.loadAndCacheImage("wadouri:" + '../../assets/Im221.dcm').then(imageData => {
//       console.log(imageData);
//       cornerstone.displayImage(element, imageData);
//     })



//     // this function gets called once the user drops the file onto the div
// function handleFileSelect(evt) {
//   evt.stopPropagation();
//   evt.preventDefault();

//   // Get the FileList object that contains the list of files that were dropped
//   const files = evt.dataTransfer.files;

//   // this UI is only built for a single file so just dump the first one
//   const file = files[0];
//   const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
//   loadAndViewImage(imageId);
// }

// function handleDragOver(evt) {
//   evt.stopPropagation();
//   evt.preventDefault();
//   evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
// }

// function loadAndViewImage(imageId) {
//   const stack = [imageId];
//   // Set the stack on the viewport
//   viewport.setStack(stack).then(() => {
//     // Set the VOI of the stack
//     // viewport.setProperties({ voiRange: ctVoiRange });
//     // Render the image
//     viewport.render();

//     const imageData = viewport.getImageData();

//     const {
//       pixelRepresentation,
//       bitsAllocated,
//       bitsStored,
//       highBit,
//       photometricInterpretation,
//     } = metaData.get('imagePixelModule', imageId);

//     const voiLutModule = metaData.get('voiLutModule', imageId);

//     const sopCommonModule = metaData.get('sopCommonModule', imageId);
//     const transferSyntax = metaData.get('transferSyntax', imageId);

//     document.getElementById('transfersyntax').innerHTML =
//       transferSyntax.transferSyntaxUID;
//     // document.getElementById('sopclassuid').innerHTML = `${
//     //   sopCommonModule.sopClassUID
//     // } [${uids[sopCommonModule.sopClassUID]}]`;
//     document.getElementById('sopinstanceuid').innerHTML = sopCommonModule.sopInstanceUID;
//     // document.getElementById('rows').innerHTML = imageData.dimensions[0];
//     // document.getElementById('columns').innerHTML = imageData.dimensions[1];
//     document.getElementById('spacing').innerHTML = imageData.spacing.join('\\');
//     document.getElementById('direction').innerHTML = imageData.direction
//       .map((x) => Math.round(x * 100) / 100)
//       .join(',');

//     document.getElementById('origin').innerHTML = imageData.origin
//       .map((x) => Math.round(x * 100) / 100)
//       .join(',');
//     document.getElementById('modality').innerHTML = imageData.metadata.Modality;

//     document.getElementById('pixelrepresentation').innerHTML =
//       pixelRepresentation;
//     document.getElementById('bitsallocated').innerHTML = bitsAllocated;
//     document.getElementById('bitsstored').innerHTML = bitsStored;
//     document.getElementById('highbit').innerHTML = highBit;
//     document.getElementById('photometricinterpretation').innerHTML =
//       photometricInterpretation;
//     document.getElementById('windowcenter').innerHTML =
//       voiLutModule.windowCenter;
//     document.getElementById('windowwidth').innerHTML = voiLutModule.windowWidth;
//   });
// }
//   }



  //--------- Tercera Fomra ----------

  // async ngOnInit() {
  //   await csRenderInit(), csToolsInit();

  //       const {
  //         PanTool,
  //         WindowLevelTool,
  //         StackScrollMouseWheelTool,
  //         ZoomTool,
  //         ToolGroupManager,
  //         Enums: csToolsEnums,
  //       } = cornerstoneTools;

  //       const { MouseBindings } = csToolsEnums;
  //       const { ViewportType } = Enums;

  //   cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  //   cornerstoneWADOImageLoader.external.dicomParser = dicomParser;



  //   const content = document.getElementById('content');
  //   const element = document.createElement('div');
  //   // Disable the default context menu
  //   element.oncontextmenu = (e) => e.preventDefault();
  //   element.style.width = '300px';
  //   element.style.height = '300px';
  //   content.appendChild(element);
  //   await csRenderInit();



  //   // var element = document.getElementById('element');

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
  //       // colormap: 'hot',
  //     };

  //     cornerstone.setViewport(element, viewport);
  //     cornerstone.updateImage(element);

  //   }).catch( error => { console.error(error) });


  //   const renderingEngineId = 'myRenderingEngine';
  //   const renderingEngine = new RenderingEngine(renderingEngineId);

  //   const viewportId = 'CT_AXIAL_STACK';

  //   const viewportInput = {
  //     viewportId,
  //     element,
  //     type: ViewportType.STACK,
  //   };

  //   renderingEngine.enableElement(viewportInput);

  //   //const viewport = <Types.IStackViewport>renderingEngine.getViewport(viewportId);

  //   cornerstoneTools.addTool(ZoomTool);
  //   cornerstoneTools.addTool(WindowLevelTool);

  //   const toolGroupId = 'myToolGroup';
  //   const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  //   // Add tools to the ToolGroup
  //   toolGroup.addTool(ZoomTool.toolName);
  //   toolGroup.addTool(WindowLevelTool.toolName);

  //   toolGroup.addViewport(viewportId, renderingEngineId);

  //   // Set the windowLevel tool to be active when the mouse left button is pressed
  //   toolGroup.setToolActive(WindowLevelTool.toolName, {
  //     bindings: [
  //       {
  //         mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
  //       },
  //     ],
  //   });

  //   toolGroup.setToolActive(ZoomTool.toolName, {
  //     bindings: [
  //       {
  //         mouseButton: csToolsEnums.MouseBindings.Secondary, // Right Click
  //       },
  //     ],
  //   });


  // }

  //>>>>>>>>>>>>>>>>>


   ngOnInit() {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init();


    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;


    var element = document.getElementById('element');

    const fontFamily =
  'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';

    cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);

    // Set the tool width
    cornerstoneTools.toolStyle.setToolWidth(2);

    // Set color for inactive tools
    cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');

    // Set color for active tools
    cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');


    //>>>..
    const LengthTool = cornerstoneTools.LengthTool;
    const  ZoomMouseWheelTool =  cornerstoneTools.ZoomMouseWheelTool;
    const  EllipticalRoiTool =  cornerstoneTools.EllipticalRoiTool;
    const  ArrowAnnotateTool =  cornerstoneTools.ArrowAnnotateTool;
    const  EraserTool =  cornerstoneTools.EraserTool;
    const  MagnifyTool =  cornerstoneTools.MagnifyTool; // lupa donde este el puntero matenido
    const  RotateTool =  cornerstoneTools.RotateTool;
    const WwwcTool = cornerstoneTools.WwwcTool; // brillo
    const ScaleOverlayTool = cornerstoneTools.ScaleOverlayTool;
    const PanTool = cornerstoneTools.PanTool;// mover img por el canvas
    const AngleTool = cornerstoneTools.AngleTool;
    const BidirectionalTool = cornerstoneTools.BidirectionalTool;
    const OrientationMarkersTool = cornerstoneTools.OrientationMarkersTool;// como brujula en la img direciones
    const  FreehandRoiTool =  cornerstoneTools.FreehandRoiTool;// crea lineas a partir de otras (no para hatsa llegar al punto de inico)
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;// rectangulo calcula el area

    // Make sure we have at least one element Enabled
    cornerstone.enable(element);

    // Adds tool to ALL currently Enabled elements
    cornerstoneTools.addTool(LengthTool);
    cornerstoneTools.addTool(ZoomMouseWheelTool)
    cornerstoneTools.addTool(EllipticalRoiTool)
    cornerstoneTools.addTool(ArrowAnnotateTool)
    cornerstoneTools.addTool(EraserTool)
    cornerstoneTools.addTool(FreehandRoiTool)
    cornerstoneTools.addTool(MagnifyTool)
    cornerstoneTools.addTool(RotateTool)
    cornerstoneTools.addTool(WwwcTool)
    cornerstoneTools.addTool(ScaleOverlayTool)
    cornerstoneTools.addTool(PanTool)
    cornerstoneTools.addTool(OrientationMarkersTool)
    cornerstoneTools.addTool(AngleTool)
    cornerstoneTools.addTool(BidirectionalTool)
    cornerstoneTools.addTool(RectangleRoiTool)


    // Activate the tool for ALL currently Enabled elements
    cornerstoneTools.setToolActive('Length', { mouseButtonMask: 0 });
    cornerstoneTools.setToolActive('ZoomMouseWheel',  { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('EllipticalRoi',  { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('ArrowAnnotate',  { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('Eraser',  { mouseButtonMask: 3 })
    cornerstoneTools.setToolActive('FreehandRoi',  { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('Magnify',  { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('Rotate',  { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('Wwwc',  { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('ScaleOverlay', { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('OrientationMarkers', { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('Bidirectional', { mouseButtonMask: 0 })
    cornerstoneTools.setToolActive('RectangleRoi', { mouseButtonMask: 1 })



    cornerstone.loadAndCacheImage("wadouri:" + '../../assets/IM222').then(imageData => {
      console.log(imageData);
      cornerstone.displayImage(element, imageData);

      //   var viewport = {
      //   invert: false,
      //   pixelReplication: false,
      //   voi: {
      //     windowWidth: 400,
      //     windowCenter: 200,
      //     windowHeight: 900,
      //   },
      //   scale: 1.2,
      //   translation: {
      //     x: 0,
      //     y: 0,
      //   },
      //   // colormap: 'hot',
      // };

      // cornerstone.setViewport(element, viewport);
      // cornerstone.updateImage(element);

    }).catch( error => { console.error(error) });

  }

}

 /* modificado --> node_modules/dicom-parser/index.d.ts:104:92
 */
