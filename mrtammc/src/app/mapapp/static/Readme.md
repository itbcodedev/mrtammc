## Fromgroup

<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">

onSubmit() {
  // TODO: Use EventEmitter with form value
  console.warn(this.profileForm.value);
}


The FormGroup directive listens for the submit event emitted by the form element 
and emits an ngSubmit event that you can bind to a callback function. 

onSubmit() {
  // TODO: Use EventEmitter with form value
  console.warn(this.profileForm.value);
}


  onSubmit() {
    // TODO: Use EventEmitter with form value
    const data = this.alertForm.value;
    this._mobile.sendalerts(data).subscribe(res => {
      console.log(res);
      this._toastr.success("Successfull send alert" + res);
    })
  }

  import { AlertmobileService } from '../../services/alertmobile.service';

  <!-- Modal -->
<div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">ระบบส่งข้อความไปยังมือถือ</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form [formGroup]="alertForm" (ngSubmit)="onSubmit()">
          <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">stop_group 
              <span style="color:red;font-weight:bold">***</span>
            </label>
            <div class="col-sm-8">
              <input class="form-control" id="stop_group" formControlName="stop_group">
              
            </div>
          </div>
          <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">stop_id  &nbsp; &nbsp;&nbsp;
                <span style="color:red;font-weight:bold">***</span>
            </label>
            <div class="col-sm-8">
            <input class="form-control" id="stop_id" formControlName="stop_id">

            </div>

          </div>
          <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">title_line 
              <span style="color:red;font-weight:bold">***</span>
            </label>
            <div class="col-sm-8">
              <input class="form-control" id="title_line" formControlName="title_line">
              
            </div>

          </div>
          <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">title_line_en</label>
            <div class="col-sm-8">
              <input class="form-control" id="title_line_en" formControlName="title_line_en">
            </div>
          </div>  
          <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">notify_date</label>
            <div class="col-sm-8">
               <input class="form-control" id="notify_date" formControlName="notify_date">           
            </div>
          </div>          
          <div class="form-group row">
            <label for="message" class="col-sm-2 col-form-label">Message
                <span style="color:red;font-weight:bold">***</span>
            </label>
            <div class="col-sm-8">
              <textarea class="form-control" id="message" formControlName="message"></textarea>
              
            </div>
          </div>
          <div class="form-group row">
            <label for="message" class="col-sm-2 col-form-label">Message_en</label>
            <div class="col-sm-8">
              <textarea class="form-control" id="message_en" formControlName="message_en"></textarea>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label"></label>
            <div class="col-sm-8">
              <!-- <button type="submit" class="btn btn-primary btn-sm" [disabled]="!alertForm.valid" >Create Alert</button> -->
              <button type="submit" class="btn btn-primary btn-sm"  >Create Alert</button>
            </div>
             
          </div>
         
        </form>
      </div>
      <div class="modal-footer">
        <p></p>
    </div>
  </div>
</div>



public _mobile: AlertmobileService,


export class AlertmobileService {
  httpOptions = { headers: new HttpHeaders(
                {
                    'Content-Type':  'application/json',
                })};

  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  sendalerts(formData: any) {
    return this._http.post("/mrta/api/mrta/mrta/Sendnotify",JSON.stringify(formData),this.httpOptions)
  }

  // sendalerts(formData: any) {
  //   return this._http.post("/mrta/api/mrta/Pushnotification",JSON.stringify(formData),this.httpOptions)
  // }
}


  savealerts(formData: any) {
    return this._http.post("/mrta/api/mrta/mrta/Sendnotify",JSON.stringify(formData),this.httpOptions)
  }



        <section class="col-lg-6">
          <div class="card">
                <div class="card-header ui-sortable-handle" style="cursor: move;">
                  <h4 class="card-title">
                    <i class="ion ion-clipboard mr-1"></i>
                    ประวัติข้อความที่ส่งไปมือถือ
                  </h4>
  
                  <div class="card-tools">
                    <ul class="pagination pagination-sm">
                      <li class="page-item"><a href="#" class="page-link">«</a></li>
                      <li class="page-item"><a href="#" class="page-link">1</a></li>
                      <li class="page-item"><a href="#" class="page-link">2</a></li>
                      <li class="page-item"><a href="#" class="page-link">3</a></li>
                      <li class="page-item"><a href="#" class="page-link">»</a></li>
                    </ul>
                  </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                  <ul class="todo-list ui-sortable">
                    <li *ngFor="let mobile of mobilemessages">

                      <!-- todo text -->
                      <span class="text">{{mobile.stop_group}}</span>
                      &nbsp;&nbsp;<small class="badge badge-danger"><i class="fa fa-clock-o"></i> {{mobile.notify_date |  date:'medium' }}</small>
  
                      <p style="margin-bottom: 0.5rem;">{{mobile.stop_id}}</p>
                      &nbsp;&nbsp;<span class="badge badge-light">title_line: {{mobile.title_line}}</span>
                      &nbsp;&nbsp;<span class="badge badge-light">message: {{mobile.message}}</span>
                      &nbsp;&nbsp;<span class="badge badge-light">message: {{mobile.message_en}}</span>
                    </li>
                  </ul>
                </div>
                <!-- /.card-body -->
                <div class="card-footer clearfix">
  
                </div>
              </div>
        </section>