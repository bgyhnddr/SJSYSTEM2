var getUsers = function (req, res, next) {
    var user = require('../db/models/user')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    Promise.all([
        user.findAll({
            where: {
                account: {
                    $and: {
                        $not: "admin",
                        $like: "%" + filterKey + "%"
                    }
                }
            },
            offset: page * count,
            limit: count
        }),
        user.count({
            where: {
                account: {
                    $and: {
                        $not: "admin",
                        $like: "%" + filterKey + "%"
                    }
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

var resetPassword = function (req, res, next) {
    var user = require('../db/models/user')
    var account = req.body.account
    if (account) {
        user.findOne({
            where: {
                account: account
            }
        }).then(function (result) {
            console.log(result)
            if (result == null) {
                res.status(500).send({
                    "code": "error",
                    "msg": '賬號不存在'
                })
            }
            else {
                result.password = "123"
                return result.save()
            }
        }).then(function (result) {
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
    if (account && account != "admin") {
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
        ]).then(function () {
            res.end()
        })
    }
    else {
        res.end()
    }
}

var getRoles = function (req, res, next) {
    var role = require('../db/models/role')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    Promise.all([
        role.findAll({
            where: {
                $and: {
                    code: {
                        $not: "admin"
                    },
                    $or: {
                        code: {
                            $like: "%" + filterKey + "%"
                        },
                        name: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            },
            offset: page * count,
            limit: count
        }),
        role.count({
            where: {
                $and: {
                    code: {
                        $not: "admin"
                    },
                    $or: {
                        code: {
                            $like: "%" + filterKey + "%"
                        },
                        name: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            }
        })
    ]).then(function (result) {
        var roles = result[0]
        var rowCount = result[1]
        res.send({
            end: (roles.length + page * count) >= rowCount,
            list: roles
        })
    })
}

var submitRole = function (req, res, next) {
    var code = req.body.code
    var name = req.body.name ? req.body.name : ""
    if (code) {
        var role = require('../db/models/role')
        role.upsert({ code: code, name: name }).then(function () {
            res.end()
        })
    }
    else {
        res.status(500).send({
            "code": "error",
            "msg": '請輸入角色編碼'
        })
    }
}

var deleteRole = function (req, res, next) {
    var role = require('../db/models/role')
    var user_role = require('../db/models/user_role')
    var role_permission = require('../db/models/role_permission')
    var code = req.body.code
    if (code && code != "admin") {
        Promise.all([
            user_role.destroy({
                where: {
                    role_code: code
                }
            }),
            role.destroy({
                where: {
                    code: code
                }
            }),
            role_permission.destroy({
                where: {
                    role_code: code
                }
            })
        ]).then(function () {
            res.end()
        })
    }
    else {
        res.end()
    }
}

var getPermissions = function (req, res, next) {
    var permission = require('../db/models/permission')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    Promise.all([
        permission.findAll({
            where: {
                $and: {
                    code: {
                        $not: "admin"
                    },
                    $or: {
                        code: {
                            $like: "%" + filterKey + "%"
                        },
                        name: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            },
            offset: page * count,
            limit: count
        }),
        permission.count({
            where: {
                $and: {
                    code: {
                        $not: "admin"
                    },
                    $or: {
                        code: {
                            $like: "%" + filterKey + "%"
                        },
                        name: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            }
        })
    ]).then(function (result) {
        var permissions = result[0]
        var rowCount = result[1]
        res.send({
            end: (permissions.length + page * count) >= rowCount,
            list: permissions
        })
    })
}

var submitPermission = function (req, res, next) {
    var code = req.body.code
    var name = req.body.name ? req.body.name : ""
    if (code) {
        var permission = require('../db/models/permission')
        permission.upsert({ code: code, name: name }).then(function () {
            res.end()
        })
    }
    else {
        res.status(500).send({
            "code": "error",
            "msg": '請輸入權限編碼'
        })
    }
}

var deletePermission = function (req, res, next) {
    var permission = require('../db/models/permission')
    var role_permission = require('../db/models/role_permission')
    var code = req.body.code
    if (code && code != "admin") {
        Promise.all([
            permission.destroy({
                where: {
                    code: code
                }
            }),
            role_permission.destroy({
                where: {
                    permission_code: code
                }
            })
        ]).then(function () {
            res.end()
        })
    }
    else {
        res.end()
    }
}

module.exports = (req, res, next) => {
    var action = req.params.action
    console.log(action)
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
        case "resetPassword":
            resetPassword(req, res, next)
            break
        case "getRoles":
            getRoles(req, res, next)
            break
        case "submitRole":
            submitRole(req, res, next)
            break
        case "deleteRole":
            deleteRole(req, res, next)
            break
        case "getPermissions":
            getPermissions(req, res, next)
            break
        case "submitPermission":
            submitPermission(req, res, next)
            break
        case "deletePermission":
            deletePermission(req, res, next)
            break
    }
}