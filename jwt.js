const jwt = require('jsonwebtoken')
// const db = require('./db.js')
// const secret = 'jwt-secret'

// const header = {
//     'type':'JWt',
//     'alg':'HS256'
// }
// const userInfoArrayUN = db.userInfoArray[0][0].username
function payload(userData) {
    return payload = {
        'username':userData[0],
        'email':'isworking',
        'exp':120000
    }
}

module.exports.payload = payload