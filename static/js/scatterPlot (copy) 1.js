// Function to create or update the chart
function createOrUpdateChart(chart, data, yAxisTitle) {
    if (!chart) {
        // Create chart instance
        chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "zoomXY";
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();

        // Create X-axis
        let valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxisX.title.text = "Corruption Index Rank (1: Clean, 180: Corrupt)";
        valueAxisX.min = -0.5;
        valueAxisX.renderer.minGridDistance = 30;

        // Create Y-axis
        let valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxisY.title.text = yAxisTitle;
        valueAxisY.min = -0.5;


        // Create series
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = "rank";
        series.dataFields.valueY = "yValue";
        series.strokeOpacity = 0;
        series.sequencedInterpolation = true;

        // Add bullets
        let bullet = series.bullets.push(new am4core.Circle());
        bullet.fill = am4core.color("#ff0000");
        bullet.strokeOpacity = 0;
        bullet.radius = 5;
        bullet.strokeWidth = 2;
        bullet.fillOpacity = 0.7;
        bullet.stroke = am4core.color("#000000");

        // Tooltip setup
        bullet.tooltipText = "{country_name}";

        // Add hover state
        let hoverState = bullet.states.create("hover");
        hoverState.properties.fillOpacity = 1;
        hoverState.properties.strokeOpacity = 1;

        // Add heat rules
        series.heatRules.push({ target: bullet, min: 2, max: 60, property: "radius" });
    } else {
        // Update Y-axis title
        chart.yAxes.getIndex(0).title.text = yAxisTitle;
    }

    // Set or update data
    chart.data = data;
    return chart;
}

// Function to update chart data based on selections
function updateChartData(data, yKey, topN) {
    let filteredData = data.filter(item => item[yKey] !== null);
    if (topN !== 'all') {
        filteredData = filteredData.filter(item => item.rank <= topN);
    }

    return filteredData.map(item => ({
        ...item,
        yValue: item[yKey]
    }));
}

// Function to determine Y-axis title based on selected dataset
function getYAxisTitle(selectedYKey) {
    switch (selectedYKey) {
        case 'female_gross_enrolment':
            return "Female Gross School Enrolment";
        case 'male_gross_enrolment':
            return "Male Gross School Enrolment";
        case 'income_less_than_two_one_five':
            return "Living Below Less than $2.15 per day";
        default:
            return "";
    }
}

// Global chart variable
let chart;

// Function to handle change events
function handleControlChange() {
    const datasetSelect = document.getElementById('datasetSelect');
    const topNSelect = document.getElementById('topNSelect');

    const selectedYKey = datasetSelect.value;
    const selectedTopN = topNSelect.value === 'all' ? 'all' : parseInt(topNSelect.value);
    const yAxisTitle = getYAxisTitle(selectedYKey);

    fetch("static/js/poverty_world_data.json")
        .then(response => response.json())
        .then(data => {
            const updatedData = updateChartData(data, selectedYKey, selectedTopN);
            chart = createOrUpdateChart(chart, updatedData, yAxisTitle);
        })
        .catch(error => console.error("Error loading the JSON data:", error));
}

// Attach event listeners and load the chart
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('datasetSelect').addEventListener('change', handleControlChange);
    document.getElementById('topNSelect').addEventListener('change', handleControlChange);
    handleControlChange(); // Load the chart with the default selections
});
