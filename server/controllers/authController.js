// endpoint-endpoint autentikasi

const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// endpoint registrasi
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // upload data ke DB
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'User registration failed', error });
    }
};

// endpoint login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // validasi data user dengan data DB
        const user = await User.findOne({ where: { username } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // buat JWT (json web token)
        const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};
