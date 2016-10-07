var getPropertyManagementCos = function(req, res, next) {
    var property_management_co = require('../db/models/property_management_co')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    return Promise.all([
        property_management_co.findAll({
            where: {
                $or: {
                    code: {
                        $like: "%" + filterKey + "%"
                    },
                    name: {
                        $like: "%" + filterKey + "%"
                    },
                    name_en: {
                        $like: "%" + filterKey + "%"
                    }
                }
            },
            offset: page * count,
            limit: count
        }),
        property_management_co.count({
            where: {
                $or: {
                    code: {
                        $like: "%" + filterKey + "%"
                    },
                    name: {
                        $like: "%" + filterKey + "%"
                    },
                    name_en: {
                        $like: "%" + filterKey + "%"
                    }
                }
            }
        })
    ]).then(function(result) {
        var property_management_cos = result[0]
        var rowCount = result[1]
        return {
            end: (property_management_cos.length + page * count) >= rowCount,
            list: property_management_cos
        }
    })
}

var submitPropertyManagementCo = function(req, res, next) {
    var property_management_co = require('../db/models/property_management_co')
    if (req.body.id) {
        return property_management_co.findOne({
            where: {
                id: req.body.id
            }
        }).then(function(result) {
            return result.update(req.body)
        }).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    } else {
        return property_management_co.create(req.body).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    }
}

var deletePropertyManagementCo = function(req, res, next) {
    var property_management_co = require('../db/models/property_management_co')
    console.log(req.body)
    return property_management_co.destroy({
        where: {
            id: req.body.id
        }
    }).then(function() {
        return "success"
    })
}

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        switch (result) {
            case "getPropertyManagementCos":
                return getPropertyManagementCos(req, res, next)
            case "submitPropertyManagementCo":
                return submitPropertyManagementCo(req, res, next)
            case "deletePropertyManagementCo":
                return deletePropertyManagementCo(req, res, next)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        console.log(error)
        res.status(500).send(error)
    })
}
