var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var staff = sequelize.define(
    'staff', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true },
        name: { type: Sequelize.STRING, primaryKey: true }
    }, {
        underscored: true
    })


module.exports = staff
