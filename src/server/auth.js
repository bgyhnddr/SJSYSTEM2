var login = function (req, res, next) {
    var account = req.body.account
    if (account != "admin") {
        res.status(500).send({
            "code": "error",
            "msg": "賬號不存在"
        })
        return
    }
    if (req.body.password != "admin") {
        res.status(500).send({
            "code": "error",
            "msg": "密碼錯誤"
        })
        return
    }
    var userInfo = {}

    userInfo.name = account
    userInfo.role = "admin"
    req.session.userInfo = userInfo
    res.send(req.session.userInfo)
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