var express = require('express');
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const db = require('../scripts/db.js')
const path = require('path');
var recordEntry = require('../scripts/recordEntry').entry

var router = express.Router();

// populating user object with data provided in login 
// also used as provide in jwt
var user = {
  username:'',
  email:'',
  token:''
}

const secret = "dr.server"
var record;

router.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/register.html'))
})

router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/login.html'))
})

router.post('/record', function(req, res, next) {
  const form = formidable();
  form.parse(req, function (err, fields, files) {
    record = {
      "patientName":fields.pname, 
      "disease":fields.disease, 
      "age":fields.age, 
      "visit":fields.visit, 
      "cure":fields.cure, 
      "lastVisit":fields.lvisit, 
      "nextVisit":fields.nvisit
    };
    const recordArray = Object.entries(record);
    recordEntry(recordArray)
    //.then(
    //   ()=>res.render('maincont',user),
    //   (err)=>console.log(err)
    // )
    res.render('maincont', user)
  })
  
})

router.post('/register', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var userInfoArray = [fields.username, fields.password]
    db.userRegistration(userInfoArray)
  })
  res.redirect('/webpages/login.html')
});

router.post('/login', (req, res, next) => {

  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var userInfoArray = [fields.username, fields.password]
  db.userLogin(userInfoArray).then(
      () => {
        console.log(userInfoArray)
        user.username = fields.username;
        user.email = fields.password;
        var payload = {
          username:user.username,
          email:user.email
        }
        var token = jwt.sign(payload, secret)
        user.token = token
        console.log('valid login')
        next();
      },
      () => {
        user.username = '';
        user.email = '';
        console.log('enter valid username and/or password')
        res.redirect('/webpages/register.html')
      }
    ).catch (
        function (err) {
          console.log('wrong in promise')
        }
    )
  })
  
},(req, res, next) => {
    res.cookie('token', user.token)
    res.render('maincont',user)
  }
)

module.exports.router = router;
module.exports.reocrd = record;
// module.exports.user = user;