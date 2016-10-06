var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var staff = sequelize.define(
    'staff', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING, unique: true }
    }, {
        underscored: true
    })


module.exports = staff