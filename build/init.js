Promise.all([
    require('../src/db/models/user'),
    require('../src/db/models/role'),
    require('../src/db/models/permission'),
    require('../src/db/models/user_role'),
    require('../src/db/models/role_permission'),
    require('../src/db/models/property_management_co'),
    require('../src/db/models/staff'),
    require('../src/db/models/job_content_template'),
    require('../src/db/models/upload_content_template'),
    require('../src/db/models/building'),
    require('../src/db/models/out_source_contractor'),
    require('../src/db/models/project'),
    require('../src/db/models/project_contract'),
    require('../src/db/models/project_type'),
    require('../src/db/models/project_item'),
    require('../src/db/models/project_state'),
    require('../src/db/models/project_setting'),
    require('../src/db/models/project_record'),
    require('../src/db/models/quotation'),
    require('../src/db/models/quotation_job'),
    require('../src/db/models/quotation_version'),
    require('../src/db/models/serial_number'),
    require('../src/db/models/attachment'),
    require('../src/db/models/file'),
    require('../src/db/models/project_attachment'),
    require('../src/db/models/project_hour'),
    require('../src/db/models/project_out_source'),
    require('../src/db/models/project_accounting'),
    require('../src/db/models/project_invoice'),
    require('../src/db/models/project_invoice_detail'),
    require('../src/db/models/po'),
    require('../src/db/models/po_payee'),
    require('../src/db/models/po_quotation'),
    require('../src/db/models/po_quotation_detail'),
    require('../src/db/models/po_quotation_detail_attachment'),
    require('../src/db/models/po_quotation_approve'),
    require('../src/db/models/comments_text'),
    require('../src/db/models/invoice_comments_text'),
    require('../src/db/models/invoice_snapshot')
].map((o) => o.sync({ force: true }))).then(function() {
    return require('../src/db/init_data')()
}).then(function() {
    console.log("success")
}).catch(function(err) {
    console.log(err)
})
