const express = require('express');
const path = require('path');
const app = express();
const port = 5002;
const cors = require('cors');

app.use(cors());



// Rute untuk membuka file main.js
app.get('/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.js'));
});
// Rute untuk halaman landing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'landingPage.html'));
});
// Rute untuk membuka file getTicketList.html
app.get('/getTicketList', (req, res) => {
    res.sendFile(path.join(__dirname, 'getTicketList.html'));
});

// Rute untuk membuka file detailTicket.html
app.get('/detailTicket', (req, res) => {
    res.sendFile(path.join(__dirname, 'detailTicket.html'));
});

// Rute untuk membuka file confirmationTicket.html
app.get('/confirmationTicket', (req, res) => {
    res.sendFile(path.join(__dirname, 'confirmationTicket.html'));
});

app.get('/flight', (req, res) => {
    res.sendFile(path.join(__dirname, 'getFlightList.html'));
});
app.get('/flightID', (req, res) => {
    res.sendFile(path.join(__dirname, 'getFlightByID.html'));
});
app.get('/flightID/confirtmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'flightTicketConfirmation.html'));
});

// Menjalankan server pada port 3000
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

