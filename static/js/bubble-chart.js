//////////*** CODE FOR BUBBLE-CHART ***//////////
var clickBubble = d3.select('#chart-bubble-chart');
clickBubble.on("click", function(){
  
d3.select("#myDiv").html("");

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 520;
// Define the chart's margins as an object
var chartMargin = {
  top: 80,
  right: 40,
  bottom: 90,
  left: 100
};
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart
var svg = d3
  .select("#myDiv")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

svg.append('text')
  .attr('class', 'title')
  .attr('y', 24)
  .html('Profitability Benchmark');

svg.append('text')
  .attr('class', 'subTitle')
  .attr('y', 40)
  .html('Billions Ps');

// Append a group to the SVG area and shift it to the right and bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
// Initial Params
var chosenXAxis = "assets";
var chosenYAxis = "netIncome";

// function used for updating x-scale var upon click on axis label
function xScale(readData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(readData, d => d[chosenXAxis]),
    d3.max(readData, d => d[chosenXAxis])
  ])
  .range([0, chartWidth]);
  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(readData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(readData, d => d[chosenYAxis]),
    d3.max(readData, d => d[chosenYAxis])
  ])
  .range([chartHeight, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  xAxis.selectAll("path").style("opacity", "1").style("stroke", "white");
  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis, chosenYAxis) {
  if (chosenYAxis === "roa" || chosenYAxis === "roe") {
    formato = ".1%";
  }else if (chosenYAxis === "netIncome"){
    formato = ",.0f";
  }
  var leftAxis = d3.axisLeft(newYScale).tickFormat(d3.format(formato));
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  yAxis.selectAll("path").style("opacity", "1").style("stroke", "white")  
  return yAxis;
}

// function used for updating circles group with a transition to new circles on changes on X axes
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  // To move the circles
  circlesGroup.selectAll("circle").transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
  // To move the text  
  circlesGroup.selectAll("text").transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    return circlesGroup;  
}

// function used for updating circles group with a transition to new circles on changes on Y axes
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  // To move the circles
  circlesGroup.selectAll("circle").transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
  // To move the text
  circlesGroup.selectAll("text").transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis])+3);
  
    return circlesGroup;
}

