function createChoroplethMap(data) {
  const corruptionScores = data.map(country => country.corruption_index_score);
  const minScore = Math.min(...corruptionScores);
  const maxScore = Math.max(...corruptionScores);
  const middleScore = (minScore + maxScore) / 2;

  var mapData = [{
    type: 'choropleth',
    locationmode: 'country names',
    locations: data.map(country => country.country_name),
    z: corruptionScores,
    text: data.map(country => `Country: ${country.country_name}<br>Region: ${country.region}<br>Rank: ${country.rank}<br>Corruption Index Score: ${country.corruption_index_score}`),
    hoverinfo: 'text',
    colorscale: [
      [0, 'rgb(255, 0, 0)'],   // Red for the most corrupt
      [0.5, 'rgb(255, 255, 0)'], // Yellow for middle corruption
      [1, 'rgb(0, 255, 0)']     // Green for the cleanest
    ],
    colorbar: {
      title: 'Corruption Perception Index',
      titleside: 'top',
      len: 0.71,
      lenmode: 'fraction',
      x: 0.5,
      y: -0.1,
      xanchor: 'center',
      yanchor: 'bottom',
      tickmode: 'array',
      tickvals: [minScore, middleScore, maxScore],
      ticktext: ['Highly Corrupt', 'Average', 'Very Clean'],
      orientation: 'h',
      titlefont: {
        family: 'Arial, sans-serif',
        size: 14,
        color: 'black',
        weight: 'bold'
      },
      tickfont: {
        family: 'Arial, sans-serif',
        size: 12,
        color: 'black',
        weight: 'bold',
      }
    }

  }];

  var layout = {
    title: '',
    geo: {
      showframe: true,
      showcoastlines: false,
      projection: {
        type: 'mercator'
      },
      bgcolor: 'rgba(255,255,255,0)',
    },
    paper_bgcolor: '#fdf6e3', // Set the background color for the entire chart area
    plot_bgcolor: '#fdf6e3', // Set the background color for the plot area
    autosize: false, // Turn off autosize
    width: 800, // Specify the fixed width of the chart
    height: 600, // Specify the fixed height of the chart
    margin: { l: 0, r: 0, t: 0, b: 0 } // Remove default margins
  };

  Plotly.newPlot('map', mapData, layout, { responsive: true });
}


function loadAndProcessData() {
  d3.json('static/js/poverty_world_data.json').then(data => {
    createChoroplethMap(data);
  }).catch(error => console.error('Error:', error));
}

loadAndProcessData();

// Transition code once database in use
// function loadAndProcessData() {
//   fetch('/api/data')
//     .then(response => response.json())
//     .then(data => createChoroplethMap(data))
//     .catch(error => console.error('Error:', error));
// }

// document.addEventListener('DOMContentLoaded', loadAndProcessData);
