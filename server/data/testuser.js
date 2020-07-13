const fs = require('fs');
var moment = require('moment');

let rowdata = fs.readFileSync('user.json');

let db = JSON.parse(rowdata)


user =  {
    email: "abc@mrta.co.th",
    role: "admin",
    create_at: moment().toISOString(),
    lastlogon: ""
}

db.users.push(user)

fs.writeFile('user.json', JSON.stringify(db, null, 2) , finished);

function finished(err) {
    console.log(err)
}

