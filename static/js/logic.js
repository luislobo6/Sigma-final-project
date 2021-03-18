/////////// Ploteo Function ////////////////////////

function ploteo(dropdownMenu){

    Plotly.d3.csv(`static/data/${dropdownMenu}.csv`, function(err, rows){
    function unpack(rows, key) {
      return rows.map(function(row) { return row[key]; });
    }
    
    var date = unpack(rows, 'ds')
    var y = unpack(rows, 'y') //.map(x => parseFloat(x))
    var yhat = unpack(rows, 'yhat') //.map(x => parseFloat(x))
    var yhat_lower = unpack(rows, 'yhat_lower')
    var yhat_upper = unpack(rows, 'yhat_upper')
    
    // console.log(date)
    // console.log(y)
    
    var trace1 = {
        type: "scatter",
        mode: "lines+markers", //"lines+markers"
        marker: {size: 3,
            color: 'darknavyblue'
        },
        name: 'actual',
        x: date,
        y: y,
        line: {color: 'darknavyblue'} //'black'
    }
    
    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: 'predicted',
        x: date,
        y: yhat,
        opacity: 1,
        line: {color: 'darkred',
        dash: 'dashdot',
        width: 1.5
        } //'#7f7f7f' 'darkgreen'
    }
    
    var trace3 = {
        type: "scatter",
        mode: "lines",
        name: 'Lower Band',
        fill: "none",
        x: date,
        y: yhat_lower,
        line: {color: 'grey'}
    }
    
    var trace4 = {
        type: "scatter",
        mode: "lines",
        name: 'Upper Band',
        fill: "tonexty",
        x: date,
        y: yhat_upper,
        line: {color: 'grey'}
    }
    
    var data = [trace1,trace2, trace3, trace4];
    
    var layout = {
        title: `${dropdownMenu} Projection with Prophet (Billion Ps)`,
        autosize: false,
        width: 1000,
        height: 540,
        // paper_bgcolor: 'LightSteelBlue',
        // plot_bgcolor: '#7f7f7f',
        xaxis: {
          autorange: true,
          range: ['2000-12-01', '2026-01-01'],
          rangeselector: {buttons: [
              {
                count: 1,
                label: '1m',
                step: 'month',
                stepmode: 'backward'
              },
              {
                count: 6,
                label: '6m',
                step: 'month',
                stepmode: 'backward'
              },
              {step: 'all'}
            ]},
          rangeslider: {range: ['2000-12-01', '2026-01-01']},
          type: 'date'
        },
        yaxis: {
          autorange: true,
          range: [86.8700008333, 138.870004167],
          type: 'linear'
        }
      };
    
      Plotly.newPlot('myDiv', data, layout);
    
    }); //end of Plotly.d3.csv    
} //end ploteo function

//////////*** CODE FOR HOME MENU ***//////////

var clickHome = d3.select('#click-Home');
clickHome.on("click", function(){
// to clear space in html   
  d3.select("#myDiv").html("");
//Adding AJAX table
  d3.select("#myDiv").append("h3").text("Mexico Banking Industry Data")
  d3.select("#myDiv").append("hr")
  //Creating Table
  d3.select("#myDiv").append("table").attr("class","display").attr("id","mytable").attr("width","100%")
  let head_table= d3.select("#mytable").append("thead").attr("width","100%").append("tr")
  head_table.append("th").text("Bank")
  head_table.append("th").text("Account")
  head_table.append("th").text("Date")
  head_table.append("th").text("Value")
  
  //Creating table with AJAX
  $(document).ready(function(){
    $('#mytable').DataTable({
      "ajax":{
        url:'static/data/table_data.json'
      },
      columns:[
        {data:"Bank"},
        {data:"Account Name"},
        {data:"Time"},
        {data:"Value"}
      ],
      "paging":true,
      "ordering":true,
      "info":true
    })
  })
console.log("Hiya");
});//end of event listener .on "click"

//////////*** CODE FOR TABLEAU BENCHMARK HISTORICAL ANALYSIS MENU ***//////////

var clickBenchmark = d3.select('#historical-benchmark');
clickBenchmark.on("click", function(){

// to clear space in html   
d3.select("#myDiv").html("");

d3.select("#myDiv").append("iframe")
.attr("src", "https://public.tableau.com/views/Market_Share_Mex_2020/MarketShare?:language=es&:display_count=y&:origin=viz_share_link:showVizHome=no&:embed=true")
.attr("width","1080").attr("height", "520")

});//end of event listener .on "click"



//////////*** CODE FOR TABLEAU PORTFOLIO MENU ***//////////

var clickPortAnalysis = d3.select('#portfolio-analysis');
clickPortAnalysis.on("click", function(){

// to clear space in html   
d3.select("#myDiv").html("");

d3.select("#myDiv").append("iframe")
.attr("src", "https://public.tableau.com/views/Bank_Lending_Mexico/Story1?:language=es&:display_count=y&:origin=viz_share_link:showVizHome=no&:embed=true")
.attr("width","1080").attr("height", "520")

});//end of event listener .on "click"

