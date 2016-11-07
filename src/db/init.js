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
        require('./models/job_content_template'),
        require('./models/upload_content_template'),
        require('./models/building'),
        require('./models/out_source_contractor'),
        require('./models/project'),
        require('./models/project_contract'),
        require('./models/project_type'),
        require('./models/project_item'),
        require('./models/project_state'),
        require('./models/project_setting'),
        require('./models/project_record'),
        require('./models/quotation'),
        require('./models/quotation_job'),
        require('./models/quotation_version'),
        require('./models/serial_number'),
        require('./models/attachment'),
        require('./models/file'),
        require('./models/project_attachment'),
        require('./models/project_hour'),
        require('./models/project_out_source'),
        require('./models/project_accounting'),
        require('./models/project_invoice'),
        require('./models/project_invoice_detail')
    ].map((o) => o.sync({ force: true }))).then(function() {
        return require('./init_data')()
    }).then(function() {
        res.send("success")
    }).catch(function(err) {
        res.send(err)
    })
}