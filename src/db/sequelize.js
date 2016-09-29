var Sequelize = require('sequelize')
// var sequelize = new Sequelize('qdm137219120_db', 'qdm137219120', '709394qwe', {
//     host: 'qdm137219120.my3w.com',
//     dialect: 'mysql'
// })
var sequelize = new Sequelize('sequelize_test', 'cypher_admin', 'Cypher2015', {
    host: '192.168.10.20',
    dialect: 'mysql',
    timezone: '+08:00'
})

module.exports = sequelize