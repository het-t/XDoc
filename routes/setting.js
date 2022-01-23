var dbConnection = require("../scripts/db").dbConnection;
var express = require("express")
var db = require('mysql')
var router = express.Router();
var user = require('../scripts/userInfo')

//object that will have fields of maincontent form 
var maincontFields = {};
var queryObj = {
    tablename:'',
    fieldName:'',
    fieldType:''
}
router.get("/", (req,res,next)=>{
    //code to make ajax request to server for options of select
    var fetchOpts = `CALL fetchLabels(?)`
    dbConnection.query(fetchOpts , [user.username] , (err, results, fields)=>{
        if (err) console.log(err);
        else {
            user.opts = results[0];
            next();
        }
    })
},(req,res,next)=>{
    //code to render columns name as options of dropdown list and username email
    res.render('setting', user)
})
router.get('/add',(req,res,next)=>{
    queryObj.tablename = user.username;
    queryObj.fieldName = req.query.fieldName;
    // queryObj.fieldType = req.query.fieldType;
    var fieldTypeToRm = req.query.fieldType;
    var fcnfQueryAdd = `CALL formCnf(?, ?, ?, ?)`;

    dbConnection.query(fcnfQueryAdd , [queryObj.tablename , 'a' ,queryObj.fieldName, fieldTypeToRm] , (err, results, fields)=>{
        if (err) console.log(err)
        else {
            next();
        }
    })
},(req,res,next)=>{
    res.redirect('./');
})
router.get('/remove',(req,res,next)=>{
    // first element is fieldName and second element is fieldType
    var fieldToRm = req.query.fieldToRm.split(",");
    console.log(fieldToRm)
    var fcnfQueryRm = `CALL formCnf(? , ? ,? ,?)`;
    dbConnection.query(fcnfQueryRm , [user.username , 'r' , fieldToRm[0] , fieldToRm[1]], (err,results,fields)=>{
        if (err) console.log(err)
        else next();
    })
},(req,res,next)=>{
    res.redirect('./');
})

module.exports = router;