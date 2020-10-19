var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    req.collection = req.db.collection('userDetails');
    next();
})

/* GET all users listing */
router.get('/', function (req, res, next) {
    req.collection.find().toArray(function (err, items) {
        res.render('./../views/users/userList', {
            message: "List of Users",
            userList: items,
            fromDb: true,
        });
    });
});

/* Create a new user */
router.get('/new', function (req, res, next) {
    res.render('./../views/users/create', {
        user: {},
    });
});

/* POST user to create */
router.post('/createorupdate', function (req, res, next) {
    if (req.body._id) {
        var query = { '_id': req.body._id };
        var newValues = { $set: { firstName: req.body.firstName, lastName: req.body.lastName } };
        req.collection.updateOne(query, newValues, function (err, result) {
            if (err) throw err;
            else {
                return res.redirect('/usersfromdb');
            }
        });
    } else {
        var newUser = req.body;
        newUser._id = Math.random().toString(36).substring(2, 6);
        req.collection.insertOne(newUser)
        res.redirect('/usersfromdb');
    }
});

/* Update user by userId */
router.get('/update/:userId', function (req, res, next) {
    req.collection.findOne({ _id: req.params.userId }, function (err, existingUser) {
        if (existingUser) {
            res.render('./../views/users/create', {
                user: existingUser
            });
        }
    });
});

/* Delete user by userId */
router.post('/delete/:userId', function (req, res, next) {
    var query = { '_id': req.params.userId.toString() };
    req.collection.deleteOne(query, function (err, result) {
        if (err) throw err;
        else {
            return res.redirect('/usersfromdb');
        }
    });
});

module.exports = router;