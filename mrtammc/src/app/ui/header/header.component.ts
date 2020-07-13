import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../auth/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwIfEmpty } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  today: string;
  isLogin: Boolean = false;
  isAdmin: Boolean = false;
  username =  '';
  role = '';
  constructor(private _userservice: UserServiceService,
    private _toastr: ToastrService,
    private _router: Router) {
    this._userservice.getUserName().subscribe(
      data => {
        console.log("21", data)
        this.username = data['username']
        this.role = data['role']
        //console.log("-------------------------------")
        console.log("26", this.username)
        console.log("27", this.role)
        this.isLogin = true;
        if (this.role == "admin") {
          this.isAdmin = true
        }
      },
      error => this._router.navigate(['/auth/login'])
    )
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timezone: 'Asia/Bangkok' };
    const currentDate = new Date();
    //this.today = currentDate.toLocaleDateString('th-TH', options) + ' ' + currentDate.toLocaleTimeString();
    this.today = currentDate.toLocaleDateString('th-TH', options);
  }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/auth/login']);
    this._toastr.success(`logout  success`)
  }
}
