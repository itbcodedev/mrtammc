import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConfigfileService } from '../../services/configfile.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { GtfsEditor } from './editor.colume';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// This lets me use jquery
declare var $: any;
interface EVENTBODY {
  filename: string,
  message: string,
  origin: string,
  path: string
}
@Component({
  selector: 'app-configfile',
  templateUrl: './configfile.component.html',
  styleUrls: ['./configfile.component.scss']
})
export class ConfigfileComponent implements OnInit, AfterViewInit {
  kmlForm: FormGroup;

  columnDefs: any;
  rowData: any;
  agfile: any;
  configfiles = environment.configfiles;
  selectedFile: Array<File> = [];
  fileobject: any;
  ListFiles: any = [];
  dirfiles: any;
  progress: any;
  agency = 'filename';
  showfile;
  showerror;
  showspec;
  showverify;
  verifyTable;
  E7Table;
  E8Table;
  collape: boolean = false;
  errorMessage;
  successMessage;
  modal_title;
  modal_body;
  modal_icon;
  kmls;
  kmlaction;
  formid;
  @ViewChild('map_popup', { static: false }) map_popupRef: ElementRef;
  @ViewChild('input_file', { static: true }) input_fileRef: ElementRef;
  defaultColDef: { resizable: boolean; };
  gridApi: any;
  gridColumnApi: any;

  constructor(
    private _uploadservice: ConfigfileService,
    private _toastr: ToastrService,
    private _http: HttpClient,
    private fb: FormBuilder
  ) {
    this.kmlForm = this.fb.group({
      line_en: ['', Validators.required ],
      line_th: ['', Validators.required ],
      url: ['', Validators.required ],
      status: ['', Validators.required ]
    });
    this.defaultColDef = { resizable: true };
  }

  ngAfterViewInit(): void {
    $('#treemenu').on('select_node.jstree', function(e, data) {
      var href = data.node.a_attr.href;
      if (href[0] == '#') {
        // document.location.href = href;
        $('#agency_info').hide();
        $('#calendar_dates_info').hide();
        $('#calendar_info').hide();
        $('#frequencies_info').hide();
        $('#periods_info').hide();
        $('#routes_info').hide();
        $('#shape_details_info').hide();
        $('#shapes_info').hide();
        $('#stop_times_info').hide();
        $('#stops_info').hide();
        $('#trips_info').hide();
        $('#kml_info').hide();
        $(`${href}`).toggle();
        $('#uploadfiletab')[0].click();
      }
    }).jstree();


  }

  ngOnInit() {
    this.kmlaction = 'Save'
    this.getkml();
  }

  toggleCollape() {
    this.collape = !this.collape;
  }
  setshowfile() {
    this.showfile = true;
    this.showerror = false;
    this.showspec = false;
    this.showverify = false;
  }
  setshowerror() {
    this.showfile = false;
    this.showerror = true;
    this.showspec = false;
    this.showverify = false;
  }
  setshowspec() {
    this.showfile = false;
    this.showerror = false;
    this.showspec = true;
    this.showverify = false;
  }

  setshowverify() {
    this.showfile = false;
    this.showerror = false;
    this.showspec = false;
    this.showverify = true;
  }

  validateTime(strTime: string) {
    let regex = new RegExp('([0-1]?[0-9]|[2][0-3]):([0-5][0-9])(:[0-5][0-9])');
    if (regex.test(strTime)) {
      return true;
    } else {
      return false;
    }
  }

  testFile(file: any) {
    this.modal_title = 'ตรวจสอบความถูกต้อง Verification';
    this.modal_body = `File :  ${file}`;
    $('#modalbtn')[0].click();
    $('#verifytab')[0].click();
    this.setshowverify();
    this._uploadservice
      .getconfigfile(file)
      .toPromise()
      .then((key: any) => {
        console.log(key);
        this.verifyTable = `
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">ผลการตรวจสอบ กรณี column ไม่ครบ (E6 Missing Column)</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
      `;
        const filekey = file.split('-')[1].split('.')[0];
        let columes = new GtfsEditor().GTFS_COLUMNDEFS[filekey];
        //console.log('160',columes);
        //console.log(Object.keys(key[0]));
        // source data
        columes.forEach(col => {
          console.log(col.headerName);
          this.verifyTable += `
          <tr *ngIf="collape">
            <td>${col.headerName}</td>
            <td>${
            Object.keys(key[0]).includes(col.field)
              ? '<span class="badge badge-success">valid</span>'
              : '<span class="badge badge-danger">Missing</span>'
            }</td>
          </tr>
          `;
        });
        this.verifyTable += `
      </tbody>
    </table>
      `;

        // check undefine null value

        this.E7Table = `
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">ผลการตรวจสอบ กรณี ค่าใน field ผิดพลาด (E7 checking Missing Field)</th>
          </tr>
        </thead>
        <tbody>
      `;

        key.forEach((record, index) => {
          Object.keys(record).forEach(k => {
            if (record[k] == '' || record[k] == null) {
              this.E7Table += `
            <tr>
              <td>
              แถวที่ #${index + 1} ของ field ชื่อ [${k}] พบ ผิดพลาด
              <div class="alert alert-danger" role="alert">
              <pre>
                #${index + 1} -> ${JSON.stringify(record, null, 2)}
                </pre>
              </div>
              </td>
            </tr>
            `;
            } else {
              //console.log(` ${k} is defined is ${record[k]}`);
            }
          });
        });

        this.E7Table += `
      </tbody>
    </table>
    `;

        let TimeField: string[] = ['arrivalTime', 'departureTime'];
        this.E8Table = `
    <table class="table table-striped">
      <thead class="thead-dark">
        <tr>
          <th scope="col">ผลการตรวจสอบกรณี รูปแบบค่าที่เป็น เวลา E8 checking time 24 hr field</th>
        </tr>
      </thead>
      <tbody>
    `;

        key.forEach((record, index) => {
          Object.keys(record).forEach(k => {
            if (TimeField.includes(k)) {
              if (record[k] == '' || record[k] == null) {
                console.log('missing field');
              } else {
                if (this.validateTime(record[k])) {
                  // console.log('valid');
                } else {
                  this.E8Table += `
              <tr >
                <td>
                recode Line no #${index + 1} field name [ ${k} ] is not valid
                <div class="alert alert-danger" role="alert">
                  #${index + 1} -> ${JSON.stringify(record)}
                </div>
                </td>
              </tr>
              `;
                }
              }
            }
          });
        });

        this.E8Table += `
    </tbody>
  </table>
  `;
      });
  }

