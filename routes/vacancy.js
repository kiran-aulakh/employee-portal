const express = require('express');
const router = express.Router();
const Vacancy = require('../models/vacancy');
const auth = require('../middlewares/auth')
const validator = require('../middlewares/validator')
const { validationResult } = require('express-validator/check');
const User = require('../models/employee');

router.post('/post', auth.checkManager(), validator.validate('vacancy'), async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const vacancy = req.body;
            const projectErr = errors.array().find(e => e.msg === positionValidation.projectNameRequired)
            const clientErr = errors.array().find(e => e.msg === positionValidation.clientNameRequired)
            const roleErr = errors.array().find(e => e.msg === positionValidation.roleRequired)
            const statusErr = errors.array().find(e => e.msg === positionValidation.statusRequired)
            const technologyErr = errors.array().find(e => e.msg === positionValidation.technologiesRequired)
            const descriptionErr = errors.array().find(e => e.msg === positionValidation.jobDescriptionRequired)
            res.render('vacancy/post', {
                vacancy,
                projectErr,
                clientErr,
                roleErr,
                statusErr,
                technologyErr,
                descriptionErr,
                loggedIn:true
            })
        }
        else{
            var vacId =  auth.getAppCookies(req)['vacId'];
            if (vacId) {
                var query = { '_id': vacId };
                var appliedBy = req.body.appliedBy;
                var oldAppliedBy = req.body.appliedBy;
                if(req.body.status === 'CLOSED'){
                    appliedBy = [];
                }
                var newValues = { $set: {
                     project: req.body.project, 
                     client: req.body.client,
                     technology:req.body.technology ,
                     role: req.body.role ,
                     description: req.body.description,
                     status: req.body.status,
                     appliedBy: appliedBy
                    } };
                Vacancy.updateOne(query, newValues, function (err, result) {
                    if (err) throw err;
                    else {
                        if(req.body.status === 'CLOSED' && oldAppliedBy!=undefined){
                            oldAppliedBy.forEach(function(value){
                                console.log("Vacancy closed for "+ value);
                              });
                        }
                        return res.redirect('/vacancy/all');
                    }
                });
            } else {
                const vacancy = new Vacancy(req.body);
            vacancy.createdby = auth.getCreatedBy(req, res, next);
            vacancy.save((err, vacancy) => {
              if (err) {
                console.log('Error while creating vacancy: ', err);
              }
              res.redirect("/vacancy/all");
            });
            }
        }
    } catch (error) {
        
    }
});

router.get('/all',auth.checkForEmpAndManager(),function(req, res, next) {
    Vacancy.find(function (err, vacancies) {
        if (err) {
        }
        else {
            const role = auth.getRole(req, res, next);
            var showUpdateButton = false;
            if(role === 'manager'){
                showUpdateButton = true;
            }
            
            res.render('vacancy/vacancyPage', {Vacancies: vacancies,showUpdateButton:showUpdateButton,loggedIn:true})
        }
    });
});

router.get('/post',auth.checkManager(),function(req, res, next) {
    res.render('vacancy/create',{loggedIn:true})
});

router.get('/get/:id',auth.checkEmployee(),async function(req, res, next) {
    await Vacancy.findById((req.params.id), function (err, vacancy) {
        if (err) {
        }
        const usr = auth.getCreatedBy(req, res, next);
        var showApplyButton = true;
        var index = vacancy.appliedBy.find( v => v === usr);
        if(index != undefined && index===usr){
            showApplyButton = false;
            console.log("Already applied for post");
        }
        if(vacancy.status != 'OPEN'){
            showApplyButton = false;
            console.log("Already applied for post");
        }
        return res.render('vacancy/vacancyDetail', {vacancy:vacancy,showApplyButton:showApplyButton,loggedIn:true})
    });
});

router.get('/apply/:id', auth.checkEmployee(),async function (req, res, next) {
    const user = auth.getCreatedBy(req, res, next);
    const id = req.params.id
    Vacancy.findByIdAndUpdate(id,
        {$push: {appliedBy: user}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }else{
                console.log("Applied for post "+user );
                alert("Applied for post");
                res.redirect('/vacancy/all')
            }
        }
    );
});

/* Update user by userId */
router.get('/update/:id',auth.checkManager(), function (req, res, next) {
    Vacancy.findOne({ _id: req.params.id }, function (err, vac) {
        if (vac) {
            res.cookie('vacId',req.params.id);
            res.render('vacancy/create', {
                vacancy: vac,loggedIn:true
            });
        }
    });
});


module.exports = router;
