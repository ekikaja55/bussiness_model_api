"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class noteModel extends Model {
    static associate(models) {
      noteModel.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  noteModel.init(
    {
      note_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      note_desc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      note_length: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "noteModel",
      tableName: "note_user",
      name: {
        plural: "notes",
        singular: "notes",
      },
      paranoid: true,
      timestamps: true,
    }
  );
  return noteModel;
};
