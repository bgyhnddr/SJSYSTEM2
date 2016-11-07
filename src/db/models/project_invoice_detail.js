var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_invoice_detail = sequelize.define(
    'project_invoice_detail', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        project_invoice_no: Sequelize.STRING,
        quotation_job_id: Sequelize.INTEGER
    }, {
        underscored: true
    })


module.exports = project_invoice_detail