var db = require('mysql2')
var http = require('http')
var express = require('express')
const res = require('express/lib/response')
const { resolve } = require('path')
var app = express()

var dbConnection = db.createConnection({
    host     : 'localhost',
    user     : 'ht',
    password : 'het161967',
    database :  'db1'
})


dbConnection.connect((err)=> {
    if(err) {
        console.log(err)
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
var user = require('../scripts/userInfo')

var userRegistration = (userInfoArray) => {
    dbConnection.query( registrationQuery, userInfoArray, (err, results, fields) => {
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
                user.fieldList = results?.[0]?.[0]?.fieldList;
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

var recordEntry = (record)=>{
    return new Promise (
        (resolve, reject) => {
            var recordEntryQuery = `CALL entry(?,?,?,?,?,?)`;
            dbConnection.query(recordEntryQuery, record ,(err, results, fields)=> {
                if (err) {
                    console.log(err)
                    reject();
                } else if (results) {
                    resolve();
                }
            })
        }
       
    )    
}

var filter = (Tablename , PID , Lvisit , Nvisit)=>{
    var filterQuery = `CALL filter(?,?,?,?)`
    return new Promise((resolve, reject)=>{
        dbConnection.query(filterQuery ,[Tablename , PID , Lvisit , Nvisit], (err, results, fields)=>{
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        });
    })
}


module.exports.dbConnection = dbConnection;
module.exports.recordEntry = recordEntry;
module.exports.filter = filter;
module.exports.userRegistration = userRegistration;
module.exports.userLogin = userLogin; 
module.exports.newTable = createTForNewUser;