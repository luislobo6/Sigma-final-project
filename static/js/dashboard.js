
//////////*** CODE FOR MAPS MENU ***//////////

// DECLARATOIN OF CONSTANTS

// chart keys defined the properties and button ids
const charts = [
  {key: "oro", title: "Gold", color: "orange"}, 
  {key: "plata", title: "Silver", color: "silver"}, 
  {key: "cobre", title: "Copper", color: "red"},
  {key: "plomo", title: "Lead", color: "blue"}, 
  {key: "zinc", title: "Zinc", color: "green"},
  {key: "coque", title: "Coke", color: "yellow"},
  {key: "fierro", title: "Iron", color: "brown"},
  {key: "azufre", title: "Sulfur", color: "gray"},
  {key: "barita", title: "Baryta", color: "purple"},
  {key: "fluorita", title: "Fluorite", color: "pink"},
];
var svg = d3.select("svg.bar-chart");

// Function that highlights in the map when the mouse is over the area
function highlightFeature(e) {
  let layer = e.target;

  layer.setStyle({
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}

// function that returns the highlight to the regular value when mouse is out of the area
function resetHighlight(e) {
  let layer = e.target;

  layer.setStyle({
      fillOpacity: 0.1
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}


/**
 * Function that receives feature from GeoJSON and if this feature has a property named minerals
 * we add the Popup to the point to display more information when each point is clicked
 * in this case we add Popup's and events for fillColor
 * @param {Object} feature from GeoJSON
 * @param {Object} layer from Leaflet
 */
function onEachFeature(feature, layer) {
  // does this feature have a property named minerals?
  if (feature.properties && feature.properties.minerals) {
    let str_popup = `${feature.properties.NOMGEO}<hr>`
    
    // we get the keys and values for the minerals produced in each state
    let keys = Object.keys(feature.properties.minerals)
    let values = Object.values(feature.properties.minerals)

    // for each key/value we add them in the popup tag
    for(let i = 0, a= keys.length; i < a; i++ ){
      str_popup = str_popup + `${keys[i]}: ${values[i]} <br>`
    }

    // Here we bind the popup's to each area
    layer.bindPopup(str_popup);

    // here we bind the events of the mouse over and out
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });

  }
}



function initCharts(dataMineria, indice, svg, chart, barScale, colorScale, format){
  
  if(d3.selectAll("button")){
    // Disable all buttons
    d3.selectAll("button").property("disabled", false);
    // enable only buttons not currently selected
    d3.select("#" + chart.current.key).property("disabled", true);
    // update page title
    d3.select("#chart").text(charts.find(o => o.key === indice).title);
  }
  
  // sorting the production data
  dataMineria.sort((a, b) => d3.descending(a[indice], b[indice]))

  // update scale domain with data from current selection
  const maxValue = d3.max(dataMineria, d=> d[indice]);
  console.log("maxValue=",maxValue)
  barScale.domain([0,maxValue]);
  colorScale.domain([0, maxValue]);

  chart.height = dataMineria.length * 30 // adjust accordingly
  svg.attr("width", chart.width)
    .attr("height", chart.height);

  // bind the data and draw the firts chart
  // console.log("#########---Aqui",(charts.find(o => o.key === indice).color))
  svg.selectAll("g")
    .data(dataMineria)
    .enter().append("g")
    .attr("class", "entry")
    .attr("transform", (d,i) => `translate(0, ${i * 30})`)
    .each (function(d) {
      
      // console.log("Entro en g: ", d)
      var entry = d3.select(this); // the current entry

      entry.append("text").attr("class", "label category")
        .attr("y", 15)
        .attr("x", 0)
        .attr("font-size", "9")
        .text(d.name);

      entry.append("rect").attr("class", "bar")
        .attr("x", 80)
        .attr("height", 15)
        .attr("width", barScale(d[indice]))
        .style("fill", 
          d3.color((charts.find(o => o.key === indice).color))
          .darker(colorScale(d[indice]))
          )

      // entry.append("text").attr("class", "label value")
      //   .attr("y", 12)
      //   .attr("x", barScale(d[indice] + 2700)) // ***REVISITED***
      //   .attr("font-size", "9")
      //   .text(format(d[indice]) + " tons");

    }) // end .each
  
  return (dataMineria,svg)
  
} // end of setupView function


function draw(isDropDown, indice, svg, chart, barScale, colorScale, format) {
  
  let dataMineria = []
  let selected_mineral = indice;
  
  // Value Selected from the DropDown Menu
  if(isDropDown == true){
    selected_mineral = d3.select("#selDataset").node().value
  }
  else{ // value selected from the buttons

  }
  // change the first letter to UpperCase to consult our API (it needs the first letter in UpperCase)
  selected_mineral = selected_mineral[0].toUpperCase() + selected_mineral.slice(1)


  // Get the mineral data from the API to plot in the bars
  d3.json(`/${selected_mineral}`, function(data) {
    console.log(data);
    
    data.features.forEach(d => {
      let minerales = d.properties.minerals;
      let keys_min = Object.keys(minerales)
      let values_min = Object.values(minerales)
      
      let aux_minerales = {
        name: d.properties.NOMGEO,
        oro: 0,
        plata: 0,
        cobre: 0,
        plomo: 0,
        zinc: 0,
        coque: 0,
        fierro: 0,
        azufre: 0,
        barita: 0,
        fluorita: 0,
      }
      
      for (let x=0, a=keys_min.length; x < a; x++ ){
        aux_minerales[keys_min[x].toLowerCase()] = values_min[x];
      }
      
      dataMineria.push(aux_minerales)
    })
    
    console.log("+++++++++",dataMineria)


    dataMineria,svg= initCharts(dataMineria, indice, svg, chart, barScale, colorScale, format);
    

  });

  console.log("(charts.find(o => o.key === selected_mineral_color))=",(charts.find(o => o.key === indice)))
  console.log("indice=",indice)
  svg.selectAll("g.entry").data(dataMineria)
    .each(function (d,i){
      d3.select(this).select(".label.category")
        .text(d.name); // order may have change
      
      d3.select(this).select(".bar")
        .transition().duration(10000).delay(50 * i)
          .attr("width", barScale(d[indice]))
          .style("fill", d3.color((charts.find(o => o.key === selected_mineral_color)))
                          .darker(colorScale(d[indice])));
      
      // d3.select(this).select(".label.value")
      //   .transition().duration(10000).delay(50 * i)
      //     .attr("x", barScale(d[indice]) + 27000) //+800 ***REVISITED***
      //     .text(format(d[indice]) + " tons");
    }) // end .each()
    .exit().remove()  //This line could be commented if we want to keep the height fixed

}




// THIS NEEDS TO BE UPDATED

var click1 = d3.select('#click1');
click1.on("click", function(){

// to clear space in html   
d3.select("#myDiv").html("");

// To create the header
d3.select("#myDiv").append("h1").text("Mexico Mining Map")
d3.select("#myDiv").append("hr")

// Creating myMap Div
d3.select("#myDiv").append("div").attr("id", "map")

let mymap = L.map('map').setView([23.507173012505426, -103.01796971980406], 6); //Set to Zacatecas and zoom of 5

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaXZpbGNoaXMiLCJhIjoiY2trN2twaDhqMDJmbzJybXVhMzcxNHY3NSJ9.5qG9lj6HT5aXnvZvne4dSg'
}).addTo(mymap);

// Creating a variable for the map styles
let myStyle = {
  "color": "#ff7800",
  "weight": 1,
  "opacity": 1,
  "fillOpacity": 0.1
};

d3.json("/start", function(data){
  // L.geoJson(data,{
  //   style: myStyle
  // }).addTo(mymap)

  L.geoJson(data,{
    pointToLayer: function(data, latlng){
        return L.marker(latlng)
    },
    onEachFeature: onEachFeature,
    style: myStyle
  }).addTo(mymap)

}) // end of d3.json

});//end of event listener .on "click"

