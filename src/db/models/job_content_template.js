var Sequelize = require('sequelize')
var sequelize = require('../sequelize')
var job_content_template = sequelize.define(
    'job_content_template', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        index: { type: Sequelize.INTEGER, defaultValue: 0 },
        content: { type: Sequelize.STRING, unique: 'jobContent' },
        project_item_id: { type: Sequelize.INTEGER, allowNull: false, unique: 'jobContent' }
    }, {
        underscored: true
    })
module.exports = job_content_template