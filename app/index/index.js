var express = require("express");

var route = express.Router();

route.get("/", function (req, res, next) {
    res.send(req.session.user);
});

module.exports = route;