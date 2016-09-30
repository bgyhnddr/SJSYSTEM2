var getUsers = function (req, res, next) {

    var user = require('../db/models/user')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    Promise.all([
        user.findAll({
            where: {
                account: {
                    $like: "%" + filterKey + "%"
                }
            },
            offset: page * count,
            limit: count
        }),
        user.count({
            where: {
                account: {
                    $like: "%" + filterKey + "%"
                }
            }
        })
    ]).then(function (result) {
        var users = result[0]
        var rowCount = result[1]
        res.send({
            end: (users.length + page * count) >= rowCount,
            list: users
        })
    })
}

var addUser = function (req, res, next) {
    var user = require('../db/models/user')
    var account = req.body.account
    if (account) {
        user.findOne({
            where: {
                account: account
            }
        }).then(function (result) {
            if (result != null) {
                res.status(500).send({
                    "code": "error",
                    "msg": '賬號已存在'
                })
            }
            else {
                return user.create({ account: account, password: "123" })
            }
        }).then(function () {
            res.end()
        })
    }
    else {
        res.status(500).send({
            "code": "error",
            "msg": '請輸入用戶'
        })
    }
}

var deleteUser = function (req, res, next) {
    var user = require('../db/models/user')
    var user_role = require('../db/models/user_role')
    var account = req.body.account
    if (account) {
        Promise.all([
            user_role.destroy({
                where: {
                    user_account: account
                }
            }),
            user.destroy({
                where: {
                    account: account
                }
            })
        ]).then(function(){
            res.end()
        })
    }
    else {
        res.end()
    }
}


module.exports = (req, res, next) => {
    var action = req.params.action
    switch (action) {
        case "getUsers":
            getUsers(req, res, next)
            break
        case "addUser":
            addUser(req, res, next)
            break
        case "deleteUser":
            deleteUser(req, res, next)
            break
    }
}