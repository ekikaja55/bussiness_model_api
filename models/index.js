const db = {}
const { DataTypes } = require('sequelize');
const connection = require('../connection');

const User = require("./userModel");
db.User = User(connection, DataTypes);
db.User.associate();

module.exports = db;