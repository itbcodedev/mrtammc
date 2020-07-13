import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserServiceService } from  '../../user-service.service';
import { User} from '../../user.model'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input() users: any = [];
  user: User;
  constructor(private _userservice: UserServiceService) { }

  ngOnInit() {
  }

  populateForm(data: User) {
    console.log(data);
    this.user = new User();
    this.user = data;
    this._userservice.formdata = this.user;
    console.log(this._userservice.formdata);
  }
}