// functions used for updating circles group with new tooltip on changes
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var label;
  if (chosenXAxis === "assets"){
    label = "Assets:";
  }else if (chosenXAxis === "portfolio") {
    label = "Portfolio:";
  }else if (chosenXAxis === "equity"){
    label = "Equity:";
  }

  var ylabel;
  if (chosenYAxis === "netIncome"){
    ylabel = "Net Income:";
    formato = ",.2f";
  }else if (chosenYAxis === "roa") {
    ylabel = "ROA:";
    formato = ".3%";
  }else if (chosenYAxis === "roe"){
    ylabel = "ROE:";
    formato = ".3%";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.bank}<br>${label} ${d3.format(",.2f")(d[chosenXAxis])}<br>${ylabel} ${d3.format(formato)(d[chosenYAxis])}`);
    });
  
  circlesGroup.call(toolTip);
  // on mouseover event EVALUATE IF WE CAN CHANGE IT TO ARROW FUNCTION
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
  // on mouseout event
  .on("mouseout", function(data, index){
    toolTip.hide(data);
  });
  
  return circlesGroup;
} // end of function update ToolTip on changes

// Load data from the CSV file and execute everything below
d3.csv("./static/data/data-bubble-chart.csv", function(readData) {
console.log(readData);
// Parse data
readData.forEach(function(data) {
  data.assets = +data.assets;
  data.portfolio = +data.portfolio;
  data.equity = +data.equity;
  data.netIncome = +data.netIncome;
  data.roa = +data.roa;
  data.roe = +data.roe;
});

// XLinearScale function called (defined above csv import code)
var xLinearScale = xScale(readData, chosenXAxis);
// console.log(xLinearScale);

// YLinearScale function called
var yLinearScale = yScale(readData, chosenYAxis);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append x axis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);
xAxis.selectAll("path").style("opacity", "1").style("stroke", "white")  

// Append y axis
var yAxis = chartGroup.append("g") 
  .classed("y-axis", true)
  .call(leftAxis);
yAxis.selectAll("path").style("opacity", "1").style("stroke", "white")  

// Append initial circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(readData)
  .enter()
  .append("g")
  
  circlesGroup.append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis])) 
  .attr("r", 20)
  .attr("fill", "stateCircle") //from bubbleChartStyle
  .attr("opacity", ".75")
  .attr("class", "stateCircle")

// This section of the code add the text
  circlesGroup.append("text").text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis])+3)
    .attr("class", "stateText")
    
// Create group for three x-axis labels
var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
// Creating the Three different types of x labels
var labelAssets = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "assets") //value to grab for event listener
  .classed("active", true)
  .text("Total Assets");

var labelPortfolio = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "portfolio") //value to grab for event listener
  .classed("inactive", true)
  .text("Portfolio");  

var labelEquity = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "equity") //value to grab for event listener
  .classed("inactive", true)
  .text("Equity");

// Create group for three y-axis labels
var ylabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");
// Creating the Three different types of x labels
var labelNetIncome = ylabelsGroup.append("text")
  .attr("y", 0 - chartMargin.left)
  .attr("x", 0 - (chartHeight/2))
  .attr("dy", "1em")
  .attr("value", "netIncome") //value to grab for event listener
  // .classed("axis-text", true)
  .classed("active", true)
  .text("Net Income");  

var labelRoa = ylabelsGroup.append("text")
  .attr("y", 0 - chartMargin.left)
  .attr("x", 0 - (chartHeight/2))
  .attr("dy", "2em")
  .attr("value", "roa") //value to grab for event listener
  // .classed("axis-text", true)
  .classed("inactive", true)
  .text("ROA (%)");  

var labelRoe = ylabelsGroup.append("text")
  .attr("y", 0 - chartMargin.left)
  .attr("x", 0 - (chartHeight/2))
  .attr("dy", "3em")
  .attr("value", "roe") //value to grab for event listener
  // .classed("axis-text", true)
  .classed("inactive", true)
  .text("ROE (%)");  

// updateToolTip function
var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

// x axis labels event listener
xlabelsGroup.selectAll("text")
  .on("click", function(){
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
      // if chose x value different than current selection
      chosenXAxis = value;
      console.log(chosenXAxis);
      
      // update XLinearScale function
      xLinearScale = xScale(readData, chosenXAxis);

      // update x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // update circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // update toolTip with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "portfolio") {
        labelPortfolio.classed("active", true).classed("inactive", false);
        labelAssets.classed("active", false).classed("inactive", true);
        labelEquity.classed("active", false).classed("inactive", true);
      } else if (chosenXAxis === "assets") {
        labelAssets.classed("active", true).classed("inactive", false);
        labelPortfolio.classed("active", false).classed("inactive", true);
        labelEquity.classed("active", false).classed("inactive", true);
      } else if (chosenXAxis === "equity") {
        labelEquity.classed("active", true).classed("inactive", false);
        labelPortfolio.classed("active", false).classed("inactive", true);
        labelAssets.classed("active", false).classed("inactive", true);
      }

    } // end if value !==chosenXAxis
  }) // end event x listener .on("click")

// y axis labels event listener
ylabelsGroup.selectAll("text")
  .on("click", function(){
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
      // if chose y value different than current selection
      chosenYAxis = value;
      console.log(chosenYAxis);
      
      // update YLinearScale function
      yLinearScale = yScale(readData, chosenYAxis);

      // update x axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis, chosenYAxis); 

      // update circles with new x values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

      // update toolTip with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis ,circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "netIncome") {
        labelNetIncome.classed("active", true).classed("inactive", false);
        labelRoa.classed("active", false).classed("inactive", true);
        labelRoe.classed("active", false).classed("inactive", true);
      } else if (chosenYAxis === "roa") {
        labelRoa.classed("active", true).classed("inactive", false);
        labelNetIncome.classed("active", false).classed("inactive", true);
        labelRoe.classed("active", false).classed("inactive", true);
      } else if (chosenYAxis === "roe") {
        labelRoe.classed("active", true).classed("inactive", false);
        labelNetIncome.classed("active", false).classed("inactive", true);
        labelRoa.classed("active", false).classed("inactive", true);
      }

    } // end if value !==chosenyAxis
  }) // end event y listener .on("click")

});// .catch(e => console.log(e));

})  // end of event listener click