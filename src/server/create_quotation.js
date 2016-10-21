var checkQuotationDraftAndActive = function(no) {
    return Promise.resolve().then(function() {
        var quotation = require('../db/models/quotation')
        var project = require('../db/models/project')
        var project_state = require('../db/models/project_state')

        quotation.belongsTo(project)
        project.hasOne(project_state)

        return quotation.findOne({
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
            if (result == null) {
                return Promise.reject("quotation not found")
            } else {
                if (result.project.project_state.state == "draft" && result.project.quotation_no == result.no) {
                    return "OK"
                } else {
                    return Promise.reject("該報價單不能進行此項操作")
                }
            }
        })
    })
}

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
                            console.log(serial_no + req.session.userInfo.name)
                            common.log_project_record("create_quotation/createQuotation", serial_no, req.session.userInfo.name)
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
        var project_item = require('../db/models/project_item')
        var job_content_template = require('../db/models/job_content_template')
        var quotation_job = require('../db/models/quotation_job')

        project_item.hasMany(job_content_template)
        project.hasOne(project_state)
        quotation.belongsTo(project)

        return checkQuotationDraftAndActive(no).then(function() {
            return quotation.findOne({
                include: [{
                    model: project,
                    include: [{
                        model: project_state,
                    }]
                }],
                where: {
                    no: no
                }
            })
        }).then(function(result) {
            if (result) {
                result.no = req.body.no
                result.property_management_co_name = req.body.property_management_co_name
                result.property_management_co_name_en = req.body.property_management_co_name_en
                result.project_name = req.body.project_name
                result.manager = req.body.manager
                if (result.project.project_state.boss_edit) {
                    result.quotation_date = new Date()
                }
                result.building_id = req.body.building_id
                return result
            } else {
                return Promise.reject("找不到報價單")
            }
        }).then(function(result) {
            if (result.project_item != req.body.project_item && req.body.project_item) {
                return quotation_job.destroy({
                    where: {
                        quotation_no: result.no
                    }
                }).then(function() {
                    return project_item.findOne({
                        include: [job_content_template]
                    })
                }).then(function(pi) {
                    if (pi) {
                        var createList = pi.job_content_templates.map((o) => {
                            return {
                                quotation_no: result.no,
                                index: o.index,
                                content: o.content
                            }
                        })
                        return quotation_job.bulkCreate(createList)
                    } else {
                        return "done"
                    }
                }).then(function() {
                    result.project_type = req.body.project_type
                    result.project_item = req.body.project_item
                    return result
                })
            } else {
                return result
            }
        }).then(function(result) {
            return result.save().then(function() {
                return "success"
            })
        })
    } else {
        return Promise.reject("沒有報價單號")
    }
}

var submitQuotationJob = function(req, res, next) {
    var quotation_job = require('../db/models/quotation_job')
    var quotation = require('../db/models/quotation')

    if (req.body.id) {
        return checkQuotationDraftAndActive(req.body.quotation_no).then(function() {
            return quotation_job.findOne({
                where: {
                    id: req.body.id
                }
            })
        }).then(function(result) {
            return result.update({
                content: req.body.content,
                cost: req.body.cost,
                retail: req.body.retail,
                count: req.body.count
            })
        }).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    } else {
        return quotation.findOne({
            where: {
                no: req.body.quotation_no
            }
        }).then(function(result) {
            return quotation_job.count({
                where: {
                    quotation_no: req.body.quotation_no
                }
            }).then(function(count) {
                return quotation_job.create({
                    content: req.body.content,
                    cost: req.body.cost,
                    retail: req.body.retail,
                    count: req.body.count,
                    quotation_no: req.body.quotation_no,
                    index: count + 1
                })
            })
        }).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            } else {
                if (error.name) {
                    return Promise.reject(error.name)
                } else {
                    return error
                }
            }
        })
    }
}

var deleteQuotationJob = function(req, res, next) {
    var quotation_job = require('../db/models/quotation_job')

    return quotation_job.findOne({
        where: {
            id: req.body.id
        }
    }).then(function(result) {
        return checkQuotationDraftAndActive(result.quotation_no)
    }).then(function() {
        quotation_job.destroy({
            where: {
                id: req.body.id
            }
        })
    }).then(function(result) {
        return "success"
    })
}

