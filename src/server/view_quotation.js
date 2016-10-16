var getQuotation = function(req, res, next) {
    var no = req.query.no
    if (no) {
        var quotation = require('../db/models/quotation')
        var building = require('../db/models/building')
        quotation.belongsTo(building, { foreignKey: 'building_id', targetKey: 'id' })
        return quotation.findOne({
            include: [{
                model: building
            }],
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
}

var getProject = function(req, res, next) {
    var id = req.query.id
    if (id) {
        var project = require('../db/models/project')
        var project_state = require('../db/models/project_state')

        project.hasOne(project_state)

        return project.findOne({
            include: [{
                model: project_state
            }],
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
}


var getQuotationJobs = function(req, res, next) {
    var quotation_job = require('../db/models/quotation_job')
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
}

var getBuilding = function(req, res, next) {
    var building = require('../db/models/building')

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
}

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        try {
            switch (result) {
                case "getQuotation":
                    return getQuotation(req, res, next)
                case "getProject":
                    return getProject(req, res, next)
                case "getQuotationJobs":
                    return getQuotationJobs(req, res, next)
                case "getBuilding":
                    return getBuilding(req, res, next)
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