import { Component, OnInit } from '@angular/core';
import { UploadfileService } from '../../services/uploadfile.service'
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.scss']
})
export class UploadfileComponent implements OnInit {
  fileName;
  columnDefs = [
    { headerName: 'Make', field: 'make' },
    { headerName: 'Model', field: 'model' },
    { headerName: 'Price', field: 'price' }
  ];

  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];

  selectedFiles: Array<File> = [];
  constructor(private _uploadservice: UploadfileService) { }

  ngOnInit() {
  }

  onFileSeleted(event: any) {
    this.selectedFiles = <Array<File>>event.target.files;
    console.log(this.selectedFiles);
  }

  onVerify() {
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('uploads[]', this.selectedFiles[i], this.selectedFiles[i]['name']);
    }

    console.log(formData);
    this._uploadservice.onVerify(formData)
      .subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          console.log('progress' + Math.round(event.loaded / event.total * 100));
        } else if (event.type == HttpEventType.Response) {
          console.log(event)
        }
      });
  }
}
