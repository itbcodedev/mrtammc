import { Component, OnInit,Renderer2,Inject } from '@angular/core';
declare let L;
import { DOCUMENT } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrls: ['./poi.component.scss']
})
export class PoiComponent implements OnInit {

  apikey = 'OFCE5UCISN.A6u3fH6hKP.uhcTNtKFfk==';
  map: any;
  categories = [
    {category: 'Parcel_Poly', desc: 'แปลงที่ดิน'},
    {category: 'BLD_Solid', desc: 'สิ่งปลุกสร้าง(เส้นทึบ)'},
    {category: 'BLD_Dotted', desc: 'สิ่งปลุกสร้าง(เส้นประ)'},
    {category: 'Station', desc: 'สถานี(point)'},
    {category: 'Station_Poly', desc: 'สถานี(area)'},
    {category: 'Alignment', desc: 'Alignment'},
    {category: 'Alignment2', desc: 'Alignment2'},
    {category: 'Line_XO', desc: 'Line_XO'},
    {category: 'Section', desc: 'Section'},
    {category: 'Turnout_line', desc: 'Turnout_line'},
    {category: 'index_4000_z47', desc: 'index-4000-z47'},
    {category: 'WayEx', desc: 'พื้นที่ที่ถูกเขตทาง'},
  ]
  constructor(@Inject(DOCUMENT) private document,
      private renderer: Renderer2) { }

  ngOnInit() {
    //this.renderer.removeClass(this.document.body, 'sidebar-open');
    //this.renderer.addClass(this.document.body, 'sidebar-collapse');

    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = L.tileLayer(landUrl, { attribution: thunAttrib });

    this.map = L.map('map').setView([13.8806125227776, 100.53723432992261], 12);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    var baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap
    };

    L.control.layers(baseLayers).addTo(this.map);
    this.map.on('click', (e) => { console.log(e.latlng); });
  }

  loadmap(data: NgForm) {
    const keys = Object.keys(data.value);
    const layers = keys.filter( (key) => data.value[key]).join();
    const TILE_URL = 'https://las.mrta.co.th/las/gis/wms/gwc.aspx?layers=' + layers + '&z={z}&x={x}&y={y}&apikey=' + this.apikey;

    //initial
    const dataLayer = L.tileLayer.wms(TILE_URL);

    dataLayer.addTo(this.map);
  }
}
