var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_item = sequelize.define(
    'project_item', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING, unique: true },
        project_type_id: { type: Sequelize.INTEGER, allowNull: false },

    }, {
        underscored: true
    })


module.exports = project_item