var login = function (req, res, next) {
    var account = req.body.account
    var password = req.body.password

    var user = require('../db/models/user')

    user.findOne({
        attributes: ['account', 'password'],
        where: {
            account: account
        }
    }).then(function (result) {
        if (result == null) {
            res.status(500).send({
                "code": "error",
                "msg": '賬號不存在'
            })
        }
        else {
            if (result.password != password) {
                res.status(500).send({
                    "code": "error",
                    "msg": '密碼錯誤'
                })
            }
            else {
                var user_role = require('../db/models/user_role')
                var role_permission = require('../db/models/role_permission')

                role_permission.belongsTo(user_role, {
                    foreignKey: 'role_code',
                    targetKey: 'role_code',
                    constraints: false
                })
                return role_permission.findAll({
                    include: [{
                        model: user_role,
                        where: {
                            user_account: result.account
                        }
                    }]
                })
            }
        }
    }).then(function (result) {
        if (result != null) {
            var userInfo = {}
            userInfo.name = account
            userInfo.permissions = result.map(o => o.permission_code)
            req.session.userInfo = userInfo
            res.send(req.session.userInfo)
        }
    })

}

var logout = function (req, res, next) {
    req.session.userInfo = undefined
    res.end()
}

var getUser = function (req, res, next) {
    res.send(req.session.userInfo)
}




module.exports = (req, res, next) => {
    var action = req.params.action
    switch (action) {
        case "login":
            login(req, res, next)
            break
        case "logout":
            logout(req, res, next)
            break
        case "getUser":
            getUser(req, res, next)
            break
    }
}