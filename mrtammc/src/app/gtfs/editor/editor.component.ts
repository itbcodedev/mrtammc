import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GtfsEditor } from './editor.colume';
import { GtfsService } from '../../services/gtfs.service';
import { Agency } from '../../models/agency.model';
import { Stop } from '../../models/stop.model';
import { Route } from '../../models/route.model';
import { Trip } from '../../models/trip.model';
import { StopTime } from '../../models/stop_time.model';
import { Calendar } from '../../models/calendar.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  columnDefs = [];
  rowData = [];
  defaultColDef = {};
  private file: any;
  fileName: any;

  private agencies: Agency[] = [];
  private stops: Stop[] = [];
  private routes: Route[] = [];
  private trips: Trip[] = [];
  private stop_times: StopTime[] = [];
  private calendars: Calendar[] = [];
  constructor(
    private route: ActivatedRoute,
    private gtfsService: GtfsService
    ) { }

  async ngOnInit() {

    this.defaultColDef = {
      width: 150, editable: true, filter: 'agTextColumnFilter'
    }
    this.route.params.subscribe(params => {
      this.file = params['file'];
    });
    this.fileName = this.file + '.txt';


    switch (this.file) {
      case 'agency':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.agency;
        this.agencies = await this.gtfsService.getAgencies();
        console.log(this.agencies);
        this.rowData = this.agencies;
        break;
      case 'stops':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.stops;
        this.stops = await this.gtfsService.getStops();
        console.log(this.stops);
        this.rowData = this.stops;
        break;
      case 'routes':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.routes;
        this.routes = await this.gtfsService.getRoutes();
        console.log(this.routes);
        this.rowData = this.routes;
        break;
      case 'trips':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.trips;
        this.trips = await this.gtfsService.getTrips();
        console.log(this.trips);
        this.rowData = this.trips;
        break;
      case 'stop_times':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.stop_times;
        this.stop_times = await this.gtfsService.getStopTimes();
        console.log(this.stop_times);
        this.rowData = this.stop_times;
        break;
      case 'calendar':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.calendar;
        this.calendars = await this.gtfsService.getCalendars();
        console.log(this.calendars);
        this.rowData = this.calendars;
        break;
      case 'calendar_dates':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.calendar_dates;
        break;
      case 'fare_attributes':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.fare_attributes;
        break;
      case 'fare_rules':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.fare_rules;
        break;
      case 'shapes':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.shapes;
        break;
      case 'frequencies':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.frequencies;
        break;
      case 'transfers':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.transfers;
        break;
      case 'feed_info':
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.feed_info;
        break;
      default:
        this.columnDefs = new GtfsEditor().GTFS_COLUMNDEFS.agency;
        this.fileName = 'agency.txt';
        break;
    }
  }
}
