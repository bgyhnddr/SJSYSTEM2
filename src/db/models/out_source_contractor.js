var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var out_source_contractor = sequelize.define(
    'out_source_contractor', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        code: { type: Sequelize.STRING, unique: true },
        company: { type: Sequelize.STRING },
        address: { type: Sequelize.STRING },
        address_en: { type: Sequelize.STRING },
        bill_address: { type: Sequelize.STRING },
        bill_address_en: { type: Sequelize.STRING },
        attn: { type: Sequelize.STRING },
        attn_en: { type: Sequelize.STRING },
        tel: { type: Sequelize.STRING },
        fax: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        comments: { type: Sequelize.STRING }
    }, {
        underscored: true
    })


module.exports = out_source_contractor