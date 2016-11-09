var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var po_payee = sequelize.define(
    'po_payee', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true },
        name: { type: Sequelize.STRING, primaryKey: true }
    }, {
        underscored: true
    })


module.exports = po_payee