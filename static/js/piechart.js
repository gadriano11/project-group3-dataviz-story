document.addEventListener('DOMContentLoaded', function() {
  fetch('static/js/poverty_world_data.json')
    .then(response => response.json())
    .then(data => {
      const regionNames = {
        "AME": "Americas",
        "AP": "Asia Pacific",
        "ECA": "Eastern Europe and Central Asia",
        "MENA": "Middle East and North Africa",
        "SSA": "Sub-Saharan Africa",
        "WE/EU": "Western Europe and European Union"
      };

      const regionCounts = data.reduce((counts, country) => {
        counts[country.region] = (counts[country.region] || 0) + 1;
        return counts;
      }, {});

      const totalCountries = data.length;

      const pieChartData = Object.entries(regionCounts).map(([region, count]) => {
        return {
          name: regionNames[region] || region,
          y: (count / totalCountries) * 100
        };
      });

      // Custom Animation Function for Pie Chart
      (function(H) {
        H.seriesTypes.pie.prototype.animate = function(init) {
          const series = this,
            chart = series.chart,
            points = series.points,
            { animation } = series.options,
            { startAngleRad } = series;

          function fanAnimate(point, startAngleRad) {
            const graphic = point.graphic,
              args = point.shapeArgs;

            if (graphic && args) {
              graphic
                .attr({
                  start: startAngleRad,
                  end: startAngleRad,
                  opacity: 1
                })
                .animate({
                  start: args.start,
                  end: args.end
                }, {
                  duration: animation.duration / points.length
                }, function() {
                  if (points[point.index + 1]) {
                    fanAnimate(points[point.index + 1], args.end);
                  }
                  if (point.index === series.points.length - 1) {
                    series.dataLabelsGroup.animate({
                      opacity: 1
                    },
                      void 0,
                      function() {
                        points.forEach(point => {
                          point.opacity = 1;
                        });
                        series.update({
                          enableMouseTracking: true
                        }, false);
                        chart.update({
                          plotOptions: {
                            pie: {
                              innerSize: '40%',
                              borderRadius: 8
                            }
                          }
                        });
                      });
                  }
                });
            }
          }

          if (init) {
            points.forEach(point => {
              point.opacity = 0;
            });
          } else {
            fanAnimate(points[0], startAngleRad);
          }
        };
      }(Highcharts));

      Highcharts.chart('piechart-container', {
        chart: {
          type: 'pie',
          height: 500,
          backgroundColor: '#d3d3d3',
        },
        title: {
          text: 'Regional Distribution of Countries'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y:.1f}%',
              distance: 20,
              style: {
                fontSize: '16px',
              }
            },
            point: {
              events: {
                click: function() {
                  const region = this.name;
                  const barGraphData = prepareBarGraphData(region, data);
                  renderBarGraph(barGraphData, region);

                  // Show the modal using Bootstrap 5 method
                  var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
                    keyboard: false
                  });
                  myModal.show();
                }
              }
            }
          }
        },
        series: [{
          enableMouseTracking: false,
          animation: {
            duration: 2000
          },
          colorByPoint: true,
          data: pieChartData
        }]
      });
    })
    .catch(error => {
      console.error('Error loading the JSON data:', error);
    });

  function prepareBarGraphData(selectedRegion, allData) {
    // Mapping of region names to their acronyms as used in your data
    const regionAcronyms = {
      "Americas": "AME",
      "Asia Pacific": "AP",
      "Eastern Europe and Central Asia": "ECA",
      "Middle East and North Africa": "MENA",
      "Sub-Saharan Africa": "SSA",
      "Western Europe and European Union": "WE/EU"
    };

    // Get the acronym for the selected region
    const regionAcronym = regionAcronyms[selectedRegion];

    // Filter the data for the selected region
    const filteredData = allData.filter(country => country.region === regionAcronym);

    // Prepare data for the bar graph
    const barGraphData = filteredData.map(country => {
      return {
        name: country.country_name, // Assuming 'name' is the country name in your data
        y: country.income_less_than_two_one_five // Replace with your actual data field
      };
    });

    return barGraphData;
  }

  function prepareBarGraphData(selectedRegion, allData) {
    const regionAcronyms = {
      "Americas": "AME",
      "Asia Pacific": "AP",
      "Eastern Europe and Central Asia": "ECA",
      "Middle East and North Africa": "MENA",
      "Sub-Saharan Africa": "SSA",
      "Western Europe and European Union": "WE/EU"
    };

    const regionAcronym = regionAcronyms[selectedRegion];
    const filteredData = allData.filter(country => country.region === regionAcronym);

    // Prepare data for the clustered bar graph
    return filteredData.map(country => ({
      country_name: country.country_name,
      income_less_than_two_one_five: country.income_less_than_two_one_five,
      male_gross_enrolment: country.male_gross_enrolment,
      female_gross_enrolment: country.female_gross_enrolment,
      corruption_index_score: country.corruption_index_score
    }));
  }

  function renderBarGraph(data, region) {
    // The categories (countries) will be the same for all series
    const categories = data.map(country => country.country_name);

    // Prepare the series data for each metric
    const series = [{
      name: 'Income Less Than $2.15',
      data: data.map(country => country.income_less_than_two_one_five)
    }, {
      name: 'Male Gross Enrolment',
      data: data.map(country => country.male_gross_enrolment)
    }, {
      name: 'Female Gross Enrolment',
      data: data.map(country => country.female_gross_enrolment)
    }, {
      name: 'Corruption Index Scores',
      data: data.map(country => country.corruption_index_score)
    }];

    // Render the clustered bar chart
    Highcharts.chart('multiset-bar-chart-container', {
      chart: {
        type: 'column'
      },
      title: {
        text: `Metrics Comparison in ${region}`
      },
      xAxis: {
        categories: categories,
        crosshair: true,
        labels: {
          style: {
            fontSize: '16px',
          },// Adjust the font size as needed
          rotation: -90,   // Rotate labels 90 degrees counter-clockwise
          align: 'right'   // Position labels to the right of the axis
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Metric Values'
        }
      },
      tooltip: {
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          grouping: true,
          shadow: false,
          borderWidth: 0
        }
      },
      series: series
    });
  }
});
