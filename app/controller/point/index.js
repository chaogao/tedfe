var express = require('express');
var Point = require('../../model/point');
var route = express.Router();
var util = require('../../../util');

route.post('/api', function (req, res, next) {
  var data = req.body;
  var point = new Point(data);

  point.save(function (err, raw) {
    if (err) {
      res.json(err.getResponse());
    } else {
      res.json(util.controller.getResponse(raw));
    }
  });
});

route.get('/api/point/:id', function (req, res, next) {
  Point.findById(req.params.id, function (err, raw) {
    if (err) {
      res.json(err.getResponse());
    } else {
      res.json(util.controller.getResponse(raw));
    }
  });

});

module.exports = route;