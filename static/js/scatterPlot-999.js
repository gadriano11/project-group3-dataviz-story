// scatterPlot.js

// Path to your JSON data file
const dataFilePath = 'static/js/poverty_world_data.json';

// Function to create scatter plot
function createScatterPlot(data, xKey, yKey, topN = 'all') {
  let filteredData = data.filter(d => {
    if (yKey === 'income_less_than_two_one_five' && d[yKey] === null) {
      return false;
    }
    if ((yKey === 'female_gross_enrolment' || yKey === 'male_gross_enrolment') && d[yKey] === 0) {
      return false;
    }
    return true;
  });

  // Check if we need to filter the data to top N countries
  if (topN !== 'all') {
    topN = parseInt(topN, 10); // Ensure topN is an integer
    filteredData = filteredData.sort((a, b) => a[xKey] - b[xKey]).slice(0, topN);
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
    title: 'Correlation between Rank and ' + getYAxisLabel(yKey),
    xaxis: { title: 'Corruption Index Score Rank (from Very Clean to Highly Corrupt)' },
    yaxis: { title: getYAxisLabel(yKey) },
    margin: { t: 30 }
  };

  Plotly.newPlot('scatter-content', [trace], layout);
}

// Function to determine the Y-axis label based on yKey
function getYAxisLabel(yKey) {
  switch (yKey) {
    case 'female_gross_enrolment':
      return 'Female Gross Enrolment';
    case 'male_gross_enrolment':
      return 'Male Gross Enrolment';
    case 'income_less_than_two_one_five':
      return 'Income Less Than $2.15';
    default:
      return yKey; // Default to the key itself if not specified
  }
}

// Function to load JSON data and then create the plot
function loadAndCreateScatterPlot() {
  fetch(dataFilePath)
    .then(response => response.json())
    .then(jsonData => {
      window.povertyData = jsonData;
      // Set 'rank' as the x-axis and 'female_gross_enrolment' as the y-axis by default
      createScatterPlot(window.povertyData, 'rank', 'female_gross_enrolment');
    })
    .catch(error => console.error('Error loading the JSON data:', error));
}

// Event handler for changing the dataset
function handleDatasetChange(event) {
  const selectedYKey = event.target.value;
  createScatterPlot(window.povertyData, 'rank', selectedYKey, document.getElementById('topNSelect').value);
}

// Function to handle change in top N countries
function handleTopNChange(event) {
  const selectedTopN = event.target.value;
  const selectedYKey = document.getElementById('datasetSelect').value;

  createScatterPlot(window.povertyData, 'rank', selectedYKey, selectedTopN);
}

// Ensuring the DOM is fully loaded before attaching event handlers and loading data
document.addEventListener('DOMContentLoaded', () => {
  loadAndCreateScatterPlot();
  document.getElementById('datasetSelect').addEventListener('change', handleDatasetChange);
  document.getElementById('topNSelect').addEventListener('change', handleTopNChange);
});
