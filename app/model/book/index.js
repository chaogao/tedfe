var util = require('../../../util');

var REQUIRED_FIELDS = [
  'name',
  'author',
  'author_src',
  'img_src',
  'content',
  'category_id',
  'category_name'
];

var SELECT_FIELDS = [
  "id",
  'name',
  'author',
  'author_src',
  'img_src',
  'content_html',
  'category_id',
  'category_name',
  'update_time',
  'create_time'
];

var pool = util.db.get();

/**
 * book model
 */
var Book = function (data, option) {
  this.data = data;
}

/**
 * 通过 id 获取 Book
 */
Book.findById = function (id, cb) {
  pool.query('select ?? from `book` where id = ?', [SELECT_FIELDS, id], function (err, raw) {
    err = util.model.transError(err);

    if (raw && raw.length == 0) {
      err = new util.error(util.code.BOOK_NOT_FOUND.code, {
        msg: util.code.BOOK_NOT_FOUND.msg
      });
    }

    cb(err, raw && raw[0]);
  });  
}

/**
 * 生成一条book数据
 */
Book.prototype.save = function (cb, option) {
  var self = this;

  if (!util.validate.checkFields(this.data, REQUIRED_FIELDS)) {
    var unDefinedFields = util.validate.getUnDefinedFields(this.data, REQUIRED_FIELDS);

    cb(new util.error(util.code.DB_FIELDS_CHECK.code, {
        msg: util.code.DB_FIELDS_CHECK.msg,
        requires: unDefinedFields
    }));
  } else {
    self.data.create_time = util.model.createTime();
    self.data.content_html = util.model.markHTML(self.data.content);

    pool.query('insert into `book` set ?', self.data, function (err, raw) {
      err = util.model.transError(err);
      cb(err, raw);
    });
  }
}

/**
 * 查找全部的 book
 */
Book.prototype.getAll = function (cb) {
  var self = this;

  pool.query('select ?? from `book` where del=0', [SELECT_FIELDS], function (err, raw) {
    // 返回数据进行处理
    self._transData(raw);
    err = util.model.transError(err);

    cb(err, raw);
  });
}

/**
 * book 内部进行数据转换
 */
Book.prototype._transData = function (data) {
  data.forEach(function (item) {
    item.create_time = new Date(item.create_time);
  });
}

module.exports = Book;