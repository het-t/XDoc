var express = require('express');
const formidable = require('formidable')
const db = require('../db.js')
const path = require('path');
const { userInfo } = require('os');

var router = express.Router();

// populating user object with data provided in login to sue in ejs
var userInfoEjs ={
  unEjs:''
}
function userDataForEjs (userInfoArray) {
  userInfoEjs.unEjs = userInfoArray[0]

}


router.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/register.html'))
})

router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/login.html'))
})

router.get('/mainContent', function(req, res, next) {
  res.render('maincont', userInfoEjs)
})

router.post('/register', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    userInfoArray = [fields.username, fields.password]
    db.userRegistration(userInfoArray)
  })
  res.redirect('login')
});

router.post('/login', (req, res, next) => {

  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    userInfoArray = [fields.username, fields.password]
    db.userLogin(userInfoArray)
    userDataForEjs(userInfoArray)                                       //populates userdata for ejs template
  })
  res.redirect('maincontent')
});


module.exports = router