import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './ui/dashboard/dashboard.component';
import { GooglemapComponent } from './gtfs/googlemap/googlemap.component';
import { EditorComponent } from './gtfs/editor/editor.component';
import { OpenstreetmapComponent } from './gtfs/openstreetmap/openstreetmap.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { PoiComponent } from './mapapp/poi/poi.component';
import { ParkingComponent } from './mapapp/parking/parking.component';
import { StaticComponent } from './mapapp/static/static.component';
import { CaltripComponent } from './mapapp/caltrip/caltrip.component';
import { CctvComponent} from './mapapp/cctv/cctv.component';
import { SimulationComponent} from './mapapp/simulation/simulation.component'
import { AlertListComponent } from './mapapp/alert-list/alert-list.component';
import { KmlslayerComponent } from './mapapp/kmlslayer/kmlslayer.component';
import { GtfsrtComponent } from './gtfs/gtfsrt/gtfsrt.component';

const routes: Routes = [
  // {
  //   path: 'googlemap',
  //   component: GooglemapComponent
  // },
  {
    path: 'kmlslayer',
    component: KmlslayerComponent
  },
  {
    path: 'tubemap',
    component: OpenstreetmapComponent
  },
  {
    path: 'gtfseditor/:file',
    component: EditorComponent
  },
  {
    path: 'gtfseditor',
    component: EditorComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {
    path: 'poi',
    component: PoiComponent
  },
  {
    path: 'parking',
    component: ParkingComponent
  },
  {
    path: 'caltrip',
    component: CaltripComponent
  },
  {
    path: 'cctv',
    component: CctvComponent
  },
  {
    path: 'alert',
    component: AlertListComponent
  },
  {
    path: 'statistic',
    component: StaticComponent
  },
  {
    path: 'simulation',
    component: SimulationComponent
  },
  {
    path: 'gtfsrt',
    component: GtfsrtComponent
  },
  {
    path: '',
    redirectTo: 'gtfsrt',
    pathMatch: 'full'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
