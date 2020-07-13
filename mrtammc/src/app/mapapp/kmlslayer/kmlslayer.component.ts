/// <reference types="@types/googlemaps" />
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormControl,FormGroup } from '@angular/forms';
import { HttpClient, HttpEventType } from "@angular/common/http";
import { ConfigfileService } from '../../services/configfile.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-kmlslayer',
  templateUrl: './kmlslayer.component.html',
  styleUrls: ['./kmlslayer.component.scss']
})
export class KmlslayerComponent implements OnInit {


  @ViewChild('gmapRef', { static: true }) mapRef: ElementRef;
  gmapContainer: google.maps.Map;
  kmls;
  kmlid;
  mapstyles: google.maps.MapTypeStyle[] = [
    {
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#f5f5f5'
        }
      ]
    },
    {
      'elementType': 'labels.icon',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#cfc8c0'
        }
      ]
    },
    {
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#f5f5f5'
        }
      ]
    },
    {
      'featureType': 'administrative.land_parcel',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#bdbdbd'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#eeeeee'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#757575'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#e5e5e5'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9e9e9e'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#ffffff'
        }
      ]
    },
    {
      'featureType': 'road.arterial',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#757575'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#dadada'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#616161'
        }
      ]
    },
    {
      'featureType': 'road.local',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9e9e9e'
        }
      ]
    },
    {
      'featureType': 'transit.line',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#e5e5e5'
        }
      ]
    },
    {
      'featureType': 'transit.station',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#eeeeee'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#c9c9c9'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9e9e9e'
        }
      ]
    }
  ];
  constructor(    private _uploadservice: ConfigfileService ) {

  }

  ngOnInit() {
    const options = {
      center: new google.maps.LatLng(13.843180, 100.487147),
      zoom: 12,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      fullscreenControl: true
    };

    this.gmapContainer = new google.maps.Map(
      this.mapRef.nativeElement,
      options
    );

    this.getkml();
    // this.showkml();
  }

  showkml() {
    console.log(this.kmls);
    interface Line {
      line_en: string,
      line_th: string,
      url: string,
      status: boolean
    }

    this.kmls.forEach((line: Line) => {
      const layer = new google.maps.KmlLayer({
        url: line.url
      });
      layer.setMap(this.gmapContainer);
    });
  }

  getkml() {
    this._uploadservice.getkml().subscribe((data: any) => {
      this.kmls = data;
      this.kmlid = data._id;
      console.log(this.kmls);
      this.kmls.forEach((line: any)=>{
        this.showkmlbyline(line);
      })

    })
  }

  showkmlbyline(line: any) {
    const layer = new google.maps.KmlLayer({
      url: line.url
    });
    layer.setMap(this.gmapContainer);
  }

  loadkml(dataForm: any) {
    this.gmapContainer = null;
    const options = {
      center: new google.maps.LatLng(13.843180, 100.487147),
      zoom: 12,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      fullscreenControl: true
    };

    this.gmapContainer = new google.maps.Map(
      this.mapRef.nativeElement,
      options
    );

    const keys = Object.keys(dataForm.value);
    // console.log(keys)
    const kmllayers = keys.filter( (key) => dataForm.value[key]);
    // console.log(kmllayers);
    kmllayers.forEach((id) => {
      this._uploadservice.getkmlbyid(id).subscribe((data) => {
        this.showkmlbyline(data);
      })
    })

  }
}


// var myParser = new geoXML3.parser({map: map});
// myParser.parse('/path/to/data.kml');
