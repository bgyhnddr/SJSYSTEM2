var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')


module.exports = (app) => {
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    app.use(session({ secret: '1234567890QWERTY' }))

    app.use('/service/:permission/:type/:action', function(req, res, next) {
        console.log("request:" + req.originalUrl)
        if (req.params.permission == "private") {
            var checkPermission = require('../permission/check-permission')
            checkPermission(req, res, next).then(function() {
                switch (req.params.type) {
                    case "RBAC":
                        require('./RBAC')(req, res, next)
                        break
                    case "upload":
                        require('./upload')(req, res, next)
                        break
                    case "datasource":
                        require('./datasource')(req, res, next)
                        break
                    case "create_quotation":
                        require('./create_quotation')(req, res, next)
                        break
                    case "view_quotation":
                        require('./view_quotation')(req, res, next)
                        break
                    case "edit_quotation":
                        require('./edit_quotation')(req, res, next)
                        break

                }
            }, function(error) {
                if (error == "not_login") {
                    res.status(404).send({
                        "code": "not_login",
                        "msg": '沒有登錄'
                    })
                } else if (error == "no_authorization") {
                    res.status(404).send({
                        "code": "no_authorization",
                        "msg": '沒有權限'
                    })
                }
            })
        } else if (req.params.permission == "public") {
            switch (req.params.type) {
                case "auth":
                    require('./auth')(req, res, next)
                    break
            }
        }
    })

    app.use('/getTestData', function(req, res, next) {
        var filterKey = req.query.filterKey
        var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
        var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

        var list = []
        for (var i = 0; i < count; i++) {
            var obj = {}
            for (var j = 0; j < 5; j++) {
                obj["column" + (j + 1)] = filterKey + page + "page" + count + "count" + Math.ceil(Math.random() * 1000)
            }

            list.push(obj)
        }

        res.send({
            end: page == 4,
            list: list
        })
    })

    app.use('/init', function(req, res, next) {
        var init = require('../db/init')
        init(req, res, next)
    })
}