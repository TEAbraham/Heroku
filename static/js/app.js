function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use d3 to select the panel with id of `#sample-metadata`
  PANEL = d3.select("#sample-metadata")
  // Use `.html("") to clear any existing metadata
  PANEL.html("");
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((metaData) => {
    Object.entries(metaData).forEach(([key, value]) => {
      PANEL
        .append("h6")
        .text(`${key}: ${value}`)
    })
    buildGauge(metaData['WFREQ']);
  })
  
    // BONUS: Build the Gauge Chart
    
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {
    // Build Bubble Chart
    var bubbleLayout = {
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: { title: 'OTU ID' }
    };
    var bubbleData = [{
        x: sampleData['otu_ids'],
        y: sampleData['sample_values'],
        text: sampleData['otu_labels'],
        mode: 'markers',
        marker: {
            size: sampleData['sample_values'],
            color: sampleData['otu_ids'],
            colorscale: "Earth",
        }
    }];
    var BUBBLE = document.getElementById('bubble');
    Plotly.plot(BUBBLE, bubbleData, bubbleLayout);
    // Build Pie Chart
    var pieData = [{
        values: sampleData['sample_values'].slice(0, 10),
        labels: sampleData['otu_ids'].slice(0, 10),
        hovertext: sampleData['otu_labels'].slice(0, 10),
        hoverinfo: 'hovertext',
        type: 'pie'
    }];
    var pieLayout = {
        margin: { t: 0, l: 0 }
    };
    var PIE = document.getElementById('pie');
    Plotly.plot(PIE, pieData, pieLayout);
  })
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
