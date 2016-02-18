var error = require("./error");

var md = require('markdown-it')({
    html: true,
    linkify: true
});

var hl = require("highlight").Highlight;

/**
 * model 相关的操作
 */
var model = {
  createTime: function () {
    return +new Date();
  },

  markHTML: function (content) {
    var html = md.render(content);

    html = hl(html, false, true);

    return html;
  },

  transError: function (mysqlError) {
    if (mysqlError) {
      return new error(mysqlError.errno, {
        msg: mysqlError.code
      });
    }
  }
}

module.exports = model;