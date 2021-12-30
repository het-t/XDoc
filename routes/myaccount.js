var express = require('express');
var router = express.Router();

router.get('/^[a-zA-Z0-9]*$', (req, res, next)=> {
    console.log(res);
})

module.exports.router = router;