var express = require('express');
var app = express();
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const db = require('../scripts/db.js')
const path = require('path');
var recordEntry = require('../scripts/recordEntry').entry;
var cookieParser = require('cookie-parser');

var session = require('express-session');
const { request } = require('http');

app.use(cookieParser());
// var stats = require('./stats.js').router;

var router = express.Router();

// populating user object with data provided in login 
// also used as provide in jwt
var user = {
  username:'',
  email:'',
  token:''
}


const secret = "dr.server"

router.get('/register', (req, res)=> {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/register.html'))
})

router.get('/login', (req, res)=> {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/login.html'))
})


var validateCookie= (req, res, next) => {
  cookieParser("dr.server");
  jwt.verify(req.signedCookies.access_token, secret, (err, authorizedData)=>{
    if(err) {
      console.log(err)
      return
    } else {
      console.log(authorizedData)
      res.render('maincont',  user)
    }
})
}

router.post('/record', cookieParser("dr.server"), validateCookie, (req, res, next)=>{
  const form = formidable();
  form.parse(req, (err, fields, files)=> {
    var recordArray = [{
      pname:fields.pname,
      disease:fields.disease, 
      age:fields.age, 
      visit:fields.visit, 
      cure:fields.cure, 
      lvisit:fields.lvisit, 
      nvisit:fields.nvisit
    }];
    recordEntry(recordArray);
  })
})

router.get('/register', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files)=> {
    var userInfoArray = [fields.username, fields.password];
    db.userRegistration(userInfoArray);
    db.newTable(userInfoArray[0]);
  })
  res.redirect('/webpages/login.html')
});

router.post('/login', (req, res, next) => {

  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files)=> {
    var userInfoArray = [fields.username, fields.password]
  db.userLogin(userInfoArray).then(
      () => {
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
        (err) => {
          console.log('wrong in promise')
        }
    )
  })
  
},
cookieParser("dr.server")
,(req, res, next) => {
    res.cookie('access_token', user.token, {
      httpOnly: true,
      signed:true,
    }).status(200)
    res.render('maincont', user)
  }
)

// router.get('/data', (req, res, next)=>{
  
// })

module.exports = router;