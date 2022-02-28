import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  isValidFileType(fileName, fileType): boolean {
    // Create an object for all extensions
    let extentionLists = { video: [], image: [], pdf: [], excel: [], xml: [] };
    let isValidType = false;
    extentionLists.video = ['m4v', 'avi', 'mpg', 'mp4'];
    extentionLists.image = ['jpg', 'jpeg', 'bmp', 'png', 'ico'];
    extentionLists.pdf = ['pdf'];
    extentionLists.excel = ['xlsx','xls'];
    extentionLists.xml = ['xml'];
    //get the extension of the selected file.
    let fileExtension = fileName.split('.').pop().toLowerCase();
    isValidType = extentionLists[fileType].indexOf(fileExtension) > -1;
    return isValidType;
  };

}
