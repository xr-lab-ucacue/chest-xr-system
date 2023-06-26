import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import cornerstoneTools from 'cornerstone-tools';
import * as cornerstone from 'cornerstone-core';
import * as dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
// import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader/dist/dynamic-import/cornerstoneWADOImageLoader.min.js';
import cornerstoneMath from 'cornerstone-math';
import 'hammerjs';
import { UploadFileService } from '../services/upload-file.service';


import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Diaseases } from '../interfaces/Diseases';


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
  selector: 'app-reference-lines-tool',
  templateUrl: './reference-lines-tool.component.html',
  styleUrls: ['./reference-lines-tool.component.css']
})
export class ReferenceLinesToolComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  file: File;
  file2: File;

  @ViewChild('input1', { read: ElementRef }) input1: ElementRef;
  @ViewChild('input2', { read: ElementRef }) input2: ElementRef;
  SyncCornerstone(): any {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init({
      showSVGCursors: true,
      globalToolSyncEnabled: true,
    });

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    var firstElement = document.getElementById('element1');
    var secondElement = document.getElementById('element2');
    const elements = [firstElement, secondElement];

    //first Img Radiologi
    this.file = this.input1.nativeElement.files;
    const imageIds = [];

    Array.prototype.forEach.call(this.file, function (file: any) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      imageIds.push(imageId);
    });

    //Second Stack radiology
    this.file2 = this.input2.nativeElement.files;
    const imageIds2 = [];

    Array.prototype.forEach.call(this.file2, function (file: any) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      imageIds2.push(imageId);
    });

    const firstStack = {
      currentImageIdIndex: 0,
      imageIds: imageIds,
    };

    const secondStack = {
      currentImageIdIndex: 0,
      imageIds: imageIds2,
    };

    // Create the synchronizer
    const synchronizer = new cornerstoneTools.Synchronizer(
      // Cornerstone event that should trigger synchronizer
      'cornerstonenewimage',
      // Logic that should run on target elements when event is observed on source elements
      cornerstoneTools.updateImageSynchronizer
    );
    const synchronizer2 = new cornerstoneTools.Synchronizer(
      'cornerstoneimagerendered',
      cornerstoneTools.wwwcSynchronizer,
      // cornerstoneTools.panZoomSynchronizer
    );

    elements.forEach((element) => {
      cornerstone.enable(element);
    });

    // Add and activate tools
    cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);
    cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
    cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
    // cornerstoneTools.addTool(cornerstoneTools.PanTool);


    cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
    cornerstoneTools.setToolActive('StackScrollMouseWheel', {});

    // load images and set the stack
    const firstLoadImagePromise = cornerstone
      .loadImage(firstStack.imageIds[0])
      .then((image) => {
        cornerstone.displayImage(firstElement, image);

        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 2 });
        // cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 })
        synchronizer2.add(firstElement);

        // set the stack as tool state
        synchronizer.add(firstElement);
        cornerstoneTools.addStackStateManager(firstElement, [
          'stack',
          'Crosshairs',
        ]);
        cornerstoneTools.addToolState(firstElement, 'stack', firstStack);
      });

    const secondLoadImagePromise = cornerstone
      .loadImage(secondStack.imageIds[0])
      .then((image) => {
        cornerstone.displayImage(secondElement, image);

        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 2 });
        // cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 })
        synchronizer2.add(secondElement);

        // set the stack as tool state
        synchronizer.add(secondElement);
        cornerstoneTools.addStackStateManager(secondElement, [
          'stack',
          'Crosshairs',
        ]);
        cornerstoneTools.addToolState(secondElement, 'stack', secondStack);
      });

    // After images have loaded, and our sync context has added both elements
    Promise.all([firstLoadImagePromise, secondLoadImagePromise]).then(() => {
      cornerstoneTools.addTool(cornerstoneTools.ReferenceLinesTool);
      cornerstoneTools.setToolEnabled('ReferenceLines', {
        synchronizationContext: synchronizer,
      });
    });
  }

}
