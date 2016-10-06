var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_manager = sequelize.define(
    'project_manager', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        user_account: { type: Sequelize.STRING, unique: true },
    }, {
        underscored: true
    })


module.exports = project_manager