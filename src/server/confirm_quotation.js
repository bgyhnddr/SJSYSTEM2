var confirmQuotation = function(req, res, next) {
    var id = req.body.id
    if (id) {
        var project = require('../db/models/project')
        var project_state = require('../db/models/project_state')
        var quotation = require('../db/models/quotation')
        var common = require('./common')

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
                    if (account != result.quotation.manager) {
                        return Promise.reject("not manager of this quotation")
                    } else {
                        result.project_state.manager_approve = true
                        return result.project_state.save().then(() => {
                            return result.quotation.no
                        })
                    }
                }
            } else {
                Promise.reject("not found")
            }
        }).then((no) => {
            return common.log_project_record("confirm_quotation/confirmQuotation", no, req.session.userInfo.name)
        })
    } else {
        return Promise.reject("not found")
    }
}

var confirmContract = function(req, res, next) {
    var id = req.body.id
    if (id) {
        var project_setting = require('../db/models/project_setting')
        var project = require('../db/models/project')
        var project_state = require('../db/models/project_state')
        var quotation = require('../db/models/quotation')
        var quotation_job = require('../db/models/quotation_job')
        var common = require('./common')

        project.belongsTo(quotation)
        quotation.hasMany(quotation_job)

        return Promise.all([
            project_setting.findAll(),
            project.findOne({
                include: [{
                    model: quotation,
                    include: quotation_job
                }, {
                    model: project_state
                }],
                where: {
                    id: id
                }
            })
        ]).then((result) => {
            var settingObj = {}
            result[0].forEach(o => settingObj[o.code] = parseInt(o.value))
            var totalRetail = result[1].quotation.quotation_jobs.reduce((sum, o) => {
                return sum + o.retail
            }, 0)
            var totalCost = result[1].quotation.quotation_jobs.reduce((sum, o) => {
                return sum + o.cost
            }, 0)
            var belowprofitability = settingObj.profitability > ((totalRetail - totalCost) / totalCost) * 100

            var checkData = {
                settingObj,
                totalRetail,
                totalCost,
                overtotalprofit: settingObj.totalprofit < totalCost,
                belowprofitability,
                quotation_no: result[1].quotation.no,
                manager: result[1].quotation.manager
            }
            if (checkData.manager == req.session.userInfo.name || req.session.userInfo.permissions.some(o => o == "confirm_quotation_boss" || o == "admin")) {
                if ((checkData.belowprofitability || checkData.overtotalprofit)) {
                    if (result[1].project_state.boss_approve) {
                        return result[1]
                    } else {
                        Promise.reject("需要BOSS確認")
                    }
                } else {
                    if (result[1].project_state.boss_approve || result[1].project_state.manager_approve) {
                        return result[1]
                    } else {
                        Promise.reject("需要BOSS或PIC先確認報價單")
                    }
                }
            } else {
                return Promise.reject("not allow")
            }
        }).then((result) => {
            if (result.project_state.state != "quotation_save") {
                return Promise.reject("not allow")
            } else {
                result.project_state.state = "quotation_contract"
                return result.project_state.save()
            }
        }).then(() => {
            return common.log_project_record("confirm_quotation/confirmContract", id, req.session.userInfo.name)
        })
    } else {
        return Promise.reject("not found")
    }
}

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        try {
            switch (result) {
                case "confirmQuotation":
                    return confirmQuotation(req, res, next)
                case "confirmContract":
                    return confirmContract(req, res, next)
            }
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}