var exec = {
    confirmQuotation(req, res, next) {
        var id = req.body.id
        if (id) {
            var project = require('../../db/models/project')
            var project_state = require('../../db/models/project_state')
            var quotation = require('../../db/models/quotation')
            var common = require('../common')

            project.hasOne(project_state)
            project.hasOne(quotation)

            return project.findOne({
                include: [project_state, quotation],
                where: {
                    id: id
                }
            }).then((result) => {
                if (result != null) {
                    var account = req.session.userInfo.name
                    if (result.project_state.state != "quotation_save") {
                        return Promise.reject("not allow")
                    } else {
                        result.project_state.boss_approve = true
                        return result.project_state.save().then(() => {
                            console.log(result.quotation.no)
                            return result.quotation.no
                        })
                    }
                } else {
                    return Promise.reject("not found")
                }
            }).then((no) => {
                return common.log_project_record("confirm_quotation_boss/confirmQuotation", no, req.session.userInfo.name)
            })
        } else {
            return Promise.reject("not found")
        }
    },
    submitConfirmInfo(req, res, next) {
        var project_setting = require('../../db/models/project_setting')
        return Promise.all([
            project_setting.upsert({
                code: "totalprofit",
                value: req.body.totalprofit
            }),
            project_setting.upsert({
                code: "profitability",
                value: req.body.profitability
            })
        ])
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