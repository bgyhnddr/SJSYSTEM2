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
      return "已確認工程"
    case "working":
      return "施工中"
    case "counting":
      return "已完成工程"
    default:
      return "已完成工程"
  }
}

var getLastDay = (year, month) => {
  var new_year = year; //取当前的年份
  var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) {
    new_month -= 12; //月份减
    new_year++; //年份增
  }
  var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
  return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
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
        where: {
          no: no
        }
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
      var quotation_job = require('../../db/models/quotation_job')
      var building = require('../../db/models/building')
      project.hasOne(project_state)
      project.belongsTo(quotation)
      quotation.belongsTo(building)
      quotation.hasMany(quotation_job)

      return project.findOne({
        include: [project_state, {
          model: quotation,
          include: [
            building,
            quotation_job
          ]
        }],
        where: {
          id: id
        }
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
  getInvoice(req, res, next) {
    var id = req.query.id
    if (id) {
      var invoice_snapshot = require('../../db/models/invoice_snapshot')
      return invoice_snapshot.findOne({
        where: {
          project_invoice_id: id
        }
      }).then((result) => {
        if (result != null) {
          return JSON.parse(result.content)
        } else {
          var project = require('../../db/models/project')
          var project_state = require('../../db/models/project_state')
          var project_invoice = require('../../db/models/project_invoice')
          var project_invoice_detail = require('../../db/models/project_invoice_detail')
          var quotation = require('../../db/models/quotation')
          var quotation_job = require('../../db/models/quotation_job')
          var building = require('../../db/models/building')

          project.hasOne(project_state)
          project.belongsTo(quotation)
          quotation.belongsTo(building)
          quotation.hasMany(quotation_job)

          project.hasOne(project_invoice)
          project_invoice.hasMany(project_invoice_detail)
          project_invoice_detail.belongsTo(quotation_job)

          return project.findOne({
            include: [project_state, {
              model: quotation,
              include: building
            }, {
              model: project_invoice,
              include: {
                model: project_invoice_detail,
                include: quotation_job
              },
              where: {
                id: id
              }
            }]
          }).then(function(result) {
            if (result == null) {
              return Promise.reject("无发票")
            } else {
              return result
            }
          })
        }
      })
    } else {
      return Promise.reject("无发票")
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
    return project.findOne({
      include: [project_accounting, project_state],
      where: {
        id: req.body.project_id
      }
    }).then((result) => {
      if (result != null) {
        if (result.project_state.state == "paying" && !req.session.userInfo.permissions.some(o => o == "boss" || o == "check")) {
          return Promise.reject("not allow")
        }
        return result
      } else {
        return Promise.reject("not found")
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
    var sequelize = require('sequelize')
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
    var project_invoice = require('../../db/models/project_invoice')
    var project_invoice_detail = require('../../db/models/project_invoice_detail')

    project.hasOne(project_state)
    project.belongsTo(quotation)
    project.hasMany(project_invoice)
    quotation.belongsTo(building)
    quotation.hasMany(quotation_job)

    quotation_job.hasMany(project_invoice_detail)
    project_invoice_detail.belongsTo(quotation_job)

    var where = undefined
    if (filterKey) {
      // wheretext = "`quotation_no` like '%" + filterKey + "%'"
      // wheretext += " OR `quotation_no` like '%" + filterKey + "%'"
      // wheretext += " OR quotation.project_name like '%" + filterKey + "%'"
      // wheretext += " OR `quotation.building`.`name` like '%" + filterKey + "%'"
      // wheretext += " OR `quotation.property_management_co_name` like '%" + filterKey + "%'"
      // wheretext += " OR `quotation.manager` like '%" + filterKey + "%'"
      // wheretext += " OR `quotation.project_type` like '%" + filterKey + "%'"
      // where = sequelize.literal(wheretext)
      where = {
        $or: [{
          quotation_no: {
            $like: "%" + filterKey + "%"
          }
        }, {
          '$quotation.project_name$': {
            $like: "%" + filterKey + "%"
          }
        }, {
          '$`quotation.building`.`name`$': {
            $like: "%" + filterKey + "%"
          }
        }, {
          '$quotation.property_management_co_name$': {
            $like: "%" + filterKey + "%"
          }
        }, {
          '$quotation.manager$': {
            $like: "%" + filterKey + "%"
          }
        }, {
          '$quotation.project_type$': {
            $like: "%" + filterKey + "%"
          }
        }]
      }
    }

    return Promise.resolve().then(() => {
      switch (type) {
        case "draft":
          return Promise.all([
            project.findAll({
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
            }),
            project.count({
              include: [{
                model: project_state,
                where: {
                  state: "draft"
                }
              }, {
                model: quotation,
                include: building
              }],
              where: where
            })
          ])
        case 'wait_approve':
          return Promise.all([
            project.findAll({
              include: [{
                model: project_state,
                where: {
                  state: "quotation_save",
                  manager_approve: {
                    $or: [{
                      $eq: null
                    }, false]
                  }
                }
              }, {
                model: quotation,
                include: building
              }],
              where: where,
              offset: page * count,
              limit: count,
              order: 'project.id DESC'
            }),
            project.count({
              include: [{
                model: project_state,
                where: {
                  state: "quotation_save",
                  manager_approve: {
                    $or: [{
                      $eq: null
                    }, false]
                  }
                }
              }, {
                model: quotation,
                include: building
              }],
              where: where
            })
          ])
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

              return [list.slice(page * count, page * count + count), list.length]
            })
          })
        case 'wait_contract':
          return Promise.all([
            project.findAll({
              include: [{
                model: project_state,
                where: {
                  state: "quotation_save",
                  manager_approve: true
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
                  state: "quotation_save",
                  manager_approve: true
                }
              }, {
                model: quotation,
                include: building
              }],
              where: where,
              offset: page * count,
              limit: count,
              order: 'project.id DESC'
            })
          ]).then((result) => {
            result[0].forEach(o => o.project_state.state = "wait_contract")
            return result
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
            }, {
              model: quotation,
              include: building
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
                state: "counting"
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
                state: "counting"
              }
            }, {
              model: quotation,
              include: building
            }],
            where: where,
            offset: page * count,
            limit: count
          })])
        case "wait_invoice":
          return project.findAll({
            include: [{
              model: project_state,
              where: {
                state: "paying"
              }
            }, {
              model: quotation,
              include: [{
                model: quotation_job,
                include: {
                  model: project_invoice_detail,
                  include: quotation_job
                }
              }, building]
            }],
            order: 'project.id DESC'
          }).then((result) => {
            var list = result.filter((p) => {
              var total = p.quotation.quotation_jobs.reduce((sum, j) => {
                return sum + j.retail * j.count
              }, 0)

              var invoice_total = p.quotation.quotation_jobs.reduce((sum, j) => {
                var sumInvoicePer = j.project_invoice_details.reduce((sumi, vo) => {
                  return sumi + vo.quotation_job.retail * vo.quotation_job.count
                }, 0)
                return sum + sumInvoicePer
              }, 0)

              return invoice_total < total
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
            return [list.slice(page * count, page * count + count), list.length]
          })
        case "wait_pay":
          return project.findAll({
            include: [{
              model: project_state,
              where: {
                state: "paying"
              }
            }, {
              model: quotation,
              include: [{
                model: quotation_job,
                include: {
                  model: project_invoice_detail,
                  include: quotation_job
                }
              }, building]
            }],
            order: 'project.id DESC'
          }).then((result) => {
            var list = result.filter((p) => {
              var total = p.quotation.quotation_jobs.reduce((sum, j) => {
                return sum + j.retail * j.count
              }, 0)

              var invoice_total = p.quotation.quotation_jobs.reduce((sum, j) => {
                var sumInvoicePer = j.project_invoice_details.reduce((sumi, vo) => {
                  return sumi + vo.quotation_job.retail * vo.quotation_job.count
                }, 0)
                return sum + sumInvoicePer
              }, 0)

              return invoice_total >= total
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
            return [list.slice(page * count, page * count + count), list.length]
          })
        case "paid":
          return project.findAll({
            include: [{
              model: project_state,
              where: {
                state: "paying"
              }
            }, {
              model: quotation,
              include: [quotation_job, building]
            }, project_invoice],
            order: 'project.id DESC'
          }).then((result) => {
            var list = result.filter((p) => {
              var total = p.quotation.quotation_jobs.reduce((sum, j) => {
                return sum + j.retail * j.count
              }, 0)

              var check_total = p.project_invoices.reduce((sum, inv) => {
                return sum + (inv.check_money ? inv.check_money : 0)
              }, 0)

              return check_total >= total
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
            return [list.slice(page * count, page * count + count), list.length]
          })
        default:
          var quotationWhere = undefined,
            buildingWhere = undefined
          if (filterKey) {
            quotationWhere = {
              $or: [{
                no: {
                  $like: "%" + filterKey + "%"
                }
              }, {
                project_name: {
                  $like: "%" + filterKey + "%"
                }
              }, {
                property_management_co_name: {
                  $like: "%" + filterKey + "%"
                }
              }, {
                manager: {
                  $like: "%" + filterKey + "%"
                }
              }, {
                project_type: {
                  $like: "%" + filterKey + "%"
                }
              }]
            }
          }
          return project.findAll({
            include: [{
              model: project_state
            }, {
              model: quotation,
              include: [building, quotation_job]
            }],
            order: 'project.id DESC'
          }).then((result) => {
            return getProjectSetting().then((settingObj) => {
              var list = result.map((o) => {
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
              if (filterKey) {
                list = list.filter((pj) => {
                  return pj.quotation_no.indexOf(filterKey) >= 0 ||
                    (pj.quotation.project_name ? (pj.quotation.project_name.indexOf(filterKey) >= 0) : false) ||
                    (pj.quotation.building ? (pj.quotation.building.name.indexOf(filterKey) >= 0) : false) ||
                    (pj.quotation.property_management_co_name ? (pj.quotation.property_management_co_name.indexOf(filterKey) >= 0) : false) ||
                    (pj.quotation.manager ? (pj.quotation.manager.indexOf(filterKey) >= 0) : false) ||
                    (pj.quotation.project_type ? (pj.quotation.project_type.indexOf(filterKey) >= 0) : false)
                })
              }
              return [list.slice(page * count, page * count + count), list.length]
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
          manager: o.quotation.manager
        }
      })
      var rowCount = result[1]
      return {
        end: (list.length + page * count) >= rowCount,
        list: list
      }
    })
  },
  getPreparedBy(req) {
    var project_record = require('../../db/models/project_record')

    return project_record.findOne({
      action: "create_quotation/createQuotation",
      content: req.query.quotation_no
    }).then((result) => {
      return result.user_account
    })
  },
  getComments(req) {
    var comments_text = require('../../db/models/comments_text')
    return comments_text.findAll()
  },
  getInvoiceComments(req) {
    var invoice_comments_text = require('../../db/models/invoice_comments_text')
    invoice_comments_text.sync()
    return invoice_comments_text.findAll()
  },
  getHourReport(req) {
    var staff = require('../../db/models/staff')
    var project = require('../../db/models/project')
    var quotation = require('../../db/models/quotation')
    var project_hour = require('../../db/models/project_hour')
    var building = require('../../db/models/building')
    Date.prototype.Format = function(fmt) { //author: meizz
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }

    staff.hasMany(project_hour, {
      foreignKey: "staff"
    })
    project_hour.belongsTo(project)
    project.belongsTo(quotation)
    quotation.belongsTo(building)

    var begin_date, end_date
    if (req.query.front) {
      begin_date = new Date(req.query.year + "-" + req.query.month + "-01")
      end_date = new Date(req.query.year + "-" + req.query.month + "-15")
    } else {
      begin_date = new Date(req.query.year + "-" + req.query.month + "-16")
      end_date = new Date(req.query.year + "-" +
        req.query.month + "-" +
        getLastDay(parseInt(req.query.year), parseInt(req.query.month)))
    }
    var sequelize = require('sequelize')
    return staff.findAll({
      include: {
        model: project_hour,
        include: {
          model: project,
          include: {
            model: quotation,
            include: building,
            where: {
              manager: req.query.manager
            }
          }
        },
        where: sequelize.literal("project_hours.begin_date>='" +
          begin_date.Format('yyyy-MM-dd') + "' AND project_hours.begin_date<='" +
          end_date.Format('yyyy-MM-dd') + "'"
        )
      },
      order: "project_hours.begin_date"
    }).then((result) => {
      return result.map((obj) => {
        var o = obj.toJSON()
        var qtions = {}
        o.project_hours.forEach((ph) => {
          if (qtions[ph.project.quotation_no] == undefined) {
            qtions[ph.project.quotation_no] = {}
            qtions[ph.project.quotation_no].qobj = ph.project.quotation
            qtions[ph.project.quotation_no].qobj.lsum = 0
            qtions[ph.project.quotation_no].phObjs = {}
          }
          qtions[ph.project.quotation_no].qobj.lsum += ph.hour
          if (qtions[ph.project.quotation_no].phObjs[ph.begin_date] == undefined) {
            var quotation_no = ph.project.quotation_no
            delete ph.project
            qtions[quotation_no].phObjs[ph.begin_date] = ph
          } else {
            qtions[ph.project.quotation_no].phObjs[ph.begin_date].hour += ph.hour
          }

        })
        var newQuotationList = []
        for (var qt in qtions) {
          var qobj = qtions[qt].qobj
          qobj.project_hours = []
          for (var ph in qtions[qt].phObjs) {
            qobj.project_hours.push(qtions[qt].phObjs[ph])
          }
          newQuotationList.push(qobj)
        }
        o.quotations = newQuotationList
        delete o.project_hours
        o.sum = o.quotations.reduce((sum, q) => {
          return sum + q.lsum
        }, 0)

        return o
      })
    })
  },
  getUsers(req, res, next) {
    var user = require('../../db/models/user')

    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    return Promise.all([
      user.findAll({
        where: {
          account: {
            $and: {
              $not: "admin",
              $like: "%" + filterKey + "%"
            }
          }
        },
        offset: page * count,
        limit: count
      }),
      user.count({
        where: {
          account: {
            $and: {
              $not: "admin",
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
