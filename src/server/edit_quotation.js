var editQuotation = function(req, res, next) {
    var no = req.body.no
    if (no) {
        var common = require('./common')
        var quotation = require('../db/models/quotation')
        var project = require('../db/models/project')
        var project_state = require('../db/models/project_state')
        var quotation_job = require('../db/models/quotation_job')
        var moment = require('moment')

        quotation.belongsTo(project)
        project.hasOne(project_state)
        quotation.hasMany(quotation_job)


        return quotation.findOne({
            include: [{
                model: project,
                include: [{
                    model: project_state,
                }]
            }, {
                model: quotation_job,
            }],
            where: {
                no: no
            }
        }).then(function(result) {
            if (result) {
                if (result.project.project_state.state != "quotation_save") {
                    return Promise.reject("not allow")
                } else {
                    return result
                }
            } else {
                return Promise.reject("not found")
            }
        }).then(function(result) {
            result.project.project_state.state = "draft"
            result.project.project_state.manager_approve = false
            result.project.project_state.boss_approve = false
            result.project.project_state.boss_edit = true
            return common.get_next_quotation_no(result.project.ori_quotation_no).then(function(qno) {
                var newQuotation = {}
                result.project.quotation_no = qno
                newQuotation.no = qno
                newQuotation.project_id = result.project_id
                newQuotation.project_item = result.project_item
                newQuotation.project_type = result.project_type
                newQuotation.property_management_co_name = result.property_management_co_name
                newQuotation.property_management_co_name_en = result.property_management_co_name_en
                newQuotation.project_name = result.project_name
                newQuotation.manager = result.manager
                newQuotation.quotation_date = moment().format("YYYY-MM-DD")
                newQuotation.building_id = result.building_id

                var newJobs = result.quotation_jobs.map((o) => {
                    return {
                        content: o.content,
                        cost: o.cost,
                        retail: o.retail,
                        count: o.count,
                        quotation_no: qno,
                        index: o.index
                    }
                })
                return Promise.all([
                    quotation_job.bulkCreate(newJobs),
                    quotation.create(newQuotation),
                    result.project.save(),
                    result.project.project_state.save()
                ]).then(function() {
                    return qno
                })
            })
        }).then(function(result) {
            common.log_project_record("edit_quotation/editQuotation", result, req.session.userInfo.name)
            return 'success'
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
                case "editQuotation":
                    return editQuotation(req, res, next)
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