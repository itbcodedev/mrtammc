import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ParkingService } from '../../services/parking.service';
import { ToastrService } from 'ngx-toastr';
declare let L;

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss']
})
export class ParkingComponent implements OnInit {

  @ViewChild("map", { static: true })
  public mapElement: ElementRef

  @ViewChild("mapdiv", { static: true })
  public mapDiv: ElementRef;

  parkingForm: FormGroup;

  map
  height
  latitude
  longitude
  controllerLayer
  baseLayers
  defaultColDef
  columnDefs
  rowData




  api
  columnApi
  userToBeEditedFromParent


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private parking: ParkingService,
    public ngxSmartModalService: NgxSmartModalService) {

    this.parkingForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      image: ['', Validators.required],
      icon: ['', Validators.required],
      capacity: ['', Validators.required]
    })

    this.height = 775 + "px";
  }

  ngOnInit() {
    const latLon = L.latLng(13.788593154063312, 100.44842125132114);
    this.map = L.map(this.mapElement.nativeElement).setView(latLon, 12);

    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = new L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = new L.tileLayer(landUrl, { attribution: thunAttrib });

    const googleStreets = new L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    this.baseLayers = {
      'OSM Map': osmMap,
      'Light Map': lightMap,
      'googleStreets': googleStreets,
      'googleHybrid': googleHybrid,
      'googleSat': googleSat,
      'googleTerrain': googleTerrain
    };


    this.controllerLayer = L.control.layers(this.baseLayers);
    this.controllerLayer.addTo(this.map);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (e) => {
      var coord = e.latlng;
      this.latitude = coord.lat;
      this.longitude = coord.lng;
    });

    this.defaultColDef = { resizable: true };
    this.columnDefs = [
      { headerName: 'Code', field: 'code', editable: true },
      { headerName: 'Name', field: 'name', editable: true },
      { headerName: 'Image', field: 'image', editable: true },
      { headerName: 'Icon', field: 'icon', editable: true },
      { headerName: 'Capacity', field: 'capacity', editable: true },
      { headerName: 'Latitude', field: 'latitude', editable: true },
      { headerName: 'Longitude', field: 'longitude', editable: true },
    ]

    this.parking.getParking().subscribe(result => {
      this.rowData = result
    }, (error) => {
      console.log(error)
    })
  }

  // one grid initialisation, grap the APIs and auto resize the columns to fit the available space
  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

  // cell change input
  onCellValueChanged(params: any) {
    this.rowData[params.rowIndex] = params.data;
    const obj = this.rowData;
    console.log("141", obj);
  }

  refresh() {
    this.parking.getParking().subscribe(result => {
      this.rowData = result;
    }, (error) => {
      console.log(error);
    });
  }


  submitParkingData() {
    if (!this.parkingForm) {
      this.toastr.error("กรอกข้อมูลผิดพลาด: ไม่ครบถ้วน")
      return false;
    } else {
      if (window.confirm('ต้องการที่จะ บันทึกข้อมูลหรือไม่?')) {
        console.log("163",this.parkingForm.value)
        const formData: any = new FormData();

        formData.append('code', this.parkingForm.get('code').value)
        formData.append('name', this.parkingForm.get('name').value)
        formData.append('latitude', this.parkingForm.get('latitude').value)
        formData.append('longitude', this.parkingForm.get('longitude').value)
        formData.append('icon', this.parkingForm.get('icon').value)
        formData.append('image', this.parkingForm.get('image').value)
        formData.append('capacity', this.parkingForm.get('capacity').value)
    
        
        // post Formdata
        this.parking.AddParking(formData).subscribe(res => {
          console.log(res);
          this.toastr.success(JSON.stringify(res))
        }, (error) => {
          console.log(error);
          this.toastr.error(JSON.stringify(error))
        });

        this.update()
      }

    }
  }



  deleteParking() {
    if (window.confirm('ต้องการที่จะ บันทึกข้อมูลหรือไม่?')) {
      var selectedRows = this.api.getSelectedRows();
      console.log(selectedRows)
      if (selectedRows.length == 0) {
        this.toastr.error('กรุณาเลือก ข้อมูลที่ต้องการลบ', 'Error', {
          timeOut: 3000
        });
        return;
      }
      this.api.refreshRows(null);

      var res = this.api.updateRowData({ remove: selectedRows });
      console.log(res.remove[0].data);
      var id = res.remove[0].data._id;
      this.parking.deleteParking(id).subscribe(result => {
        console.log(result);
        this.toastr.success(JSON.stringify(result))
      }, (error) => {
        console.log(error);
        this.toastr.error(JSON.stringify(error))
      });
    }

  }


  // 1 Get updated row
  onSelectionChanged(event) {
    var selectedRows = this.api.getSelectedRows();
    this.userToBeEditedFromParent = selectedRows;
    console.log(this.userToBeEditedFromParent);

    var selectedRowsString = "";
    selectedRows.forEach(function (selectedRow, index) {
      if (index > 5) {
        return;
      }
      if (index !== 0) {
        selectedRowsString += ", ";
      }
      selectedRowsString += selectedRow.id;
    });
    if (selectedRows.length >= 5) {
      selectedRowsString += " - and " + (selectedRows.length - 5) + " others";
    }
  }

  //2 Get edited row
  newData = [];

  onCellEditingStopped(e) {
    console.log(e.data);
    this.parking.updateParking(e.data).subscribe(result => {
      console.log(result);
      this.toastr.success(JSON.stringify(result))
    }, (error) => {
      console.log(error);
      this.toastr.error(JSON.stringify(error))
    });
  }

  //Get updated row  
  onrowValueChanged(row) {
    console.log("onrowValueChanged: ");
    console.log("onrowValueChanged: " + row);
  }


  // chage station icon
  onFileChange_image(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file)
      this.parkingForm.get('image').setValue(file);
    }

  }

  // chage station icon
  onFileChange_icon(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file)
      this.parkingForm.get('icon').setValue(file);
    }

  }


  update() {
    this.refresh();
    this.ngOnInit();
 } 

}