  viewfile(file: any) {
    console.log('viewfile')
    console.log(file);
    console.log(this.ListFiles);
    const fileobj = this.ListFiles.find(obj => obj.origin === file);
    console.log(fileobj);

    const filekey = file.split('.')[0];
    this.agfile = file;
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS[filekey];
    this.defaultColDef = { resizable: true };
    console.log('273', this.columnDefs);
    this._uploadservice.getconfigfile(fileobj.filename).subscribe(res => {
      this.rowData = res;
      console.log(res);
    });
  }

  viewfileOnlists(file: any) {
    console.log('viewfileOnlists')

    $('#filedetailtab')[0].click();
    const filekey = file.split('-')[1].split('.')[0];
    //console.log(filekey);
    this.agfile = file;
    console.log('file');
    console.log(file);
    this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS[filekey];
    this.defaultColDef = { resizable: true };

    console.log('289',this.columnDefs);
    // let stopIdfield = this.columnDefs.filter(e => e.field === "stopId");
    // console.log(stopIdfield);

    this._uploadservice.getconfigfile(file).subscribe(res => {
      // console.log("res");
      console.log('298',res);
      this.rowData = res;
      let key = Object.keys(this.rowData[0]);
    });
  }

  getuplodfile() {
    this._uploadservice.listdir().subscribe(res => {
      this.dirfiles = res;
    });
    this.setshowfile();
    return this.dirfiles;
  }

  deployconfigfile(file: any) {
    this.modal_title = 'ดำเนินการ Deploy file GTFS';
    this.modal_body = `copy File :  ${file} ไปสู่ /feed`;
    $('#modalbtn')[0].click();

    this._uploadservice.deployconfigfile(file).subscribe(res => {
      this._toastr.success('Success upload' + file + 'ไปสู่  /feed and backup old file ไปที่ /backupfeed');
    });
  }

  refresh() {
    this.setshowfile();
    console.log('click');
    this.getuplodfile();
  }

  deleteFile(file) {
    console.log('delete file' + file);
    if (confirm(`ท่านต้องการที่จะ ลบไฟล์  ${file} หรือไม่?`)) {
      this._uploadservice.deleteconfigfile(file).subscribe(res => {
        console.log(res);
      });

      this.getuplodfile();
      this._toastr.success(file + ' already deleted');
      this.columnDefs = [];
      this.rowData = [];
      this.agfile = '';
    }
  }

  savedbFile(file) {

    console.log('save db file' + file);

    if (confirm(`ท่านต้องการที่จะ บันทึกไฟล์  ${file}  ลงฐานข้อมูลหรือไม่?`)) {
      this._uploadservice.savedbconfigfile(file).subscribe(result => {
        console.log(result);
        this._toastr.success(JSON.stringify(result))
      }, (error) => {
        console.log(error);
        this._toastr.error(JSON.stringify(error))
      });
    }
  }

  browseFile(event, file, index) {
    $('#upload1').trigger('click');
    const element = this.input_fileRef.nativeElement;
    console.log(event.target.files[0]);
    this.selectedFile[index] = event.target.files[0];
    // check file upload same name
    if (file == this.selectedFile[index].name) {
      // // console.log(this.selectedFile[index]);
      // this.successMessage = "ไฟล์ที่ต้องการ upload " + file;
      // this._toastr.success(this.successMessage);

      this.modal_title = 'ขั้นตอนการเลือกไฟล์'
      this.modal_icon = '<i class="fa fa-check" aria-hidden="true"></i>'
      this.modal_body = 'ไฟล์ที่ต้องการ upload ' + file;

    } else {
      // // console.log("you upload wrong file");
      // this.errorMessage = "Upload ผิดไฟล์ กรุณา upload file ชื่อ " + file;
      // this._toastr.error(this.errorMessage);

      this.modal_title = 'ขั้นตอนการเลือกไฟล์'
      this.modal_icon = '<i class="fa fa-exclamation" aria-hidden="true"></i>'
      this.modal_body = 'ท่านเลือก ผิดไฟล์ กรุณา เลือก file ชื่อ ' + file;

      this.selectedFile[index] = null;
      // console.log(element);
      element.value = null
    }

    $('#modalbtn')[0].click();
  }

