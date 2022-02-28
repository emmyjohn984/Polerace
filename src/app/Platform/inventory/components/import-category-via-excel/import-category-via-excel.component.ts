import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-import-category-via-excel',
  templateUrl: './import-category-via-excel.component.html',
  styleUrls: ['./import-category-via-excel.component.scss']
})

export class ImportCategoryViaExcelComponent implements OnInit {

  files: Array<any> = [];
  userData: any = {};
  formData = new FormData();
  @ViewChild('file') file: ElementRef;

  constructor(private commonService: CommonService, private notificationService: NotificationService, private inventoryService: InventoryService) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
  }

  handleFileChange(event) {
    let files = event.target.files;
    if (files) {
      this.files = [];
      for (let file of files) {
        if (this.commonService.isValidFileType(file.name, "excel")) {
          this.formData.append('CategoryUpload', file)
          this.formData.append('UserId', this.userData.userId)
          this.formData.append('CompanyId', this.userData.companyId)
          let data = {
            file: '',
            fileName: file.name,
            size: file.size,
            progress: '100%',
            status: 'Done'
          }
          let reader = new FileReader();
          reader.onload = (e) => {
            data.file = e.target.result.toString(),
              this.files.push(data);
          }
          reader.readAsDataURL(file);
        }
        else
          this.notificationService.Error("Please select valid file type.");
      }
    }
  }

  upload(file) {
    if (file) {
      this.inventoryService.importCategoryViaExcel(this.formData).subscribe(respone => {
        if (respone.body.status == 200) {
          if (respone.body.message == "")
            this.notificationService.Success("Categories has been uploaded successfully. It may take few minutes to complete process.")
          else
            this.notificationService.Warning(respone.body.message)
          this.files = [];
          this.formData = new FormData();
          this.file.nativeElement.value = '';
        }
        else
          this.notificationService.Error(respone.body.message)
      }, error => {
        this.notificationService.Error("Something went wrong. Please try again later.")
      });
    }
    else
      this.notificationService.Error("Please select file first.");

  }

  delete(e) {
    this.files = [];
    this.formData = new FormData();
    this.file.nativeElement.value = '';
  }

  downloadSampleFile() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '/assets/sample/SampleCategoryImportFile.xlsx');
    link.setAttribute('download', 'SampleCategoryImportFile.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
