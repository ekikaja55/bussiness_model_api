"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userModel extends Model {
    static associate(models) {
      userModel.hasMany(models.Note, {
        foreignKey: "user_id",
      });
    }
  }
  userModel.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      api_key: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      api_hit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "userModel",
      tableName: "user",
      name: {
        plural: "users",
        singular: "users",
      },
      paranoid: true,
      timestamps: true,
    }
  );
  return userModel;
};
