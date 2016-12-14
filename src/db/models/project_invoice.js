var Sequelize = require('sequelize')
var sequelize = require('../sequelize')

var project_invoice = sequelize.define(
  'project_invoice', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true
    },
    no: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    project_id: Sequelize.INTEGER,
    create_date: Sequelize.STRING,
    check_date: Sequelize.STRING,
    check_no: Sequelize.STRING,
    check_money: Sequelize.DECIMAL,
    attachment_id: Sequelize.INTEGER,
    total: Sequelize.DECIMAL
  }, {
    underscored: true
  })


module.exports = project_invoice
