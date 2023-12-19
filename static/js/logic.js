// Creating the map object
let myMap = L.map('map', {
  center: [0, 0], // World's center
  zoom: 2,
});

// Adding base maps
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  minZoom: 0,
  maxZoom: 20,
}).addTo(myMap);

let markers = [];

function clearMarkers() {
  markers.forEach(marker => myMap.removeLayer(marker));
  markers = [];
}

function addMarkers(selectedRegions) {
  clearMarkers();
  d3.json('static/js/corruption_data.json').then(data => {
    data.forEach(function(country) {
      if (selectedRegions.length === 0 || selectedRegions.includes(country.Region)) {
        let marker = L.marker([country.latitude, country.longitude]).addTo(myMap);
        marker.bindPopup(`<div>
          <strong>Country:</strong> ${country.Country}<br>
          <strong>Code:</strong> ${country.Code}<br>
          <strong>Region:</strong> ${country.Region}<br>
          <strong>Corruption Index Score:</strong> ${country['Corruption Index Score']}<br>
          <strong>Rank:</strong> ${country.Rank}
        </div>`);
        markers.push(marker);
      }
    });
  }).catch(error => console.error('Error:', error));
}

function updateMap() {
  const selectedRegions = Array.from(document.querySelectorAll('input[name="region"]:checked')).map(el => el.value);
  addMarkers(selectedRegions);
}

function createTable(data, containerId) {
  let container = document.getElementById(containerId);
  let table = document.createElement('table');
  data.forEach(country => {
    let row = table.insertRow();
    Object.values(country).forEach(text => {
      let cell = row.insertCell();
      cell.innerText = text;
    });
  });
  container.appendChild(table);
}

function loadAndProcessData() {
  d3.json('static/js/corruption_data.json').then(data => {
    let sortedData = data.sort((a, b) => a.Rank - b.Rank);
    let cleanest = sortedData.slice(0, 10);
    let mostCorrupt = sortedData.slice(-10).reverse();

    createTable(cleanest, 'cleanest-table');
    createTable(mostCorrupt, 'most-corrupt-table');

    addMarkers([]);
  }).catch(error => console.error('Error:', error));
}

loadAndProcessData();
