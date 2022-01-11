var express = require('express');
var app = express();
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const db = require('../scripts/db.js')
const path = require('path');
var cookieParser = require('cookie-parser');

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


var validateCookie = (req, res, next) => {
  cookieParser("dr.server");
  jwt.verify(req.signedCookies.access_token, secret, (err, authorizedData)=>{
    if(err) {
      console.log(err)
      return
    } else {
      next();
    }
  })
};

router.post('/record', cookieParser("dr.server"), validateCookie, (req, res, next) => {
  const form = formidable();

  form.parse(req, (err, fields, files)=> {
    var decodedToken = jwt.verify(req.signedCookies.access_token, secret)
    var tablename = decodedToken.username;
    var lvisit = fields.lvisit.toString().replace("-","").replace("-",""); 
    var nvisit = fields.nvisit.toString().replace("-","").replace("-","");

    var recordArray = [
      fields.pname,
      fields.disease, 
      fields.age, 
      fields.visit, 
      fields.cure, 
      lvisit,
      nvisit,
      tablename
    ];

    db.recordEntry(recordArray).then(
      ()=>{
       next();
      }, 
      ()=> {
        console.log("something wrong in recordEntry() promise")
      }
    )
  })
},validateCookie,(req, res)=>{
  res.render('maincont', user)
})

router.post('/register', (req, res, next) => {
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

module.exports = router