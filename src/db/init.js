var Sequelize = require('sequelize')
module.exports = function (req, res, next) {
    var user = require('./models/user')
    var role = require('./models/role')
    var permission = require('./models/permission')
    var user_role = require('./models/user_role')
    var role_permission = require('./models/role_permission')

    Promise.all([
        user.sync({ force: true }),
        role.sync({ force: true }),
        user_role.sync({ force: true }),
        permission.sync({ force: true }),
        role_permission.sync({ force: true })
    ]).then(function () {
        return Promise.all([
            user.create({ account: 'admin', password: "admin" }),
            role.create({ code: "admin", name: "admin" }),
            user_role.create({ user_account: "admin", role_code: "admin" }),
            permission.create({ code: "admin", name: "admin" }),
            role_permission.create({ role_code: "admin", permission_code: "admin" })
        ])
    }).then(function () {
        // role_permission.belongsTo(user_role, {
        //     foreignKey: 'role_code',
        //     targetKey: 'role_code',
        //     constraints: false
        // });

        // role_permission.findAll({
        //     include: [{
        //         model: user_role,
        //         where: {
        //             user_account: "admin"
        //         }
        //     }]
        // }).then(function (result) {
        //     res.send(result.map(o => o.permission_code))
        // })
        res.send("success")
    })
}