//////////*** CODE FOR TABLES MENU ***//////////

// WORK IN PROGRESS
// CLICK 2
var click2 = d3.select('#click2');
click2.on("click", function(){
   
  // to clear space in html 
  d3.select("#myDiv").html("");

  d3.select("#myDiv").append("h1").text("Data Table of Production in tons*")
  d3.select("#myDiv").append("hr")
  // Creating a table
  d3.select("#myDiv").append("table").attr("class", "display").attr("id", "mytable").attr("width", "100%")
  let head_table = d3.select("#mytable").append("thead").attr("width", "100%").append("tr")
  head_table.append("th").text("entidad")
  head_table.append("th").text("oro (kg)")
  head_table.append("th").text("plata (kg)")
  head_table.append("th").text("azufre")
  head_table.append("th").text("cobre")
  head_table.append("th").text("plomo")
  head_table.append("th").text("zinc")
  head_table.append("th").text("barita")
  head_table.append("th").text("coque")
  head_table.append("th").text("fluorita")

  // Creating a data table with ajax
  $(document).ready(function () {
    $('#mytable').DataTable({ 
      "ajax": {
        url: "/tabla", 
        dataSrc: ""},
          columns: [
              { data: 'entidad' },
              { data: 'oro' },
              { data: 'plata' },
              { data: 'azufre' },
              { data: 'cobre' },
              { data: 'plomo' },
              { data: 'zinc' },
              { data: 'barita' },
              { data: 'coque' },
              { data: 'fluorita' }
          ],
      "paging":   true,
      "ordering": true,
      "info":     true
        
    })
  }); // end of document.ready

})  // end of event listener click


