var db = require('mysql')
var http = require('http')
var express = require('express')
var app = express()

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
    
    return new Promise (
        (resolve, reject) => {
            dbConnection.query( loginQuery, userInfoArray, (err, results, fields)=> {
            if (err) console.log(err)
            if (results?.[0]?.[0]?.username && results?.[0]?.[0]?.password) {
                resolve()
            } else {
                reject()
            }
        }
    )}) 
};


module.exports.userRegistration = userRegistration;
module.exports.userLogin = userLogin; 