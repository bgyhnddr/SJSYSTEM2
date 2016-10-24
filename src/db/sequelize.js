var Sequelize = require('sequelize')
    // var sequelize = new Sequelize('qdm137219120_db', 'qdm137219120', '709394qwe', {
    //     host: 'qdm137219120.my3w.com',
    //     dialect: 'mysql'
    // })
var sequelize = new Sequelize('bdm241050686_db', 'bdm241050686', '709394qwe', {
        host: 'bdm241050686.my3w.com',
        dialect: 'mysql',
        timezone: '+08:00',
        logging: false
    })
    // var sequelize = new Sequelize('database', null, null, {
    //     dialect: 'sqlite',
    //     storage: 'src/db/data/database.db'
    // })

module.exports = sequelize