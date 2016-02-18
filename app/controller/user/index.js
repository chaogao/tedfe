var express = require("express");
var route = express.Router();

var User = require("../../model/user");
var util = require('../../../util');

route.post("/api", function (req, res, next) {
  var data = req.body;
  var user = new User(data);

  user.save(function (err, raw) {
    if (err) {
      res.json(err.getResponse());
    } else {
      res.json(util.controller.getResponse(raw));
    }
  });
});

route.post("/api/login", function (req, res, next) {
  var data = req.body;
  var user = new User();

  // 没有传入直接返回
  if (!data.name || !data.passport) {
    var err = new util.error(util.code.USER_LOGIN_FIELDS.code, {
        msg: util.code.USER_LOGIN_FIELDS.msg
    });

    throw err;
  }

  // 验证并设置 session
  user.validate(data.name, data.passport, function (err, raw) {
    if (err) {
        res.json(err.getResponse());
    } else {
        req.session.user = raw;
        res.json(raw);
    }
  });
});

module.exports = route;