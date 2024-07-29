// model data user untuk sequelize

// import Sequelize from "sequelize";
const Sequelize = require("sequelize")
// import db from "../config/database";
const db = require("../config/database")

const { DataTypes } = Sequelize; // untuk mendefinisikan datatype model

const Buku = db.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    judul: {
        type: DataTypes.STRING,
        allowNull: false
    },
    penulis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tahun_terbit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status_ketersediaan: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// export model
module.exports = Buku;