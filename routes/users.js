var express = require('express');
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const db = require('../db.js')
const path = require('path');

var router = express.Router();

// populating user object with data provided in login 
// also used as provide in jwt
var user = {
  username:'',
  email:'',
  token:''
}

const secret = "dr.server"

router.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/register.html'))
})

router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/login.html'))
})

router.get('/mainContent', function(req, res, next) {
  console.log(req.header[token]) 
  res.render('maincont', user)
})

router.post('/register', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var userInfoArray = [fields.username, fields.password]
    db.userRegistration(userInfoArray)
    res.end()
  })
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

module.exports = router;
// module.exports.user = user;