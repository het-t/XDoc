var express = require('express');
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');
app.use(cookieParser())
var jwt = require('jsonwebtoken')
var db = require('../scripts/db')
const formidable = require('formidable')

var user = {
    username:'',
    email:''
}
router.get('/', cookieParser("dr.server"), (req, res, next)=>{
    var access_token = req.signedCookies.access_token
    var token = jwt.verify(access_token, "dr.server")
    user.username = token.username;
    user.email = token.email;
    res.redirect(`./${token.username}`)
})

router.get("/:username", (req, res, next)=>{
    // console.log("request params", req.params)
    // console.log("more", req.query)
    res.render('stats', user)
    db.filter(user.username , req.query.pid , req.query.lvisit , req.query.nvisit)
})

router.get('/:pid&')

module.exports = router;