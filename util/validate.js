/**
 * 数据校验
 */
var checkFields = function (arr, needs) {
  var ret = true;

  needs.forEach(function (val) {
    if (arr[val] === undefined || arr[val] === "") {
      ret = false;
      return false;
    }
  });

  return ret;
}

var getUnDefinedFields = function (arr, needs) {
  var ret = [];

  needs.forEach(function (val) {
    if (arr[val] === undefined || arr[val] === "") {
      ret.push(val);
      return false;
    }
  });

  return ret;
}

exports.checkFields = checkFields;
exports.getUnDefinedFields = getUnDefinedFields;