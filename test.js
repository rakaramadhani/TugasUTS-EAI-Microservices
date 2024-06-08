function fetchFlightList() {
    const listContainer = document.getElementById('flightList');
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
