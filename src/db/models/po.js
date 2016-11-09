var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var po = sequelize.define(
    'po', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        no: { type: Sequelize.STRING, unique: true },
        prepared_by: Sequelize.STRING,
        date: Sequelize.STRING,
        comments: Sequelize.STRING,
        state: Sequelize.STRING
    }, {
        underscored: true
    })


module.exports = po