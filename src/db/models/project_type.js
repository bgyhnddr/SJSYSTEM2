var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_type = sequelize.define(
    'project_type', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING, unique: true }

    }, {
        underscored: true
    })


module.exports = project_type