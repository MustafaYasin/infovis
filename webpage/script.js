//JL: set variables for window height and width
var h = $(window).innerHeight();
var w = $(window).innerWidth();


/*JL: scrollmagic:
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
    var scene = new ScrollMagic.Scene({ duration: h/4, triggerHook: 0, reverse:true})
        .setTween(h1Disappears)
        .addIndicators() // add indicators (requires plugin)
        .addTo(controller);

    // gantt-chart appears
    var ganttAppears = TweenLite.to("#gantt_chart", 1, {
        opacity: 1
    });

    // build scene for gantt-chart appears
    var scene = new ScrollMagic.Scene({ duration: h, triggerHook: 0, reverse:true})
        .setTween(ganttAppears)
        .addIndicators() // add indicators (requires plugin)
        .addTo(controller);
});



// define what chart to draw
function drawChart() {

    // fill the data table
    // columns TODO: get data from json
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task ID');
    data.addColumn('string', 'Task Name');
    data.addColumn('string', 'Maßnahme');
    data.addColumn('date', 'Start Date');
    data.addColumn('date', 'End Date');
    data.addColumn('number', 'Duration');
    data.addColumn('number', 'Percent Complete');
    data.addColumn('string', 'Dependencies');

    // rows TODO: get data from json
    data.addRows([
        ['', '2020 Zeitstrahl', '',
            new Date(2020, 1, 1), new Date(2020, 12, 31), null, 100, null],
        ['maßnahme 1', 'Stop von Konzerten und Sportveranstaltungen', 'Immer mehr Theater und Konzerthäuser stellen den Spielbetrieb ein. Die Fußball-Bundesliga pausiert',
            new Date(2020, 3, 12), new Date(2020, 5, 16), null, 100, null],
        ['maßnahme 2', 'Reiseeinschränkung', 'Die Grenzen zu Frankreich, Österreich, Luxemburg, Dänemark und der Schweiz gibt es Kontrollen und Einreiseverbote. In den meisten Bundesländern sind Schulen und Kitas geschlossen',
            new Date(2020, 3, 16), new Date(2020, 5, 16), null, 100, null],
        ['maßnahme 3', '1. Lockdown', 'Verbot von Ansammlungen von mehr als zwei Menschen. Ausgenommen sind Angehörige, die im eigenen Haushalt leben. Cafés, Kneipen, Restaurants, aber auch Friseure zum Beispiel schließen',
            new Date(2020, 3, 22), new Date(2020, 5, 11), null, 100, null],
        ['maßnahme 4', 'Schule schließt', 'Schule schließt',
            new Date(2020, 3, 22), new Date(2020, 4, 15), null, 100, null],
        ['maßnahme 5', 'Maskenpflicht für alle Bundesländer', 'Maskenpflicht für alle Bundesländer',
            new Date(2020, 4, 22), new Date(2020, 12, 31), null, 100, null],
        ['maßnahme 6', 'Reiseeinschränkung', 'Einreisende aus internationalen Risikogebieten müssen sich bei der Rückkehr nach Deutschland testen lassen',
            new Date(2020, 8, 8), new Date(2020, 12, 31), null, 100, null],
        ['maßnahme 7', 'Beherbergungsverbot', 'Die Bundesländer beschließen ein Beherbergungsverbot für Urlauber aus inländischen Risikogebieten. Die Zahl der Neuinfektionen ist auf mehr als 4000 binnen eines Tages gestiegen',
            new Date(2020, 10, 7), new Date(2020, 12, 31), null, 100, null],
        ['maßnahme 8', 'Beherbergungsverbot', 'Beherbergungsverbot bei Inzididenz > 50',
            new Date(2020, 10, 14), new Date(2020, 12, 31), null, 100, null],
        ['maßnahme 9', 'Lockdown light', 'Lockdown light, Gastronomie schließt',
            new Date(2020, 11, 2), new Date(2020, 12, 31), null, 100, null],

    ]);

    // gantt chart options
    var options = {
        height: 400,
        gantt: {
            trackHeight: 30,
            defaultStartDate: new Date(2020,1,1),
            // color palette of the gantt chart
            palette: [
                {
                    "color": "#5e97f6",
                    "dark": "#2a56c6",
                    "light": "#c6dafc"
                }
            ]
        }
    };

    // define the chart
    var chart = new google.visualization.Gantt(document.getElementById('gantt_chart'));

    // draw the chart
    chart.draw(data, options);
}

// load google gantt chart
google.charts.load('current', {'packages':['gantt']});
// call drawChart function with loaded chart
google.charts.setOnLoadCallback(drawChart);

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
