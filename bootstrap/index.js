var express = require("express"),
    swig = require("swig"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
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
     */
    generateApp: function (argument) {
        var accessLog = fs.createWriteStream('./log/access.log', {flags: 'a'});

        // access logo 记录
        app.use(function (req, res, next) {
            var meta = '[' + new Date() + '] ' + req.url + '\n';
            accessLog.write(meta + '\n');
            next();
        });
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
        var errorLog = fs.createWriteStream('./log/error.log', {flags: 'a'});

        // log error
        app.use(function (err, req, res, next) {
            var meta = "[" + new Date() + "]" + req.url + " ";

            // 如果是自定义错误也记录下来
            if (Error.is(err)) {
                errorLog.write(meta + err.getMessage() + err.stack() + "\n");
            } else {
                errorLog.write(meta + err.stack + "\n");    
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