document.addEventListener('DOMContentLoaded', function() {
    fetch('static/js/poverty_world_data.json')
        .then(response => response.json())
        .then(data => {
            // Mapping of region acronyms to full names
            const regionNames = {
                "AME": "Americas",
                "AP": "Asia Pacific",
                "ECA": "Eastern Europe and Central Asia",
                "MENA": "Middle East and North Africa",
                "SSA": "Sub-Saharan Africa",
                "WE/EU": "Western Europe and European Union"
            };

            // Count the number of countries in each region
            const regionCounts = data.reduce((counts, country) => {
                counts[country.region] = (counts[country.region] || 0) + 1;
                return counts;
            }, {});

            // Total number of countries
            const totalCountries = data.length;

            // Calculate the percentage for each region and use full region names
            const pieChartData = Object.entries(regionCounts).map(([region, count]) => {
                return {
                    name: regionNames[region] || region, // Use full region name
                    y: (count / totalCountries) * 100 // Percentage calculation
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
                                }, function () {
                                    if (points[point.index + 1]) {
                                        fanAnimate(points[point.index + 1], args.end);
                                    }
                                    if (point.index === series.points.length - 1) {
                                        series.dataLabelsGroup.animate({
                                            opacity: 1
                                        },
                                        void 0,
                                        function () {
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

            // Create the Highcharts Pie Chart
            Highcharts.chart('piechart-container', {
                chart: {
                    type: 'pie',
                  width: null,
                  height: 500
                },
                title: {
                    text: 'Regional Distribution of Countries',
                    align: 'center'
                },
                subtitle: {
                    text: 'Custom animation of pie series',
                    align: 'left'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        borderWidth: 2,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y:.1f}%',
                            distance: 20
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
});
