import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users: any = [];
  constructor(private _userservice: UserServiceService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  this.listuser();

  }

  listuser() {
    this._userservice.getAll()
    .subscribe(
      data => {
        this.users = data.body;
      },
      error => {}
      );
}

}
