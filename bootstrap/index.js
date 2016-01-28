var express = require("express"),
    swig = require("swig"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    FileStreamRotator = require('file-stream-rotator'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    path = require("path"),
    fs = require("fs");

var RedisStore = require('connect-redis')(session);

var Error = require("../util/error");

var app;

var App = {
    getApp: function (argument) {
        app = express();

        this.generateTemplate();
        this.generateCookieSession();
        this.generateApp();
        this.generateRoute();
        this.generateError();
        this.generate404();

        return app;
    },

    /**
     * 对 cookie 和 session 进行配置
     */
    generateCookieSession: function (argument) {
        app.use(cookieParser());
        app.use(session({
            secret: "tedfe",
            resave:false,
            saveUninitialized:false,
            store: new RedisStore({
                host: "121.42.218.198",
                port: 6379
            })
        }));
    },

    /**
     * app 所有请求通用处理
     * 目前处理 methodoverride logger
     */
    generateApp: function (argument) {
        /**
         * favicon 配置
         */
        app.use(favicon(__dirname + "/../public/favicon.ico"));

        /**
         * method override 让浏览器支持 put、delete
         */
        app.use(methodOverride());

        /**
         * access log 记录
         */
        var logDirectory = path.join(__dirname, "..", "log");
         
        // ensure log directory exists 
        fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

        // create a rotating write stream 
        var accessLogStream = FileStreamRotator.getStream({
            filename: logDirectory + '/access-%DATE%.log',
            date_format: "YYYYMMDDHH",
            frequency: 'daily',
            verbose: false
        });

        app.use(morgan('combined', {stream: accessLogStream}));
    },

    /**
     * 生成路由信息
     */
    generateRoute: function (argument) {
        app.use("/", require("../app/index"));
        app.use("/point", require("../app/point"));
    },

    /**
     * 生成模板信息
     */
    generateTemplate: function (argument) {
        app.engine("html", swig.renderFile);
        app.set('view engine', 'html');
        app.set('views', path.join(__dirname, "..", "views"));

        if (app.get("env") == "development") {
            app.set("view cache", false);
            swig.setDefaults({
                cache: false
            });
        } else {
            app.set("view cache", true);
        }
    },

    /**
     * 错误日志记录
     */
    generateError: function (argument) {
        var logDirectory = path.join(__dirname, "..", "log");
         
        // ensure log directory exists 
        fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

        // create a rotating write stream 
        var errorLogStream = FileStreamRotator.getStream({
            filename: logDirectory + '/error-%DATE%.log',
            date_format: "YYYYMMDDHH",
            frequency: 'daily',
            verbose: false
        });

        // log error
        app.use(function (err, req, res, next) {
            var meta = "[" + new Date() + "]" + req.url + " ";

            // 如果是自定义错误也记录下来
            if (Error.is(err)) {
                errorLogStream.write(meta + err.getMessage() + err.stack() + "\n");
            } else {
                errorLogStream.write(meta + err.stack + "\n");    
            }

            next(err);
        });

        // 处理自定义错误为正确返回值
        app.use(function (err, req, res, next) {
            // 自定义错误为程序正确返回
            if (Error.is(err)) {
                res.status(200).send(err.getResponse());
            } else {
                if (app.get("env") == "development") {
                    next(err);
                } else {
                    res.status(500).send("server error");
                }
            }
        });
    },

    /**
     * 处理 404 页面
     */
    generate404: function () {
        app.use(function (req, res) {
            res.status(404).render("404.html");
        });
    }
}

module.exports = App;