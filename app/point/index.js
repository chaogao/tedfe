var express = require("express");

var Error = require("../../util/error");

var route = express.Router();

route.get("/", function (req, res, next) {
    throw(new Error(1001, {
        msg: "tmd"
    }));

    res.send("hello point");
});

module.exports = route;