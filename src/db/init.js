var Sequelize = require('sequelize')
module.exports = function(req, res, next) {
    Promise.all([
        require('./models/user'),
        require('./models/role'),
        require('./models/permission'),
        require('./models/user_role'),
        require('./models/role_permission'),
        require('./models/property_management_co'),
        require('./models/staff'),
        require('./models/project_manager'),
        require('./models/project_type'),
        require('./models/project_item'),
        require('./models/job_content_template'),
        require('./models/upload_content_template'),
        require('./models/building'),
        require('./models/out_source_contractor'),
        require('./models/project'),
        require('./models/quotation'),
        require('./models/quotation_content'),
        require('./models/quotation_version'),
        require('./models/serial_number')
    ].map((o) => o.sync({ force: true }))).then(function() {
        return require('./init_data')()
    }).then(function() {
        res.send("success")
    })
}