var checkProjectConfirm = (id) => {
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
        if (result.project_state.manager_approve == true) {
          return "OK"
        } else {
          return Promise.reject("not allow")
        }
      }
    })
  })
}

var exec = {
  createInvoice(req, res, next) {
    var project = require('../../db/models/project')
    var project_state = require('../../db/models/project_state')
    var quotation = require('../../db/models/quotation')
    var quotation_job = require("../../db/models/quotation_job")
    var project_invoice = require("../../db/models/project_invoice")
    var project_invoice_detail = require("../../db/models/project_invoice_detail")

    var moment = require('moment')
    var common = require('../common')

    project.belongsTo(quotation)
    quotation.hasMany(quotation_job)
    project.hasMany(project_invoice)
    project_invoice.hasMany(project_invoice_detail)
    project_invoice_detail.belongsTo(quotation_job)



    return checkProjectConfirm(req.body.project_id).then(() => {
      return project.findOne({
        include: [{
          model: quotation,
          include: quotation_job
        }, {
          model: project_invoice,
          include: {
            model: project_invoice_detail,
            include: quotation_job
          }
        }],
        where: {
          id: req.body.project_id
        }
      })
    }).then((result) => {
      if (result != null) {
        return result
      } else {
        return Promise.reject("not found")
      }
    }).then((result) => {
      var ecost = result.quotation.quotation_jobs.reduce((sum, o) => {
        return sum + o.count * o.cost
      }, 0)

      var icost = result.project_invoices.reduce((sum, pi) => {
        return sum + pi.project_invoice_details.reduce((isum, d) => {
          return isum + d.quotation_job.count * d.quotation_job.cost
        }, 0)
      }, 0)
      if (ecost > icost) {
        return ecost - icost
      } else {
        return Promise.reject("超过预算")
      }
    }).then((result) => {
      return quotation_job.findAll({
        where: {
          id: {
            $in: req.body.project_invoce_details.map(o => o.quotation_job_id)
          }
        }
      }).then((qj) => {
        if (result < qj.reduce((sum, o) => {
            return sum + o.cost * o.count
          }, 0)) {
          return Promise.reject("超过预算")
        } else {
          return "OK"
        }
      })
    }).then(() => {
      return common.generate_serial_no("I")
    }).then((no) => {
      return project_invoice.create({
        no: no,
        create_date: moment().format("YYYY-MM-DD"),
        project_id: req.body.project_id
      })
    }).then((result) => {
      return project_invoice_detail.bulkCreate(req.body.project_invoce_details.map((o) => {
        return {
          project_invoice_no: result.no,
          quotation_job_id: o.quotation_job_id
        }
      }))
    }).then(() => {
      return "success"
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
