## 

  deployconfigfile(file: any) {
    // const filename = file.split("-")[1]
    this._uploadservice.deployconfigfile(file).subscribe(res => {
      console.log(res);
      this._toastr.success("Successfull upload file" + res);
    });
  }


    constructor(
    private _uploadservice: ConfigfileService,
    private _toastr: ToastrService,
    private _http: HttpClient,
    private fb: FormBuilder
  ) {


    import { ConfigfileService } from "../../services/configfile.service";



  deployconfigfile(filename: string) {
    console.log('deploy config file ->' + filename);
    return this._http.get(this.upload_url +'/deployconfig/' + filename);
  }



  upload_url = `${this.baseUrl}/configfile`;

  app.use('/configfile', configfile);


  const configfile = require('./routes/configfile.router');


  router.get("/deployconfig/:filename", (req, res) => {
  let filename = req.params.filename;
  let oldfile = "configfiles/" + filename;
  let targetfile = "feed/" + filename.split('-')[1];
  let backupfile = "backupfeed/" + filename.split('-')[1];

  // backup file first
  fs.rename(targetfile, backupfile, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log(err);
      }
    } else {
      res.json({
        message: "Backup Success"
      });
    }
  });

  // copy note rename
  fs.copyFileSync(oldfile, targetfile, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log(err);
      }
    } else {
      res.json({
        message: "Success Deploy"
      });
    }
  });
});

--------------------------------

 <button type="button" class="btn btn-danger btn-sm" (click)="savedbFile(file)">Save DB</button>

   savedbFile(file) {
    interface RESPONSEVALUE {
      message: string;
      error: number;
    }
    console.log("delete file" + file);
    this._uploadservice.savedbconfigfile(file).subscribe((res: RESPONSEVALUE) => {
      if (res.error) {
        this._toastr.error("error insert DB", res.message, { timeOut: 3000 })
      } else {
        this._toastr.success("success insert db", res.message, { timeOut: 3000 });
      }
      console.log(res);
    });
  }
----
    constructor(
    private _uploadservice: ConfigfileService,
    private _toastr: ToastrService,
    private _http: HttpClient,
    private fb: FormBuilder
  ) 


----
  import { ConfigfileService } from "../../services/configfile.service";
  baseUrl = environment.baseUrl;
  listfile_url = `${this.baseUrl}/listdir`;
  upload_url = `${this.baseUrl}/configfile`;


  savedbconfigfile(filename: string) {
    console.log('save to database  ->' + filename);
    return this._http.get(this.upload_url +'/savedb/' + filename);
  }
  
-- to backend
app.use('/configfile', configfile);
const configfile = require('./routes/configfile.router');


-----
router.get("/savedb/:filename", (req, res) => {
  let filename = req.params.filename;
  const csvFilePath = `./configfiles/${filename}`
  const csv = require('csvtojson');
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      console.log("jsonObj");
      console.log(jsonObj);

      if (jsonObj && jsonObj.length) {
        MongoClient.connect(url, {
          useNewUrlParser: true
        }, (err, db) => {
          if (err) throw err;
          var dbo = db.db("mmcmrtadb");
          dbo.collection(`${filename}`).insertMany(jsonObj, (err, res) => {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
          });
        });

        res.send({
          message: 'success insert obj db',
          error: 0
        });

      } else {
        console.log('blank db')
        res.send({
          message: 'fail insert  db because there is no record in file',
          error: 1
        });
      }

    });
});