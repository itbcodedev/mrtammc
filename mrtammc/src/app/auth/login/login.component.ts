import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../user.model';
import { NavigationStart } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  successMessage: string;
  constructor(private _userservice: UserServiceService,
    private _toastr: ToastrService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) {
    this.loginForm = new FormGroup({
      //cnname: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  };
  ngOnInit() {
  }


  isValid(controlName) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  login() {
    // console.log(this.loginForm.value);

    if (this.loginForm.valid) {
      this._userservice.login(this.loginForm.value)
        .subscribe(
          (data) => {
            console.log("--------------------------------------")
            console.log(data.body);
            this._toastr.success(`login  success`)
            localStorage.setItem('token', data.body.toString());
            this._router.navigate(['/gtfsrt']);
          },
          error => {
            //this._toastr.error(`ขออภัยไม่พบ ชื่อของท่านใน  OU=mmc,OU=Project,DC=mrta,DC=co,DC=th`)
            this._toastr.error(`ขออภัยไม่พบ Email ของท่่านใน ระบบ`)
           }
        );
    }
  }

  logout() {
    localStorage.removeItem('token')
    this._router.navigate(['/gtfsrt']);
  }
  isLogged() {
    return localStorage.getItem('token') != null;
  }


  movetoregister() {
    this._router.navigate(['/auth/register'], { relativeTo: this._activatedRoute });
}
}
