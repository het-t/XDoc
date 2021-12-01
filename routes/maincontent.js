var express = require('express')
const jwt = require('jsonwebtoken')
var router = express.Router()

var secret = "dr.server"

router.get('/new-record', (req, res) => {
    jwt.verify(req.token, secret, (err, authorizedData)=>{
        if(err) console.log("token reading failed manually")
        else {
            res.json({
                message:"token read successfully manually",
                authorizedData
            })
            console.log("successfully accessed protected route")
        }
    })
})

module.export = router ;
