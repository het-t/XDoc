var express = require('express')
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser('dr.server'))
const jwt = require('jsonwebtoken')
var user = require('../scripts/userInfo')
var dbConnection = require('../scripts/db').dbConnection
var formidable = require('formidable')
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
        }
    })
    var queryS = `CALL pending_connection(?)`
    dbConnection.query(queryS, [user.username],(err,results,fields)=>{
        if (err) console.log(err)
        else {
            var sender = results?.[0]?.[0]?.sender
            if (sender) {
                user.pendCon = sender;
            } else {
                user.pendCon = ' ';
            }
            next()
        }
    })
},(req, res, next)=>{
    res.render('profile', user);
})

router.get('/connect', (req,res,next)=>{
    var query = `CALL make_connection(?, ?)`
    dbConnection.query(query, [user.username, req.query.rei],(err, results, fields)=>{
        if (err) console.log(err)
        else {
            next();
        }
    })
}, (req,res,next)=>{
    res.render('profile',user)
})

router.get('/accept',(req,res,next)=>{
    var query = `CALL process_request(?, ?, ?)`
    //replace sender by actual username
    dbConnection.query(query, ['a', user.pendCon ,user.username],(err,results,fields)=>{
        if (err) console.log(err)
        else {
            user.pendCon = ' '
            next()
        }
    })  
},(req,res,next)=>{
    res.render('profile',user)
})

router.get('/reject',(req,res,next)=>{
    var query = `CALL process_request(?, ?, ?)`
    dbConnection.query(query, ['r', user.pendCon ,user.username],(err,results,fields)=>{
        if (err) console.log(err)
        else {
            user.pendCon = ' '
            next()
        }
    })  
},(req,res,next)=>{
    res.render('profile',user)
})

router.get('/setimg',(req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files)=>{
        console.log(files)
    })
})

module.exports = router;