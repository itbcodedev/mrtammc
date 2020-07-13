import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavigationStart } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {

  FormData: FormGroup;
  successMessage: string;

  constructor(private _userservice: UserServiceService,
    private _toastr: ToastrService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) {


    this.FormData = new FormGroup({
      email: new FormControl(null, Validators.email),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      cnfpass: new FormControl(null, this.passValidator),
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
    });

    this.FormData.controls.password.valueChanges
      .subscribe(
        x => this.FormData.controls.cnfpass.updateValueAndValidity()
      );
  }

  ngOnInit() {
  }

  passValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const cnfpassValue = control.value;

      const passControl = control.root.get('password');
      if (passControl) {
        const passValue = passControl.value;
        if (passValue !== cnfpassValue || passValue === '') {
          return {
            isError: true
          };
        }
      }
    }
    return null;
  }



  register() {
    // need service to post from to nodejs api
    // console.log(this.FormData.value);

    if (this.FormData.valid) {
      this._userservice.submitRegister(this.FormData.value)
        .subscribe(
          (data) => {
            this._toastr.success(`Register  success`)
          },
          error => this._toastr.error('Some error, please contact administrator')
        );
    }
  }

  movetologin() {
    this._router.navigate(['/auth/login'], { relativeTo: this._activatedRoute });
  }

  isValid(controlName) {
    return this.FormData.get(controlName).invalid && this.FormData.get(controlName).touched;
  }
}
