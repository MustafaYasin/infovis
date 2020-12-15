//set variables for window height and width
var h = $(window).innerHeight();
var w = $(window).innerWidth();


/*scrollmagic:
 - makes headline disappear on scroll
 - makes content appear on scroll
 */

$(document).ready(function($)  { // wait for document ready
		// init ScrollMagic
		var controller = new ScrollMagic.Controller({container: "#scrollcontainer"});

        // header1Container disapears
        var h1Disappears = TweenLite.to("#h1Container", 1, {
            opacity: 0
        });
        // build scene for header1Container disappers
        var scene = new ScrollMagic.Scene({ duration: h/2, triggerHook: 0, reverse:true})
                        .setTween(h1Disappears)
                        .addTo(controller);

        // contentContainer appears
        var contentAppears = TweenLite.to("#contentContainer", 1, {
            opacity: 1
        });
        // build scene for header1Container disappers
        var scene = new ScrollMagic.Scene({ duration: h, triggerHook: 0, reverse:true})
                        .setTween(contentAppears)
                        .addTo(controller);
});

function filterData(data){
const beherbergungen = data.filter(
item => item.Sparte === 'Beherbergung'
);
visualiseChart(beherbergungen);
}

function filterDatanachGastro(data){
const gastro = data.filter(
item => item.Sparte === 'Gastronomie'
);
visualiseChart(gastro);
}


function visualiseChart(data){
console.log("test");
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
var svg = d3.select("#visualisationContainer")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",`translate(${margin.left},${margin.top})`);

var xAxis = d3.scaleBand()
              .domain(data.map(function(d) { return d.Monat; }))
              .range([0, width]);

svg.append("g")
   .attr("transform", `translate(0, ${height})`)
   .call(d3.axisBottom(xAxis));
var yAxis = d3.scaleLinear()
							.domain([-50,50])
              //.domain([d3.min(data.map(function(d) {return d.VeraederungenzumVorjahr;})),d3.max(data.map(function(d) { return d.VeraederungenzumVorjahr; }))])
              .range([height, 0]);
svg.append("g")
   .call(d3.axisLeft(yAxis));
//curve
var curve = svg.append("path")
               .datum(data)
               .attr("fill", "none")
               .attr("stroke", "turquoise")
               .attr("stroke-width", 2)
							 .attr('d',d3
               .line()
               .x(function (d) {return xAxis(d.Monat);})
               .y(function (d) {var value = (+(d.VeraederungenzumVorjahr.replace(",",".")));
                  return yAxis(value);})
          );


}
