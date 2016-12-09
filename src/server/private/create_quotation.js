var checkQuotationDraftAndActive = (no) => {
  return Promise.resolve().then(function() {
    var quotation = require('../../db/models/quotation')
    var project = require('../../db/models/project')
    var project_state = require('../../db/models/project_state')

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

var checkProjectWorking = (id) => {
  return Promise.resolve().then(function() {
    var project = require('../../db/models/project')
    var project_state = require('../../db/models/project_state')

    project.hasOne(project_state)

    return project.findOne({
      include: project_state,
      where: {
        id: id
      }
    }).then(function(result) {
      if (result == null) {
        return Promise.reject("project not found")
      } else {
        if (result.project_state.state == "working") {
          return "OK"
        } else {
          return Promise.reject("not allow")
        }
      }
    })
  })
}
var exec = {
  createQuotation(req, res, next) {
    var co_id = req.body.co_id
    if (co_id) {
      var property_management_co = require('../../db/models/property_management_co')
      var project = require('../../db/models/project')
      var project_state = require('../../db/models/project_state')
      var quotation = require('../../db/models/quotation')
      var common = require('../common')

      return property_management_co.findOne({
        where: {
          id: co_id
        }
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
                return {
                  project_id: project_result.id
                }
              })
            })
          })
        }
      })
    } else {
      return Promise.reject("沒有指定物業公司")
    }
  },
  saveDraft(req, res, next) {
    var no = req.body.no

    if (no) {
      var common = require('../common')
      var quotation = require('../../db/models/quotation')
      var project = require('../../db/models/project')
      var project_state = require('../../db/models/project_state')
      var project_item = require('../../db/models/project_item')
      var job_content_template = require('../../db/models/job_content_template')
      var upload_content_template = require('../../db/models/upload_content_template')
      var quotation_job = require('../../db/models/quotation_job')
      var project_attachment = require('../../db/models/project_attachment')

      project_item.hasMany(job_content_template)
      project_item.hasMany(upload_content_template)
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
          if (!result.project.project_state.boss_edit) {
            result.quotation_date = req.body.quotation_date
          }
          result.building_id = req.body.building_id
          return result
        } else {
          return Promise.reject("找不到報價單")
        }
      }).then(function(result) {
        if (result.project_item != req.body.project_item && req.body.project_item) {
          return Promise.all([
            quotation_job.destroy({
              where: {
                quotation_no: result.no
              }
            }),
            project_attachment.destroy({
              where: {
                project_id: result.project.id
              }
            })
          ]).then(function() {
            return project_item.findOne({
              include: [job_content_template, upload_content_template],
              where: {
                name: req.body.project_item
              }
            })
          }).then(function(pi) {
            if (pi) {
              return Promise.all([
                quotation_job.bulkCreate(pi.job_content_templates.map((o) => {
                  return {
                    quotation_no: result.no,
                    index: o.index,
                    content: o.content
                  }
                })),
                project_attachment.bulkCreate(pi.upload_content_templates.map((o => {
                  console.log({
                    project_id: result.project.id,
                    index: o.index,
                    content: o.content
                  })
                  return {
                    project_id: result.project.id,
                    index: o.index,
                    content: o.content
                  }
                })))
              ])


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
  },
  submitQuotationJob(req, res, next) {
    var quotation_job = require('../../db/models/quotation_job')
    var quotation = require('../../db/models/quotation')

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
  },
  deleteQuotationJob(req, res, next) {
    var quotation_job = require('../../db/models/quotation_job')

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
  },
  upQuotationJob(req, res, next) {
    var quotation_job = require('../../db/models/quotation_job')
    return quotation_job.findOne({
      where: {
        id: req.body.id
      }
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
  },
  downQuotationJob(req, res, next) {
    var quotation_job = require('../../db/models/quotation_job')
    return quotation_job.findOne({
      where: {
        id: req.body.id
      }
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
  },
  saveQuotation(req, res, next) {
    var no = req.body.no
    if (no) {
      var common = require('../common')
      var quotation = require('../../db/models/quotation')
      var project = require('../../db/models/project')
      var project_state = require('../../db/models/project_state')
      var quotation_job = require('../../db/models/quotation_job')

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
  },
  editQuotation(req, res, next) {
    var no = req.body.no
    if (no) {
      var common = require('../common')
      var quotation = require('../../db/models/quotation')
      var project = require('../../db/models/project')
      var project_state = require('../../db/models/project_state')
      var quotation_job = require('../../db/models/quotation_job')

      quotation.belongsTo(project)
      project.hasOne(project_state)
      quotation.hasMany(quotation_job)


      return quotation.findOne({
        include: {
          model: project,
          include: {
            model: project_state,
            where: {
              state: "quotation_save",
              manager_approve: {
                $or: [{
                  $eq: false
                }, {
                  $eq: null
                }]
              }
            }
          }
        },
        where: {
          no: no
        }
      }).then((result) => {
        if (result == null) {
          return Promise.reject("not allow")
        } else {
          return result
        }
      }).then((result) => {
        result.project.project_state.state = "draft"
        return result.project.project_state.save()
      })
    } else {
      return Promise.reject("not found")
    }
  },
  deleteProject(req, res, next) {
    var project = require('../../db/models/project')
    project.destroy({
      where: {
        id: req.body.id
      }
    }).then(()=>{
      return "OK"
    })
  },
  saveContract(req, res, next) {
    var projectId = req.body.project_id
    if (projectId) {
      var common = require('../common')
      var project = require('../../db/models/project')
      var project_state = require('../../db/models/project_state')
      var project_contract = require('../../db/models/project_contract')
      project.hasOne(project_state)
      return project.findOne({
        include: [project_state],
        where: {
          id: projectId
        }
      }).then((result) => {
        if (result != null) {
          if (result.project_state.state != "quotation_save") {
            return Promise.reject("not allow")
          } else {
            return result
          }
        } else {
          return Promise.reject("no project")
        }
      }).then((result) => {
        return project_contract.upsert({
          project_id: projectId,
          attachment_id: req.body.attachment_id
        })
      }).then(function(result) {
        common.log_project_record("create_quotation/saveContract", projectId + ":" + req.body.attachment_id, req.session.userInfo.name)
        return 'success'
      })
    } else {
      return Promise.reject("no project id")
    }
  },
  beginWork(req, res, next) {
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
      if (result.project_state.state != "quotation_contract") {
        return Promise.reject("not allow")
      } else {
        result.project_state.state = "working"
        return result.project_state.save().then(() => {
          return result
        })
      }
    }).then((result) => {
      common.log_project_record("create_quotation/beginWork", result.id, req.session.userInfo.name)
      return "success"
    })
  },
  addProjectAttachment(req, res, next) {
    var project_attachment = require('../../db/models/project_attachment')

    return project_attachment.create(req.body)
  },
  deleteProjectAttachment(req, res, next) {
    var project_attachment = require('../../db/models/project_attachment')

    return project_attachment.destroy({
      where: {
        id: req.body.id
      }
    }).then((result) => {
      return "success"
    })
  },
  saveProjectAttachment(req, res, next) {
    var project_attachment = require('../../db/models/project_attachment')
    return project_attachment.update({
      attachment_id: req.body.attachment_id
    }, {
      where: {
        id: req.body.id
      }
    })
  },
  submitProjectHour(req, res, next) {
    var project_hour = require('../../db/models/project_hour')
    return checkProjectWorking(req.body.project_id).then(() => {
      return project_hour.findOne({
        where: {
          id: req.body.id
        }
      })
    }).then((result) => {
      if (result != null) {
        return result.update(req.body)
      } else {
        return project_hour.create(req.body)
      }
    })
  },
  deleteProjectHour(req, res, next) {
    var project_hour = require('../../db/models/project_hour')
    return checkProjectWorking(req.body.project_id).then(() => {
      return project_hour.destroy({
        where: {
          id: req.body.id
        }
      })
    }).then(() => {
      return "success"
    })
  },
  submitProjectOutSource(req, res, next) {
    var project_out_source = require('../../db/models/project_out_source')
    return checkProjectWorking(req.body.project_id).then(() => {
      return project_out_source.findOne({
        where: {
          id: req.body.id
        }
      })
    }).then((result) => {
      if (result != null) {
        return result.update(req.body)
      } else {
        return project_out_source.create(req.body)
      }
    })
  },
  deleteProjectOutSource(req, res, next) {
    var project_out_source = require('../../db/models/project_out_source')
    return checkProjectWorking(req.body.project_id).then(() => {
      return project_out_source.destroy({
        where: {
          id: req.body.id
        }
      })
    }).then(() => {
      return "success"
    })
  },
  endWork(req, res, next) {
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
      if (result.project_state.state != "working") {
        return Promise.reject("not allow")
      } else {
        result.project_state.state = "counting"
        return result.project_state.save().then(() => {
          return result
        })
      }
    }).then((result) => {
      common.log_project_record("create_quotation/endWork", result.id, req.session.userInfo.name)
      return "success"
    })
  },
  submitComments(req) {
    var comments_text = require('../../db/models/comments_text')
    comments_text.upsert(req.body)
  },
  deleteComments(req) {
    var comments_text = require('../../db/models/comments_text')
    comments_text.destroy({
      where: {
        code: req.body.code
      }
    })
  },
  saveQuotationComments(req) {
    var quotation = require('../../db/models/quotation')
    quotation.upsert({
      no: req.body.no,
      comments: req.body.comments
    })
  },
  submitInvoiceComments(req) {
    var invoice_comments_text = require('../../db/models/invoice_comments_text')
    invoice_comments_text.upsert(req.body)
  },
  deleteInvoiceComments(req) {
    var invoice_comments_text = require('../../db/models/invoice_comments_text')
    invoice_comments_text.destroy({
      where: {
        code: req.body.code
      }
    })
  },
  saveInvoiceSnapshot(req) {
    var invoice_snapshot = require('../../db/models/invoice_snapshot')
    return invoice_snapshot.upsert({
      project_invoice_id: req.body.id,
      content: req.body.content
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
