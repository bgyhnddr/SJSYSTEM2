var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_record = sequelize.define(
    'project_record', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        action: { type: Sequelize.STRING },
        content: { type: Sequelize.STRING },
        user_account: { type: Sequelize.STRING }
    }, {
        underscored: true
    })


module.exports = project_record