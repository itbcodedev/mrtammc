import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent} from './admin/admin.component';
import { UserComponent } from './dashboard/user/user.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { AuthRoutingModule } from './auth-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploadfileComponent } from './uploadfile/uploadfile.component';
import { ConfigfileComponent } from './configfile/configfile.component';
import { AgGridModule } from 'ag-grid-angular';
import { GtfsspecComponent } from './gtfsspec/gtfsspec.component';
import { ValidateSpecComponent } from './validate-spec/validate-spec.component';
import { LdapuserComponent } from './dashboard/ldapuser/ldapuser.component';
import { MrtalineComponent } from './mrtaline/mrtaline.component';
import { GtfsmapComponent } from './gtfsmap/gtfsmap.component';
import { CctvComponent } from './cctv/cctv.component';
import { ParkingComponent } from './parking/parking.component';
import { RouteformatComponent } from './routeformat/routeformat.component';
import { GtfstoolComponent } from './gtfstool/gtfstool.component';
import { RatioparkingComponent } from './ratioparking/ratioparking.component';
import { KmltorouteComponent } from './kmltoroute/kmltoroute.component';
@NgModule({
  declarations: [LoginComponent, RegistrationComponent,AdminComponent,
                  UserComponent, UserListComponent, DashboardComponent,
                  UploadfileComponent, ConfigfileComponent, GtfsspecComponent, ValidateSpecComponent, LdapuserComponent, MrtalineComponent, GtfsmapComponent, CctvComponent, ParkingComponent, RouteformatComponent, GtfstoolComponent, RatioparkingComponent, KmltorouteComponent],
  imports: [
    CommonModule,
    NgxSmartModalModule.forRoot(),
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    AgGridModule,
  ],
  providers: [ NgxSmartModalService ],
  exports: [LoginComponent, RegistrationComponent]
})
export class AuthModule { }
