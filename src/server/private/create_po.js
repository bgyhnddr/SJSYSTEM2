var exec = {
    submitPO(req, res, next) {
        var po = require("../../db/models/po")
        var common = require("../common")
        return Promise.resolve().then(() => {
            if (!req.body.no) {
                return common.generate_serial_no("PO").then((gno) => {
                    req.body.no = gno
                    return "OK"
                })
            }
            return "OK"
        }).then(() => {
            var obj = {
                id: req.body.id,
                no: req.body.no,
                date: req.body.date,
                prepared_by: req.body.prepared_by,
                comments: req.body.comments
            }
            if (!obj.id) {
                obj.state = "draft"
            }
            return po.upsert(obj).then(() => {
                return po.find({
                    where: {
                        no: req.body.no
                    }
                })
            })
        })
    },
    addQuotation(req, res, next) {
        var po_quotation = require("../../db/models/po_quotation")
        var quotation = require("../../db/models/quotation")
        var project = require("../../db/models/project")
        var project_state = require("../../db/models/project_state")

        quotation.hasOne(project)

        return quotation.findOne({
            include: {
                model: project,
                include: project_state
            },
            where: {
                no: req.body.quotation_no
            }
        }).then((result) => {
            if (result != null) {
                return result
            } else {
                return Promise.reject("no quotation")
            }
        }).then((result) => {
            if (result.project != null &&
                result.project.project_state.state != "draft" &&
                result.project.project_state.state != "quotation_save") {
                return true
            } else {
                return Promise.reject("not right quotation")
            }
        }).then(() => {
            return po_quotation.findOne({
                where: {
                    po_id: req.body.po_id,
                    quotation_no: req.body.quotation_no
                }
            }).then((result) => {
                if (result != null) {
                    return "already have"
                } else {
                    return po_quotation.create(req.body)
                }
            })
        })
    },
    submitPODetail(req, res, next) {
        var po_quotation_detail = require("../../db/models/po_quotation_detail")
        var po_payee = require("../../db/models/po_payee")

        return po_quotation_detail.upsert(req.body).then(() => {
            po_payee.upsert({ name: req.body.po_payee_name })
        })
    },
    deletePODetail(req, res, next) {
        var po_quotation_detail = require("../../db/models/po_quotation_detail")
        return po_quotation_detail.destroy({
            where: {
                id: req.body.id
            }
        }).then(() => {
            return "success"
        })
    },
    uploadPODetailAttachment(req, res, next) {
        var po_quotation_detail_attachment = require("../../db/models/po_quotation_detail_attachment")
        return po_quotation_detail_attachment.create({
            po_quotation_detail_id: req.body.po_quotation_detail_id,
            attachment_id: req.body.attachment_id
        })
    },
    deletePODetailAttachment(req, res, next) {
        var po_quotation_detail_attachment = require("../../db/models/po_quotation_detail_attachment")
        return po_quotation_detail_attachment.destroy({
            where: {
                id: req.body.id
            }
        }).then(() => {
            return "success"
        })
    },
    finishPO(req, res, next) {
        var po = require("../../db/models/po")
        var po_quotation = require("../../db/models/po_quotation")
        var po_quotation_approve = require("../../db/models/po_quotation_approve")
        po.hasMany(po_quotation)

        return po.findOne({
            include: po_quotation,
            where: {
                id: req.body.id,
                state: "draft"
            }
        }).then((result) => {
            if (result != null) {
                return result
            } else {
                return Promise.reject("not found")
            }
        }).then((result) => {
            var updateList = result.po_quotations.map(o => {
                return po_quotation_approve.upsert({
                    po_quotation_id: o.id,
                    manager_approve: false,
                    boss_approve: false
                })
            })
            result.state = "done"
            updateList.push(result.save())

            return Promise.all(updateList)
        })
    }
}

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        try {
            return exec[result](req, res, next)
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}