const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: '-01:00'
    },
    logging: false,
});


module.exports = sequelize;
