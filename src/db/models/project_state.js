var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_state = sequelize.define(
    'project_state', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        project_id: { type: Sequelize.INTEGER, unique: true },
        state: { type: Sequelize.STRING },
        manager_approve: { type: Sequelize.BOOLEAN, default: false },
        boss_approve: { type: Sequelize.BOOLEAN, default: false },
        boss_edit: { type: Sequelize.BOOLEAN, default: false }
    }, {
        underscored: true
    })


module.exports = project_state