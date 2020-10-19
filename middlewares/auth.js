const expressJwt = require('express-jwt');

function isAuthenticated() {
  return expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'], getToken: function (req) {
    return getAppCookies(req)['token']
},
});
}

const getAppCookies = (req) => {
  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookies = {};
  rawCookies.forEach(rawCookie=>{
  const parsedCookie = rawCookie.split('=');
   parsedCookies[parsedCookie[0]] = parsedCookie[1];
  });
  return parsedCookies;
 };
 
function checkManager() {
  return (req, res, next) => {
      var token = getAppCookies(req)['token']
      var role = getAppCookies(req)['role']
      if (role === "manager") {
          next()
      } else {
        res.render('partials/pageNotFound');
      }
  }
}

function getCreatedBy(req, res, next) {
  return getAppCookies(req)['user']
}

function checkEmployee() {
  return (req, res, next) => {
      var token = getAppCookies(req)['token']
      var role = getAppCookies(req)['role']
      if (role === "employee") {
          next()
      } else {
          res.status(401).send('Unauthorized')
      }
  }
}

function checkForEmpAndManager(){
  return (req, res, next) => {
    var token = getAppCookies(req)['token']
    var role = getAppCookies(req)['role']
    if (role === "employee" || role === "manager") {
        next()
    } else {
        res.status(401).send('Unauthorized')
    }
}
}

function getRole(req, res, next){
  return getAppCookies(req)['role']
}

module.exports = {
  isAuthenticated,
  checkManager,
  getCreatedBy,
  getRole,
  getAppCookies,
  checkEmployee,
  checkForEmpAndManager
}