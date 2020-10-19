const express = require('express');
const router = express.Router();
const passport = require('passport');
const validator = require('../middlewares/validator');
const User = require('../models/employee');
const { validationResult } = require('express-validator/check');

router.get('/register', function(req, res, next) {
    res.render('users/register',{loggedIn:true})
})

router.post('/register', validator.validate('register'),async function (req, res, next) {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const user = req.body;
        console.log(errors);
        const userErr =  errors.array().find(e => e.msg === validator.usernameRequired)
        const emailErr = errors.array().find(e => e.msg === validator.emailRequired)
        const passwordErr = errors.array().find(e => e.msg === validator.passwordRequired)
        const roleErr = errors.array().find(e => e.msg === validator.roleRequired)
        res.render('users/register', {
            title: 'Register',
            user,
            userErr,
            passwordErr,
            emailErr,
            roleErr,loggedIn:true
        })
    }
    else{
        const user = new User(req.body);
        await user.setHashedPassword();
      
        user.save((err, savedUser) => {
          if (err) {
            console.log('Error while creating a user: ', err);
          }
          res.redirect("/auth/login");
        });
    }

  } catch (error) {
      
  }
 
});

router.post(
  '/login',validator.validate('login'),
  passport.authenticate('local', { session: false }),
  function (req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const user = req.body;
        console.log(errors);
        const usernameErr =  errors.array().find(e => e.msg === validator.usernameRequired)
        const passwordErr = errors.array().find(e => e.msg === validator.passwordRequired)
        res.render('users/login', {
            user,
            usernameErr,
            passwordErr,
            roleErr,loggedIn:true
        })}else{
    var response = req.user.toAuthJson()
    res.cookie('token',response['token']);
    res.cookie('role',req.user.role);
    res.cookie('name',response['username']);
    res.cookie('user',response['username']);
    res.redirect('/vacancy/all')
        }
  }
);  

router.get('/login',function(req, res, next) {
    res.render('users/login',{loggedIn:false})
});

router.get('/logout', function(req, res){
    req.logout();
    res.clearCookie('token')
    res.clearCookie('role')
    res.clearCookie('name')
    res.clearCookie('user')
    res.clearCookie('vacId')
    res.redirect('/auth/login');
  });

module.exports = router;
