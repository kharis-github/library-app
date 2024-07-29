// model data user untuk sequelize

// import Sequelize from "sequelize";
const Sequelize = require("sequelize")
// import db from "../config/database";
const db = require("../config/database")

const { DataTypes } = Sequelize; // untuk mendefinisikan datatype model

const User = db.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin'],
        defaultValue: 'user'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// export model
module.exports = User;