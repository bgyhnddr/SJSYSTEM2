var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_accounting = sequelize.define(
    'project_accounting', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        project_id: { type: Sequelize.INTEGER, unique: true },
        ecost: Sequelize.DECIMAL,
        acost: Sequelize.DECIMAL,
        income: Sequelize.DECIMAL
    }, {
        underscored: true
    })


module.exports = project_accounting