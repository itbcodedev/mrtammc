const express = require('express');
var jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path');
var fs = require("fs");
const request = require('request');


var LdapUser = require('../models/ldapuser')
const {
  Client
} = require('ldapts');

const url = "ldap://192.168.3.250";
const bindDN = "CN=sawangpong,OU=mmc,OU=Project,DC=mrta,DC=co,DC=th";
const password = '1234P@ssw0rd';

const client = new Client({
  url,
});

router.post("/", async (req, res) => {
  const userPrincipalName = req.body.email;
  const cnname = req.body.cnname;
  // const loginbinddn = `CN=${cnname},OU=mmc,OU=Project,DC=mrta,DC=co,DC=th`
  const password = req.body.password

  // check use in list
  const verifyuser = Verify(userPrincipalName)
  
  try {
    await client.bind(userPrincipalName, password);
    //await client.bind(loginbinddn, password);

    let role=await Verify(userPrincipalName)
    isAuthenticated = true;
    // console.log("Authentication success?" + isAuthenticated);
    let token = jwt.sign({
      // username: req.body.email
      // role:  admin  ? user
      username: req.body.email,
      role: role
    }, 'secret', {
      expiresIn: '1d'
    });
    console.log(token)
    return res.status(200).json(token);
     
  } catch (error) {
    isAuthenticated = false;
    console.log("Authentication false:  " + error);
    return res.status(500).json({ message: "Please Verify Ldap account" });
  } finally {
    await client.unbind();
  }
});

/**
 * syncRequest wrap a request with promise
 * @param {*} url 
 */
function syncRequest(url) {

  return new Promise( (resolve, reject) => {
    request(url, (err, res, body)  => {
      if (err)  reject(err);
      if (res.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      let json = JSON.parse(body);

      resolve(json);
    });
  });
}

/**
 * isEmailinArray 
 * Check email
 * @param {any} email 
 * @param {aray} array 
 */
function inDatabaseCheck(email, data) {
  let users = []
  let roles = []
  data.forEach(obj => {
    users.push(obj.email)
    roles.push(obj.role)
  })
  
  if (users.includes(email)) {
    let role = roles[users.indexOf(email)]
    return role
  } else {
    return false 
  }
  
}

/**
 * verify email 
 * @param {*} email 
 */
async function Verify(email) {
  let refPath = path.join(__dirname,"../data/")
  let rawdata = fs.readFileSync(refPath+'/admin.json')
  let useradmin = JSON.parse(rawdata)
  let ldapuser

  try {
    const data = await syncRequest('http://localhost:3000/ldap/listldapuser')
    ldapusers = data
  } catch (error) {
    console.log(error)
  }


  // check email in list  console.log("86 Verify function" + email)
  //console.log("114",ldapusers)

  const roleinDatabase = inDatabaseCheck(email,ldapusers)
  const inAdminList = useradmin.admin.includes(email)

  if (inAdminList) {
    console.log("email: ",email," role: ", "admin")
    return "admin"
  } else if (roleinDatabase !== false) {
    console.log("email: ",email," role: ", roleinDatabase)
    return roleinDatabase
  } else {
    console.log("not permission login")
  }

}

function LdapToEpoch1(n) {
  var sec = Math.round(n / 10000000);
  sec -= 11644473600;
  var datum = new Date(sec * 1000);
  return datum.toGMTString()
}

const searchDN = "OU=mmc,OU=Project,DC=mrta,DC=co,DC=th";
router.get("/list", async (req, res) => {
  try {
    const bindDN = "sawangpong.mu@mrta.co.th"
    const password = '1234P@ssw0rd';
    await client.bind(bindDN, password);
    const {
      searchEntries,
      searchReferences,
    } = await client.search(searchDN, {
      scope: 'sub',
      filter: "(&(objectClass=person)(objectClass=user))",
    });
    searchEntries.forEach(e => {
      e.lastLogon = LdapToEpoch1(e.lastLogon);
      e.accountExpires = LdapToEpoch1(e.accountExpires);
    })
    //console.log(searchEntries);
    res.send(JSON.stringify(searchEntries));

  } catch (ex) {
    throw ex;
  } finally {
    await client.unbind();
  }
});

router.get('/listldapuser', async (req, res) => {
  try {
    const ldapusers = await LdapUser.find()
    res.status(200).json(ldapusers)
  } catch {
    res.status(500).json({ message: error })
  }
})

router.post('/createldapuser', async (req, res, next) => {

  const ldapuser = new LdapUser({
    email: req.body.email,
    fullname: req.body.fullname,
    role: req.body.role
  })

  try {
    const ldapusersave = await ldapuser.save()
    res.status(200).json(ldapusersave);
  } catch {
    res.status(500).json({ message: err })
  }

})

router.delete('/deleteldapuser/:id', async (req, res) => {
  try {
    const id = req.params.id
    const query = await LdapUser.findByIdAndRemove(id)
    console.log(query)
    res.status(200).json(query)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})
module.exports = router;
