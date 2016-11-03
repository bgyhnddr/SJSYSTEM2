var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_out_source = sequelize.define(
    'project_out_source', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        out_source_contractor_id: { type: Sequelize.INTEGER },
        content: Sequelize.STRING,
        cost: Sequelize.DECIMAL,
        attachment_id: Sequelize.INTEGER,
        project_id: Sequelize.INTEGER,
        comments: Sequelize.STRING,
        finish_date: Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = project_out_source