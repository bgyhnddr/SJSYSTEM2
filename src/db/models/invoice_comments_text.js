var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var invoice_comments_text = sequelize.define(
    'invoice_comments_text', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, unique: true },
        code: { type: Sequelize.STRING, primaryKey: true },
        content: Sequelize.TEXT
    }, {
        underscored: true
    })


module.exports = invoice_comments_text
