import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { Agency } from 'src/app/models/agency.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

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
