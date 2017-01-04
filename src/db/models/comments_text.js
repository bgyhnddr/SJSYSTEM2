var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var comments_text = sequelize.define(
    'comments_text', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true },
        code: { type: Sequelize.STRING, primaryKey: true },
        content: Sequelize.TEXT
    }, {
        underscored: true
    })


module.exports = comments_text
