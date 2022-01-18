var express = require('express');
var app = express();
var router = express.Router();
var searchRouter = express.Router({mergeParams:true});
var cookieParser = require('cookie-parser');
app.use(cookieParser())
var jwt = require('jsonwebtoken')
var db = require('../scripts/db')
const formidable = require('formidable')
var user = {
    username:'',
    email:'',
    records:''
}

router.get('/', cookieParser("dr.server"), (req, res, next)=>{
    var access_token = req.signedCookies.access_token
    var token = jwt.verify(access_token, "dr.server")
    user.username = token.username;
    user.email = token.email;
    res.redirect(`./${token.username}/`)
})

router.use("/:username",searchRouter)

searchRouter.get("/", (req, res, next)=>{
    // // console.log("request params", req.params)
    // // console.log("more", req.query)
    res.render('stats', user)
})
searchRouter.get('/search',(req, res, next)=>{
    console.log(req.query)
    
    var pid = req.query.pid
    var lvisit = req.query.lvisit
    var nvisit = req.query.nvisit
    
    lvisit = lvisit.toString().replace('-','').replace('-','');
    nvisit = nvisit.toString().replace('-','').replace('-','');

    // condition ? exprIfTrue : exprIfFalse

    pid = '' ? pid = "0" : pid;
    lvisit = '' ? lvisit = "0" : lvisit;
    nvisit = '' ? nvisit = "0" : nvisit;
    console.log(pid , lvisit , nvisit)
    db.filter(user.username, pid, lvisit, nvisit)
    .then((results)=>{
        // console.log(results)
        // console.log(results[0])
        console.log(results)

        user.records = results[0];
        res.render("stats" , user)
    }, (err)=>{
        console.log(err)
        console.log("promise rejected in filter function of db.js")
    })
})


module.exports = router;