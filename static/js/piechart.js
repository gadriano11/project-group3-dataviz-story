// Flags!!!

import { findFlagUrlByIso3Code } from 'https://cdn.jsdelivr.net/npm/country-flags-svg@2.0.0-beta.1/+esm';



// Load JSON data
d3.json("static/js/poverty_world_data.json").then(data => {
  // Mapping of abbreviations to full region names
  const regionNames = {
    "AME": "Americas",
    "AP": "Asia Pacific",
    "ECA": "Eastern Europe and Central Asia",
    "MENA": "Middle East and North Africa",
    "SSA": "Sub-Saharan Africa",
    "WE/EU": "Western Europe and European Union"
  };

  // Group data by region using Array.reduce
  let groupedData = data.reduce((accumulator, currentValue) => {
    let region = currentValue.region;
    if (!accumulator[region]) {
      accumulator[region] = [];
    }
    accumulator[region].push(currentValue);
    return accumulator;
  }, {});

  // Convert grouped data into an array suitable for D3 pie chart
  let pieData = Object.keys(groupedData).map(region => {
    return { region: region, values: groupedData[region] };
  });

  // Define dimensions and radius of the pie chart
  const margin = { top: 20, right: 150, bottom: 20, left: 150 }; // Increased margins
  const width = 300 + margin.left + margin.right; // Updated width with margins
  const height = 300 + margin.top + margin.bottom; // Updated height with margins
  const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

  const total = pieData.reduce((sum, region) => sum + region.values.length, 0);



  // Create SVG container for the pie chart
  const svg = d3.select('.pie-content')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

  // Create a color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create a pie generator
  const pie = d3.pie()
    .value(d => d.values.length);

  // Create an arc generator
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Create the pie chart
  const slices = svg.selectAll('.arc')
    .data(pie(pieData))
    .enter()
    .append('g')
    .attr('class', 'arc');


  // Calculate outer arc for label connectors
  const outerArc = d3.arc()
    .innerRadius(radius * 1.1) // 1.1 to push the label slightly outside the pie
    .outerRadius(radius * 1.1);

  // Draw arc paths and append labels
  slices.append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.region))
    .each(function(d) { this._current = d; });

  // Append polyline for label connectors
  slices.append('polyline')
    .attr('points', function(d) {
      const pos = outerArc.centroid(d);
      pos[0] = radius * 1.07 * (midAngle(d) < Math.PI ? 1 : -1); // Multiply by 1 or -1 to place labels on the correct side
      return [arc.centroid(d), outerArc.centroid(d), pos];
    })
    .style('fill', 'none')
    .style('stroke', '#555')
    .style('stroke-width', '1px');


  // Append text labels
  slices.append('text')
    .attr('transform', function(d) {
      const pos = outerArc.centroid(d);
      pos[0] = radius * 0.98 * (midAngle(d) < Math.PI ? 1 : -1); // Adjust to move text further out
      pos[1] += 5; // Lower the label slightly
      return `translate(${pos})`;
    })
    .attr('dy', '.35em')
    .style('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
    .text(d => {
      const percentage = (d.data.values.length / total * 100).toFixed(1); // Calculate percentage
      return `${regionNames[d.data.region] || d.data.region}: ${percentage}%`; // Display region name and percentage
    })
    .style('font-weight', 'bold');

  // Function to calculate the mid angle of a slice
  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }



  // Add interactivity to pie slices
  slices.on('click', function(event, d) {
    const region = d.data.region;
    const countryData = d.data.values;
    openModal(regionNames[region], countryData);
  });

  // Function to open the modal
  function openModal(region, countryData) {
    let countryButtonsHtml = '<div class="container"><div class="row">';

    // Dynamically generate country buttons with popover data
    countryData.forEach((data, index) => {
      // Access properties directly from the data object
      const countryName = data.country_name;
      const rank = data.rank;
      const score = data.corruption_index_score;
      const iso3Code = data.country_code;
      const flagUrl = findFlagUrlByIso3Code(iso3Code);

      // For every third country, end and start a new row for a 3-column layout
      if (index % 6 === 0 && index !== 0) {
        countryButtonsHtml += '</div><div class="row">';
      }

      // Add button with popover info
      countryButtonsHtml += `
      <div class="col-md-2">
        <button type="button" class="btn btn-info country-button" 
          data-bs-toggle="popover" 
          data-bs-original-title="<img class='popover-flag' src='${flagUrl}' alt='${countryName} flag'> ${countryName}"
          data-bs-content="Rank: ${rank}, Corruption Index Score: ${score}">
          ${countryName}
        </button>
      </div>`;
    });

    // Close the last row and container divs
    countryButtonsHtml += '</div></div>';

    // Set the content of the modal and display it
    document.getElementById('modal-text').innerHTML = `Countries in ${region}:<br>${countryButtonsHtml}`;

    // Show the modal
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();

    // Initialize popovers for the dynamically added buttons
    initializePopovers();
  }

  function initializePopovers() {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('.country-button'));
    popoverTriggerList.forEach(function(popoverTriggerEl) {
      new bootstrap.Popover(popoverTriggerEl, {
        trigger: 'focus',
        placement: 'top',
        html: true,
        title: popoverTriggerEl.getAttribute('data-bs-original-title'),
        content: function() {
          return popoverTriggerEl.getAttribute('data-bs-content');
        }
      });
    });
  }
})


