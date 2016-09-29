var Sequelize = require('sequelize')
module.exports = function (req, res, next) {
    var user = require('./models/user')
    var role = require('./models/role')
    
    Promise.all([user.sync({ force: true }), 
    role.sync({ force: true })]).then(function () {
        return user.create({ account: 'admin' })
    }).then(function () {
        return role.bulkCreate([
            { code: "admin", user_account: "admin" },
            { code: "user", user_account: "admin" }
        ])
    })
}