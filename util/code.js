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
  },


  /**
   * book action 相关 2100 ~ 2199
   */
  BOOK_NOT_FOUND: {
    code: 2100,
    msg: 'no book data found'
  },

  /**
   * point action 相关 2200 ~ 2299
   */
  POINT_NOT_FOUND: {
    code: 2200,
    msg: 'no point data found'
  }
}

module.exports = code;