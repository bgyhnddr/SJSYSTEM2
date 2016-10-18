var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var quotation_job = sequelize.define(
    'quotation_job', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        quotation_no: { type: Sequelize.STRING, unique: "quotation_content" },
        index: { type: Sequelize.INTEGER, defaultValue: 0 },
        content: { type: Sequelize.STRING, unique: "quotation_content" },
        cost: { type: Sequelize.DECIMAL, defaultValue: 0 },
        retail: { type: Sequelize.DECIMAL, defaultValue: 0 },
        count: { type: Sequelize.STRING, defaultValue: 0 }
    }, {
        underscored: true
    })


module.exports = quotation_job