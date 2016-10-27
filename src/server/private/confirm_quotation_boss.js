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
        var project_setting = require('../../db/models/project_setting')
        var returnObj = {
            totalprofit: "0",
            profitability: "20"
        }
        return project_setting.findAll().then((result) => {
            if (result.length != 0) {
                result.forEach((o) => {
                    result[o.code] = o.value
                })
            }
            return returnObj
        })
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
                    return sum + o.retail
                }, 0)
                var totalCost = result[1].quotation.quotation_jobs.reduce((sum, o) => {
                    return sum + o.cost
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
                        name: result.attachment.name
                    }
                }
            })
        } else {
            return Promise.reject("no projectId")
        }
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