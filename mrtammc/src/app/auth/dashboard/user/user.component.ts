import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserServiceService } from  '../../user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {


  successMessage: string;
  FormData: FormGroup;
  constructor(public _userservice: UserServiceService,
    private _toastr: ToastrService) {
    this.FormData = new FormGroup({
      _id: new FormControl(null,  Validators.required),
      email: new FormControl(null, Validators.email),
      username: new FormControl(null, Validators.required),
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
    });
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

  update() {
    if (this.FormData.valid) {
      this._userservice.updateUser(this.FormData.value)
        .subscribe(
          (data) => {
            this._toastr.success(`update success`)
            //console.log(data)
          },
          error => this.successMessage = 'Can not update user'
        );
    }
  }


}
