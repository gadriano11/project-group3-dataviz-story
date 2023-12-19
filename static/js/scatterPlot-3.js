// scatterPlot.js
// Rank at Y-axis
// Other variables at X-axis


// Path to your JSON data file
const dataFilePath = 'static/js/poverty_world_data.json';

// Function to create scatter plot
function createScatterPlot(data, yKey, xKey, topN = 'all') {
  let filteredData = data;

  // Check if we need to filter the data to top N countries
  if (topN !== 'all') {
    topN = parseInt(topN, 10); // Ensure topN is an integer
    filteredData = data.sort((a, b) => a.rank - b.rank).slice(0, topN);
  }

  const trace = {
    x: filteredData.map(d => d[xKey]), // x-axis data
    y: filteredData.map(d => d[yKey]), // y-axis data
    mode: 'markers',
    type: 'scatter',
    text: filteredData.map(d => d.country_name),
    marker: { size: 12 }
  };

  const layout = {
    title: 'Correlation between ' + xKey + ' and Rank',
    xaxis: { title: xKey },
    yaxis: { title: 'Rank' },
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
      // Call with rank as the y-axis and female_gross_enrolment as the x-axis
      createScatterPlot(window.povertyData, 'rank', 'female_gross_enrolment');
    })
    .catch(error => console.error('Error loading the JSON data:', error));
}

// Event handler for changing the dataset
function handleDatasetChange(event) {
  const selectedDataset = event.target.value;
  let yKey = 'rank'; // Y-axis is now 'rank'
  let xKey; // X-axis will be determined based on selection

  switch (selectedDataset) {
    case 'female_gross_enrolment':
      xKey = 'female_gross_enrolment';
      break;
    case 'male_gross_enrolment':
      xKey = 'male_gross_enrolment';
      break;
    case 'income_less_than_two_one_five':
      xKey = 'income_less_than_two_one_five';
      break;
    default:
      return; // If the selection is invalid, do nothing
  }

  const topNSelectElement = document.getElementById('topNSelect');
  const selectedTopN = topNSelectElement.value;

  createScatterPlot(window.povertyData, yKey, xKey, selectedTopN);
}

// Function to handle change in top N countries
function handleTopNChange(event) {
  const selectedTopN = event.target.value;
  const datasetSelectElement = document.getElementById('datasetSelect');
  const selectedDataset = datasetSelectElement.value;

  let yKey = 'rank'; // Y-axis is now 'rank'
  let xKey; // X-axis will be determined based on selection

  switch (selectedDataset) {
    case 'female_gross_enrolment':
      xKey = 'female_gross_enrolment';
      break;
    case 'male_gross_enrolment':
      xKey = 'male_gross_enrolment';
      break;
    case 'income_less_than_two_one_five':
      xKey = 'income_less_than_two_one_five';
      break;
    default:
      xKey = 'female_gross_enrolment'; // Default case if none is selected
  }

  createScatterPlot(window.povertyData, yKey, xKey, selectedTopN);
}

// Ensuring the DOM is fully loaded before attaching event handlers and loading data
document.addEventListener('DOMContentLoaded', () => {
  loadAndCreateScatterPlot();
  document.getElementById('datasetSelect').addEventListener('change', handleDatasetChange);
  document.getElementById('topNSelect').addEventListener('change', handleTopNChange);
});
