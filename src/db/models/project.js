var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project = sequelize.define(
    'project', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        quotation_no: { type: Sequelize.STRING, unique: true },
        ori_quotation_no: { type: Sequelize.STRING, unique: true },
        property_management_co_name: { type: Sequelize.STRING },
        property_management_co_name_en: { type: Sequelize.STRING }
    }, {
        underscored: true
    })


module.exports = project