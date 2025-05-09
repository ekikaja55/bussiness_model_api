const { Sequelize } = require("sequelize");

const connection = new Sequelize('db_week_9', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection