import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UserServiceService } from '../../auth/user-service.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  showHead: any;
  username =  '';
  constructor(private _userservice: UserServiceService,
    private _router: Router) {

      _router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          if (event['url'] == '/auth/login' || event['url'] == '/auth/register') {
            this.showHead = false;
          } else {
            this.showHead = true;
          }
        }
      });

      this.showHead = true;
    }

  ngOnInit() {
  }

}
