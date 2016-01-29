/**
 * 通用错误处理类
 */
var SysError = function (code, data) {
  this.code = code;
  this.data = data;

  this.err = new Error(code);
}

SysError.prototype.__type = "sys_err";

/**
 * 返回前端的 json 数据
 */
SysError.prototype.getResponse = function () {
  var res = {
    err: this.code,
    data: this.data
  }

  return res;
}

SysError.prototype.stack = function (argument) {
  return this.err.stack;
}

/**
 * 日志记录的 message
 */
SysError.prototype.getMessage = function () {
  return "code:" + this.code + " message:" + JSON.stringify(this.data); 
}

/**
 * 判断是否为自定义 error
 */
SysError.is = function (err) {
  if (err.__type == "sys_err") {
    return true;
  } else {
    return false;
  }
}

module.exports = SysError;