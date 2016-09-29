var Sequelize = require('sequelize')
var sequelize = new Sequelize('qdm137219120_db', 'qdm137219120', '709394qwe', {
    host: 'qdm137219120.my3w.com',
    dialect: 'mysql'
})


var login = function (req, res, next) {
    var account = req.body.account
    var password = req.body.password

    var userTable = sequelize.define('User', {}, {
        freezeTableName: true
    })

    var roleTable = sequelize.define('Role', {}, {
        freezeTableName: true
    })

    userTable.findOne({
        attributes: ['Account', 'Password'],
        where: {
            Account: account
        }
    }).then(function (user) {
        if (user == null) {
            res.status(500).send({
                "code": "error",
                "msg": '賬號不存在密碼錯誤'
            })
        }
        else {
            if (user.Password != password) {
                res.status(500).send({
                    "code": "error",
                    "msg": '密碼錯誤'
                })
            }
            else {
                var userInfo = {}

                userInfo.name = account
                userInfo.role = "admin"
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