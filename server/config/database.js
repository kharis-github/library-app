// database.js menyimpan konfigurasi koneksi ke database relasional

// IMPORTS
const { Sequelize } = require('sequelize');
const mysql = require("mysql");

// KONFIGURASI
const host = "localhost"
const database = "library_app"
const user = "root"
const password = ""

// IMPLEMENTASI MENGGUNAKAN SEQUELIZE
// 1) db interface facade untuk berinteraksi dengan db mysql
const db = new Sequelize(database, user, password, {
    host,
    dialect: "mysql" // menggunakan db mysql
})

// // IMPLEMENTASI MENGGUNAKAN `mysql`
// const db = mysql.createConnection({
//     host,
//     database,
//     user,
//     password
// })

// EXPORT 

module.exports = db;