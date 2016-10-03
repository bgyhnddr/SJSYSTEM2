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

var getUserRoles = function (req, res, next) {
    var user_role = require('../db/models/user_role')
    var role = require('../db/models/role')
    user_role.belongsTo(role, {
        foreignKey: 'role_code',
        targetKey: 'code',
        constraints: false
    })

    var user = req.query.user
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    Promise.all([
        user_role.findAll({
            include: [{
                model: role
            }],
            where: {
                $and: {
                    user_account: {
                        $and: {
                            $not: "admin",
                            $eq: user
                        }
                    },
                    role_code: {
                        $not: "admin"
                    },
                    $or: {
                        role_code: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            },
            offset: page * count,
            limit: count
        }),
        user_role.count({
            include: [{
                model: role
            }],
            where: {
                $and: {
                    user_account: {
                        $and: {
                            $not: "admin",
                            $eq: user
                        }
                    },
                    role_code: {
                        $not: "admin"
                    },
                    $or: {
                        role_code: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            }
        })
    ]).then(function (result) {
        var user_roles = result[0]
        var rowCount = result[1]
        res.send({
            end: (user_roles.length + page * count) >= rowCount,
            list: user_roles
        })
    })
}

var submitUserRole = function (req, res, next) {
    console.log(req.body)
    var id = req.body.id
    var role_code = req.body.role_code ? req.body.role_code : ""
    var user_account = req.body.user_account
    if (role_code) {
        var user_role = require('../db/models/user_role')
        if (id) {
            user_role.update(
                {
                    role_code: role_code
                },
                {
                    where: {
                        id: id,
                        user_account: user_account
                    }
                }).then(function () {
                    res.end()
                })
        }
        else {
            user_role.create({
                user_account: user_account,
                role_code: role_code
            }).then(function () {
                res.end()
            })
        }
    }
    else {
        res.status(500).send({
            "code": "error",
            "msg": '請指定角色'
        })
    }
}

var deleteUserRole = function (req, res, next) {
    var user_role = require('../db/models/user_role')

    var id = req.body.id
    if (id) {
        user_role.destroy({
            where: {
                id: id
            }
        }).then(function () {
            res.end()
        })
    }
    else {
        res.end()
    }
}

var getRolePermissions = function (req, res, next) {
    var role_permission = require('../db/models/role_permission')
    var role = require('../db/models/role')
    var permission = require('../db/models/permission')

    role_permission.belongsTo(role, {
        foreignKey: 'role_code',
        targetKey: 'code',
        constraints: false
    })

    role_permission.belongsTo(permission, {
        foreignKey: 'permission_code',
        targetKey: 'code',
        constraints: false
    })
    var role_code = req.query.role
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    Promise.all([
        role_permission.findAll({
            include: [role, permission],
            where: {
                $and: {
                    role_code: {
                        $and: {
                            $not: "admin",
                            $eq: role_code
                        }
                    },
                    permission_code: {
                        $not: "admin"
                    },
                    $or: {
                        permission_code: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            },
            offset: page * count,
            limit: count
        }),
        role_permission.count({
            include: [role, permission],
            where: {
                $and: {
                    role_code: {
                        $and: {
                            $not: "admin",
                            $eq: role_code
                        }
                    },
                    permission_code: {
                        $not: "admin"
                    },
                    $or: {
                        permission_code: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            }
        })
    ]).then(function (result) {
        var role_permissions = result[0]
        var rowCount = result[1]
        res.send({
            end: (role_permissions.length + page * count) >= rowCount,
            list: role_permissions
        })
    }, function (e) {
        console.log(e)
    })
}

var submitRolePermission = function (req, res, next) {
    console.log(req.body)
    var id = req.body.id
    var permission_code = req.body.permission_code ? req.body.permission_code : ""
    var role_code = req.body.role_code
    if (permission_code) {
        var role_permission = require('../db/models/role_permission')
        if (id) {
            role_permission.update(
                {
                    permission_code: permission_code
                },
                {
                    where: {
                        id: id,
                        role_code: role_code
                    }
                }).then(function () {
                    res.end()
                })
        }
        else {
            role_permission.create({
                permission_code: permission_code,
                role_code: role_code
            }).then(function () {
                res.end()
            })
        }
    }
    else {
        res.status(500).send({
            "code": "error",
            "msg": '請指定權限'
        })
    }
}

var deleteRolePermission = function (req, res, next) {
    var role_permission = require('../db/models/role_permission')

    var id = req.body.id
    if (id) {
        role_permission.destroy({
            where: {
                id: id
            }
        }).then(function () {
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
        case "getUserRoles":
            getUserRoles(req, res, next)
            break
        case "submitUserRole":
            submitUserRole(req, res, next)
            break
        case "deleteUserRole":
            deleteUserRole(req, res, next)
            break
        case "getRolePermissions":
            getRolePermissions(req, res, next)
            break
        case "submitRolePermission":
            submitRolePermission(req, res, next)
            break
        case "deleteRolePermission":
            deleteRolePermission(req, res, next)
            break
    }
}