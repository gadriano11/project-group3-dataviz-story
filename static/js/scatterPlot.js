
let dataSet = [];
let currentChart;

// Load and parse the data
fetch('/api/v1.0/jsonify')
  .then(response => response.json())
  .then(data => {
    dataSet = data;
    createChart('female_gross_enrolment', 'all'); // Default chart
  });

// Function to create the chart
function createChart(selectedData, rankFilter) {
  if (currentChart) {
    currentChart.destroy(); // Destroy the existing chart before creating a new one
  }

  const filteredData = dataSet.filter(item => rankFilter === 'all' || item.rank <= rankFilter);
  const scatterData = filteredData.map(item => ({
    x: item.rank,
    y: item[selectedData],
    borderColor: getBorderColor(item.corruption_index_score)
  }));

  const ctx = document.getElementById('scatterChart').getContext('2d');
  currentChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Countries',
        data: scatterData,
        backgroundColor: scatterData.map(data => data.borderColor),

        // Customizations for dot size and border
        pointRadius: 5, // Adjust the size of the dots
        pointBorderColor: 'black', // Set the border color of the dots
        pointBorderWidth: 1 // Set the border width of the dots
      }]
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      }
    }
  });
}

// Color scaling function
function getBorderColor(score) {
  const greenValue = Math.round((score / 100) * 255);
  const redValue = 255 - greenValue;
  return `rgb(${redValue}, ${greenValue}, 0)`;
}

// Event listeners for the selectors
document.getElementById('datasetSelect').addEventListener('change', function() {
  updateChart();
});

document.getElementById('topNSelect').addEventListener('change', function() {
  updateChart();
});

// Function to update the chart based on selections
function updateChart() {
  const selectedData = document.getElementById('datasetSelect').value;
  const rankFilter = document.getElementById('topNSelect').value;
  createChart(selectedData, rankFilter);
}
