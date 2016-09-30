var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
module.exports = (app) => {
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    app.use(session({ secret: '1234567890QWERTY' }))

    app.use('/service/:type/:action', function (req, res, next) {
        switch (req.params.type) {
            case "auth":
                require('./auth')(req, res, next)
                break
            case "RBAC":
                require('./RBAC')(req, res, next)
                break
        }
    })

    app.use('/getTestData', function (req, res, next) {
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

    app.use('/init', function (req, res, next) {
        var init = require('../db/init')
        init(req, res, next)
    })
}