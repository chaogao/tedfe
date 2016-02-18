/**
 * 用户model
 * @model User
 */
var crypto = require("crypto"),
    Dig = "hex";

var util = require('../../../util');

var REQUIRED_FIELDS = [
  'name',
  'passport'
];

var User = function (data, option) {
    this.pool =  util.db.get();
    this.data = data;
}

/**
 * 验证登陆
 */
User.prototype.validate = function (name, password, cb) {
    var self = this,
        md5Password = crypto.createHash("md5").update(password).digest(Dig);
    
    self.pool.query('select ?? from tedfe_user where name = ?', [REQUIRED_FIELDS, name], function (err, raw) {
        var result = (!err && raw[0] && raw[0].passport == md5Password) ? true : false;

        if (err) {
            err = util.model.transError(err);
            cb(err);
        } else if (result) {
            cb(err, raw[0]);
        } else {
            err = new util.error(util.code.USER_LOGIN_PASSPORT.code, {
                msg: util.code.USER_LOGIN_PASSPORT.msg
            });

            cb(err);
        }
    });
}

/**
 * 新建用户
 */
User.prototype.save = function (cb) {
    var self = this;

    if (!util.validate.checkFields(this.data, REQUIRED_FIELDS)) {
        cb(new util.error(util.code.DB_FIELDS_CHECK.code, {
            msg: util.code.DB_FIELDS_CHECK.msg
        }));
    } else {
        this.data.passport = crypto.createHash("md5").update(this.data.passport).digest(Dig);
        this.data.create_time = util.model.createTime();

        console.log(this.data);

        this.pool.query('insert into tedfe_user set ?', this.data, function (err, raw) {
            err = util.model.transError(err);
            cb(err, raw);
        });
    }
}

module.exports = User;