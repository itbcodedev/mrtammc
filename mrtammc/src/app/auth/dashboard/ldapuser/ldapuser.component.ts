import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserServiceService } from '../../user-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ldapuser',
  templateUrl: './ldapuser.component.html',
  styleUrls: ['./ldapuser.component.scss']
})
export class LdapuserComponent implements OnInit {
  users: any = [];
  userForm: FormGroup;
  roles = ['admin', 'member']
  ldapusers
  constructor(private _userservice: UserServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  public ngOnInit() {
    this.listuser();
    this.listldapuser();

    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  listuser() {
    console.log("list user function");

    this._userservice.ldaplist()
      .subscribe(
        data => {
          console.log("38", data)
          this.users = data.body;
        },
        error => {
          console.log("42", error)
        }
      );
  }

  listldapuser() {

    this._userservice.listldapuser().subscribe(data => {
      this.ldapusers = data;
      console.log("list ldapser function", this.ldapusers);
    }, (error) => { }
    );
  }

  onSubmit() {
    if (this.userForm.dirty && this.userForm.valid) {
      // alert(`Name: ${this.userForm.value.fullname} Email: ${this.userForm.value.email}`);
      this._userservice.createldapuser(this.userForm.value)
      this.toastr.success('ได้สร้างข้อมูลเรียบร้อยแล้ว', 'Success', {
        timeOut: 3000
      });
      this.update()
    } else {
      return;
    }


  }

  deleteUser(user) {
    console.log(user)
    const result = this._userservice.deleteUser(user._id)
    const json = JSON.stringify(user)
    alert(`ท่านต้องการ ลบข้อมูล ${json} `)
    this.toastr.success('ได้ลบข้อมูลที่ ท่านได้เลือกแล้ว', 'Success', {
      timeOut: 3000
    });


    this.update()

  }

  update() {
    this.listldapuser()
    this.ngOnInit();
  }

}
