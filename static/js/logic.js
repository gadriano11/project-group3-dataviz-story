// Creating the map object
let myMap = L.map('map', {
  center: [0, 0], // Use the World's center coordinates
  zoom: 2, // Adjust zoom level to show all markers
});

// Adding base maps
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  minZoom: 0,
  maxZoom: 20,
}).addTo(myMap);

// Global variable to store markers
let markers = [];

// Function to clear existing markers
function clearMarkers() {
  markers.forEach(marker => myMap.removeLayer(marker));
  markers = [];
}

// Function to add markers based on the selected regions
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

// Function to update the map based on checkbox selection
function updateMap() {
  const selectedRegions = Array.from(document.querySelectorAll('input[name="region"]:checked')).map(el => el.value);
  addMarkers(selectedRegions);
}

// Initial map loading with all markers
addMarkers([]);
