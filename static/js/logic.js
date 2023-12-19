// Creating the map object
let myMap = L.map('map', {
  center: [0, 0], // World's center
  zoom: 2,
  scrollWheelZoom: true, // Allows zooming with the scroll wheel
  dragging: false, // Disables dragging
  touchZoom: true, // Allows zooming on touch devices
  doubleClickZoom: true, // Allows zooming with double click
});

// Adding base maps
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  minZoom: 0,
  maxZoom: 20,
}).addTo(myMap);

let markers = [];

// Function to determine marker color based on Corruption Index Score
function getColorByScore(score) {
  const percentage = score / 100;
  const red = Math.round((1 - percentage) * 255);
  const green = Math.round(percentage * 255);
  const blue = 0;
  return `rgb(${red}, ${green}, ${blue})`;
}

function clearMarkers() {
  markers.forEach(marker => myMap.removeLayer(marker));
  markers = [];
}

function addMarkers(selectedRegions) {
  clearMarkers();
  d3.json('static/js/corruption_data.json').then(data => {
    data.forEach(function(country) {
      if (selectedRegions.length === 0 || selectedRegions.includes(country.Region)) {
        const color = getColorByScore(country['Corruption Index Score']);
        let marker = L.marker([country.latitude, country.longitude], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%;"></div>`,
            iconSize: [10, 10]
          })
        }).addTo(myMap);
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
    let cell = row.insertCell();
    cell.innerText = country.Country; // Only displaying country names
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
