// scatterPlot.js
// corruption_index_score at the Y-Axis
// other variables at the X-Axis


// Path to your JSON data file
const dataFilePath = 'static/js/poverty_world_data.json';

// Function to create scatter plot
function createScatterPlot(data, xKey, yKey, topN = 'all') {
  let filteredData = data;

  // Check if we need to filter the data to top N countries
  if (topN !== 'all') {
    topN = parseInt(topN, 10); // Ensure topN is an integer
    filteredData = data.sort((a, b) => a.rank - b.rank).slice(0, topN);
  }

  const trace = {
    x: filteredData.map(d => d[yKey]), // Swapped yKey with xKey
    y: filteredData.map(d => d[xKey]), // Swapped xKey with yKey
    mode: 'markers',
    type: 'scatter',
    text: filteredData.map(d => d.country_name),
    marker: { size: 12 }
  };

  const layout = {
    title: 'Correlation between ' + yKey + ' and ' + xKey, // Swapped the places of xKey and yKey
    xaxis: { title: yKey }, // Swapped the places of xKey and yKey
    yaxis: { title: xKey }, // Swapped the places of xKey and yKey
    margin: { t: 30 }
  };

  Plotly.newPlot('scatter-content', [trace], layout);
}

// Function to load JSON data and then create the plot
function loadAndCreateScatterPlot() {
  fetch(dataFilePath)
    .then(response => response.json())
    .then(jsonData => {
      window.povertyData = jsonData;
      // Swapped 'corruption_index_score' and 'female_gross_enrolment'
      createScatterPlot(window.povertyData, 'female_gross_enrolment', 'corruption_index_score');
    })
    .catch(error => console.error('Error loading the JSON data:', error));
}

// Event handler for changing the dataset
function handleDatasetChange(event) {
  const selectedDataset = event.target.value;
  let xKey = 'corruption_index_score'; // This will now represent the Y axis
  let yKey; // This will now represent the X axis

  switch (selectedDataset) {
    case 'female_gross_enrolment':
      yKey = 'female_gross_enrolment';
      break;
    case 'male_gross_enrolment':
      yKey = 'male_gross_enrolment';
      break;
    case 'income_less_than_two_one_five':
      yKey = 'income_less_than_two_one_five';
      break;
    default:
      return; // If the selection is invalid, do nothing
  }

  const topNSelectElement = document.getElementById('topNSelect');
  const selectedTopN = topNSelectElement.value;

  createScatterPlot(window.povertyData, xKey, yKey, selectedTopN);
}

// Function to handle change in top N countries
function handleTopNChange(event) {
  const selectedTopN = event.target.value;
  const datasetSelectElement = document.getElementById('datasetSelect');
  const selectedDataset = datasetSelectElement.value;

  let xKey = 'corruption_index_score'; // This will now represent the Y axis
  let yKey; // This will now represent the X axis

  switch (selectedDataset) {
    case 'female_gross_enrolment':
      yKey = 'female_gross_enrolment';
      break;
    case 'male_gross_enrolment':
      yKey = 'male_gross_enrolment';
      break;
    case 'income_less_than_two_one_five':
      yKey = 'income_less_than_two_one_five';
      break;
    default:
      yKey = 'female_gross_enrolment'; // Default case
  }

  createScatterPlot(window.povertyData, xKey, yKey, selectedTopN);
}

// Ensuring the DOM is fully loaded before attaching event handlers and loading data
document.addEventListener('DOMContentLoaded', () => {
  loadAndCreateScatterPlot();
  document.getElementById('datasetSelect').addEventListener('change', handleDatasetChange);
  document.getElementById('topNSelect').addEventListener('change', handleTopNChange);
});
