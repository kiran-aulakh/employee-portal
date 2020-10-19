const { body, check } = require('express-validator')

const projectNameRequired = 'Project name should not be empty';
const clientNameRequired = 'Client name should not be empty';
const technologiesRequired = 'Technologies should not be empty';
const roleRequired = 'Provide role between employee/manager';
const jobDescriptionRequired = 'Job description should not be empty';
const statusRequired = 'status should not be empty and must be OPEN/CLOSED';
const usernameRequired = 'Username required';
const emailRequired = 'Email required';
const passwordRequired = 'Invalid password';


function validate(method) {
  switch (method) {
    case 'register': {
     return [ 
        check('username', usernameRequired).exists().notEmpty().isString(),
        check('email', emailRequired).exists().notEmpty().isEmail(),
        check('role', roleRequired).exists().notEmpty().isString().custom((value) => {
            if (value === 'employee' || value === 'manager') {
                return true
            }
            return false
        }),
        check('password', passwordRequired).exists().isString().notEmpty().isAlphanumeric(),
       ]   
    }
    case 'vacancy': {
        return [ 
           check('project', projectNameRequired).exists().notEmpty(),
           check('client', clientNameRequired).exists().notEmpty(),
           check('technology', technologiesRequired).exists().notEmpty(),
           check('role', roleRequired).exists().notEmpty().isString(['manager', 'employee']),
           check('description', jobDescriptionRequired).exists().isString().notEmpty(),
           check('status', statusRequired).exists().notEmpty().isString().custom((value) => {
            if (value === 'OPEN' || value === 'CLOSED') {
                return true
            }
            return false
        }),
          ]   
       }

    case 'login' : {
        return [
            check('username',usernameRequired).exists().notEmpty(),
            check('password', passwordRequired).exists().isString().notEmpty(),
        ]
    }
  }
}

module.exports = {
    validate,
    projectNameRequired,
    clientNameRequired,
    technologiesRequired,
    roleRequired,
    jobDescriptionRequired,
    statusRequired,
    roleRequired,
    usernameRequired,
    passwordRequired,
    emailRequired,
}