//////////*** CODE FOR PORTFOLIO PROJECTIONS MENU ***//////////

var clickPortProjections = d3.select('#portfolio-projections');
clickPortProjections.on("click", function(){

// to clear space in html   
d3.select("#myDiv").html("");

// To create the select item
d3.select("#myDiv").append("select").attr("id", "selDataset")

d3.select("#selDataset").append("option").attr("id", "Total_Portfolio")
.text("Total_Portfolio")
d3.select("#selDataset").append("option").attr("id", "Commercial_Portfolio")
.text("Commercial_Portfolio") 
d3.select("#selDataset").append("option").attr("id", "Retail_Portfolio")
.text("Retail_Portfolio") 
d3.select("#selDataset").append("option").attr("id", "Mortgage_Portfolio")
.text("Mortgage_Portfolio")
d3.select("#selDataset").append("option").attr("id", "Total_Liabilities")
.text("Total_Liabilities")
d3.select("#selDataset").append("option").attr("id", "Bank_Deposits")
.text("Bank_Deposits") 
d3.select("#selDataset").append("option").attr("id", "Time_Deposits")
.text("Time_Deposits")

ploteo("Total_Portfolio")

d3.select('#selDataset').on("change", function(){
    var dropdownMenu = d3.select("#selDataset").node().value;
    console.log(dropdownMenu)
    ploteo(dropdownMenu) 
});

});//end of event listener .on "click"

//////////*** CODE FOR TABLEAU FINANCIAL RESULTS MENU ***//////////

var clickResults = d3.select('#results');
clickResults.on("click", function(){

// to clear space in html   
d3.select("#myDiv").html("");

d3.select("#myDiv").append("iframe")
.attr("src", "https://public.tableau.com/shared/5QDW5DP8P?:display_count=y&:origin=viz_share_link:showVizHome=no&:embed=true")
.attr("width","1080").attr("height", "520")

});//end of event listener .on "click"


//////////*** CODE FOR CONCLUSIONS ***//////////

var clickConclusions = d3.select('#click-Conclusions');
clickConclusions.on("click", function(){
    function init() {
        // // to clear space in html 
        // d3.select("#myDiv").html("");
        // // To create the header
        // d3.select("#myDiv").append("h1").text("Conclusions") 
        // d3.select("#myDiv").append("hr")
        // // Creating a div class "list-group"
        // d3.select("#myDiv").append("div").attr("class", "list-group")
        
        // // To create a list of buttons class "list-group-item list-group-item-action"
        // d3.select("div.list-group").append("button").attr("id", "one").attr("class", "list-group-item list-group-item-action").text(" ( 1 ) ")
        // d3.select("div.list-group").append("button").attr("id", "two").attr("class", "list-group-item list-group-item-action").text(" ( 2 ) ")
        // d3.select("div.list-group").append("button").attr("id", "three").attr("class", "list-group-item list-group-item-action").text(" ( 3 ) ")
        // d3.select("div.list-group").append("button").attr("id", "four").attr("class", "list-group-item list-group-item-action").text(" ( 4 ) ")
        // d3.select("div.list-group").append("button").attr("id", "five").attr("class", "list-group-item list-group-item-action").text(" ( 5 ) ")
          
        // };  
      
        // init()
      
        // // Take Away #1
        // d3.select("#one").on("click", function(){
        //   d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
        //   d3.select("#one").text(" ( 1 ) Sonora is by far the greatest producer of Gold and Copper")
        //     .attr("class", "list-group-item list-group-item-action active")
        // });
      
        // // Take Away #2
        // d3.select("#two").on("click", function(){
        //   d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
        //   d3.select("#two").text(" ( 2 ) Zacatecas is the larger producer of Silver followed by Chihuahua and Durango")
        //   .attr("class", "list-group-item list-group-item-action active")
        // })
      
        // // Take Away #3
        // d3.select("#three").on("click", function(){
        //   d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
        //   d3.select("#three").text(" ( 3 ) Only a few states in Mexico are dedicated to the Mining Industry")
        //   .attr("class", "list-group-item list-group-item-action active")
        // })
      
        // // Take Away #4
        // d3.select("#four").on("click", function(){
        //   d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
        //   d3.select("#four").text(" ( 4 ) INEGI data can seem confusing but it is very well organized in comparisson with other governmental bodies")
        //   .attr("class", "list-group-item list-group-item-action active")
        // })
      
        // // Take Away #5
        // d3.select("#five").on("click", function(){
        //   d3.selectAll("button").attr("class", "list-group-item list-group-item-action")
        //   d3.select("#five").text(" ( 5 ) The hardest part of the project was to connect the back and the front end")
        //   .attr("class", "list-group-item list-group-item-action active")
        // })
      

});//end of event listener .on "click"