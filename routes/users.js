var express = require('express');
var router = express.Router();


const users = [
  {
    "_id": "123",
    "firstName": "ABC",
    "lastName": "CDE"
  }
]

/* GET all users listing */
router.get('/', function (req, res, next) {
  req.session.name = 'A';
  res.render('./../views/users/userList', {
    message: "List of Users",
    userList: users,
    fromDb: false,
  });
});

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

module.exports = router;
