var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var upload_content_template = sequelize.define(
    'upload_content_template', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        index: { type: Sequelize.INTEGER, defaultValue: 0 },
        content: { type: Sequelize.STRING, unique: true },
        project_item_id: { type: Sequelize.INTEGER, allowNull: false }
    }, {
        underscored: true
    })


module.exports = upload_content_template