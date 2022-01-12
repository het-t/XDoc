var express = require('express');
var app = express();

app.get('*',(req ,res, next)=>{
    console.log("chale che")
})