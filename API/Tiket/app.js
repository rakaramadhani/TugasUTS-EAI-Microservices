const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const PORT = 3000;

// Menyiapkan koneksi ke database
const connection = mysql.createConnection({
    host: 'mysql-3cd749a3-student-243e.a.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS__5WPvHLIhgZcPkJKJI6',
    port: '24602',
    database: 'UTS_EAI',
    connectTimeout: 10000
});

// Membuat koneksi ke database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Menyiapkan middleware untuk parsing body dari request
app.use(bodyParser.json());

// Mendapatkan semua tiket
app.get('/tiket', (req, res) => {
  connection.query('SELECT * FROM tiket', (error, results) => {
    if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
        return;
    }
    res.json(results);
    });
});

// Mendapatkan tiket berdasarkan ID
app.get('/tiket/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM tiket WHERE id = ?', id, (error, results) => {
        if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
        return;
        }
        if (results.length === 0) {
        res.status(404).send('Tiket tidak ditemukan');
        } else {
        res.json(results[0]);
        }
    });
});

// Menambahkan tiket baru
app.post('/tiket', (req, res) => {
    const tiket = req.body;
    connection.query('INSERT INTO tiket SET ?', tiket, (error, results) => {
        if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
        return;
        }
        res.status(201).send('Tiket berhasil ditambahkan');
    });
});

// Menghapus tiket berdasarkan ID
app.delete('/tiket/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM tiket WHERE id = ?', id, (error, results) => {
        if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
        return;
        }
        res.send('Tiket berhasil dihapus');
    });
});

// Mengubah tiket berdasarkan ID
app.put('/tiket/:id', (req, res) => {
    const id = req.params.id;
    const updatedTiket = req.body;
    connection.query('UPDATE tiket SET ? WHERE id = ?', [updatedTiket, id], (error, results) => {
        if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
        return;
        }
        res.send('Tiket berhasil diperbarui');
    });
});

// Menjalankan server pada port 3000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`http://localhost:${PORT}/tiket`);
});
