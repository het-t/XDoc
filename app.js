//routes modules from routes folder
const userRoutes = require('./routes/users')
const indexRoutes = require('./routes/index')

//script for db handling 
const db = require('./db.js')


const express = require('express')
const path = require('path')

const app = express()

//setting view engine 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//setting path for static files 
app.use(express.static(__dirname + '/public'))


//mounting index and user routers
app.use('/', indexRoutes)
app.use('/user', userRoutes)


//creating server 
app.listen(3030, () => {
    console.log("server is running")
})