//////////*** CODE FOR BAR CHARTS MENU ***//////////
// (( CLICK 3))
var click3 = d3.select('#click3');
click3.on("click", function(){
   
  // to clear space in html 
  d3.select("#myDiv").html("");
  d3.select("#mytable").html("");
  // To create the header
  d3.select("#myDiv").append("h1").text("Production in tons: ").insert("span").attr("id", "chart").text("Gold")
  d3.select("#myDiv").append("hr")
  // Creating an SVG
  d3.select("#myDiv").append("svg").attr("class", "bar-chart")
  d3.select("#myDiv").append("hr")
  // To create a form
  d3.select("#myDiv").append("form")
  // to append three buttons under the form
  d3.select("form").append("button").attr("type", "button").attr("id", "oro").text("*** Gold ***")
  d3.select("form").append("button").attr("type", "button").attr("id", "plata").text("*** Silver ***")
  d3.select("form").append("button").attr("type", "button").attr("id", "cobre").text("*** Copper ***")
  d3.select("form").append("button").attr("type", "button").attr("id", "plomo").text("*** Lead ***")
  d3.select("form").append("button").attr("type", "button").attr("id", "zinc").text("*** Zinc ***")
  d3.select("form").append("button").attr("type", "button").attr("id", "coque").text("*** Coke ***")
  // d3.select("form").append("button").attr("type", "button").attr("id", "fierro").text("*** Iron ***")
  d3.select("form").append("button").attr("type", "button").attr("id", "azufre").text("*** Sulfur ***")
  d3.select("form").append("button").attr("type", "button").attr("id", "barita").text("*** Baryta ***")
  d3.select("form").append("button").attr("type", "button").attr("id", "fluorita").text("*** Fluorite ***")
  
  // chart keys defined the properties and button ids
  const charts = [
    {key: "oro", title: "Gold", color: "orange"}, 
    {key: "plata", title: "Silver", color: "silver"}, 
    {key: "cobre", title: "Copper", color: "red"},
    {key: "plomo", title: "Lead", color: "blue"}, 
    {key: "zinc", title: "Zinc", color: "green"},
    {key: "coque", title: "Coke", color: "yellow"},
    {key: "fierro", title: "Iron", color: "brown"},
    {key: "azufre", title: "Sulfur", color: "gray"},
    {key: "barita", title: "Baryta", color: "purple"},
    {key: "fluorita", title: "Fluorite", color: "pink"},
  ];

  // data used for each chart
  var chart = {
    width : 1200,
    height: 0,         // the height is set after data is loaded
    current: charts[0] // [0] represents chart to display first
  }

  // defining a variable that will hold the data
  var dataMineria = [];

  // Setting scale functions for y axis and colors, and format 2 digits 
  var barScale = d3.scaleLinear().range([0, 600]); //Validate 600
  var colorScale = d3.scaleLinear().range([0, 1]);
  const format = d3.format(",.0f");

  const svg = d3.select("svg.bar-chart");

  d3.selectAll("button").on("click", function(){
    chart.current = charts.filter(d=> d.key == this.id)[0]; //getting button id
    draw (); //change this to draw() function
    
  }); //end of selectAll("button")

  // Load the data from csv
  d3.json("/tabla", function(data) {
    console.log(data);
    data.forEach(function(obj) {
      dataMineria.push({
        name: obj.entidad,
        oro: +obj.oro,
        plata: +obj.plata,
        cobre: +obj.cobre,
        plomo: +obj.plomo,
        zinc: +obj.zinc,
        coque: +obj.coque,
        fierro: +obj.fierro,
        azufre: +obj.azufre,
        barita: +obj.barita,
        fluorita: +obj.fluorita,  
      });
      
    });
    // setupView()
    init();
    // console.log(dataMineria)
  });

  function setupView(){
    // Disable all buttons
    d3.selectAll("button").property("disabled", false);
    // enable only buttons not currently selected
    d3.select("#" + chart.current.key).property("disabled", true);
    // update page title
    d3.select("#chart").text(chart.current.title);
    
    // sorting the production data
    console.log(chart.current.key)
    dataMineria.sort((a, b) => d3.descending(a[chart.current.key], b[chart.current.key]))
    // var dataMinParsed = dataMineria.filter( d => d.oro != 0 || d.plata != 0 || d.cobre != 0 || d.plomo != 0 || d.zinc != 0 || d.coque != 0 || d.fierro != 0 || d.azufre != 0 || d.barita != 0 || d.fluorita != 0)  
    
    if (chart.current.key === "oro"){
      var dataMinParsed = dataMineria.filter( d => d.oro)
    } else if(chart.current.key === "plata"){
      var dataMinParsed = dataMineria.filter( d => d.plata)
    } else if(chart.current.key === "cobre"){
      var dataMinParsed = dataMineria.filter( d => d.cobre)
    } else if(chart.current.key === "plomo"){
      var dataMinParsed = dataMineria.filter( d => d.plomo)
    } else if(chart.current.key === "zinc"){
      var dataMinParsed = dataMineria.filter( d => d.zinc)
    } else if(chart.current.key === "coque"){
      var dataMinParsed = dataMineria.filter( d => d.coque)
    // } else if(chart.current.key === "fierro"){
    //   var dataMinParsed = dataMineria.filter( d => d.fierro)
    } else if(chart.current.key === "azufre"){
      var dataMinParsed = dataMineria.filter( d => d.azufre)
    } else if(chart.current.key === "barita"){
      var dataMinParsed = dataMineria.filter( d => d.barita)
    } else if(chart.current.key === "fluorita"){
      var dataMinParsed = dataMineria.filter( d => d.fluorita)
    } 
        
    console.log(`dataMineria.${chart.current.key}`)
    console.log("d." + chart.current.key) 
    console.log(dataMineria)
    console.log(dataMinParsed) //***REVISITED***

    // update scale domain with data from current selection
    const maxValue = d3.max(dataMinParsed, d => d[chart.current.key]);
    barScale.domain([0,maxValue]);
    colorScale.domain([0, maxValue]);
    
    return (dataMinParsed)
    
  } // end of setupView function

  // This function runs once
  function init () {
    // Setup svg viewport
    dataMinParsed = setupView();
    
    chart.height = dataMinParsed.length * 30 // adjust accordingly
    svg.attr("width", chart.width)
      .attr("height", chart.height);

    // bind the data and draw the firts chart
    
    svg.selectAll("g")
      .data(dataMinParsed)
      .enter().append("g")
      .attr("class", "entry")
      .attr("transform", (d,i) => `translate(0, ${i * 30})`)
      .each (function(d) {
        var entry = d3.select(this); // the current entry

        entry.append("text").attr("class", "label category")
          .attr("y", 15)
          .attr("x", 0)
          .text(d.name);

        entry.append("rect").attr("class", "bar")
          .attr("x", 150)
          .attr("height", 20)
          .attr("width", barScale(d[chart.current.key]))
          .style("fill", 
            d3.color(chart.current.color).darker(colorScale(d[chart.current.key])))

        entry.append("text").attr("class", "label value")
          .attr("y", 15)
          .attr("x", barScale(d[chart.current.key] + 2700)) // ***REVISITED***
          .attr("font-size", "9")
          .text(format(d[chart.current.key]) + " tons");

      }) // end .each
          
  } // end function init()

  function draw() {
    
    init();

    dataMinParsed = setupView();
    
    svg.selectAll("g.entry").data(dataMinParsed)
      .each(function (d,i){
        d3.select(this).select(".label.category")
          .text(d.name); // order may have change
        
        d3.select(this).select(".bar")
          .transition().duration(1000).delay(50 * i)
            .attr("width", barScale(d[chart.current.key]))
            .style("fill", d3.color(chart.current.color)
                            .darker(colorScale(d[chart.current.key])));
        
        d3.select(this).select(".label.value")
          .transition().duration(1000).delay(50 * i)
            .attr("x", barScale(d[chart.current.key]) + 160) //+800 ***REVISITED***
            .text(format(d[chart.current.key]) + " tons");
      }) // end .each()
      .exit().remove()  //This line could be commented if we want to keep the height fixed

  } // end function draw()
    
}); //end of event listener .on "click"

