var FileStreamRotator = require('file-stream-rotator'),
  fs = require('fs'),
  path = require('path');

var loggerStream;

/**
 * 生成日志写入 stream 文件
 */
if (!loggerStream) {
  (function () {
    
    var logDirectory = path.join(__dirname, '..', 'log');
     
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

    loggerStream = FileStreamRotator.getStream({
      filename: logDirectory + '/app-%DATE%.log',
      date_format: 'YYYYMMDDHH',
      frequency: 'daily',
      verbose: false
    });
  })();
}

/**
 * 打日志，如果传入 req 则打url日志
 */
var logger = function (data, req) {
  var req = req || {};
  var meta = '[' + new Date() + '] ' + (req && req.url ? (req.url + ' ') : '');

 var dataStr = JSON.stringify(data);

 console.log(meta + dataStr);

 loggerStream.write(meta + dataStr);
}

module.exports = logger;