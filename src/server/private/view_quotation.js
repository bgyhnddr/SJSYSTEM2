var getState = (state) => {
    switch (state) {
        case 'draft':
            return "草稿"
        case "wait_approve":
            return "等待確認"
        case "wait_approve_boss":
            return "等待BOSS確認"
        case "wait_contract":
            return "等待合同"
        case "quotation_contract":
            return "已報價工程"
        case "working":
            return "施工中"
        case "counting":
            return "已完成工程"
        default:
            return "已完成工程"
    }
}

var getProjectSetting = () => {
    var project_setting = require('../../db/models/project_setting')
    return project_setting.findAll().then((result) => {
        var returnObj = {
            totalprofit: "0",
            profitability: "20"
        }
        if (result.length != 0) {
            result.forEach((o) => {
                returnObj[o.code] = o.value
            })
        }
        return returnObj
    })
}

var exec = {
    getQuotation(req, res, next) {
        var no = req.query.no
        if (no) {
            var quotation = require('../../db/models/quotation')
            var project = require('../../db/models/project')
            var project_state = require('../../db/models/project_state')
            quotation.belongsTo(project)
            project.hasOne(project_state)

            return quotation.findOne({
                include: {
                    model: project,
                    include: project_state
                },
                where: { no: no }
            }).then(function(result) {
                if (result == null) {
                    return Promise.reject("沒有找到報價單")
                } else {
                    return result
                }
            })
        } else {
            return Promise.reject("沒有找到報價單")
        }
    },
    getProject(req, res, next) {
        var id = req.query.id
        if (id) {
            var project = require('../../db/models/project')
            var project_state = require('../../db/models/project_state')
            var quotation = require('../../db/models/quotation')

            project.hasOne(project_state)
            project.belongsTo(quotation)

            return project.findOne({
                include: [project_state, quotation],
                where: { id: id }
            }).then(function(result) {
                if (result == null) {
                    return Promise.reject("沒有找到工程")
                } else {
                    return result
                }
            })
        } else {
            return Promise.reject("沒有找到工程")
        }
    },
    getQuotationJobs(req, res, next) {
        var quotation_job = require('../../db/models/quotation_job')
        var quotationNo = req.query.quotationNo
        if (quotationNo) {
            return quotation_job.findAll({
                where: {
                    quotation_no: quotationNo
                },
                order: ['index']
            }).then(function(result) {
                return {
                    end: true,
                    list: result
                }
            })
        } else {
            Promise.reject("no qno")
        }
    },
    getBuilding(req, res, next) {
        var building = require('../../db/models/building')

        var id = req.query.id == undefined ? "" : req.query.id

        if (id) {
            return building.findOne({
                where: {
                    id: id
                }
            }).then((result) => {
                if (result == null) {
                    return Promise.reject("not found")
                } else {
                    return result
                }
            })
        } else {
            return Promise.reject("not found")
        }
    },
    getProfitSetting(req, res, next) {
        return getProjectSetting()
    },
    getProjectConfirmInfo(req, res, next) {
        var id = req.query.id
        if (id) {
            var project_setting = require('../../db/models/project_setting')
            var project = require('../../db/models/project')
            var quotation = require('../../db/models/quotation')
            var quotation_job = require('../../db/models/quotation_job')

            project.belongsTo(quotation)
            quotation.hasMany(quotation_job)

            return Promise.all([
                project_setting.findAll(),
                project.findOne({
                    include: [{
                        model: quotation,
                        include: quotation_job
                    }],
                    where: {
                        id: id
                    }
                })
            ]).then((result) => {
                var settingObj = {}
                result[0].forEach(o => settingObj[o.code] = parseInt(o.value))
                var totalRetail = result[1].quotation.quotation_jobs.reduce((sum, o) => {
                    return sum + o.retail * o.count
                }, 0)
                var totalCost = result[1].quotation.quotation_jobs.reduce((sum, o) => {
                    return sum + o.cost * o.count
                }, 0)
                var belowprofitability = settingObj.profitability > ((totalRetail - totalCost) / totalCost) * 100

                return {
                    settingObj,
                    totalRetail,
                    totalCost,
                    overtotalprofit: settingObj.totalprofit < totalCost,
                    belowprofitability,
                    quotation_no: result[1].quotation.no,
                    manager: result[1].quotation.manager
                }
            })
        } else {
            return Promise.reject("not found")
        }
    },
    getQuotationHistory(req, res, next) {
        var id = req.query.id
        if (id) {
            var quotation = require('../../db/models/quotation')

            return quotation.findAll({
                where: {
                    project_id: id
                },
                order: ["id"]
            })
        }
    },
    getAttachment(req, res, next) {
        var id = req.query.id
        if (id) {
            var fs = require('fs')
            var file = require('../../db/models/file')
            var attachment = require('../../db/models/attachment')
            attachment.belongsTo(file)
            attachment.findOne({
                include: file,
                where: {
                    id: id
                }
            }).then((result) => {
                if (result != null) {
                    var localFile = fs.readFileSync("upload/files/" + result.file_hash, 'binary')
                    res.setHeader('Content-disposition', 'inline; filename=' + encodeURIComponent(result.name))
                    res.setHeader('Content-Type', result.file.type)
                    res.setHeader('Content-Length', result.file.size)
                    res.write(localFile, 'binary')
                    res.end()
                } else {
                    return Promise.reject("no file record")
                }
            })
        } else {
            return Promise.reject("no file id")
        }
    },
    getProjectContract(req, res, next) {
        var id = req.query.id
        if (id) {
            var attachment = require('../../db/models/attachment')
            var project_contract = require('../../db/models/project_contract')
            project_contract.belongsTo(attachment)
            return project_contract.findOne({
                include: attachment,
                where: {
                    project_id: id
                }
            }).then((result) => {
                if (result == null) {
                    return {
                        id: "",
                        name: ""
                    }
                } else {
                    return {
                        id: result.attachment_id,
                        name: result.attachment ? result.attachment.name : ""
                    }
                }
            })
        } else {
            return Promise.reject("no projectId")
        }
    },
    getProjectAttachments(req, res, next) {
        var id = req.query.id
        var project = require('../../db/models/project')
        var project_attachment = require('../../db/models/project_attachment')
        var attachment = require('../../db/models/attachment')
        project_attachment.belongsTo(project)
        project_attachment.belongsTo(attachment)
        return project_attachment.findAll({
            include: [{
                model: project,
                where: {
                    id: id
                }
            }, attachment],
            order: ['index']
        })
    },
    getProjectHours(req, res, next) {
        var id = req.query.id
        var project = require('../../db/models/project')
        var project_hour = require('../../db/models/project_hour')
        project_hour.belongsTo(project)
        return project_hour.findAll({
            include: [{
                model: project,
                where: {
                    id: id
                }
            }]
        })
    },
    getProjectOutSources(req, res, next) {
        var id = req.query.id
        var project = require('../../db/models/project')
        var project_out_source = require('../../db/models/project_out_source')
        var attachment = require('../../db/models/attachment')
        project_out_source.belongsTo(project)
        project_out_source.belongsTo(attachment)
        return project_out_source.findAll({
            include: [{
                model: project,
                where: {
                    id: id
                }
            }, attachment]
        })
    },
    getProjectAccounting(req, res, next) {
        var project_accounting = require('../../db/models/project_accounting')
        return project_accounting.findOne({
            where: {
                project_id: req.query.project_id
            }
        }).then((result) => {
            if (result != null) {
                return result
            } else {
                return {
                    ecost: 0,
                    acost: 0,
                    income: 0,
                    project_id: req.query.project_id
                }
            }
        })
    },
    saveProjectAcounting(req, res, next) {
        var project_accounting = require('../../db/models/project_accounting')
        var project = require('../../db/models/project')
        var project_state = require('../../db/models/project_state')

        project.hasOne(project_state)
        project.hasOne(project_accounting)
        req.session.userInfo.permissions.some(o => o == "boss" || o == "admin")
        return project.findOne({
            include: [project_accounting, project_state],
            where: {
                id: req.body.project_id
            }
        }).then((result) => {
            if (result != null) {
                return result
            } else {
                return Promise.reject("not found")
            }
        }).then((result) => {
            if (result.project_state.state == "counting" ||
                req.session.userInfo.permissions.some(o => o == "boss" || o == "admin")) {
                return result
            } else {
                return Promise.reject("not allow")
            }
        }).then((result) => {
            return project_accounting.upsert(req.body)
        })
    },
    confirmProjectAcounting(req, res, next) {
        var id = req.body.id
        var common = require('../common')
        var project_state = require('../../db/models/project_state')
        var project = require('../../db/models/project')

        project.hasOne(project_state)

        return project.findOne({
            include: project_state,
            where: {
                id: id
            }
        }).then((result) => {
            if (result != null) {
                return result
            } else {
                return Promise.reject("project not found")
            }
        }).then((result) => {
            if (result.project_state.state != "counting") {
                return Promise.reject("not allow")
            } else {
                result.project_state.state = "paying"
                return result.project_state.save().then(() => {
                    return result
                })
            }
        }).then((result) => {
            common.log_project_record("view_quotation/endWork", result.id, req.session.userInfo.name)
            return "success"
        })
    },
    getProjectInvoices(req, res, next) {
        var id = req.body.id
        var project = require('../../db/models/project')

        var project_invoice = require('../../db/models/project_invoice')
        var project_invoice_detail = require('../../db/models/project_invoice_detail')
        var quotation_job = require('../../db/models/quotation_job')
        var attachment = require('../../db/models/attachment')

        project_invoice.belongsTo(project)
        project_invoice.belongsTo(attachment)
        project_invoice.hasMany(project_invoice_detail)
        project_invoice_detail.belongsTo(quotation_job)

        return project_invoice.findAll({
            include: [{
                model: project_invoice_detail,
                include: quotation_job
            }, {
                model: project,
                where: {
                    id: req.query.id
                }
            }, attachment]
        }).then((result) => {
            return result.map((obj) => {
                var o = obj.toJSON()
                o.invoice_money = o.project_invoice_details.reduce((sum, item) => {
                    if (item.quotation_job != null) {
                        var fnum = parseInt(item.quotation_job.retail * item.quotation_job.count)
                        return sum + (fnum ? fnum : 0)
                    } else {
                        return sum
                    }
                }, 0)

                if (o.attachment == null) {
                    o.attachment = {
                        id: 0,
                        name: ""
                    }
                }
                return o
            })
        })
    },
    getProjects(req, res, next) {
        var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
        var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
        var page = req.query.page == undefined ? 0 : parseInt(req.query.page)
        var type = req.query.type

        var project = require('../../db/models/project')
        var project_state = require('../../db/models/project_state')
        var quotation = require('../../db/models/quotation')
        var quotation_job = require('../../db/models/quotation_job')
        var building = require('../../db/models/building')
        var project_setting = require('../../db/models/project_setting')

        project.hasOne(project_state)
        project.belongsTo(quotation)
        quotation.belongsTo(building)
        quotation.hasMany(quotation_job)

        // return exec.getProjectConfirmInfo(req).then((confirmInfo) => {

        // })

        var where = undefined
        if (filterKey) {
            where = {
                $or: [{
                        quotation_no: {
                            $like: "%" + filterKey + "%"
                        }
                    }, {
                        '$quotation.project_name$': {
                            $like: "%" + filterKey + "%"
                        }
                    },
                    {
                        '$quotation.building.name$': {
                            $like: "%" + filterKey + "%"
                        }
                    },
                    {
                        '$quotation.property_management_co_name$': {
                            $like: "%" + filterKey + "%"
                        }
                    },
                    {
                        '$quotation.manager$': {
                            $like: "%" + filterKey + "%"
                        }
                    },
                    {
                        '$quotation.project_type$': {
                            $like: "%" + filterKey + "%"
                        }
                    }
                ]
            }
        }

        return Promise.resolve().then(() => {
            switch (type) {
                case "draft":
                    return Promise.all([project.findAll({
                        include: [{
                            model: project_state,
                            where: {
                                state: "draft"
                            }
                        }, {
                            model: quotation,
                            include: building
                        }],
                        where: where,
                        offset: page * count,
                        limit: count,
                        order: 'project.id DESC'
                    }), project.count({
                        include: [{
                            model: project_state,
                            where: {
                                state: "draft"
                            }
                        }, {
                            model: quotation,
                            include: building
                        }],
                        where: where,
                        offset: page * count,
                        limit: count
                    })])
                case 'wait_approve':
                    return getProjectSetting().then((settingObj) => {
                        return project.findAll({
                            include: [{
                                model: project_state,
                                where: {
                                    state: "quotation_save"
                                }
                            }, {
                                model: quotation,
                                include: [building, quotation_job]
                            }],
                            order: 'project.id DESC'
                        }).then((result) => {
                            var list = result.map((o) => {
                                var obj = o.toJSON()
                                obj.project_state.state = 'wait_approve'
                                return obj
                            })
                            list = list.filter((pj) => {
                                var totalRetail = pj.quotation.quotation_jobs.reduce((sum, o) => {
                                    return sum + o.retail * o.count
                                }, 0)
                                var totalCost = pj.quotation.quotation_jobs.reduce((sum, o) => {
                                    return sum + o.cost * o.count
                                }, 0)
                                var belowprofitability = settingObj.profitability > ((totalRetail - totalCost) / totalCost) * 100
                                var overtotalprofit = settingObj.totalprofit < totalCost
                                var needboss = belowprofitability || overtotalprofit
                                if (pj.project_state.boss_approve) {
                                    return false
                                } else {
                                    return !pj.project_state.manager_approve && !needboss
                                }
                            })
                            if (filterKey) {
                                list = list.filter((pj) => {
                                    return pj.quotation_no.indexOf(filterKey) >= 0 ||
                                        pj.quotation.project_name.indexOf(filterKey) >= 0 ||
                                        pj.quotation.building.name.indexOf(filterKey) >= 0 ||
                                        pj.quotation.property_management_co_name.indexOf(filterKey) >= 0 ||
                                        pj.quotation.manager.indexOf(filterKey) >= 0 ||
                                        pj.quotation.project_type.indexOf(filterKey) >= 0
                                })
                            }

                            return [list, list.length]
                        })
                    })
                case 'wait_approve_boss':
                    return getProjectSetting().then((settingObj) => {
                        return project.findAll({
                            include: [{
                                model: project_state,
                                where: {
                                    state: "quotation_save"
                                }
                            }, {
                                model: quotation,
                                include: [building, quotation_job]
                            }],
                            order: 'project.id DESC'
                        }).then((result) => {
                            var list = result.map((o) => {
                                var obj = o.toJSON()
                                obj.project_state.state = 'wait_approve'
                                return obj
                            })
                            list = list.filter((pj) => {
                                var totalRetail = pj.quotation.quotation_jobs.reduce((sum, o) => {
                                    return sum + o.retail * o.count
                                }, 0)
                                var totalCost = pj.quotation.quotation_jobs.reduce((sum, o) => {
                                    return sum + o.cost * o.count
                                }, 0)
                                var belowprofitability = settingObj.profitability > ((totalRetail - totalCost) / totalCost) * 100
                                var overtotalprofit = settingObj.totalprofit < totalCost
                                var needboss = belowprofitability || overtotalprofit
                                return !pj.project_state.boss_approve && needboss
                            })
                            if (filterKey) {
                                list = list.filter((pj) => {
                                    return pj.quotation_no.indexOf(filterKey) >= 0 ||
                                        pj.quotation.project_name.indexOf(filterKey) >= 0 ||
                                        pj.quotation.building.name.indexOf(filterKey) >= 0 ||
                                        pj.quotation.property_management_co_name.indexOf(filterKey) >= 0 ||
                                        pj.quotation.manager.indexOf(filterKey) >= 0 ||
                                        pj.quotation.project_type.indexOf(filterKey) >= 0
                                })
                            }

                            return [list, list.length]
                        })
                    })
                case 'wait_contract':
                    return getProjectSetting().then((settingObj) => {
                        return project.findAll({
                            include: [{
                                model: project_state,
                                where: {
                                    state: "quotation_save"
                                }
                            }, {
                                model: quotation,
                                include: [building, quotation_job]
                            }],
                            order: 'project.id DESC'
                        }).then((result) => {
                            var list = result.map((o) => {
                                var obj = o.toJSON()
                                obj.project_state.state = 'wait_contract'
                                return obj
                            })
                            list = list.filter((pj) => {
                                var totalRetail = pj.quotation.quotation_jobs.reduce((sum, o) => {
                                    return sum + o.retail * o.count
                                }, 0)
                                var totalCost = pj.quotation.quotation_jobs.reduce((sum, o) => {
                                    return sum + o.cost * o.count
                                }, 0)
                                var belowprofitability = settingObj.profitability > ((totalRetail - totalCost) / totalCost) * 100
                                var overtotalprofit = settingObj.totalprofit < totalCost
                                var needboss = belowprofitability || overtotalprofit
                                return pj.project_state.boss_approve || (!needboss && pj.manager_approve)
                            })
                            if (filterKey) {
                                list = list.filter((pj) => {
                                    return pj.quotation_no.indexOf(filterKey) >= 0 ||
                                        pj.quotation.project_name.indexOf(filterKey) >= 0 ||
                                        pj.quotation.building.name.indexOf(filterKey) >= 0 ||
                                        pj.quotation.property_management_co_name.indexOf(filterKey) >= 0 ||
                                        pj.quotation.manager.indexOf(filterKey) >= 0 ||
                                        pj.quotation.project_type.indexOf(filterKey) >= 0
                                })
                            }

                            return [list, list.length]
                        })
                    })
                case "quotation_contract":
                    return Promise.all([project.findAll({
                        include: [{
                            model: project_state,
                            where: {
                                state: "quotation_contract"
                            }
                        }, {
                            model: quotation,
                            include: building
                        }],
                        where: where,
                        offset: page * count,
                        limit: count,
                        order: 'project.id DESC'
                    }), project.count({
                        include: [{
                            model: project_state,
                            where: {
                                state: "quotation_contract"
                            }
                        }, {
                            model: quotation,
                            include: building
                        }],
                        where: where,
                        offset: page * count,
                        limit: count
                    })])
                case "working":
                    return Promise.all([project.findAll({
                        include: [{
                            model: project_state,
                            where: {
                                state: "working"
                            }
                        }, {
                            model: quotation,
                            include: building
                        }],
                        where: where,
                        offset: page * count,
                        limit: count,
                        order: 'project.id DESC'
                    }), project.count({
                        include: [{
                            model: project_state,
                            where: {
                                state: "working"
                            }
                        }],
                        where: where,
                        offset: page * count,
                        limit: count
                    })])
                case "counting":
                    return Promise.all([project.findAll({
                        include: [{
                            model: project_state,
                            where: {
                                $or: [{
                                        state: "counting"
                                    },
                                    { state: "paying" }
                                ]
                            }
                        }, {
                            model: quotation,
                            include: building
                        }],
                        where: where,
                        offset: page * count,
                        limit: count,
                        order: 'project.id DESC'
                    }), project.count({
                        include: [{
                            model: project_state,
                            where: {
                                $or: [{
                                        state: "counting"
                                    },
                                    { state: "paying" }
                                ]
                            }
                        }],
                        where: where,
                        offset: page * count,
                        limit: count
                    })])
                default:
                    return Promise.all([project.findAll({
                        include: [{
                            model: project_state
                        }, {
                            model: quotation,
                            include: [building, quotation_job]
                        }],
                        where: where,
                        offset: page * count,
                        limit: count,
                        order: 'project.id DESC'
                    }), project.count({
                        where: where,
                        offset: page * count,
                        limit: count
                    })]).then((result) => {
                        return getProjectSetting().then((settingObj) => {
                            var list = result[0].map((o) => {
                                var pj = o.toJSON()
                                if (pj.project_state.state == "quotation_save") {
                                    var totalRetail = pj.quotation.quotation_jobs.reduce((sum, o) => {
                                        return sum + o.retail * o.count
                                    }, 0)
                                    var totalCost = pj.quotation.quotation_jobs.reduce((sum, o) => {
                                        return sum + o.cost * o.count
                                    }, 0)
                                    var belowprofitability = settingObj.profitability > ((totalRetail - totalCost) / totalCost) * 100
                                    var overtotalprofit = settingObj.totalprofit < totalCost
                                    var needboss = belowprofitability || overtotalprofit

                                    if (pj.project_state.boss_approve) {
                                        pj.project_state.state = "wait_contract"
                                    } else {
                                        if (needboss) {
                                            pj.project_state.state = "wait_approve_boss"
                                        } else {
                                            pj.project_state.state = pj.project_state.manager_approve ? "wait_contract" : "wait_approve"
                                        }
                                    }

                                }
                                return pj
                            })
                            return [list, result[1]]
                        })
                    })
            }
        }).then((result) => {
            var list = result[0].map((o) => {
                return {
                    id: o.id,
                    quotation_no: o.quotation_no,
                    property_management_co_name: o.quotation.property_management_co_name,
                    building_name: o.quotation.building == null ? "" : o.quotation.building.name,
                    project_name: o.quotation.project_name,
                    project_type: o.quotation.project_type,
                    state: getState(o.project_state.state),
                    manager: o.manager
                }
            })
            var rowCount = result[1]
            return {
                end: (list.length + page * count) >= rowCount,
                list: list
            }
        })
    }
}

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        return exec[result](req, res, next)
    }).then(function(result) {
        if (req.params.action != "getAttachment") {
            res.send(result)
        }
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}