//////////*** CODE FOR SUMMARY BY TYPE OF MINERAL ***//////////

// THIS NEEDS TO BE UPDATED

var click4 = d3.select('#click4');
click4.on("click", function(){
  
  // to clear space in html   
  d3.select("#myDiv").html(""); 

  // To create the header
  d3.select("#myDiv").append("h3").text("Summary by type of mineral")
  // Creating a row in bootstrap to hold a h8 tag and the select
  var row_Just = d3.select("#myDiv").append("div").attr("class", "row")
  //Create a column to hold the bars  
  row_Just.append("div").attr("class", "col-4").attr("id", "h8div")
  // Create a column to hold the table
  row_Just.append("div").attr("class", "col-4").attr("id", "seldiv")
  // To create h8 tag
  d3.select("#h8div").append("h8").text("Select from the list the mineral you want to visualize")
  

  // To create a dropDown select
  let dropdown  = d3.select("#seldiv").append("select")
  .attr("id", "selDataset");

  // Populate it with D3
  dropdown.selectAll("option")
    .data(charts)
    .enter()
    .append("option")
    .attr("value", d => d.key)
    .text(d=>d.title);

  d3.select("#myDiv").append("hr")
  ////// This chunk of code is for plotting the map //////

  d3.select("#myDiv").append("div").attr("class", "row").append("div").attr("class", "col").attr("id", "mapcol")
  // Creating myMap Div
  d3.select("#mapcol").append("div").attr("id", "map2")

  let mymap = L.map('map2').setView([23.507173012505426, -103.01796971980406], 5); //Set to Zacatecas and zoom of 4

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiaXZpbGNoaXMiLCJhIjoiY2trN2twaDhqMDJmbzJybXVhMzcxNHY3NSJ9.5qG9lj6HT5aXnvZvne4dSg'
  }).addTo(mymap);

  // Creating a variable for the map styles
  let myStyle = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 1,
    "fillOpacity": 0
  };

  // Value Selected from the DropDown Menu
  let selected_mineral = d3.select("#selDataset").node().value
  let selected_mineral_color = d3.select("#selDataset").node().value
  // change the first letter to UpperCase to consult our API (it needs the first letter in UpperCase)
  selected_mineral = selected_mineral[0].toUpperCase() + selected_mineral.slice(1)
  
  // $(".leaflet-interactive").remove(); //removes previously drawn lines!

  // from the constant we get the value of the color, to match colors from the bars and the map
  for (let x=0, a=charts.length; x < a; x++ ){
    // if the selected mineral in the dropdown matches, then we select that color and break from the for cycle
    if (charts[x].key == selected_mineral_color){
      myStyle.color = charts[x].color
      break;
    }
  }
    
  // Here we call our API, it needs the name of the mineral first letter UpperCase
  // this API returns a GeoJSON object with only the states that produces the mineral 
  d3.json(`/${selected_mineral}`, function(data){
    // change the fillOpacity to know when we have visited one state, because the initial state is less transparent
    myStyle.fillOpacity = 0.5;
    
    // Add the geoJson layer to highlight only the states that produces the selected mineral
    L.geoJson(data,{
      pointToLayer: function(data, latlng){
          return L.marker(latlng)
      },
      onEachFeature: onEachFeature, // here we add the popups and events
      style: myStyle // change style
    }).addTo(mymap)

    

  }) // end of d3.json call to API


  ////// This chunk of code is for displting the table and the bar charts //////
  // Creating a row in bootstrap to hold the table and the bars in the same level
  d3.select("#myDiv").append("hr")

  var row_Just = d3.select("#myDiv").append("div").attr("class", "row justify-content-evenly")
  //Create a column to hold the bars  
  row_Just.append("div").attr("class", "col-md-7").attr("id", "col-bars")
  // Create a column to hold the table
  row_Just.append("div").attr("class", "col-md-5").attr("id", "col-table")


  // data used for each chart
  var chart = {
    width : 800, //
    height: 0,         // the height is set after data is loaded
    current: (charts.find(o => o.key === selected_mineral_color)) // [0] represents chart to display first
  }


  // Setting scale functions for y axis and colors, and format 2 digits 
  var barScale = d3.scaleLinear().range([0, 600]); //Validate 600
  var colorScale = d3.scaleLinear().range([0, 1]);
  const format = d3.format(",.0f");

  const svg = d3.select("#col-bars").append("svg").attr("class", "bar-chart").classed("svg-container", true) //container class to make it responsive;




  ///////////////// Event Listener for the dropDown
  d3.selectAll("#selDataset").on("change", function(){
    
    // Update selected mineral color
    selected_mineral_color = d3.select("#selDataset").node().value

    // Here Changes the values for the charts when you select something from the DropDown
    draw(true,selected_mineral_color,svg,chart,barScale,colorScale,format);
    
    //////// **** Here comes the code for updating the map in a separate function **** ////////
    changeDrop(mymap)
    
  }); //end of selectAll("button")
  
  // let indice = d3.select("#selDataset").node().value
  console.log("+++++++++selected_mineral_color",selected_mineral_color)
  draw(true, selected_mineral_color,svg,chart,barScale,colorScale,format)

}); // End of d3.select #click4



