var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var po_quotation = sequelize.define(
    'po_quotation', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        po_id: Sequelize.INTEGER,
        quotation_no: Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = po_quotation