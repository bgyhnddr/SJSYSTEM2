var createQuotation = function(req, res, next) {
    var co_id = req.body.co_id
    if (co_id) {
        var property_management_co = require('../db/models/property_management_co')
        var project = require('../db/models/project')
        var project_state = require('../db/models/project_state')
        var quotation = require('../db/models/quotation')
        var common = require('./common')

        return property_management_co.findOne({
            where: { id: co_id }
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("沒有找到物業公司")
            } else {
                return common.generate_serial_no("Q").then(function(serial_no) {
                    return project.create({
                        quotation_no: serial_no,
                        ori_quotation_no: serial_no
                    }).then(function(project_result) {
                        return Promise.all([
                            quotation.create({
                                no: serial_no,
                                project_id: project_result.id,
                                property_management_co_name: result.name,
                                property_management_co_name_en: result.name_en
                            }),
                            project_state.upsert({
                                project_id: project_result.id,
                                state: "draft"
                            })
                        ]).then(function() {
                            return { project_id: project_result.id }
                        })
                    })
                })
            }
        })
    } else {
        return Promise.reject("沒有指定物業公司")
    }
}

var saveDraft = function(req, res, next) {
    var no = req.body.no
    if (no) {
        var common = require('./common')
        var quotation = require('../db/models/quotation')
        var project = require('../db/models/project')
        var project_state = require('../db/models/project_state')
        quotation.belongsTo(project)
        project.hasOne(project_state)

        quotation.findOne({
            include: [{
                model: project,
                include: [{
                    model: project_state,
                }]
            }],
            where: {
                no: no
            }
        }).then(function(result) {
            if (result) {
                return Promise.resolve(result)
            } else {
                return Promise.reject("找不到報價單")
            }
        }).then(function(result) {
            if (result.project &&
                result.project.quotation_no == result.no &&
                result.project.project_state.state == "draft") {
                return Promise.resolve(result)
            } else {
                return Promise.reject("不能保存這張報價單")
            }
        }).then(function(result) {
            result.no = req.body.no
            result.property_management_co_name = req.body.property_management_co_name
            result.property_management_co_name_en = req.body.property_management_co_name_en
            result.project_name = req.body.project_name
            result.manager = req.body.manager
            result.quotation_date = req.body.quotation_date
            result.building_id = req.body.building_id
            result.project_type = req.body.project_type
            result.project_item = req.body.project_item
            return result.save()
        })
    } else {
        return Promise.reject("沒有報價單號")
    }
}

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        try {
            switch (result) {
                case "createQuotation":
                    return createQuotation(req, res, next)
                case "saveDraft":
                    return saveDraft(req, res, next)
            }
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error)
    })
}