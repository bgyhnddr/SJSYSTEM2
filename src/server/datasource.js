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
        var list = result[0]
        var rowCount = result[1]
        return {
            end: (list.length + page * count) >= rowCount,
            list: list
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

var getStaffs = function(req, res, next) {
    var staff = require('../db/models/staff')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    return Promise.all([
        staff.findAll({
            where: {
                $or: {
                    name: {
                        $like: "%" + filterKey + "%"
                    }
                }
            },
            offset: page * count,
            limit: count
        }),
        staff.count({
            where: {
                $or: {
                    name: {
                        $like: "%" + filterKey + "%"
                    }
                }
            }
        })
    ]).then(function(result) {
        var list = result[0]
        var rowCount = result[1]
        return {
            end: (list.length + page * count) >= rowCount,
            list: list
        }
    })
}

var submitStaff = function(req, res, next) {
    var staff = require('../db/models/staff')
    if (req.body.id) {
        return staff.findOne({
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
        return staff.create(req.body).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    }
}

var deleteStaff = function(req, res, next) {
    var staff = require('../db/models/staff')
    return staff.destroy({
        where: {
            id: req.body.id
        }
    }).then(function() {
        return "success"
    })
}

var getBuildings = function(req, res, next) {
    var building = require('../db/models/building')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    return Promise.all([
        building.findAll({
            where: {
                $or: {
                    name: {
                        $like: "%" + filterKey + "%"
                    },
                    name_en: {
                        $like: "%" + filterKey + "%"
                    },
                    address: {
                        $like: "%" + filterKey + "%"
                    },
                    address_en: {
                        $like: "%" + filterKey + "%"
                    },
                    bill_address: {
                        $like: "%" + filterKey + "%"
                    },
                    bill_address_en: {
                        $like: "%" + filterKey + "%"
                    },
                    attn: {
                        $like: "%" + filterKey + "%"
                    },
                    attn_en: {
                        $like: "%" + filterKey + "%"
                    },
                    tel: {
                        $like: "%" + filterKey + "%"
                    },
                    fax: {
                        $like: "%" + filterKey + "%"
                    },
                    email: {
                        $like: "%" + filterKey + "%"
                    }
                }
            },
            offset: page * count,
            limit: count
        }),
        building.count({
            where: {
                $or: {
                    name: {
                        $like: "%" + filterKey + "%"
                    },
                    name_en: {
                        $like: "%" + filterKey + "%"
                    },
                    address: {
                        $like: "%" + filterKey + "%"
                    },
                    address_en: {
                        $like: "%" + filterKey + "%"
                    },
                    bill_address: {
                        $like: "%" + filterKey + "%"
                    },
                    bill_address_en: {
                        $like: "%" + filterKey + "%"
                    },
                    attn: {
                        $like: "%" + filterKey + "%"
                    },
                    attn_en: {
                        $like: "%" + filterKey + "%"
                    },
                    tel: {
                        $like: "%" + filterKey + "%"
                    },
                    fax: {
                        $like: "%" + filterKey + "%"
                    },
                    email: {
                        $like: "%" + filterKey + "%"
                    }
                }
            }
        })
    ]).then(function(result) {
        var list = result[0]
        var rowCount = result[1]
        return {
            end: (list.length + page * count) >= rowCount,
            list: list
        }
    })
}

var submitBuilding = function(req, res, next) {
    var building = require('../db/models/building')
    if (req.body.id) {
        return building.findOne({
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
        return building.create(req.body).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    }
}

var deleteBuilding = function(req, res, next) {
    var building = require('../db/models/building')
    console.log(req.body)
    return building.destroy({
        where: {
            id: req.body.id
        }
    }).then(function() {
        return "success"
    })
}

var getProjectManagers = function(req, res, next) {
    var project_manager = require('../db/models/project_manager')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    return Promise.all([
        project_manager.findAll({
            where: {
                user_account: {
                    $like: "%" + filterKey + "%"
                }
            },
            offset: page * count,
            limit: count
        }),
        project_manager.count({
            where: {
                user_account: {
                    $like: "%" + filterKey + "%"
                }
            }
        })
    ]).then(function(result) {
        var list = result[0]
        var rowCount = result[1]
        return {
            end: (list.length + page * count) >= rowCount,
            list: list
        }
    })
}

var submitProjectManager = function(req, res, next) {
    var project_manager = require('../db/models/project_manager')
    if (req.body.id) {
        return project_manager.findOne({
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
        return project_manager.create(req.body).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    }
}

var deleteProjectManager = function(req, res, next) {
    var project_manager = require('../db/models/project_manager')
    console.log(req.body)
    return project_manager.destroy({
        where: {
            id: req.body.id
        }
    }).then(function() {
        return "success"
    })
}

var getProjectTypes = function(req, res, next) {
    var project_type = require('../db/models/project_type')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    return Promise.all([
        project_type.findAll({
            where: {
                name: {
                    $like: "%" + filterKey + "%"
                }
            },
            offset: page * count,
            limit: count
        }),
        project_type.count({
            where: {
                name: {
                    $like: "%" + filterKey + "%"
                }
            }
        })
    ]).then(function(result) {
        var list = result[0]
        var rowCount = result[1]
        return {
            end: (list.length + page * count) >= rowCount,
            list: list
        }
    })
}

var submitProjectType = function(req, res, next) {
    var project_type = require('../db/models/project_type')
    if (req.body.id) {
        return project_type.findOne({
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
        return project_type.create(req.body).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    }
}

var deleteProjectType = function(req, res, next) {
    var project_type = require('../db/models/project_type')
    var project_item = require('../db/models/project_item')
    var upload_content_template = require('../db/models/upload_content_template')
    var job_content_template = require('../db/models/job_content_template')

    project_type.hasMany(project_item)

    project_item.hasMany(upload_content_template)

    project_item.hasMany(job_content_template)


    return project_type.findOne({
        include: [{
            model: project_item,
            include: [
                upload_content_template,
                job_content_template
            ]
        }],
        where: {
            id: req.body.id
        }
    }).then(function(result) {
        var destroyList = []
        result.project_items.forEach(function(item) {
            item.upload_content_templates.forEach(function(template) {
                destroyList.push(template.destroy())
            })
            item.job_content_templates.forEach(function(template) {
                destroyList.push(template.destroy())
            })
            destroyList.push(item.destroy())
        })

        destroyList.push(result.destroy())
        if (result) {
            return Promise.all(destroyList)
        } else {
            return "do nothing"
        }
    })
}

var getProjectItems = function(req, res, next) {
    var project_item = require('../db/models/project_item')
    var project_type = require('../db/models/project_type')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)
    var type = req.query.type

    if (type) {
        project_item.belongsTo(project_type)

        return Promise.all([
            project_item.findAll({
                include: [{
                    model: project_type,
                    where: {
                        name: type
                    }
                }],
                where: {
                    name: {
                        $like: "%" + filterKey + "%"
                    }
                },
                offset: page * count,
                limit: count
            }),
            project_item.count({
                include: [{
                    model: project_type,
                    where: {
                        name: type
                    }
                }],
                where: {
                    name: {
                        $like: "%" + filterKey + "%"
                    }
                }
            })
        ]).then(function(result) {
            var list = result[0]
            var rowCount = result[1]
            return {
                end: (list.length + page * count) >= rowCount,
                list: list
            }
        })
    } else {
        Promise.reject("no type")
    }
}

var submitProjectItem = function(req, res, next) {
    var project_item = require('../db/models/project_item')
    var project_type = require('../db/models/project_type')
    if (req.body.id) {
        return project_item.findOne({
            where: {
                id: req.body.id
            }
        }).then(function(result) {
            return result.update({
                name: req.body.name
            })
        }).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    } else {
        return project_type.findOne({
            where: {
                name: req.body.project_type_name
            }
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("type not found")
            } else {
                return project_item.create({
                    name: req.body.name,
                    project_type_id: result.id
                })
            }
        }).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    }
}

var deleteProjectItem = function(req, res, next) {
    var project_item = require('../db/models/project_item')
    var upload_content_template = require('../db/models/upload_content_template')
    var job_content_template = require('../db/models/job_content_template')

    project_item.hasMany(upload_content_template)

    project_item.hasMany(job_content_template)


    return project_item.findOne({
        include: [
            upload_content_template,
            job_content_template
        ],
        where: {
            id: req.body.id
        }
    }).then(function(result) {
        var destroyList = []
        result.upload_content_templates.forEach(function(template) {
            destroyList.push(template.destroy())
        })
        result.job_content_templates.forEach(function(template) {
            destroyList.push(template.destroy())
        })
        destroyList.push(result.destroy())

        if (result) {
            return Promise.all(destroyList)
        } else {
            return "do nothing"
        }
    })
}

var getUploadTemplates = function(req, res, next) {
    var upload_content_template = require('../db/models/upload_content_template')
    var project_item = require('../db/models/project_item')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var item = req.query.item
    if (item) {
        upload_content_template.belongsTo(project_item)

        return upload_content_template.findAll({
            include: [{
                model: project_item,
                where: {
                    name: item
                }
            }],
            where: {
                content: {
                    $like: "%" + filterKey + "%"
                }
            },
            order: ['index']
        }).then(function(result) {
            return {
                end: true,
                list: result
            }
        })
    } else {
        Promise.reject("no item")
    }
}

var submitUploadTemplate = function(req, res, next) {
    var upload_content_template = require('../db/models/upload_content_template')
    var project_item = require('../db/models/project_item')
    if (req.body.id) {
        return upload_content_template.findOne({
            where: {
                id: req.body.id
            }
        }).then(function(result) {
            return result.update({
                content: req.body.content
            })
        }).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    } else {
        return project_item.findOne({
            where: {
                name: req.body.project_item_name
            }
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("type not found")
            } else {
                return upload_content_template.count({
                    where: {
                        project_item_id: result.id
                    }
                }).then(function(count) {
                    return upload_content_template.create({
                        content: req.body.content,
                        project_item_id: result.id,
                        index: count + 1
                    })
                })
            }
        }).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    }
}

var deleteUploadTemplate = function(req, res, next) {
    var upload_content_template = require('../db/models/upload_content_template')

    return upload_content_template.destroy({
        where: {
            id: req.body.id
        }
    }).then(function(result) {
        return "success"
    })
}

var upUploadTemplate = function(req, res, next) {
    var upload_content_template = require('../db/models/upload_content_template')
    console.log(req.body.index)
    return upload_content_template.findAll({
        where: {
            index: {
                $lte: req.body.index
            }
        },
        limit: 2,
        order: [
            ["index", "DESC"]
        ]
    }).then(function(result) {
        if (result.length == 2) {
            console.log(result[0])
            console.log(result[1])
            var tempIndex = result[0].index
            result[0].index = result[1].index
            result[1].index = tempIndex



            console.log(result[0].index)
            console.log(result[1].index)

            return Promise.all([
                result[0].save(),
                result[1].save()
            ])
        } else {
            return "do nothing"
        }
    })
}

var downUploadTemplate = function(req, res, next) {
    var upload_content_template = require('../db/models/upload_content_template')

    return upload_content_template.findAll({
        where: {
            index: {
                $gte: req.body.index
            }
        },
        limit: 2,
        order: [
            ["index"]
        ]
    }).then(function(result) {
        if (result.length == 2) {
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

var getJobTemplates = function(req, res, next) {
    var job_content_template = require('../db/models/job_content_template')
    var project_item = require('../db/models/project_item')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var item = req.query.item
    if (item) {
        job_content_template.belongsTo(project_item)

        return job_content_template.findAll({
            include: [{
                model: project_item,
                where: {
                    name: item
                }
            }],
            where: {
                content: {
                    $like: "%" + filterKey + "%"
                }
            },
            order: ['index']
        }).then(function(result) {
            return {
                end: true,
                list: result
            }
        })
    } else {
        Promise.reject("no item")
    }
}

var submitJobTemplate = function(req, res, next) {
    var job_content_template = require('../db/models/job_content_template')
    var project_item = require('../db/models/project_item')
    if (req.body.id) {
        return job_content_template.findOne({
            where: {
                id: req.body.id
            }
        }).then(function(result) {
            return result.update({
                content: req.body.content
            })
        }).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    } else {
        return project_item.findOne({
            where: {
                name: req.body.project_item_name
            }
        }).then(function(result) {
            if (result == null) {
                return Promise.reject("type not found")
            } else {
                return job_content_template.count({
                    where: {
                        project_item_id: result.id
                    }
                }).then(function(count) {
                    return job_content_template.create({
                        content: req.body.content,
                        project_item_id: result.id,
                        index: count + 1
                    })
                })
            }
        }).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    }
}

var deleteJobTemplate = function(req, res, next) {
    var job_content_template = require('../db/models/job_content_template')

    return job_content_template.destroy({
        where: {
            id: req.body.id
        }
    }).then(function(result) {
        return "success"
    })
}

var upJobTemplate = function(req, res, next) {
    var job_content_template = require('../db/models/job_content_template')
    console.log(req.body.index)
    return job_content_template.findAll({
        where: {
            index: {
                $lte: req.body.index
            }
        },
        limit: 2,
        order: [
            ["index", "DESC"]
        ]
    }).then(function(result) {
        if (result.length == 2) {
            console.log(result[0])
            console.log(result[1])
            var tempIndex = result[0].index
            result[0].index = result[1].index
            result[1].index = tempIndex



            console.log(result[0].index)
            console.log(result[1].index)

            return Promise.all([
                result[0].save(),
                result[1].save()
            ])
        } else {
            return "do nothing"
        }
    })
}

var downJobTemplate = function(req, res, next) {
    var job_content_template = require('../db/models/job_content_template')

    return job_content_template.findAll({
        where: {
            index: {
                $gte: req.body.index
            }
        },
        limit: 2,
        order: [
            ["index"]
        ]
    }).then(function(result) {
        if (result.length == 2) {
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

var getOutSourceContractors = function(req, res, next) {
    var out_source_contractor = require('../db/models/out_source_contractor')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    return Promise.all([
        out_source_contractor.findAll({
            where: {
                $or: {
                    code: {
                        $like: "%" + filterKey + "%"
                    },
                    company: {
                        $like: "%" + filterKey + "%"
                    },
                    address: {
                        $like: "%" + filterKey + "%"
                    },
                    address_en: {
                        $like: "%" + filterKey + "%"
                    },
                    bill_address: {
                        $like: "%" + filterKey + "%"
                    },
                    bill_address_en: {
                        $like: "%" + filterKey + "%"
                    },
                    attn: {
                        $like: "%" + filterKey + "%"
                    },
                    attn_en: {
                        $like: "%" + filterKey + "%"
                    },
                    tel: {
                        $like: "%" + filterKey + "%"
                    },
                    fax: {
                        $like: "%" + filterKey + "%"
                    },
                    email: {
                        $like: "%" + filterKey + "%"
                    },
                    comments: {
                        $like: "%" + filterKey + "%"
                    }
                }
            },
            offset: page * count,
            limit: count
        }),
        out_source_contractor.count({
            where: {
                $or: {
                    code: {
                        $like: "%" + filterKey + "%"
                    },
                    company: {
                        $like: "%" + filterKey + "%"
                    },
                    address: {
                        $like: "%" + filterKey + "%"
                    },
                    address_en: {
                        $like: "%" + filterKey + "%"
                    },
                    bill_address: {
                        $like: "%" + filterKey + "%"
                    },
                    bill_address_en: {
                        $like: "%" + filterKey + "%"
                    },
                    attn: {
                        $like: "%" + filterKey + "%"
                    },
                    attn_en: {
                        $like: "%" + filterKey + "%"
                    },
                    tel: {
                        $like: "%" + filterKey + "%"
                    },
                    fax: {
                        $like: "%" + filterKey + "%"
                    },
                    email: {
                        $like: "%" + filterKey + "%"
                    },
                    comments: {
                        $like: "%" + filterKey + "%"
                    }
                }
            }
        })
    ]).then(function(result) {
        var list = result[0]
        var rowCount = result[1]
        return {
            end: (list.length + page * count) >= rowCount,
            list: list
        }
    })
}

var submitOutSourceContractor = function(req, res, next) {
    var out_source_contractor = require('../db/models/out_source_contractor')
    if (req.body.id) {
        return out_source_contractor.findOne({
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
        return out_source_contractor.create(req.body).catch(function(error) {
            if (error.name == "SequelizeUniqueConstraintError") {
                return Promise.reject("數據不能重複")
            }
            return Promise.reject(error.name)
        })
    }
}

var deleteOutSourceContractor = function(req, res, next) {
    var out_source_contractor = require('../db/models/out_source_contractor')
    console.log(req.body)
    return out_source_contractor.destroy({
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
            case "getStaffs":
                return getStaffs(req, res, next)
            case "submitStaff":
                return submitStaff(req, res, next)
            case "deleteStaff":
                return deleteStaff(req, res, next)
            case "getBuildings":
                return getBuildings(req, res, next)
            case "submitBuilding":
                return submitBuilding(req, res, next)
            case "deleteBuilding":
                return deleteBuilding(req, res, next)
            case "getProjectManagers":
                return getProjectManagers(req, res, next)
            case "submitProjectManager":
                return submitProjectManager(req, res, next)
            case "deleteProjectManager":
                return deleteProjectManager(req, res, next)
            case "getProjectTypes":
                return getProjectTypes(req, res, next)
            case "submitProjectType":
                return submitProjectType(req, res, next)
            case "deleteProjectType":
                return deleteProjectType(req, res, next)
            case "getProjectItems":
                return getProjectItems(req, res, next)
            case "submitProjectItem":
                return submitProjectItem(req, res, next)
            case "deleteProjectItem":
                return deleteProjectItem(req, res, next)
            case "getUploadTemplates":
                return getUploadTemplates(req, res, next)
            case "submitUploadTemplate":
                return submitUploadTemplate(req, res, next)
            case "deleteUploadTemplate":
                return deleteUploadTemplate(req, res, next)
            case "upUploadTemplate":
                return upUploadTemplate(req, res, next)
            case "downUploadTemplate":
                return downUploadTemplate(req, res, next)
            case "getJobTemplates":
                return getJobTemplates(req, res, next)
            case "submitJobTemplate":
                return submitJobTemplate(req, res, next)
            case "deleteJobTemplate":
                return deleteJobTemplate(req, res, next)
            case "upJobTemplate":
                return upJobTemplate(req, res, next)
            case "downJobTemplate":
                return downJobTemplate(req, res, next)
            case "getOutSourceContractors":
                return getOutSourceContractors(req, res, next)
            case "submitOutSourceContractor":
                return submitOutSourceContractor(req, res, next)
            case "deleteOutSourceContractor":
                return deleteOutSourceContractor(req, res, next)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        console.log(error)
        res.status(500).send(error)
    })
}