import { Component, OnInit } from '@angular/core';
import { CaltripserviceService } from '../../services/caltripservice.service';
import { NgForm } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

declare var $: any;


@Component({
  selector: 'app-caltrip',
  templateUrl: './caltrip.component.html',
  styleUrls: ['./caltrip.component.scss']
})

export class CaltripComponent implements OnInit {
  lines: any;
  fromstaion: any ;
  tostation: any  ;
  frominput: any = "";
  toinput: any = "";
  dataForm: NgForm;
  result: any;
  TypeTk;
  TypePs;
  TypeDt;
  @ViewChild('myModal', { static: true }) myModal:ElementRef;

  constructor( private _caltripservice: CaltripserviceService) {}

  ngOnInit() {
  }

  selectedstation(data: NgForm){
    const station = data.value["station"]
    if (this.frominput == "fromselect") {
      this.fromstaion = station;
      this.frominput = "";
    }
    if (this.toinput == "toselect") {
      this.tostation =  station;
      this.toinput = ""
    }
    $(this.myModal.nativeElement).modal('hide');
  }

  cancelselect() {
    this.fromstaion = "";
    this.tostation = "";
    $(this.myModal.nativeElement).modal('show');
  }

  showmodal() {
    $(this.myModal.nativeElement).modal('show');
  }

  fromline() {
    console.log('fromline');
    this.frominput = "fromselect";
    this._caltripservice.gettrip()
    .subscribe(data => {
      console.log(data);
      this.lines = data;
      this.showmodal();
    });
  }

  toline() {
    console.log('toline');
    this.toinput = "toselect";
    this._caltripservice.gettrip()
    .subscribe(data => {
      this.lines = data;
      console.log(this.lines);
      this.showmodal();
    });
  }

  calulateFair(data: NgForm) {
    let config = {
      "TypeTk": data.value["TypeTk"],
      "TypePs": data.value["TypePs"],
      "TypeDt": data.value["TypeDt"]
    }
    this.TypeTk =  data.value["TypeTk"];
    this.TypePs =  data.value["TypePs"];
    this.TypeDt =  data.value["TypeDt"]
    
    let destination = {
      "fromstation": data.value["fromstation"],
      "tostation": data.value["tostation"]
    }
    this.getfaretable(config);
  }

  //config format
  //{ "TypeTk": "C", "TypePs": "N", "TypeDt": "N", "fromstation": "BL25-สีลม", "tostation": "PP07-ไทรม้า" }
  getfaretable(config){

    let fare = this._caltripservice.getfairtable(config)
               .subscribe(result => {
                 console.log(result);
                 this.result = result;
               });

  }
}
