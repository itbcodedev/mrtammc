import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoiComponent } from './poi/poi.component';
import { FormsModule} from '@angular/forms';
import { ParkingComponent } from './parking/parking.component';
import { CaltripComponent } from './caltrip/caltrip.component';
import { CctvComponent} from './cctv/cctv.component';
import { AlertListComponent } from './alert-list/alert-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { KmlslayerComponent } from './kmlslayer/kmlslayer.component';
import { StaticComponent } from './static/static.component';
import { SimulationComponent } from './simulation/simulation.component';
import {FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents(null),
  ],
  declarations: [
    PoiComponent,
    ParkingComponent,
    CaltripComponent,
    CctvComponent,
    AlertListComponent,
    KmlslayerComponent,
    StaticComponent,
    SimulationComponent
  ]
})
export class MapappModule { }
