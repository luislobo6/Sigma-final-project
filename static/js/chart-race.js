//////////*** CODE FOR CHART-BAR-RACE ***//////////

var clickRace = d3.select('#chart-race-click');
clickRace.on("click", function(){
  
  d3.select("#myDiv").html("");
  
//////////////////////////////////////////////////////////

const top_n = 10;
const height = 520;
const width = 1230;

const tickDuration  = 2000; //delay of an animation
const delayDuration = 3500; 
const yearStart     = 2009;
const yearEnd       = 2020;

const title = `Top Mexican Banks with Highest Portfolio Value (${yearStart}-${yearEnd})`;

const svg = d3.select("#myDiv").append("svg")
   .attr("width", width)
   .attr("height", height)
   .style("background-color", "grey");

const margin = {
   top: 80,
   right: 0,
   bottom: 0,
   left: 0
};

const palette = {
   Banamex: "rgba(200, 15, 0, 1)", 
   BBVA: "rgba(0, 15, 255, 1)",
   Santander: "rgba(250, 60, 0, 1)",
   Banorte: "rgba(160, 0, 0, 1)",
   HSBC: "rgba(255, 0, 0, 1)",
   Scotiabank: "rgba(160, 60, 0, 1)",
   Inbursa: "rgba(20, 20, 255, 1)",
   Bajio: "rgba(255, 150, 0, 1)",
   Azteca: "rgba(60, 200, 100, 1)",
   Banregio: "rgba(109, 0, 0, 1)",
   Bancoppel: "rgba(255, 165, 0, 1)",
   Multiva: "rgba(0, 0, 255, 1)",
   Sabadell: "rgba(106, 90, 205, 1)",
   Interacciones: "rgba(255, 99, 71, 1)"
};

const logos = {
   Banamex: "static/images/banamex.png", 
   BBVA: "static/images/bbva.png",
   Santander: "static/images/santander.png",
   Banorte: "static/images/banorte.png",
   HSBC: "static/images/hsbc.png",
   Scotiabank: "static/images/scotia.png",
   Inbursa: "static/images/inbursa.png",
   Bajio: "static/images/bajio.png",
   Azteca: "static/images/azteca.png",
   Banregio: "static/images/banregio.png",
   Bancoppel: "static/images/bancoppel.png",
   Multiva: "static/images/multiva.png",
   Sabadell: "static/images/sabadell.png",
   Interacciones: "static/images/interacciones.png"
};

const barPadding = (height-(margin.bottom+margin.top))/(top_n*5);

svg.append('text')
   .attr('class', 'title')
   .attr('y', 24)
   .html(title);


svg.append('text')
   .attr('class', 'subTitle')
   .attr('y', 40)
   .html('Billions Ps');

let year = yearStart;

d3.csv("static/data/dataChartRace.csv", function(data) {

   console.log(data);

   // data.forEach( d => {
   //    d.colour = d3.rgb(Math.random()*255,Math.random()*155,Math.random()*255);
   //    // d.colour = d3.hsl(Math.random()*360,0.75,0.75);
   // });

   let lastValues = {};

   function _normalizeData(){
       const values = {};

       const ret = [];
       data.forEach( d => {
          const name = d["Bank Name"];
          const lbl  = `${year} [YR${year}]`;
          const txt  = d[lbl];
          let val  = "";
          if( txt != '..')
            val = txt; //parseFloat(txt);
          
          val = Math.round( val * 1e1) / 1e1; //round 1 digit // change to this for 2 digits: Math.round( val * 1e2) / 1e2
         //  console.log(val)  
          
          let lastValue = lastValues[ name ];
          if( lastValue == null )
            lastValue = "";
          
          ret.push({
              name     : name,
              colour   : palette[name],//d.colour,
              value    : val,
              img      : logos[name],   
              lastValue: lastValue
          });
          
          //remember current value of the country
          values[name] = val;
          
       }); //End forEach
      
      lastValues = values;

       return ret.sort((a,b) => b.value - a.value).slice(0, top_n);
   } //End of function _normalizeData()

   let yearSlice = _normalizeData();

   yearSlice.forEach((d,i) => d.rank = i);

   console.log('yearSlice: ', yearSlice)

   let x = d3.scaleLinear()
      .domain([0, d3.max(yearSlice, d => d.value)])
      .range([margin.left, width-margin.right-65]);

   let y = d3.scaleLinear()
      .domain([top_n, 0])
      .range([height-margin.bottom, margin.top]);

   let xAxis = d3.axisTop()
      .scale(x)
      .ticks(width > 500 ? 5:2)
      .tickSize(-(height-margin.top-margin.bottom))
      .tickFormat(d => d3.format(',')(d))
      ;

   svg.append('g')
      .attr('class', 'axis xAxis')
      .attr('transform', `translate(0, ${margin.top})`)
      .call(xAxis)
      .selectAll('.tick line')
      .classed('origin', d => d == 0);

   svg.selectAll('rect.bar')
      .data(yearSlice, d => d.name)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', x(0)+1)
      .attr('width', d => x(d.lastValue)-x(0))
      .attr('y', d => y(d.rank)+5)
      .attr('height', y(1)-y(0)-barPadding)
      .style('fill', d => d.colour);

   ////////////////////////////////////////////

   // svg.selectAll('text.label')
   //    .data(yearSlice, d => d.name)
   //    .enter()
   //    .append('text')
   //    .attr('class', 'label')
   //    .attr('x', d => x(d.lastValue)-8)
   //    .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
   //    .style('text-anchor', 'end')
   //    .html(d => d.name);

   //////////////////////////////////

   const group = svg.selectAll('svg.label')
   .data(yearSlice, d => d.name)
   .enter()
   .append('svg')
   .attr('class', 'label')
   .attr('x', d => x(d.lastValue)-4)
   .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
   ;

   group.append('text')
      .attr('class', 'label')
      .attr('dx', -32)
      .attr('dy', 20)
      .html(d => d.name)    

   group.append('image')
      .attr('class', 'flag')
      .attr('width', 35)
      .attr('height', 25)
      .attr('x', -30)
      .attr('y', 3)
      .attr("xlink:href", d => d.img)




   //////////////////////////////////////

   ///// hidden intentionally

      // svg.selectAll('text.valueLabel')
   //    .data(yearSlice, d => d.name) //d.value
   //    .enter()
   //    .append('text')
   //    .attr('class', 'valueLabel')
   //    .attr('x', d => x(d.lastValue)+5)
   //    .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
   //    .text(d => d.value); //d.lastValue

   let yearText = svg.append('text')
      .attr('class', 'yearText')
      .attr('x', width-margin.right)
      .attr('y', height-25)
      .style('text-anchor', 'end')
      .html(~~year);

   let ticker = d3.interval(e => {

      yearSlice = _normalizeData();

      yearSlice.forEach((d,i) => d.rank = i);

      console.log('IntervalYear: ', yearSlice); // Console log

      x.domain([0, d3.max(yearSlice, d => d.value)]); 

      svg.select('.xAxis')
         .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .call(xAxis);

      const bars = svg.selectAll('.bar').data(yearSlice, d => d.name);

      bars
         .enter()
         .append('rect')
         .attr('class', d => `bar ${d.name.replace(/\s/g,'_')}`)
         .attr('x', x(0)+1)
         .attr( 'width', d => x(d.value)-x(0))
         .attr('y', d => y(top_n+1)+5)
         .attr('height', y(1)-y(0)-barPadding)
         .style('fill', d => d.colour)
         .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('y', d => y(d.rank)+5);

      bars
         .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('width', d => Math.max(0, x(d.value)-x(0)))
         .attr('y', d => y(d.rank)+5);

      bars
         .exit()
         .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('width', d => Math.max(0, x(d.value)-x(0)))
         .attr('y', d => y(top_n+1)+5)
         .remove();

      //***************************** */   

      // const labels = svg.selectAll('.label')
      //    .data(yearSlice, d => d.name);

      // labels
      //    .enter()
      //    .append('text')
      //    .attr('class', 'label')
      //    .attr('x', d => x(d.value)-8)
      //    .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
      //    .style('text-anchor', 'end')
      //    .html(d => d.name)    
      //    .transition()
      //    .duration(tickDuration)
      //    .ease(d3.easeLinear)
      //    .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
   
      // labels
      //    .transition()
      //    .duration(tickDuration)
      //    .ease(d3.easeLinear)
      //    .attr('x', d => x(d.value)-8)
      //    .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

      // labels
      //    .exit()
      //    .transition()
      //    .duration(tickDuration)
      //    .ease(d3.easeLinear)
      //    .attr('x', d => x(d.value)-8)
      //    .attr('y', d => y(top_n+1)+5)
      //    .remove();

      //***************************** */   

      let labels = svg.selectAll('svg.label')
      .data(yearSlice, d => d.name);

      const group = labels
      .enter()
      .append('svg')
      .attr('class', 'label')
      .attr('x', d => x(d.value)-4)
      .attr('y', d => y(top_n+1)+10)
      ;

      group
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('y', d => y(d.rank)+10)
      ;

      group.append('text')
      .attr('class', 'label')
      .attr('dx', -32)
      .attr('dy', 20)
      .html(d => d.name)    

      group.append('image')
      .attr('class', 'flag')
      .attr('width', 35)
      .attr('height', 20)
      .attr('x', -30)
      .attr('y', 3)
      .attr("xlink:href", d => d.img)

      labels
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('x', d => x(d.value)-4)
      .attr('y', d => y(d.rank)+10);

      labels
      .exit()
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('x', d => x(d.value)-4)
      .attr('y', d => y(top_n+1)+5)
      .remove();


      //***************************** */   

      const valueLabels = svg.selectAll('.valueLabel').data(yearSlice, d => d.value); // d => d.name)

      valueLabels
         .enter()
         .append('text')
         .attr('class', 'valueLabel')
         .attr('x', d => x(d.value)+5)
         .attr('y', d => y(top_n+1)+5)
         .text( function (d) {
            if(d.value != 0)
               return d.value;
            else 
               return ""
         }) //.text(d => d.value) 
         .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

      valueLabels
         .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('x', d => x(d.value)+5)
         .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
         // .tween("text", function(d) {
         //    let i = d3.interpolateNumber(d.lastValue, d.value);
            
            // return function(t) {
               // this.textContent = d3.format(',')(i(t));
            // }; // End of function t
            
         // }); //End of tween 

      valueLabels
         .exit()
         .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .attr('x', d => x(d.value)+5)
         .attr('y', d => y(top_n+1)+5)
         .remove();

      yearText.html(~~year);

      year ++;
      if(year > yearEnd) ticker.stop();
   }, delayDuration); // End of d3.interval

}); // End of d3.csv

//////////////////////////////////////////////////////////

})  // end of event listener click
