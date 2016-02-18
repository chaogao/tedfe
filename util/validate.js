/**
 * 数据校验
 */
var checkFields = function (arr, needs) {
  var ret = true;

  needs.forEach(function (val) {
    if (arr[val] === undefined) {
      ret = false;
      return false;
    }
  });

  return ret;
}

exports.checkFields = checkFields;