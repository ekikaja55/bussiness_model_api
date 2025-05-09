'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userModel extends Model {
        static associate(models) { }
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
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date_of_birth: {
                type: DataTypes.STRING,
                allowNull: false
            },
            api_key: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            refresh_token: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            balance: {
                type: DataTypes.INTEGER,

            },
            api_hit: {
                type: DataTypes.INTEGER
            },
        },
        {
            sequelize,
            modelName: 'userModel',
            tableName: 'user',
            name: {
                plural: 'users',
                singular: 'users'
            },
            paranoid: true,
            timestamps: true
        }
    );
    return userModel;
};
