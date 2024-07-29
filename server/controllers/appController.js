// routing untuk aplikasi

const Buku = require('../models/BukuModel')

// 1 - display buku
exports.displayBuku = async (req, res) => {
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
}
// 2 - add buku
exports.addBuku = (req, res) => {
    console.log("Data dari user: ", req.body);
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
}
// 3 - update buku
exports.updateBuku = async (req, res) => {
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
}
// 4 - delete buku
exports.deleteBuku = (req, res) => {
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
}