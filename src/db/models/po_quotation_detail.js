var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var po_quotation_detail = sequelize.define(
    'po_quotation_detail', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        po_quotation_id: Sequelize.INTEGER,
        po_payee_name: Sequelize.STRING,
        content: Sequelize.STRING,
        price: { type: Sequelize.DECIMAL, defaultValue: 0 },
        count: { type: Sequelize.DECIMAL, defaultValue: 0 },
        check_no: Sequelize.STRING,
        attachment_id: Sequelize.INTEGER
    }, {
        underscored: true
    })


module.exports = po_quotation_detail