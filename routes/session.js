var express = require('express');
var router = express.Router();

router.get("/", function (req, res) {
    var name = req.session.name
    return res.send(name)
})


module.exports = router;