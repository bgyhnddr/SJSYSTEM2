var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_hour = sequelize.define(
    'project_hour', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING },
        begin_date: { type: Sequelize.STRING },
        hour: Sequelize.FLOAT,
        staff: Sequelize.STRING,
        comments: Sequelize.STRING,
        project_id: Sequelize.INTEGER

    }, {
        underscored: true
    })


module.exports = project_hour