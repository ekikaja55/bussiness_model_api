const { Sequelize } = require("sequelize");

const connection = new Sequelize('db_bussiness', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection