// Path to your JSON data file
const dataFilePath = 'static/js/poverty_world_data.json';

// Create root element and chart
var root = am5.Root.new("chartdiv");
root.setThemes([am5themes_Animated.new(root)]);

var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: true,
  wheelY: "zoomXY",
  pinchZoomX: true,
  pinchZoomY: true
}));

// Create axes
var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererX.new(root, {})
}));

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));

// Function to create scatter series
function createScatterSeries(data, xKey, yKey) {
  var series = chart.series.push(am5xy.XYSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: yKey,
    valueXField: xKey
  }));




  
  series.bullets.push(function() {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: series.get("fill"),
        stroke: am5.color(0x000000), // Black border
        strokeWidth: 2 // Width of the border
      })
    });
  });

  series.data.setAll(data);
}

// Function to load JSON data and then create the plot
function loadAndCreateScatterPlot(xKey, yKey, topN = 'all') {
  fetch(dataFilePath)
    .then(response => response.json())
    .then(jsonData => {
      clearChart(); // Clear the chart before adding new data

      // Filter out null y-values first
      let filteredData = jsonData.filter(item => item[yKey] !== null);

      // If topN is not 'all', filter the data to include only ranks up to topN
      if (topN !== 'all') {
        filteredData = filteredData.filter(item => item.rank <= topN);
      }

      // Map the data for the chart
      let processedData = filteredData.map(item => ({
        xValue: item[xKey], // This should be the rank field from your JSON
        yValue: item[yKey],
        country_name: item.country_name
      }));

      // Now, create or update the series with the processed data
      createScatterSeries(processedData, 'xValue', 'yValue');
    })
    .catch(error => console.error('Error loading the JSON data:', error));
}




// Event handler for changing the dataset
function handleDatasetChange(event) {
  const selectedYKey = event.target.value;
  loadAndCreateScatterPlot('rank', selectedYKey);
}

// Event handler for changing the top N countries
function handleTopNChange(event) {
  const selectedTopN = event.target.value;
  const selectedYKey = document.getElementById('datasetSelect').value;
  loadAndCreateScatterPlot('rank', selectedYKey, selectedTopN);
}

// Function to clear existing series from the chart
function clearChart() {
  while (chart.series.length > 0) {
    chart.series.removeIndex(0).dispose();
  }
}




// Ensuring the DOM is fully loaded before attaching event handlers and loading data
document.addEventListener('DOMContentLoaded', () => {
  loadAndCreateScatterPlot('rank', 'female_gross_enrolment');
  document.getElementById('datasetSelect').addEventListener('change', handleDatasetChange);
  document.getElementById('topNSelect').addEventListener('change', handleTopNChange);
});