  uploadFile(file, index) {
    // console.log("file " + file)
    this.rowData = [];
    this.columnDefs = [];
    let obj: EVENTBODY;
    const filename = file;
    // console.log("index is: " + index);
    // console.log("file :" + this.selectedFile[index]);
    const selectedfile = this.selectedFile[index];
    // console.log("selectedfile");
    // console.log(selectedfile);
    if (filename == selectedfile.name) {
      const uploadData = new FormData();
      uploadData.append(filename, this.selectedFile[index], this.selectedFile[index].name);
      this._uploadservice.onVerify(uploadData, filename).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log(
            'progress' + Math.round((event.loaded / event.total) * 100)
          );
        } else if (event.type === HttpEventType.Response) {
          obj = <EVENTBODY>event.body;
          this.ListFiles.push(event.body);
          console.log('obj.filename ' + obj.filename);
          this.viewfileOnlists(obj.filename);
          $('#filedetailtab')[0].click();
        }
      });
      // this.successMessage = "Success upload file ชื่อ " + filename;
      // this._toastr.success(this.successMessage);
      this.modal_title = 'ขั้นตอนการ uploadfile'
      this.modal_icon = '<i class="fa fa-check" aria-hidden="true"></i>'
      this.modal_body = 'Success upload file ชื่อ ' + filename;

    } else {
      // console.log("you upload wrong file");
      // this.errorMessage = "ผิดไฟล์ กรุณา upload file ชื่อ " + filename;
      // this._toastr.error(this.errorMessage);
      this.modal_title = 'ขั้นตอนการ uploadfile'
      this.modal_icon = '<i class="fa fa-exclamation" aria-hidden="true"></i>'
      this.modal_body = 'ผิดไฟล์ กรุณา upload file ชื่อ ' + filename;
    }

    // Button trigger modal
    $('#modalbtn')[0].click();
  }


  reloadservice(event) {
    console.log(event)
  }

// agencyFareUrl: ""
// agencyId: "MRTA_Transit"
// agencyLang: "en"
// agencyName: "MRTA Transit Rapid Transit Authority of Thailand"
// agencyPhone: "0-2716-4044"
// agencyTimezone: "Asia/Bangkok"
// agencyUrl: "https://www.mrta.co.th/"

  onCellValueChanged(file: any, params: any) {
    console.log('onCellValueChanged')
    this.rowData[params.rowIndex] = params.data
    const obj = this.rowData
    console.log(obj)
    this._uploadservice.liveupdate(file, obj).subscribe((data) => {
      this._toastr.success('Live Update', data.message, { timeOut: 2000 });
    },
      error => {
        this._toastr.error('Live Update', 'ผิดพลาด...', { timeOut: 2000 })
      });
  }

async uploadkml() {

  if (this.kmlaction == 'Update') {
    console.log('update.....');
    await this._uploadservice.updatekml(this.formid,this.kmlForm.value).subscribe((data: any) => {
      this.modal_title = 'KML update message'
      this.modal_icon = '<i class="fa fa-exclamation" aria-hidden="true"></i>'
      this.modal_body = data.line_en;
    })
    this.kmlaction = 'Save'
    this.kmlForm.patchValue({});
  } else {
    console.log('create......');
    await this._uploadservice.uploadkml(this.kmlForm.value).subscribe((data: any) => {
      this.modal_title = 'KML save message'
      this.modal_icon = '<i class="fa fa-exclamation" aria-hidden="true"></i>'
      this.modal_body = data.line_en ;
      this.kmlForm.patchValue({});
    })
  }

  $('#modalbtn')[0].click();
  await this.getkml()
  // reset form here
  this.kmlForm.markAsPristine();
}


  getkml() {
    this._uploadservice.getkml().subscribe((data) => {
      this.kmls = data
    })
  }

  deletekml(id: any) {
    this._uploadservice.deletekml(id).subscribe((data: any) => {
      this.modal_title = 'KML delete message'
      this.modal_icon = '<i class="fa fa-exclamation" aria-hidden="true"></i>'
      this.modal_body = data.message;
    })
    this.getkml();
    $('#modalbtn')[0].click();
  }

  editkml(id: any) {
    this.formid = id;
    this.kmlaction = 'Update'
    this._uploadservice.getkmlbyid(id).subscribe((data) => {
      this.kmlForm.patchValue(data);
      console.log(data);
    });
    console.log(this.kmlForm);
  }

  onGridReady(params) {
    //console.log(params)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit()
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
}
