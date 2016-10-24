var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_contract = sequelize.define(
    'project_contract', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        project_id: { type: Sequelize.INTEGER, unique: true },
        attachment_id: Sequelize.INTEGER

    }, {
        underscored: true
    })


module.exports = project_contract