var express = require('express');
const formidable = require('formidable')
const db = require('../db.js')
const path = require('path');

var router = express.Router();

// populating user object with data provided in login 
var user = {
  username:'john doe',
  email:'johndoe@ejs.working'
}

router.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/register.html'))
})

router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname ,'../public', '/webpages/login.html'))
})

router.get('/mainContent', function(req, res, next) {
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
      function () {
        next()
      },
      function () {
        console.log('enter valid username and/or password')
        res.redirect('/webpages/register.html')
      }
    ).catch (
        function (err) {
          console.log('wrong in promise')
        }
    )
  })
},(req, res, next)=> {
  res.render('maincont',user)
})


module.exports = router