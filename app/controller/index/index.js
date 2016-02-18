var express = require("express");
var Book = require("../../model/book");
var route = express.Router();
var util = require('../../../util');

route.get("/", function (req, res, next) {
  res.json(req.session.user);
});

module.exports = route;