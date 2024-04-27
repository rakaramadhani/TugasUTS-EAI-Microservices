const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const PORT = 3000;
const cors = require('cors');
app.use(cors());



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

// Membeli tiket berdasarkan ID
app.post('/tiket/beli/:id', (req, res) => {
    const id = req.params.id;
    const jumlahBeli = req.body.jumlah;

    connection.query('SELECT stock FROM tiket WHERE id = ?', id, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Tiket tidak ditemukan');
            return;
        }

        const stockTersedia = results[0].stock;
        if (stockTersedia < jumlahBeli) {
            res.status(400).send('stock tidak cukup');
            return;
        }

        const stockBaru = stockTersedia - jumlahBeli;
        connection.query('UPDATE tiket SET stock = ? WHERE id = ?', [stockBaru, id], (updateError, updateResults) => {
            if (updateError) {
                console.error('Error executing update query:', updateError);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send('Pembelian tiket berhasil');
        });
    });
});



// Menjalankan server pada port 3000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`http://localhost:${PORT}/tiket`);
});
