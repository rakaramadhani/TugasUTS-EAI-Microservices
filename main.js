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
                    <ul class="grid grid-cols-4 gap-4 justify-center">
                        ${data.map(tiket => `
                            <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-white dark:border-gray-100">
                                <a href="#">
                                    <img class="rounded-t-lg" src="${tiket.image}" alt="${tiket.nama_wisata}" style="width: 100%;" /> <!-- Added style to set image width -->
                                </a>
                                <div class="p-5">
                                    <a href="#">
                                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-indigo-700">${tiket.nama_wisata}</h5>
                                    </a>
                                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${tiket.lokasi}</p>
                                    <p class="text-lg mb-3 font-normal text-gray-700 dark:text-indigo-400">Mulai dari: <span class="font-bold text-indigo-500">Rp.${tiket.harga}</span> / orang</p>
                                    <p class="text-lg mb-3 font-normal text-gray-700 dark:text-indigo-400">Tiket tersisa <span class="text-red-500 font-bold">${tiket.stock}</span></p>
                                    <a href="/detailTicket?id=${tiket.id}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Beli Sekarang
                                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
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
                <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-5">
                    <h2 class="text-lg font-semibold text-gray-900">Detail Tiket: ${data.nama_wisata}</h2>
                    <p class="text-gray-600">ID: <span id="tiketId">${data.id}</span></p>
                    <p class="text-gray-600">Harga: ${data.harga}</p>
                    <p class="text-gray-600">Stok: ${data.stock}</p>
                    <p class="text-gray-600">Buka pada: ${data.open} WIB</p>
                    <p class="text-gray-600">Tutup pada: ${data.close} WIB</p>
                    <p class="text-gray-600">Lokasi: ${data.lokasi}</p>
                    <div class="mt-4">
                        <label for="jumlah" class="block text-sm font-medium text-gray-700">Jumlah tiket yang ingin di beli:</label>
                        <div>
                            <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Small input</label>
                            <input type="number" id="jumlah" name="jumlah" min="1" max="${data.stock}" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        </div>
                    </div>
                    <button id="beliButton" class="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Beli Tiket
                    </button>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function beliTiket(id, jumlah) {
    fetch(`http://localhost:3000/tiket/beli/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, jumlah: jumlah })
    })
    .then(response => {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            // Jika respon bukan JSON, baca sebagai teks
            return response.text();
        }
    })
    .then(data => {
        // Jika data adalah objek, asumsikan itu adalah JSON dan periksa properti 'success'
        if (typeof data === 'object' && data.success) {
            alert('Pembelian tiket berhasil!');
            window.location.href = '/confirmationTicket';
        } else if (typeof data === 'string' && data.includes("Pembelian tiket berhasil")) {
            // Jika data adalah string dan mengandung pesan sukses, tangani sebagai sukses
            alert('Pembelian tiket berhasil!');
            window.location.href = '/confirmationTicket';
        } else {
            // Jika tidak ada kasus di atas, lempar error
            throw new Error('Server mengembalikan error: ' + data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat pembelian tiket.');
    });

}