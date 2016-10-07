var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var property_management_co = sequelize.define(
    'property_management_co', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        code: { type: Sequelize.STRING, unique: true },
        name: { type: Sequelize.STRING, unique: true },
        name_en: { type: Sequelize.STRING, unique: true }
    }, {
        underscored: true
    })


module.exports = property_management_co