//////////*** CODE FOR CONCLUSIONS MENU ***//////////

// WORK IN PROGRESS

var click5 = d3.select('#click5');
click5.on("click", function(){
  
  function init() {
  // to clear space in html 
  d3.select("#myDiv").html("");
  // To create the header
  d3.select("#myDiv").append("h1").text("Conclusions") 
  d3.select("#myDiv").append("hr")
  // Creating a div class "list-group"
  d3.select("#myDiv").append("div").attr("class", "list-group")
  
  // To create a list of buttons class "list-group-item list-group-item-action"
  d3.select("div.list-group").append("button").attr("id", "one").attr("class", "list-group-item list-group-item-action").text(" ( 1 ) ")
  d3.select("div.list-group").append("button").attr("id", "two").attr("class", "list-group-item list-group-item-action").text(" ( 2 ) ")
  d3.select("div.list-group").append("button").attr("id", "three").attr("class", "list-group-item list-group-item-action").text(" ( 3 ) ")
  d3.select("div.list-group").append("button").attr("id", "four").attr("class", "list-group-item list-group-item-action").text(" ( 4 ) ")
  d3.select("div.list-group").append("button").attr("id", "five").attr("class", "list-group-item list-group-item-action").text(" ( 5 ) ")
    
  };  

  init()

  // Take Away #1
  d3.select("#one").on("click", function(){
    d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
    d3.select("#one").text(" ( 1 ) Sonora is by far the greatest producer of Gold and Copper")
      .attr("class", "list-group-item list-group-item-action active")
  });

  // Take Away #2
  d3.select("#two").on("click", function(){
    d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
    d3.select("#two").text(" ( 2 ) Zacatecas is the larger producer of Silver followed by Chihuahua and Durango")
    .attr("class", "list-group-item list-group-item-action active")
  })

  // Take Away #3
  d3.select("#three").on("click", function(){
    d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
    d3.select("#three").text(" ( 3 ) Only a few states in Mexico are dedicated to the Mining Industry")
    .attr("class", "list-group-item list-group-item-action active")
  })

  // Take Away #4
  d3.select("#four").on("click", function(){
    d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
    d3.select("#four").text(" ( 4 ) INEGI data can seem confusing but it is very well organized in comparisson with other governmental bodies")
    .attr("class", "list-group-item list-group-item-action active")
  })

  // Take Away #5
  d3.select("#five").on("click", function(){
    d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
    d3.select("#five").text(" ( 5 ) The hardest part of the project was to connect the back and the front end")
    .attr("class", "list-group-item list-group-item-action active")
  })

})  // end of event listener click


