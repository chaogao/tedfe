var express = require("express");
var Book = require("../../model/book");
var route = express.Router();
var util = require('../../../util');

route.post("/api", function (req, res, next) {
  var data = req.body;
  var book = new Book(data);

  book.save(function (err, raw) {
    if (err) {
      res.json(err.getResponse());
    } else {
      res.json(util.controller.getResponse(raw));
    }
  });
});

route.get("/api/", function (req, res, next) {
  var book = new Book();

  book.getAll(function (err, raw) {
    if (err) {
      res.json(err.getResponse());
    } else {
      res.json(util.controller.getResponse(raw));
    }
  });
});

module.exports = route;