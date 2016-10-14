var user = require('./models/user')
var role = require('./models/role')
var permission = require('./models/permission')
var user_role = require('./models/user_role')
var role_permission = require('./models/role_permission')

module.exports = function() {
    return Promise.all([
        user.create({ account: 'admin', password: "admin" }),
        role.create({ code: "admin", name: "admin" }),
        user_role.create({ user_account: "admin", role_code: "admin" }),
        permission.create({ code: "admin", name: "admin" }),
        role_permission.create({ role_code: "admin", permission_code: "admin" }),
        role.create({ code: "boss", name: "boss" }),
        role.create({ code: "accountant", name: "accountant" }),
        role.create({ code: "PIC", name: "PIC" }),
        role.create({ code: "operator", name: "operator" }),
        permission.create({ code: "create_quotation", name: "創建報價單" }),
        permission.create({ code: "confirm_quotation", name: "確認報價單" }),
        permission.create({ code: "approve_quotation", name: "核准報價單" }),
        permission.create({ code: "edit_quotation", name: "修改報價單" }),
        permission.create({ code: "view_quotation", name: "查閱報價單" }),
        permission.create({ code: "workhour_and_outsource", name: "工時/外判錄入" }),
        permission.create({ code: "invoice", name: "開具發票" }),
        permission.create({ code: "check", name: "支票錄入" }),
        permission.create({ code: "create_po", name: "創建PO" }),
        permission.create({ code: "confirm_po", name: "確認PO" }),
        permission.create({ code: "approve_po", name: "核准PO" }),
        permission.create({ code: "view_po", name: "查閱PO" }),
        permission.create({ code: "moneylog", name: "付款記錄" })
    ])
}