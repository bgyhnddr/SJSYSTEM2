var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var quotation = sequelize.define(
    'quotation', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true },
        no: { type: Sequelize.STRING, primaryKey: true },
        project_name: { type: Sequelize.STRING },
        project_type: { type: Sequelize.STRING },
        project_item: { type: Sequelize.STRING },
        property_management_co: { type: Sequelize.STRING },
        buliding: { type: Sequelize.STRING },
        manager: { type: Sequelize.STRING },
        project_id: { type: Sequelize.INTEGER }

    }, {
        underscored: true
    })


module.exports = quotation