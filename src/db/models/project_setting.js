var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_setting = sequelize.define(
    'project_setting', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true },
        code: { type: Sequelize.INTEGER, primaryKey: true },
        value: Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = project_setting