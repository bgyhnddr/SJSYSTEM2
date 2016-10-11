var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var serial_number = sequelize.define(
    'serial_number', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        company: { type: Sequelize.STRING },
        number: { type: Sequelize.INTEGER, default: 0 },
        year: { type: Sequelize.INTEGER },
        type: { type: Sequelize.STRING }
    }, {
        underscored: true
    })


module.exports = serial_number