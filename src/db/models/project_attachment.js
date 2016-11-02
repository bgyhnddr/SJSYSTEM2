var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_attachment = sequelize.define(
    'project_attachment', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        index: Sequelize.INTEGER,
        project_id: { type: Sequelize.INTEGER },
        content: { type: Sequelize.STRING },
        attachment_id: Sequelize.INTEGER
    }, {
        underscored: true
    })


module.exports = project_attachment