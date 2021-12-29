var db = require('mysql')
var http = require('http')
var express = require('express')
const res = require('express/lib/response')
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


var userRegistration = (userInfoArray) => {
    dbConnection.query( registrationQuery, userInfoArray, function(err, results, fields) {
        if (err) throw err
        console.log("user registration took place successfully")
    })
}
var userLogin = (userInfoArray) => {
    
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

// function to create new table to store data of particular user
var createTForNewUser = (username) => {
    var createTable = `CALL table_for_individual(?)`
    dbConnection.query(createTable, username)
}

module.exports.userRegistration = userRegistration;
module.exports.userLogin = userLogin; 
module.exports.newTable = createTForNewUser;