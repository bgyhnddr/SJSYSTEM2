var checkProjectPaying = (id) => {
    return Promise.resolve().then(function() {
        var project = require('../../db/models/project')
        var project_state = require('../../db/models/project_state')

        project.hasOne(project_state)

        return project.findOne({
            include: project_state,
            where: {
                id: id
            }
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("project not found")
            } else {
                if (result.project_state.state == "paying") {
                    return "OK"
                } else {
                    return Promise.reject("not allow")
                }
            }
        })
    })
}

var exec = {
    submitCheck(req, res, next) {
        var project_invoice = require("../../db/models/project_invoice")

        var moment = require('moment')


        return checkProjectPaying(req.body.project_id).then(() => {
            return project_invoice.findOne({
                where: {
                    id: req.body.id
                }
            })
        }).then((result) => {
            if (result != null) {
                result.check_date = moment().format("YYYY-MM-DD")
                result.check_no = req.body.check_no
                result.check_money = req.body.check_money
                result.attachment_id = req.body.attachment_id
                return result.save()
            } else {
                return Promise.reject("not found")
            }
        }).then(() => {
            return "success"
        })
    },
    savePODetailCheckNo(req, res, next) {
        var po_quotation_detail = require("../../db/models/po_quotation_detail")
        return po_quotation_detail.update({
            check_no: req.body.check_no
        }, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            return "success"
        })
    },
    savePODetailCheck(req, res, next) {
        var po_quotation_detail = require("../../db/models/po_quotation_detail")
        return po_quotation_detail.update({
            attachment_id: req.body.attachment_id
        }, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            return "success"
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