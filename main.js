document.addEventListener('DOMContentLoaded', function() {
    fetchTiketList();

    document.body.addEventListener('click', function(event) {
        if (event.target.className === 'detailButton') {
            const tiketId = event.target.getAttribute('data-id');
            fetchTiketDetail(tiketId);
        } else if (event.target.id === 'beliButton') {
            const tiketId = document.getElementById('tiketId').textContent;
            const jumlah = document.getElementById('jumlah').value;
            beliTiket(tiketId, jumlah);
        }
    });
});

// Menggunakan template literal untuk memperbaiki tata letak HTML
function fetchTiketList() {
    const listContainer = document.getElementById('tiketList');
    if (listContainer) {
        fetch('http://localhost:3000/tiket')
            .then(response => response.json())
            .then(data => {
                listContainer.innerHTML = `
                    <ul class="grid grid-cols-4 gap-6">
                        ${data.map(tiket => `
                            <li class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                                <a href="#">
                                    <img class="w-full" src="${tiket.image}" alt="${tiket.nama_wisata}" />
                                </a>
                                <div class="p-5">
                                    <a href="#">
                                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">${tiket.nama_wisata}</h5>
                                    </a>
                                    <p class="mb-3 font-normal text-gray-700">${tiket.lokasi}</p>
                                    <p class="text-lg font-normal text-gray-700">Mulai dari: <span class="font-bold text-indigo-500">Rp.${tiket.harga}</span> / orang</p>
                                    <p class="text-lg font-normal text-gray-700">Tiket tersisa <span class="text-red-500 font-bold">${tiket.stock}</span></p>
                                    <a href="/detailTicket?id=${tiket.id}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                        Beli Sekarang
                                        <svg class="ml-2 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                        </svg>
                                    </a>
                                </div>
                            </li>
                        `).join('')}
                    </ul>`;
            });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tiketId = urlParams.get('id');
    if (tiketId) {
        fetchTiketDetail(tiketId);
    }
});

function fetchTiketDetail(id) {
    fetch(`http://localhost:3000/tiket/${id}`)
        .then(response => response.json())
        .then(data => {
            const detailContainer = document.getElementById('detailTiket');
            detailContainer.innerHTML = `
                <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden w-full p-10">
                    <h2 class="text-center mb-10 text-4xl font-bold text-gray-900"><span id="tiketId" class="text-red-500">${data.id}</span>. ${data.nama_wisata}</h2>
                    <p class="text-gray-600">Harga: <span class="text-red-500 font-bold">${data.harga}</span></p>
                    <p class="text-gray-600">Stok: <span class="text-red-500 font-bold">${data.stock}</span></p>
                    <p class="text-gray-600">Buka pada: <span class="text-blue-500 font-bold">${data.open}</span> WIB</p>
                    <p class="text-gray-600">Tutup pada: <span class="text-blue-500 font-bold">${data.close}</span> WIB</p>
                    <p class="text-gray-600">Lokasi: <span class=" font-bold">${data.lokasi}</span></p>
                    <div class="mt-4">
                        <label for="nama" class="block text-sm font-medium text-gray-700">Nama Pemesan:</label>
                        <input type="text" id="nama" name="nama" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                        <label for="nik" class="block text-sm font-medium text-gray-700">NIK:</label>
                        <input type="text" id="nik" name="nik" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                        <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                        <input type="email" id="email" name="email" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                        <label for="jumlah" class="block text-sm font-medium text-gray-700">Jumlah Tiket:</label>
                        <input type="number" id="jumlah" name="jumlah" min="1" max="${data.stock}" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <button id="beliButton" class="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        <a href="">Beli Tiket</a>
                    </button>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function beliTiket(id, jumlah) {
    const nama = document.getElementById('nama').value;
    const nik = document.getElementById('nik').value;
    const email = document.getElementById('email').value;
    const id_tiket = document.getElementById('tiketId').textContent;

    fetch(`http://localhost:3000/tiket/beli/${id_tiket}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, tiket_id: id_tiket, jumlah: jumlah, nama: nama, nik: nik, email: email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Menerima respons sebagai teks
    })
    .then(text => {
        // Langsung menangani teks respons tanpa mencoba mem-parsing sebagai JSON
        if (text === "Pembelian tiket berhasil") {
            alert('Pembelian tiket berhasil!');
            window.location.href = '/confirmationTicket';
        } else {
            throw new Error('Server mengembalikan error: ' + text);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat pembelian tiket: ' + error.message);
    });
}

// FLIGHT

function fetchFlightList() {
    const listContainer = document.getElementById('flightList');
    if (listContainer) {
        fetch('https://d22a-180-244-134-126.ngrok-free.app/flights', {headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          })})
            .then(response => response.json())
            .then(data => {
                console.log(data)
                listContainer.innerHTML = `
                <ul class="grid grid-cols-1 gap-4">
                ${data.data.map(flight => `
                    <div class="max-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div class="p-5 flex justify-between items-center">
                            <div>
                                <h5 class="mb-2 text-xl font-bold text-gray-900">${flight.nama_maskapai} - ${flight.kode_penerbangan}</h5>
                                <p class="text-sm font-medium text-gray-700">${flight.departure_city} (${flight.dept_IATA}) - ${flight.arrival_city} (${flight.dest_IATA})</p>
                                <div class="text-gray-700">
                                    <p>Departure: ${new Date(flight.dept_time).toLocaleString()}</p>
                                    <p>Arrival: ${new Date(flight.arriv_time).toLocaleString()}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-bold text-indigo-600">Rp.${flight.harga.toLocaleString()} / pax</p>
                                <p class="text-sm font-medium text-red-500">Tickets remaining: ${flight.jumlah_tiket}</p>
                                <a href="/flightID?id=${flight.kode_penerbangan}" class="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                    Choose
                                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </ul>`;
            });
    }
}

document.addEventListener('DOMContentLoaded', fetchFlightList);


function flightbyLocation() {
    const listContainer = document.getElementById('');
    const kota = document.getElementById('lokasi').textContent;
    if (listContainer) {
        fetch(`https://d22a-180-244-134-126.ngrok-free.app/flights/to/${kota}`, {headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          })})
            .then(response => response.json())
            .then(data => {
                console.log(data)
                listContainer.innerHTML = `
                <ul class="grid grid-cols-1 gap-4">
                ${data.data.map(flight => `
                    <div class="max-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div class="p-5 flex justify-between items-center">
                            <div>
                                <h5 class="mb-2 text-xl font-bold text-gray-900">${flight.nama_maskapai} - ${flight.kode_penerbangan}</h5>
                                <p class="text-sm font-medium text-gray-700">${flight.departure_city} (${flight.dept_IATA}) - ${flight.arrival_city} (${flight.dest_IATA})</p>
                                <div class="text-gray-700">
                                    <p>Departure: ${new Date(flight.dept_time).toLocaleString()}</p>
                                    <p>Arrival: ${new Date(flight.arriv_time).toLocaleString()}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-bold text-indigo-600">Rp.${flight.harga.toLocaleString()} / pax</p>
                                <p class="text-sm font-medium text-red-500">Tickets remaining: ${flight.jumlah_tiket}</p>
                                <a href="/flightID?id=${flight.kode_penerbangan}" class="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                    Choose
                                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </ul>`;
            });
    }
}

document.addEventListener('DOMContentLoaded', fetchFlightList);

