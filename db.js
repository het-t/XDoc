const db = require('mysql')
// const express = require('express')
// const app = express()

const dbConnection = db.createConnection({
    host     : 'localhost',
    user     : 'ht',
    password : 'het161967',
    database :  'db1'
})


dbConnection.connect(function(err) {
    if(err) {
        console.log("db connection error")
    }
    else { 
        console.log("db connected")
    }
})


//db queries 
var username, password;
var userInfoArray = [username, password]
const registrationQuery =  `CALL registration_entry(?, ?)`
const loginQuery = `CALL newlogin(?, ?)`


function userRegistration (userInfoArray){
    dbConnection.query( registrationQuery, userInfoArray, function(err, results, fields) {
        if (err) throw err
        console.log("user registration took place successfully")
    })
}
function userLogin (userInfoArray){
    dbConnection.query( loginQuery, userInfoArray, function(err, results, fields) {
        if (err) throw err
        console.log(results[0])
        console.log("user login took place successfully")
    })
}

module.exports.userRegistration = userRegistration;
module.exports.userLogin = userLogin; 