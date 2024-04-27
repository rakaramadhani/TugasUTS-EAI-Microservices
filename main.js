
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // atau gunakan "http://127.0.0.1:5500" untuk lebih spesifik
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
document.getElementById('addForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const tiketName = document.getElementById('tiketName').value;
    try {
        const response = await fetch('http://localhost:3000/tiket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: tiketName })
        });
        const data = await response.json();
        console.log('Success:', data);
        await fetchTiket();
    } catch (error) {
        console.error('Error:', error);
    }
});

async function fetchTiket() {
    try {
        const response = await fetch('http://localhost:3000/tiket');
        const data = await response.json();
        const tiketList = document.getElementById('tiketList');
        tiketList.innerHTML = '';
        data.forEach(tiket => {
            const li = document.createElement('li');
            li.textContent = tiket.name;
            tiketList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchTiket();