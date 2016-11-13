var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var building = sequelize.define(
    'building', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING, unique: true },
        name_en: { type: Sequelize.STRING, unique: true },
        address: { type: Sequelize.STRING },
        address_en: { type: Sequelize.STRING },
        bill_address: { type: Sequelize.STRING },
        bill_address_en: { type: Sequelize.STRING },
        attn: { type: Sequelize.STRING },
        attn_en: { type: Sequelize.STRING },
        tel: { type: Sequelize.STRING },
        fax: { type: Sequelize.STRING },
        mgt_tel: { type: Sequelize.STRING },
        mgt_fax: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING }
    }, {
        underscored: true
    })


module.exports = building