var upQuotationJob = function(req, res, next) {
    var quotation_job = require('../db/models/quotation_job')
    return quotation_job.findOne({
        where: { id: req.body.id }
    }).then((result) => {
        return quotation_job.findOne({
            where: {
                $and: {
                    index: {
                        $lt: result.index
                    },
                    quotation_no: result.quotation_no
                }
            },
            order: [
                ["index", "DESC"]
            ]
        }).then((o) => {
            return [o, result]
        })
    }).then(function(result) {
        if (result[0] != null) {
            var tempIndex = result[0].index
            result[0].index = result[1].index
            result[1].index = tempIndex

            return Promise.all([
                result[0].save(),
                result[1].save()
            ])
        } else {
            return "do nothing"
        }
    })
}

var downQuotationJob = function(req, res, next) {
    var quotation_job = require('../db/models/quotation_job')
    return quotation_job.findOne({
        where: { id: req.body.id }
    }).then((result) => {
        return quotation_job.findOne({
            where: {
                $and: {
                    index: {
                        $gt: result.index
                    },
                    quotation_no: result.quotation_no
                }
            },
            order: [
                ["index"]
            ]
        }).then((o) => {
            return [o, result]
        })
    }).then(function(result) {
        if (result[0] != null) {
            var tempIndex = result[0].index
            result[0].index = result[1].index
            result[1].index = tempIndex

            return Promise.all([
                result[0].save(),
                result[1].save()
            ])
        } else {
            return "do nothing"
        }
    })
}

var saveQuotation = function(req, res, next) {
    var no = req.body.no
    if (no) {
        var common = require('./common')
        var quotation = require('../db/models/quotation')
        var project = require('../db/models/project')
        var project_state = require('../db/models/project_state')
        var quotation_job = require('../db/models/quotation_job')

        quotation.belongsTo(project)
        project.hasOne(project_state)
        quotation.hasMany(quotation_job)


        return checkQuotationDraftAndActive(no).then(function() {
            return quotation.findOne({
                include: [{
                    model: project,
                    include: [{
                        model: project_state,
                    }]
                }, {
                    model: quotation_job
                }],
                where: {
                    no: no
                }
            })
        }).then(function(result) {
            if (result) {
                if (result.quotation_jobs.length == 0) {
                    return Promise.reject("至少需要添加一條工作内容")
                } else {
                    if (
                        result.no &&
                        result.property_management_co_name &&
                        result.property_management_co_name_en &&
                        result.project_name &&
                        result.manager &&
                        result.quotation_date &&
                        result.building_id &&
                        result.project_type &&
                        result.project_item) {
                        result.project.project_state.state = "quotation_save"
                        return Promise.all([result.save(), result.project.project_state.save()])
                    } else {
                        return Promise.reject("報價單信息不全無法完成")
                    }
                }

            } else {
                return Promise.reject("找不到報價單")
            }
        }).then(function(result) {
            common.log_project_record("create_quotation/saveQuotation", no, req.session.userInfo.name)
            return 'success'
        })
    } else {
        return Promise.reject("沒有報價單號")
    }
}

var editQuotation = function(req, res, next) {
    var no = req.body.no
    if (no) {
        var common = require('./common')
        var quotation = require('../db/models/quotation')
        var project = require('../db/models/project')
        var project_state = require('../db/models/project_state')
        var quotation_job = require('../db/models/quotation_job')

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
            result.project.project_state.boss_edit = false
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
                newQuotation.quotation_date = result.quotation_date
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
                case "createQuotation":
                    return createQuotation(req, res, next)
                case "saveDraft":
                    return saveDraft(req, res, next)
                case "submitQuotationJob":
                    return submitQuotationJob(req, res, next)
                case "deleteQuotationJob":
                    return deleteQuotationJob(req, res, next)
                case "upQuotationJob":
                    return upQuotationJob(req, res, next)
                case "downQuotationJob":
                    return downQuotationJob(req, res, next)
                case "saveQuotation":
                    return saveQuotation(req, res, next)
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