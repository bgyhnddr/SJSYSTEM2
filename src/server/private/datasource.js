var exec = {
    getPropertyManagementCos(req, res, next) {
        var property_management_co = require('../../db/models/property_management_co')

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
    },
    submitPropertyManagementCo(req, res, next) {
        var property_management_co = require('../../db/models/property_management_co')
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
    },
    deletePropertyManagementCo(req, res, next) {
        var property_management_co = require('../../db/models/property_management_co')
        return property_management_co.destroy({
            where: {
                id: req.body.id
            }
        }).then(function() {
            return "success"
        })
    },
    getStaffs(req, res, next) {
        var staff = require('../../db/models/staff')

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
    },
    submitStaff(req, res, next) {
        var staff = require('../../db/models/staff')
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
    },
    deleteStaff(req, res, next) {
        var staff = require('../../db/models/staff')
        return staff.destroy({
            where: {
                id: req.body.id
            }
        }).then(function() {
            return "success"
        })
    },
    getBuildings(req, res, next) {
        var building = require('../../db/models/building')

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
    },
    submitBuilding(req, res, next) {
        var building = require('../../db/models/building')
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
    },
    deleteBuilding(req, res, next) {
        var building = require('../../db/models/building')
        return building.destroy({
            where: {
                id: req.body.id
            }
        }).then(function() {
            return "success"
        })
    },
    getProjectManagers(req, res, next) {
        var user_role = require('../../db/models/user_role')

        var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
        var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
        var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

        return Promise.all([
            user_role.findAll({
                where: {
                    $and: {
                        user_account: {
                            $like: "%" + filterKey + "%"
                        },
                        role_code: "PIC"
                    }
                },
                offset: page * count,
                limit: count
            }),
            user_role.count({
                where: {
                    $and: {
                        user_account: {
                            $like: "%" + filterKey + "%"
                        },
                        role_code: "PIC"
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
    },
    submitProjectManager(req, res, next) {
        var user_role = require('../../db/models/user_role')
        if (req.body.id) {
            return user_role.findOne({
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
            req.body.role_code = "PIC"
            return user_role.create(req.body).catch(function(error) {
                if (error.name == "SequelizeUniqueConstraintError") {
                    return Promise.reject("數據不能重複")
                }
                return Promise.reject(error.name)
            })
        }
    },
    deleteProjectManager(req, res, next) {
        var user_role = require('../../db/models/user_role')
        return user_role.destroy({
            where: {
                id: req.body.id
            }
        }).then(function() {
            return "success"
        })
    },
    getProjectTypes(req, res, next) {
        var project_type = require('../../db/models/project_type')

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
    },
    submitProjectType(req, res, next) {
        var project_type = require('../../db/models/project_type')
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
    },
    deleteProjectType(req, res, next) {
        var project_type = require('../../db/models/project_type')
        var project_item = require('../../db/models/project_item')
        var upload_content_template = require('../../db/models/upload_content_template')
        var job_content_template = require('../../db/models/job_content_template')

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
    },
    getProjectItems(req, res, next) {
        var project_item = require('../../db/models/project_item')
        var project_type = require('../../db/models/project_type')

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
    },
    submitProjectItem(req, res, next) {
        var project_item = require('../../db/models/project_item')
        var project_type = require('../../db/models/project_type')
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
    },
    deleteProjectItem(req, res, next) {
        var project_item = require('../../db/models/project_item')
        var upload_content_template = require('../../db/models/upload_content_template')
        var job_content_template = require('../../db/models/job_content_template')

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
    },
    getUploadTemplates(req, res, next) {
        var upload_content_template = require('../../db/models/upload_content_template')
        var project_item = require('../../db/models/project_item')

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
    },
    submitUploadTemplate(req, res, next) {
        var upload_content_template = require('../../db/models/upload_content_template')
        var project_item = require('../../db/models/project_item')
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
    },
    deleteUploadTemplate(req, res, next) {
        var upload_content_template = require('../../db/models/upload_content_template')

        return upload_content_template.destroy({
            where: {
                id: req.body.id
            }
        }).then(function(result) {
            return "success"
        })
    },
    upUploadTemplate(req, res, next) {
        var upload_content_template = require('../../db/models/upload_content_template')
        return upload_content_template.findOne({
            where: { id: req.body.id }
        }).then((result) => {
            return upload_content_template.findOne({
                where: {
                    $and: {
                        index: {
                            $lt: result.index
                        },
                        project_item_id: result.project_item_id
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
    },
    downUploadTemplate(req, res, next) {
        var upload_content_template = require('../../db/models/upload_content_template')
        return upload_content_template.findOne({
            where: { id: req.body.id }
        }).then((result) => {
            return upload_content_template.findOne({
                where: {
                    $and: {
                        index: {
                            $gt: result.index
                        },
                        project_item_id: result.project_item_id
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
    },
    getJobTemplates(req, res, next) {
        var job_content_template = require('../../db/models/job_content_template')
        var project_item = require('../../db/models/project_item')

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
    },
    submitJobTemplate(req, res, next) {
        var job_content_template = require('../../db/models/job_content_template')
        var project_item = require('../../db/models/project_item')
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
    },
    deleteJobTemplate(req, res, next) {
        var job_content_template = require('../../db/models/job_content_template')

        return job_content_template.destroy({
            where: {
                id: req.body.id
            }
        }).then(function(result) {
            return "success"
        })
    },
    upJobTemplate(req, res, next) {
        var job_content_template = require('../../db/models/job_content_template')
        return job_content_template.findOne({
            where: { id: req.body.id }
        }).then((result) => {
            return job_content_template.findOne({
                where: {
                    $and: {
                        index: {
                            $lt: result.index
                        },
                        project_item_id: result.project_item_id
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
    },
    downJobTemplate(req, res, next) {
        var job_content_template = require('../../db/models/job_content_template')
        return job_content_template.findOne({
            where: { id: req.body.id }
        }).then((result) => {
            return job_content_template.findOne({
                where: {
                    $and: {
                        index: {
                            $gt: result.index
                        },
                        project_item_id: result.project_item_id
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
    },
    getOutSourceContractors(req, res, next) {
        var out_source_contractor = require('../../db/models/out_source_contractor')

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
    },
    submitOutSourceContractor(req, res, next) {
        var out_source_contractor = require('../../db/models/out_source_contractor')
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
    },
    deleteOutSourceContractor(req, res, next) {
        var out_source_contractor = require('../../db/models/out_source_contractor')
        return out_source_contractor.destroy({
            where: {
                id: req.body.id
            }
        }).then(function() {
            return "success"
        })
    }
}
module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        return exec[result](req, res, next)
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}
