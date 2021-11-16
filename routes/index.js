var express = require('express');
const path = require('path');
var router = express.Router();
const app = express();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '/webpages/register.html'))
});


module.exports = router;