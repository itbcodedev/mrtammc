import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../ui/ui.module';
import { GooglemapComponent } from './googlemap/googlemap.component';
import { EditorComponent } from './editor/editor.component';
import { AgGridModule } from 'ag-grid-angular';
import { OpenstreetmapComponent } from './openstreetmap/openstreetmap.component';
import { GtfsrtComponent } from './gtfsrt/gtfsrt.component';
import { FormsModule }   from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    UiModule,
    AgGridModule.withComponents(null),
    FormsModule
  ],
  declarations: [GooglemapComponent, EditorComponent, OpenstreetmapComponent, GtfsrtComponent]
})
export class GtfsModule { }
