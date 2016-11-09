var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var po_quotation_detail_attachment = sequelize.define(
    'po_quotation_detail_attachment', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        po_quotation_detail_id: Sequelize.INTEGER,
        attachment_id: Sequelize.INTEGER
    }, {
        underscored: true
    })


module.exports = po_quotation_detail_attachment