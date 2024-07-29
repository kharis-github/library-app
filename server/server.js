// konfigurasi database
const db = require('./config/database'); // fungsi koneksi ke database
const bodyParser = require("body-parser");
const cors = require("cors"); // memampukan pengambilan data cross-domain
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
// IMPORT UTK SEQUELIZE
const User = require('./models/UserModel');
const Buku = require('./models/BukuModel');
const sequelize = require('sequelize');

const express = require('express');

// initialize app: untuk menggunakan API Express.js
const app = express()

// middleware untuk mengizinkan data dikirim dari front-end interface ke back-end
app.use(bodyParser.json());
// cors untuk mencegah cross-site scripting
app.use(cors())

// KONEKSI KE DATABASE
// // 1) mysql
// db.connect((err) => {
//     if (err) throw err;
//     console.log("KONEKSI DATABASE BERHASIL");
// });
// 2) sequelize
db.sync()
    .then(() => {
        console.log('KONEKSI DATABASE BERHASIL!');
    });

// TESTING
app.get("/", (req, res) => {
    res.send("Server ini berhasil!")
})

// FETCH DATA BUKU
app.get("/buku", async (req, res) => {
    // // 1-mysql
    // // ambil data dari database
    // const sql = "SELECT * FROM buku";
    // db.query(sql, (err, result) => {
    //     // unpack data dari json
    //     const results = JSON.parse(JSON.stringify(result));
    //     console.log(results);
    //     // tampilkan data ke client
    //     res.send(results);
    // });
    // 2-sequelize
    try {
        const buku = await Buku.findAll();
        res.json(buku); // Kirim data ke front-end dalam format JSON
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// INSERT DATA KE DATABASE
app.post("/add", (req, res) => {
    // console.log("Data dari user: ", req.body);
    // 1. ambil data dari user
    const { body } = req;
    const values = [
        body.judul,
        body.penulis,
        body.tahun_terbit,
        body.status_ketersediaan
    ];
    // // 1-mysql
    // // 2. konstruksi query masukkan data user
    // const sql = "INSERT INTO buku (`judul`, `penulis`, `tahun_terbit`, `status_ketersediaan`) VALUES (?)";
    // // 3. eksekusi query
    // db.query(sql, [values], (err, result) => {
    //     if (err) return res.json(err);
    //     return res.json(result);
    // })
    // 2-sequelize
    async function createBuku(judul, penulis, tahun_terbit, status_ketersediaan) {
        const buku = await Buku.create({ judul, penulis, tahun_terbit, status_ketersediaan });
        console.log('Buku created:', buku.toJSON());
    }
    // jalankan proses insert
    createBuku(...values);
})

// DELETE DARI DATABASE
app.delete("/buku/:id", (req, res) => {
    const id = req.params.id;
    // 1-mysql
    // const sql = "DELETE FROM buku WHERE id = ?";
    // // eksekusi CRUD delete
    // // console.log("ID BUKU: ", id);
    // db.query(sql, [id], (err, result) => {
    //     if (err) return res.json(err);
    //     return res.json(result)
    // })
    // 2-sequelize
    async function deleteBuku(id) {
        const buku = await Buku.findByPk(id);
        if (buku) {
            await buku.destroy();
            console.log('Delete berhasil!');
        } else {
            console.log('Delete gagal!');
        }
    }

    deleteBuku(id);
})

// UPDATE DATA PADA DATABASE
app.put("/buku/:id", async (req, res) => {
    // id buku dari params
    const id = req.params.id;
    // ekstraksi data dari body
    const { body } = req;
    // const values = [
    //     body.judul,
    //     body.penulis,
    //     body.tahun_terbit,
    //     body.status_ketersediaan
    // ];
    // // 1-mysql
    // const sql = "UPDATE buku SET `judul`=?, `penulis`=?, `tahun_terbit`=?, `status_ketersediaan`=? WHERE `id`=?";
    // // run sql
    // db.query(sql, [...values, id], (err, result) => {
    //     if (err) return res.json(err);
    //     return res.json(result)
    // })
    // 2-sequelize
    // ekstraksi data dari body
    const { judul, penulis, tahun_terbit, status_ketersediaan } = body;
    // jalankan proses update
    try {
        const buku = await Buku.findByPk(id);
        // jika buku ditemukan di database
        if (buku) {
            buku.judul = judul || buku.judul;
            buku.penulis = penulis || buku.penulis;
            buku.tahun_terbit = tahun_terbit || buku.tahun_terbit;
            buku.status_ketersediaan = status_ketersediaan !== undefined ? status_ketersediaan : buku.status_ketersediaan;

            await buku.save();
            res.json(buku); // Kirim data buku yang telah diperbarui ke front-end
        } else {
            // error handling
            res.status(404).json({ error: 'Buku not found' });
        }
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// MEMFILTER BUKU BERDASARKAN FIELD SEARCH
// Endpoint untuk mencari buku berdasarkan judul atau penulis
app.get('/search', async (req, res) => {
    // ekstraksi query teks pencarian
    const { q, option } = req.query;
    console.log("Query: ", q, "Option: ", option);
    try {
        // cari via filter
        if (option === 'judul') {
            const buku = await Buku.findAll({
                where: {
                    judul: {
                        [sequelize.Op.like]: `%${q}%`
                    }
                }
            });
            res.json(buku);
        }
        else if (option === 'penulis') {
            const buku = await Buku.findAll({
                where: {
                    penulis: {
                        [sequelize.Op.like]: `%${q}%`
                    }
                }
            });
            res.json(buku);
        }
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// REGISTRASI USER BARU
app.post('/register', async (req, res) => {
    // ekstraksi username dan password
    const { username, password, role } = req.body;
    console.log("Username: ", username, "Password: ", password, "Role", role);
    // 
    try {
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // upload data ke DB
        const user = await User.create({
            username,
            password: hashedPassword,
            role: role ? 'admin' : 'user'
        });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'User registration failed', error });
    }
})

// LOGIN USER YANG SUDAH ADA
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // validasi data user dengan data DB
        const user = await User.findOne({ where: { username } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            // kondisi gagal
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // buat JWT (json web token)
        const token = jwt.sign({ userId: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
})

const PORT = 8000;
app.listen(PORT, () => console.log(`SERVER LISTENING DI PORT ${PORT}`))