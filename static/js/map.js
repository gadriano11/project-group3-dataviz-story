document.addEventListener('DOMContentLoaded', function() {
  fetch('static/js/poverty_world_data.json')
    .then(response => response.json())
    .then(data => {
      // Process the data to fit Highcharts' format
      const processedData = data.map(country => ({
        code3: country.country_code, // assuming 'country_code' is the ISO 3166-1 alpha-3 country code
        name: country.country_name,
        value: country.corruption_index_score,
        rank: country.rank,
        incomeLessThan215: country.income_less_than_two_one_five,
        maleGrossEnrolment: country.male_gross_enrolment,
        femaleGrossEnrolment: country.female_gross_enrolment
      }));

      // Create the Highcharts map
      Highcharts.mapChart('container', {
        chart: {
          map: 'custom/world',
          borderWidth: 2,
          borderColor: 'black',
          borderDashStyle: 'solid'
        },

        title: {
          text: 'Corruption Perception Index by Country'
        },

        subtitle: {
          text: 'Click on a country to view detailed information'
        },

        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },

        colorAxis: {
          min: 0,
          max: 100, // Adjust if the scale is different
          minColor: '#FF0000',
          maxColor: '#008000'
        },

        series: [{
          data: processedData,
          joinBy: ['iso-a3', 'code3'],
          name: 'Corruption Index Score',
          states: {
            hover: {
              color: '#a4edba'
            }
          },
          point: {
            events: {
              click: function() {
                // Open modal with details on click
                const modalTitleMap = document.getElementById('modalTitleMap');
                const modalTextMap = document.getElementById('modalTextMap');

                // Set the title and text of the modal
                modalTitleMap.textContent = this.name;
                modalTextMap.innerHTML = `
                  <strong>Corruption Index Score:</strong> ${this.value}<br/>
                  <strong>Rank:</strong> ${this.rank}<br/>
                  <strong>Income less than $2.15:</strong> ${this.incomeLessThan215}<br/>
                  <strong>Male Gross Enrolment:</strong> ${this.maleGrossEnrolment}<br/>
                  <strong>Female Gross Enrolment:</strong> ${this.femaleGrossEnrolment}<br/>
                `;

                // Show the modal
                const myModalMap = new bootstrap.Modal(document.getElementById('myModalMap'));
                myModalMap.show();
              }
            }
          },
          dataLabels: {
            enabled: false,
            format: '{point.name}'
          }
        }]
      });
    })
    .catch(error => {
      console.error('Error loading the JSON data:', error);
    });
});
