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

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        try {
            switch (result) {
                case "createQuotation":
                    return createQuotation(req, res, next)
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