var Sequelize = require('sequelize')
module.exports = function(req, res, next) {
    var user = require('./models/user')
    var role = require('./models/role')
    var permission = require('./models/permission')
    var user_role = require('./models/user_role')
    var role_permission = require('./models/role_permission')
    var property_management_co = require('./models/property_management_co')
    var staff = require('./models/staff')
    var project_manager = require('./models/project_manager')
    var project_type = require('./models/project_type')
    var project_item = require('./models/project_item')
    var job_content_template = require('./models/job_content_template')
    var upload_content_template = require('./models/upload_content_template')
    var buliding = require('./models/buliding')

    Promise.all([
        user.sync({ force: true }),
        role.sync({ force: true }),
        user_role.sync({ force: true }),
        permission.sync({ force: true }),
        role_permission.sync({ force: true }),
        property_management_co.sync({ force: true }),
        staff.sync({ force: true }),
        project_manager.sync({ force: true }),
        project_type.sync({ force: true }),
        project_item.sync({ force: true }),
        job_content_template.sync({ force: true }),
        upload_content_template.sync({ force: true }),
        buliding.sync({ force: true })
    ]).then(function() {
        return Promise.all([
            user.create({ account: 'admin', password: "admin" }),
            role.create({ code: "admin", name: "admin" }),
            user_role.create({ user_account: "admin", role_code: "admin" }),
            permission.create({ code: "admin", name: "admin" }),
            role_permission.create({ role_code: "admin", permission_code: "admin" })
        ])
    }).then(function() {
        res.send("success")
    })
}