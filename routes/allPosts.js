var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    req.collection = req.db.collection('posts');
    next();
})

/* GET all posts listing */
router.get('/', function (req, res, next) {
    req.collection.find().toArray(function (err, items) {
        res.render('./../views/posts/postList', {
            message: "List of Posts",
            userList: items,
            fromDb: true,
        });
    });
});

/* Create a new post */
router.get('/new', function (req, res, next) {
    res.render('./../views/posts/create', {
        user: {},
    });
});

/* POST posts to create */
router.post('/createorupdate', function (req, res, next) {
    if (req.body._id) {
        var query = { '_id': req.body._id };
        var newValues = { $set: { firstName: req.body.firstName, lastName: req.body.lastName } };
        req.collection.updateOne(query, newValues, function (err, result) {
            if (err) throw err;
            else {
                return res.redirect('/posts');
            }
        });
    } else {
        var newUser = req.body;
        newUser._id = Math.random().toString(36).substring(2, 6);
        req.collection.insertOne(newUser)
        res.redirect('/posts');
    }
});

/* Update user by userId */
router.get('/update/:postId', function (req, res, next) {
    req.collection.findOne({ _id: req.params.userId }, function (err, existingUser) {
        if (existingUser) {
            res.render('./../views/posts/create', {
                user: existingUser
            });
        }
    });
});

/* Delete user by userId */
router.post('/delete/:postId', function (req, res, next) {
    var query = { '_id': req.params.userId.toString() };
    req.collection.deleteOne(query, function (err, result) {
        if (err) throw err;
        else {
            return res.redirect('/posts');
        }
    });
});

module.exports = router;