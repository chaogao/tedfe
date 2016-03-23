var util = require('../../../util');
var Book = require('../book');
var async = require('async');

var REQUIRED_FIELDS = [
  'book_id',
  'order_index',
  'title',
  'content',
  'is_overview'
];

var SELECT_FIELDS = [
  'id',
  'book_id',
  'parent_id',
  'order_index',
  'title',
  'content_html',
  'img_src',
  'is_overview',
  'ext',
  'create_time',
  'update_time'
];

var pool = util.db.get();

/**
 * point model
 */
var Point = function (data, option) {
  this.data = data;
}

/**
 * 生成一条book数据
 */
Point.prototype.save = function (cb, option) {
  var self = this;

  // 检测必须字段
  if (!util.validate.checkFields(this.data, REQUIRED_FIELDS)) {
    var unDefinedFields = util.validate.getUnDefinedFields(this.data, REQUIRED_FIELDS);

    cb(new util.error(util.code.DB_FIELDS_CHECK.code, {
        msg: util.code.DB_FIELDS_CHECK.msg,
        requires: unDefinedFields
    }));

    return;
  }

  async.waterfall([
    // it check if the book is existing
    function (next) {
      var bookId = self.data['book_id'];

      Book.findById(bookId, function (err, raw) {
        next(err, raw);
      });
    },

    // check if parent id point is existing
    function (blog, next) {
      // it has parent_id then check it
      var parentId = self.data['parent_id'];

      if (parentId) {
        Point.findbyId(id, function (err, raw) {
          next(err, blog, raw);
        });
      } else { 
        next(null, blog, null);
      }
    },

    // insert blog
    function (blog, parentData, next) {
      self.data.create_time = util.model.createTime();
      self.data.content_html = util.model.markHTML(self.data.content);

      pool.query('insert into `book_point` set ?', self.data, function (err, raw) {
        err = util.model.transError(err);
        next(err, raw);
      });
    }

  ], function (err, raw) {
    cb(err, raw);
  });

  return;
}

/**
 * findById
 */
Point.findById = function (id, cb) {
  var self = this;

  pool.query('select ?? from `book_point` where id=?', [SELECT_FIELDS, id], function (err, raw) {
    err = util.model.transError(err);

    if (raw && raw.length == 0) {
      err = new util.error(util.code.POINT_NOT_FOUND.code, {
        msg: util.code.POINT_NOT_FOUND.msg
      });
    }

    cb(err, raw && raw[0]);
  });
}

module.exports = Point;