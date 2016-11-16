var exec = {
  getPayees(req, res, next) {
    var po_payee = require("../../db/models/po_payee")
    return po_payee.findAll().then((result) => {
      return result.map(o => o.name)
    })
  },
  getPO(req, res, next) {
    var po = require("../../db/models/po")
    return po.findOne({
      where: {
        id: req.query.id
      }
    }).then((result) => {
      if (result != null) {
        return result
      } else {
        return Promise.reject("not found")
      }
    })
  },
  getQuotations(req, res, next) {
    var project = require("../../db/models/project")
    var project_state = require("../../db/models/project_state")
    project.hasOne(project_state)
    return project.findAll({
      include: {
        model: project_state,
        where: {
          $and: [{
            state: {
              $ne: "draft"
            }
          }, {
            state: {
              $ne: "quotation_save"
            }
          }]
        }
      }
    }).then((result) => {
      result.forEach(o => console.log(o.project_state.state))
      return result.map(o => o.quotation_no)
    })
  },
  getPODetail(req, res, next) {
    var po = require("../../db/models/po")
    var po_quotation = require("../../db/models/po_quotation")
    var quotation = require("../../db/models/quotation")
    var po_quotation_detail = require("../../db/models/po_quotation_detail")
    var po_quotation_detail_attachment = require("../../db/models/po_quotation_detail_attachment")
    var project = require("../../db/models/project")
    var project_accounting = require("../../db/models/project_accounting")
    var attachment = require("../../db/models/attachment")
    var po_quotation_approve = require("../../db/models/po_quotation_approve")

    po_quotation.belongsTo(po)
    po_quotation.hasOne(po_quotation_approve)
    po_quotation.belongsTo(quotation)
    po_quotation.hasMany(po_quotation_detail)
    po_quotation_detail.hasMany(po_quotation_detail_attachment)

    po_quotation_detail.belongsTo(attachment)
    po_quotation_detail_attachment.belongsTo(attachment)

    quotation.hasOne(project)
    project.hasOne(project_accounting)

    quotation.hasMany(po_quotation)

    return po_quotation.findAll({
      include: [{
        model: quotation,
        include: [{
          model: po_quotation,
          include: [po_quotation_detail, po]
        }, {
          model: project,
          include: project_accounting
        }]
      }, {
        model: po_quotation_detail,
        include: [attachment, {
          model: po_quotation_detail_attachment,
          include: attachment
        }]
      }, po_quotation_approve],
      where: {
        po_id: req.query.po_id
      }
    }).then((result) => {
      return result.map(o => o.toJSON())
    }).then((result) => {
      return result.map((poDetail) => {
        var ecost = poDetail.quotation.project.project_accounting.ecost

        var used = poDetail.quotation.po_quotations.reduce((sum, poq) => {
          if (poq.po.state == "done" || poq.po.id == req.query.po_id) {
            return sum + poq.po_quotation_details.reduce((lsum, d) => {
              return lsum + d.price * d.count
            }, 0)
          } else {
            return sum
          }
        }, 0)

        poDetail.left = ecost - used
        return poDetail
      })
    })
  },
  getPODrafts(req, res, next) {
    var sequelize = require('sequelize')
    var po = require("../../db/models/po")
    var po_quotation = require("../../db/models/po_quotation")
    var quotation = require("../../db/models/quotation")
    po.hasMany(po_quotation)
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    return po.findAll({
      include: po_quotation,
      where: {
        $and: {
          state: "draft",
          $or: {
            no: {
              $like: "%" + filterKey + "%"
            },
            prepared_by: {
              $like: "%" + filterKey + "%"
            },
            comments: {
              $like: "%" + filterKey + "%"
            },
            '$po_quotations.quotation_no$': {
              $like: "%" + filterKey + "%"
            }
          }
        }
      }
    }).then(function(result) {
      var list = result.map((o) => {
        var obj = o.toJSON()
        obj.quotation_nos = o.po_quotations.map(o => o.quotation_no).join(",")
        return obj
      })
      var rowCount = list.length
      list = list.slice(page * count, page * count + count)
      return {
        end: (list.length + page * count) >= rowCount,
        list: list
      }
    })
  },
  getPOWaitApproves(req, res, next) {
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    var po = require("../../db/models/po")
    var po_quotation = require("../../db/models/po_quotation")
    var po_quotation_approve = require("../../db/models/po_quotation_approve")
    po.hasMany(po_quotation)
    po_quotation.hasOne(po_quotation_approve)

    return po.findAll({
      include: {
        model: po_quotation,
        include: {
          model: po_quotation_approve,
          where: {
            $and: {
              boss_approve: false,
              manager_approve: false
            }
          }
        }
      },
      where: {
        $and: {
          state: "done",
          $or: {
            no: {
              $like: "%" + filterKey + "%"
            },
            prepared_by: {
              $like: "%" + filterKey + "%"
            },
            comments: {
              $like: "%" + filterKey + "%"
            },
            '$po_quotations.quotation_no$': {
              $like: "%" + filterKey + "%"
            }
          }
        }
      }
    }).then(function(result) {
      var list = result.map((o) => {
        var obj = o.toJSON()
        obj.quotation_nos = o.po_quotations.map(o => o.quotation_no).join(",")
        return obj
      })
      var rowCount = list.length
      list = list.slice(page * count, page * count + count)
      return {
        end: (list.length + page * count) >= rowCount,
        list: list
      }
    })
  },
  getPOWaitBossApproves(req, res, next) {
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    var po = require("../../db/models/po")
    var po_quotation = require("../../db/models/po_quotation")
    var po_quotation_approve = require("../../db/models/po_quotation_approve")
    var quotation = require("../../db/models/quotation")
    var project = require('../../db/models/project')
    var project_accounting = require('../../db/models/project_accounting')
    var po_quotation_detail = require('../../db/models/po_quotation_detail')


    po.hasMany(po_quotation)
    po_quotation.belongsTo(po)
    po_quotation.hasOne(po_quotation_approve)
    po_quotation.belongsTo(quotation)
    po_quotation.hasMany(po_quotation_detail)
    quotation.hasOne(project)

    quotation.hasMany(po_quotation)
    project.hasOne(project_accounting)

    return po.findAll({
      include: {
        model: po_quotation,
        include: [{
          model: po_quotation_approve,
          where: {
            $and: {
              boss_approve: false
            }
          }
        }, {
          model: quotation,
          include: [{
            model: project,
            include: project_accounting
          }, {
            model: po_quotation,
            include: [po_quotation_detail, po]
          }]
        }, po_quotation_detail]
      },
      where: {
        state: "done"
      }
    }).then(function(result) {
      var list = result.map((o) => {
        var obj = o.toJSON()
        obj.quotation_nos = o.po_quotations.map(o => o.quotation_no).join(",")
        return obj
      }).filter((po) => {
        return po.po_quotations.some((poquotation) => {
          var ecost = poquotation.quotation.project.project_accounting.ecost

          var used = poquotation.quotation.po_quotations.reduce((sum, poq) => {
            if (poq.po.state == "done" || poq.po.id == req.query.po_id) {
              return sum + poq.po_quotation_details.reduce((lsum, d) => {
                return lsum + d.price * d.count
              }, 0)
            } else {
              return sum
            }
          }, 0)
          return ecost < used
        })
      })

      if (filterKey) {
        list = list.filter((o) => {
          return o.no.indexOf(filterKey) >= 0 ||
            o.prepared_by.indexOf(filterKey) >= 0 ||
            o.comments.indexOf(filterKey) >= 0
        })
      }
      return {
        end: true,
        list: list
      }
    })
  },
  getApproved(req, res, next) {
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    var po = require("../../db/models/po")
    var po_quotation = require("../../db/models/po_quotation")
    var po_quotation_approve = require("../../db/models/po_quotation_approve")
    var quotation = require("../../db/models/quotation")
    var project = require('../../db/models/project')
    var project_accounting = require('../../db/models/project_accounting')
    var po_quotation_detail = require('../../db/models/po_quotation_detail')

    project.hasOne(project_accounting)

    po.hasMany(po_quotation)
    po_quotation.belongsTo(po)
    po_quotation.hasOne(po_quotation_approve)
    po_quotation.belongsTo(quotation)
    po_quotation.hasMany(po_quotation_detail)
    quotation.hasOne(project)

    quotation.hasMany(po_quotation)

    return po.findAll({
      include: {
        model: po_quotation,
        include: [{
          model: po_quotation_approve
        }, {
          model: quotation,
          include: [{
            model: project,
            include: project_accounting
          }, {
            model: po_quotation,
            include: [po_quotation_detail, po]
          }]
        }, {
          model: po_quotation_detail,
          where: {
            attachment_id: {
              $or: {
                $eq: 0,
                $eq: "",
                $eq: null
              }
            }
          }
        }]
      },
      where: {
        state: "done"
      }
    }).then(function(result) {
      var list = result.map((o) => {
        var obj = o.toJSON()
        obj.quotation_nos = o.po_quotations.map(o => o.quotation_no).join(",")
        return obj
      }).filter((po) => {
        return po.po_quotations.every((poquotation) => {
          if (poquotation.po_quotation_approve.boss_approve) {
            return true
          } else {
            var ecost = poquotation.quotation.project.project_accounting.ecost

            var used = poquotation.quotation.po_quotations.reduce((sum, poq) => {
              if (poq.po.state == "done" || poq.po.id == req.query.po_id) {
                return sum + poq.po_quotation_details.reduce((lsum, d) => {
                  return lsum + d.price * d.count
                }, 0)
              } else {
                return sum
              }
            }, 0)

            var needboss = ecost < used

            return !needboss && poquotation.po_quotation_approve.manager_approve
          }
        })
      })

      if (filterKey) {
        list = list.filter((o) => {
          return o.no.indexOf(filterKey) >= 0 ||
            o.prepared_by.indexOf(filterKey) >= 0 ||
            o.comments.indexOf(filterKey) >= 0
        })
      }
      return {
        end: true,
        list: list
      }
    })
  },
  getPOPaids(req, res, next) {
    var po = require("../../db/models/po")
    var po_quotation = require("../../db/models/po_quotation")
    var po_quotation_detail = require("../../db/models/po_quotation_detail")
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

    po.hasMany(po_quotation)
    po_quotation.hasOne(po_quotation_detail)

    return po.findAll({
      include: {
        model: po_quotation,
        include: {
          model: po_quotation_detail,
          where: {
            attachment_id: {
              $gt: 0
            }
          }
        }
      },
      where: {
        $and: {
          state: "done",
          $or: {
            no: {
              $like: "%" + filterKey + "%"
            },
            prepared_by: {
              $like: "%" + filterKey + "%"
            },
            comments: {
              $like: "%" + filterKey + "%"
            },
            '$po_quotations.quotation_no$': {
              $like: "%" + filterKey + "%"
            }
          }
        }
      }
    }).then(function(result) {
      var list = result.map((o) => {
        var obj = o.toJSON()
        obj.quotation_nos = o.po_quotations.map(o => o.quotation_no).join(",")
        return obj
      })
      var rowCount = list.length
      list = list.slice(page * count, page * count + count)
      return {
        end: (list.length + page * count) >= rowCount,
        list: list
      }
    })
  },
  getPOs(req, res, next) {
    var po = require("../../db/models/po")
    var po_quotation = require("../../db/models/po_quotation")
    var po_quotation_detail = require("../../db/models/po_quotation_detail")
    var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
    var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
    var page = req.query.page == undefined ? 0 : parseInt(req.query.page)
    po.hasMany(po_quotation)
    po_quotation.hasOne(po_quotation_detail)

    return po.findAll({
      include: {
        model: po_quotation,
        include: {
          model: po_quotation_detail
        }
      },
      where: {
        $or: {
          no: {
            $like: "%" + filterKey + "%"
          },
          prepared_by: {
            $like: "%" + filterKey + "%"
          },
          comments: {
            $like: "%" + filterKey + "%"
          },
          '$po_quotations.quotation_no$': {
            $like: "%" + filterKey + "%"
          }
        }
      }
    }).then(function(result) {
      var list = result.map((o) => {
        var obj = o.toJSON()
        obj.quotation_nos = o.po_quotations.map(o => o.quotation_no).join(",")
        return obj
      })
      var rowCount = list.length
      list = list.slice(page * count, page * count + count)
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
    try {
      return exec[result](req, res, next)
    } catch (e) {
      console.log(e)
      res.status(500).send(e)
    }
  }).then(function(result) {
    res.send(result)
  }).catch(function(error) {
    res.status(500).send(error.toString())
  })
}
