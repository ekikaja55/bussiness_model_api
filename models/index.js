const db = {};
const { DataTypes } = require("sequelize");
const connection = require("../connection/connection");

const User = require("./userModel");
const Note = require("./noteModel");
db.User = User(connection, DataTypes);
db.Note = Note(connection, DataTypes);

db.User.associate(db);
db.Note.associate(db);

module.exports = db;
