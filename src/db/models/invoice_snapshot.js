var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var invoice_snapshot = sequelize.define(
    'invoice_snapshot', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        project_invoice_id: { type: Sequelize.INTEGER, unique: true },
        content: Sequelize.STRING(32768)
    }, {
        underscored: true
    })


module.exports = invoice_snapshot
