var exec = {
    getPayees(req, res, next) {
        var po_payee = require("../../db/models/po_payee")
        return po_payee.findAll().then((result) => {
            return result.map(o => o.name)
        })
    },
    getPO(req, res, next) {
        var po = require("../../db/models/po")
        return po.findOne({
            where: {
                id: req.query.id
            }
        }).then((result) => {
            if (result != null) {
                return result
            } else {
                return Promise.reject("not found")
            }
        })
    },
    getQuotations(req, res, next) {
        var project = require("../../db/models/project")
        var project_state = require("../../db/models/project_state")
        project.hasOne(project_state)
        return project.findAll({
            include: {
                model: project_state,
                where: {
                    state: {
                        $and: {
                            $ne: "draft",
                            $ne: "quotation_save"
                        }
                    }
                }
            }
        }).then((result) => {
            return result.map(o => o.quotation_no)
        })
    },
    getPODetail(req, res, next) {
        var po = require("../../db/models/po")
        var po_quotation = require("../../db/models/po_quotation")
        var quotation = require("../../db/models/quotation")
        var quotation_job = require("../../db/models/quotation_job")
        var po_quotation_detail = require("../../db/models/po_quotation_detail")
        var po_quotation_detail_attachment = require("../../db/models/po_quotation_detail_attachment")
        var project = require("../../db/models/project")
        var project_accounting = require("../../db/models/project_accounting")
        var attachment = require("../../db/models/attachment")

        po_quotation.belongsTo(po)
        po_quotation.belongsTo(quotation)
        po_quotation.hasMany(po_quotation_detail)
        po_quotation_detail.hasMany(po_quotation_detail_attachment)

        po_quotation_detail.belongsTo(attachment)
        po_quotation_detail_attachment.belongsTo(attachment)

        quotation.hasMany(quotation_job)
        quotation.hasOne(project)
        project.hasOne(project_accounting)

        quotation.hasMany(po_quotation)

        return po_quotation.findAll({
            include: [{
                model: quotation,
                include: [quotation_job, {
                    model: po_quotation,
                    include: [po_quotation_detail, po]
                }, {
                    model: project,
                    include: project_accounting
                }]
            }, {
                model: po_quotation_detail,
                include: [attachment, {
                    model: po_quotation_detail_attachment,
                    include: attachment
                }]
            }],
            where: {
                po_id: req.query.po_id
            }
        }).then((result) => {
            return result.map(o => o.toJSON())
        }).then((result) => {
            return result.map((poDetail) => {
                var ecost = poDetail.quotation.project.project_accounting.ecost

                var used = poDetail.quotation.po_quotations.reduce((sum, poq) => {
                    if (po.state != "draft" || po.id == req.query.po_id) {
                        return sum + poq.po_quotation_details.reduce((lsum, d) => {
                            return lsum + d.price * d.count
                        }, 0)
                    } else {
                        return sum
                    }
                }, 0)

                poDetail.left = ecost - used
                return poDetail
            })
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