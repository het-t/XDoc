var express = require('express')
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser('dr.server'))
const jwt = require('jsonwebtoken')
var user = require('../scripts/userInfo')

var secret = "dr.server"
// var user = {
//     username:'',
//     email:'',
// }
var router = express.Router();

router.get('/',cookieParser("dr.server"),(req, res, next)=>{
    jwt.verify(req.signedCookies.access_token, secret, (err, authorizedData)=>{
        if(err) {
            console.log(err)
            return
        } else {
            user.username = authorizedData.username;
            user.email = authorizedData.email;
            next();
        }
    })
},(req, res, next)=>{
    res.render('profile', user);
})

module.exports = router;