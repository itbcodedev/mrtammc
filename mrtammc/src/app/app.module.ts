import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { GtfsModule } from './gtfs/gtfs.module';
import { GtfsService } from './services/gtfs.service';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { MapappModule } from './mapapp/mapapp.module';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import { ImageFormatterComponent } from './image-formatter/image-formatter.component';

import { FileSaverModule } from 'ngx-filesaver';


@NgModule({
  declarations: [
    AppComponent,
    ImageFormatterComponent,
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    UiModule,
    GtfsModule,
    HttpClientModule,
    AgGridModule.withComponents([ImageFormatterComponent]) ,
    FormsModule,
    ReactiveFormsModule,
    MapappModule,
    AuthModule,
    BrowserAnimationsModule,
    FileSaverModule
  ],
  exports: [
    BrowserAnimationsModule
  ],
  providers: [GtfsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
