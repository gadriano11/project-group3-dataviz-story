function createChoroplethMap(data) {
  const corruptionScores = data.map(country => country['Corruption Index Score']);
  const minScore = Math.min(...corruptionScores);
  const maxScore = Math.max(...corruptionScores);
  const middleScore = (minScore + maxScore) / 2; // This is a simple average; you can adjust if needed
  var mapData = [{
    type: 'choropleth',
    locationmode: 'country names',
    locations: data.map(country => country.Country),
    z: data.map(country => country['Corruption Index Score']),
    text: data.map(country => `Country: ${country.Country}<br>Region: ${country.Region}<br>Rank: ${country.Rank}<br>Corruption Index Score: ${country['Corruption Index Score']}`),
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
      }
    },

    autosize: false, /* Turn off autosize */
    width: 800,
    height: 600,
    margin: { l: 0, r: 0, t: 0, b: 0 }/* Match the height of the container */
  };

  Plotly.newPlot('map', mapData, layout, { responsive: true });
}


function loadAndProcessData() {
  d3.json('static/js/corruption_data.json').then(data => {
    createChoroplethMap(data);
  }).catch(error => console.error('Error:', error));
}

loadAndProcessData();
