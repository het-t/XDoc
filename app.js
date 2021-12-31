//routes modules from routes folder
const indexRoutes = require('./routes/index.js')
const userRoutes = require('./routes/users.js')
const statsRoutes = require('./routes/stats.js')


//script for db handling 
const db = require('./scripts/db.js')


const express = require('express');
const path = require('path');

const app = express();

//setting view engine 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//setting path for static files 
app.use(express.static(__dirname + '/public'))


//mounting index and user routers
app.use('/user', userRoutes)
app.use('/', indexRoutes)
app.use('/user/statastics', statsRoutes)

// app.all('*', (req, res)=> {
//     res.redirect("/webpages/login.html")
// })



//creating server 
app.listen(3030, () => {
    console.log("server is running")
})