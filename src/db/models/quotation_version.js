var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var quotation_version = sequelize.define(
    'quotation_version', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        quotation_no: { type: Sequelize.STRING, unique: true },
        version: { type: Sequelize.INTEGER, default: 1 }
    }, {
        underscored: true
    })


module.exports = quotation_version