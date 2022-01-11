var express = require('express');
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');
const { route } = require('.');
app.use(cookieParser())
var jwt = require('jsonwebtoken')
var db = require('../scripts/db').linkUserToTable

router.get('/', cookieParser("dr.server"), (req, res, next)=>{
    var access_token = req.signedCookies.access_token
    var token = jwt.verify(access_token, "dr.server")
    console.log(token.username)
    res.redirect(`./${token.username}`)
})

router.get('/:username', (req, res, next)=>{
    res.end()
})

module.exports = router;