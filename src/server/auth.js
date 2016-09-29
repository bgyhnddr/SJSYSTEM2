var login = function (req, res, next) {
    var account = req.body.account
    var password = req.body.password

    var user = require('../db/models/user')
    var role = require('../db/models/role')

    role.belongsTo(user)

    role.findAll({
        attributes: ['code'],
        include: [
            {
                model: user,
                attributes: ['account', 'password'],
                where: {
                    account: account
                }
            }
        ]
    }).then(function (result) {
        if (result.length == 0) {
            res.status(500).send({
                "code": "error",
                "msg": '賬號不存在'
            })
        }
        else {
            if (result[0].user.password != password) {
                res.status(500).send({
                    "code": "error",
                    "msg": '密碼錯誤'
                })
            }
            else {
                var userInfo = {}
                userInfo.name = account
                userInfo.role = result.map(o => o.code)
                req.session.userInfo = userInfo
                res.send(req.session.userInfo)
            }
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