//////////*** CODE FOR DROPDOWN SELECTION @ RESUMEN ONLY MAP ***//////////

// WORK IN PROGRESS
function changeDrop(mymap){
  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiaXZpbGNoaXMiLCJhIjoiY2trN2twaDhqMDJmbzJybXVhMzcxNHY3NSJ9.5qG9lj6HT5aXnvZvne4dSg'
  }).addTo(mymap);

  // Creating a variable for the map styles
  let myStyle = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 1,
    "fillOpacity": 0
  };

  // Value Selected from the DropDown Menu
  let selected_mineral = d3.select("#selDataset").node().value
  let selected_mineral_color = d3.select("#selDataset").node().value
  // change the first letter to UpperCase to consult our API (it needs the first letter in UpperCase)
  selected_mineral = selected_mineral[0].toUpperCase() + selected_mineral.slice(1)
  
  $(".leaflet-interactive").remove(); //removes previously drawn lines!

  // from the constant we get the value of the color, to match colors from the bars and the map
  for (let x=0, a=charts.length; x < a; x++ ){
    // if the selected mineral in the dropdown matches, then we select that color and break from the for cycle
    if (charts[x].key == selected_mineral_color){
      myStyle.color = charts[x].color
      break;
    }
  }
    
  // Here we call our API, it needs the name of the mineral first letter UpperCase
  // this API returns a GeoJSON object with only the states that produces the mineral 
  d3.json(`/${selected_mineral}`, function(data){
    // change the fillOpacity to know when we have visited one state, because the initial state is less transparent
    myStyle.fillOpacity = 0.5;
    
    // Add the geoJson layer to highlight only the states that produces the selected mineral
    L.geoJson(data,{
      pointToLayer: function(data, latlng){
          return L.marker(latlng)
      },
      onEachFeature: onEachFeature, // here we add the popups and events
      style: myStyle // change style
    }).addTo(mymap)

  }) // end of d3.json call to API
}