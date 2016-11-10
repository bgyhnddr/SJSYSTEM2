var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var po_quotation_approve = sequelize.define(
    'po_quotation_approve', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        po_quotation_id: { type: Sequelize.INTEGER, unique: true },
        manager_approve: Sequelize.BOOLEAN,
        boss_approve: Sequelize.BOOLEAN
    }, {
        underscored: true
    })


module.exports = po_quotation_approve