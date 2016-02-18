/**
 * 错误码定义
 */
var code = {
  /**
   * db 相关 1000 ~ 1999
   */
  DB_FIELDS_CHECK: {
    code: 1000,
    msg: 'no required fields'
  },

  /**
   * user action 相关 2000 ~ 2099
   */
  USER_LOGIN_FIELDS: {
    code: 2000,
    msg: 'no name or passport'
  },

  USER_LOGIN_PASSPORT: {
    code: 2001,
    msg: 'passport error'
  }
}

module.exports = code;