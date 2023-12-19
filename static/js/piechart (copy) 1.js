// Load JSON data
d3.json("static/js/corruption_data.json").then(data => {
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
    let region = currentValue.Region;
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
  const width = 450 + margin.left + margin.right; // Updated width with margins
  const height = 450 + margin.top + margin.bottom; // Updated height with margins
  const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;


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

  // Draw arc paths
  slices.append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.region));


  // Add labels to the pie chart
  slices.append('text')
    .attr('transform', function(d) {
      const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      // Determine the x and y coordinates for labels
      const x = Math.sin(midAngle) * (radius * 0.53);
      const y = -Math.cos(midAngle) * (radius * 0.53);
      // Rotate labels, offset by 90 degrees for the SVG's coordinate system
      const rotation = (midAngle < Math.PI ? midAngle - Math.PI / 2 : midAngle + Math.PI / 2) * (180 / Math.PI);
      return `translate(${x}, ${y}) rotate(${rotation})`;
    })
    .attr('text-anchor', 'middle') // Center the text on its coordinates
    .text(d => regionNames[d.data.region] || d.data.region)
    .style('font-weight', 'bold')
    .style('font-size', '12px'); // Adjust font size as necessary


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
      const countryName = data.Country;
      const rank = data.Rank;
      const score = data['Corruption Index Score'];

      // For every third country, end and start a new row for a 3-column layout
      if (index % 6 === 0 && index !== 0) {
        countryButtonsHtml += '</div><div class="row">';
      }

      // Add button with popover info
      countryButtonsHtml += `
      <div class="col-md-2">
        <button type="button" class="btn btn-info country-button" 
          data-bs-toggle="popover" 
          data-bs-original-title="${countryName}" 
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
