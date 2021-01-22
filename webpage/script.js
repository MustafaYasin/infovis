//JL: set variables for window height and width
var h = $(window).innerHeight();
var w = $(window).innerWidth();

let massnahmen = [
	['maßnahme 1', 'Stop von Konzerten und Sportveranstaltungen', 'Immer mehr Theater und Konzerthäuser stellen den Spielbetrieb ein. Die Fußball-Bundesliga pausiert',
		new Date(2020, 2, 12), new Date(2020, 5, 16), null, 100, null],
	['maßnahme 2', 'Reiseeinschränkung', 'In den meisten Bundesländern sind Schulen und Kitas geschlossen',
		new Date(2020, 2, 16), new Date(2020, 5, 16), null, 100, null],
	['maßnahme 3', '1. Lockdown', 'Verbot von Ansammlungen von mehr als zwei Menschen. Ausgenommen sind Angehörige, die im eigenen Haushalt leben. Cafés, Kneipen, Restaurants, aber auch Friseure zum Beispiel schließen',
		new Date(2020, 2, 22), new Date(2020, 5, 11), null, 100, null],
	['maßnahme 4', 'Schule schließt', 'Schule schließt',
		new Date(2020, 2, 22), new Date(2020, 4, 15), null, 100, null],
	['maßnahme 5', 'Maskenpflicht für alle Bundesländer', 'Maskenpflicht für alle Bundesländer',
		new Date(2020, 3, 22), new Date(2020, 12, 31), null, 100, null],
	['maßnahme 6', 'Reiseeinschränkung', 'Einreisende aus internationalen Risikogebieten müssen sich bei der Rückkehr nach Deutschland testen lassen',
		new Date(2020, 7, 8), new Date(2020, 12, 31), null, 100, null],
	['maßnahme 7', 'Beherbergungsverbot', 'Die Bundesländer beschließen ein Beherbergungsverbot für Urlauber aus inländischen Risikogebieten. Die Zahl der Neuinfektionen ist auf mehr als 4000 binnen eines Tages gestiegen',
		new Date(2020, 9, 7), new Date(2020, 12, 31), null, 100, null],
	['maßnahme 8', 'Beherbergungsverbot', 'Beherbergungsverbot bei Inzididenz > 50',
		new Date(2020, 9, 14), new Date(2020, 12, 31), null, 100, null],
	['maßnahme 9', 'Lockdown light', 'Lockdown light, Gastronomie schließt',
		new Date(2020, 10, 2), new Date(2020, 12, 31), null, 100, null],
	['2020', '2020', '2020',
		new Date(2020, 0, 0), new Date(2020, 12, 31), null, 100, null],

]
/*
scrollmagic:
 - makes headline disappear on scroll
 - makes content appear on scroll
 */

/**
* Runs the whole Javascript  code "on document ready"
*scrollmagic:
    * - makes headline disappear on scroll
    *- makes content appear on scroll
*/

$(document).ready(function($)  { // wait for document ready
    // init ScrollMagic
    var controller = new ScrollMagic.Controller();

    // header1Container disapears
    var h1Disappears = TweenLite.to("#h1Container", 1, {
        opalineObject: 0
    });
    // build scene for header1Container disappers
    var scene = new ScrollMagic.Scene({ duration: h, triggerHook: 0, reverse:true})
        .setTween(h1Disappears)
        //.addIndicators() // add indicators (requires plugin)
        .addTo(controller);


    // checkbox events
    $('#BeherbergungUmsatz').on('change', (event) => {
      if(!event.target.checked) {
        $('.line.lineObjects.Beherbergung.Umsatz').css({'display': 'none'});
      } else {
        $('.line.lineObjects.Beherbergung.Umsatz').css({'display': 'block'});
      }
    });

    $('#Beherbergungbeschäftigte').on('change', (event) => {
      if(!event.target.checked) {
        $('.line.lineObjects.Beherbergung.Beschäftigte').css({'display': 'none'});
      } else {
        $('.line.lineObjects.Beherbergung.Beschäftigte').css({'display': 'block'});
      }
    });

    $('#GastronomieUmsatz').on('change', (event) => {
      if(!event.target.checked) {
        $('.line.lineObjects.Gastronomie.Umsatz').css({'display': 'none'});
      } else {
        $('.line.lineObjects.Gastronomie.Umsatz').css({'display': 'block'});
      }
    });

    $('#Gastronomiebeschäftigte').on('change', (event) => {
      if(!event.target.checked) {
        $('.line.lineObjects.Gastronomie.Beschäftigte').css({'display': 'none'});
      } else {
        $('.line.lineObjects.Gastronomie.Beschäftigte').css({'display': 'block'});
      }
    });

    //get's the csv data and runs the main function with it
    d3.csv("https://gist.githubusercontent.com/BilelAyech/aa74eaba3d8f09b49e4c0bac08572858/raw/fa8d8c9bd598000bb1051dea72592078fd171ffb/data2.csv")
    .then(d => {
      main(d)
    })

});

/**
 * Runs all functions related to the D3 Line Chart
 */
function main(data){
    chart(data);
	google.charts.load('current', {'packages':['gantt']});
	google.charts.setOnLoadCallback(drawChart);

}


/**
 * Draws the D3 Line Chart, updates the D3 Line Chart and generates a tooltip for the D3 Line Chart
 * @param {array} keys - The array holding a key for each line in the line chart (Beherbergung Umsatz,Beherbergung Beschäftigte,...)
 * @param {parseTime} d - Reading out the dates of the csv
 * @param {d3 chart} svg - holds the scaffold of the chart and draws it's tooltip
 * @param {d3 scaleTime} x - defines the x points for the chart lineObjects
 * @param {d3 scaleLinear} y - defines the y points for the chart lineObjects
 * @param {d3 scaleOrdinal} z - sets the color scheme of the chart lineObjects
 * @param {d3 line} line - draws the chart lineObjects depending on x,y,z
 * @param {svg} focus - defines the tooltip
 * @param {svg} overlay - defines the tooltip scaffold
 * @param {array} lineObjects - assigns the csv x(dates) and y(degrees) values to the keys
 * @param {HTMLElement} label - holds the tooltip texts
 * @param {HTMLElement} circle - holds the tooltip circles
 */
function chart(data) {

    var keys = data.columns.slice(1);

	var parseTime = d3.timeParse("%Y%m%d"),
		formatDate = d3.timeFormat("%Y-%m-%d"),
		bisectDate = d3.bisector(d => d.date).left,
		formatValue = d3.format(".1f");

	data.forEach(function(d) {
		d.date = parseTime(d.date);
		return d;
	})

	let svg = d3.select("#chart"),
		margin = {top: 15, right: 35, bottom: 15, left: 35},
		width= svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleTime()
		.rangeRound([margin.left, width - margin.right])
		.domain(d3.extent(data, d => d.date))

	var y = d3.scaleLinear()
		.rangeRound([height - margin.bottom, margin.top]);

	var z = d3.scaleOrdinal(d3.schemeCategory10);

	var line = d3.line()
		.curve(d3.curveCardinal)
		.x(d => x(d.date))
		.y(d => y(d.degrees));

    //draw x axis
	svg.append("g")
		.attr("class","x-axis")
		.attr("transform", "translate(0," + (height - margin.bottom) + ")")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")));

    //draw y axis
	svg.append("g")
		.attr("class", "y-axis")
		.attr("transform", "translate(" + margin.left + ",0)");

    //defining the focus to enable hover text & animation in line chart
	var focus = svg.append("g")
		.attr("class", "focus")
		.style("display", "none");

    //focus line to generate
	focus.append("line").attr("class", "lineHover")
		.style("stroke", "#999")
		.attr("stroke-width", 1)
		.style("shape-rendering", "crispEdges")
		.style("opalineObject", 0.5)
		.attr("y1", -height)
		.attr("y2",0);

    //defining the overlay
	var overlay = svg.append("rect")
		.attr("class", "overlay")
		.attr("x", margin.left)
		.attr("width", width - margin.right - margin.left)
		.attr("height", height)

	var lineObjects = keys.map(function(id) {
		return {
			id: id,
			values: data.map(d => {return {date: d.date, degrees: +d[id]}})
		};
	});

    //assigns the y values to the csv data
	y.domain([
		d3.min(lineObjects, d => d3.min(d.values, c => c.degrees)),
		d3.max(lineObjects, d => d3.max(d.values, c => c.degrees))
	]).nice();

    //draw y axis + horizontal guidelines
	svg.selectAll(".y-axis").transition()
		.duration(1,0)
		.call(d3.axisLeft(y))

	var lineObject = svg.selectAll(".lineObjects")
		.data(lineObjects);

	lineObject.exit().remove();

    //assign each line to it's lineObject
	lineObject.enter().insert("g", ".focus").append("path")
		.attr("class", d => "line lineObjects " + d.id)
		.style("stroke", d => z(d.id))
		.merge(lineObject)
	.transition().duration(1,0)
		.attr("d", d => line(d.values))

	var labels = focus.selectAll(".lineHoverText")
		.data(keys)

	labels.enter().append("text")
		.attr("class", "lineHoverText")
		.style("fill", d => z(d))
		.attr("text-anchor", "start")
		.attr("font-size",12)
		.attr("dy", (_, i) => 1 + i * 2 + "em")
		.merge(labels);

	var circles = focus.selectAll(".hoverCircle")
		.data(keys)

	circles.enter().append("circle")
		.attr("class", "hoverCircle")
		.style("fill", d => z(d))
		.attr("r", 2.5)
		.merge(circles);

    //draws the overlay
	svg.selectAll(".overlay")
		.on("mouseover", function() { focus.style("display", null); })
		.on("mouseout", function() { focus.style("display", "none"); })
		.on("mousemove", mousemove);

    /**
     * Draws the tooltip depending on the mouse position
     */
	function mousemove() {

		var x0 = x.invert(d3.mouse(this)[0]),
			i = bisectDate(data, x0, 1),
			d0 = data[i - 1],
			d1 = data[i],
			d = x0 - d0.date > d1.date - x0 ? d1 : d0;

		focus.select(".lineHover")
			.attr("transform", "translate(" + x(d.date) + "," + height + ")");

		focus.select(".lineHoverDate")
			.attr("transform",
				"translate(" + x(d.date) + "," + (height + margin.bottom) + ")")
			.text(formatDate(d.date));

		focus.selectAll(".hoverCircle")
			.attr("cy", e => y(d[e]))
			.attr("cx", x(d.date));

		focus.selectAll(".lineHoverText")
			.attr("transform",
				"translate(" + (x(d.date)) + "," + height / 2.5 + ")")
			.text(e => e + " " + formatValue(d[e]) + "%");

		x(d.date) > (width - width / 4)
			? focus.selectAll("text.lineHoverText")
				.attr("text-anchor", "end")
				.attr("dx", -10)
			: focus.selectAll("text.lineHoverText")
				.attr("text-anchor", "start")
				.attr("dx", 10)

        //reorders Gantt bars depending on the mouse position
		reorderGanttBars(d.date);
    }
}

function ganttChart(massnahmen){
	massnahmen.forEach((value, key, map) =>{
		console.log(value.startDate);

		drawBar(key, value);
	})



}

function drawBar(key, value){
	const canvas = document.querySelector('#canvas');

	if (!canvas.getContext) {
		return;
	}
	const ctx = canvas.getContext('2d');

	// set line stroke and line width
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 16;
	ctx.font = "8px Arial";
	ctx.fillStyle = "white";


	// draw a red line
	ctx.beginPath();

	let startdate = new Date(value.startDate);
	let enddate = new Date(value.enddate);
	ctx.moveTo(positionFromDate(startdate), key*20);
	ctx.lineTo(positionFromDate(enddate), key*20);
	ctx.stroke();
	ctx.fillText(value.massnahme, 0, key*20);

}

function positionFromDate(date){
	let position = 0;
	position = (1177/365) * (date.getDate() + ((date.getMonth())*30));
	console.log("getday " + date.getDate()+"getMonth:"+ date.getMonth() + "position " + position);
	return position;
}

function fillGanttChart(massnahmen){
	const data = new google.visualization.DataTable();
	data.addColumn('string', 'Task ID');
	data.addColumn('string', 'Task Name');
	data.addColumn('string', 'Resource');
	data.addColumn('date', 'Start Date');
	data.addColumn('date', 'End Date');
	data.addColumn('number', 'Duration');
	data.addColumn('number', 'Percent Complete');
	data.addColumn('string', 'Dependencies');
	// data.addColumn({type: 'string', role: 'tooltip'});


	data.addRows(massnahmen);
	return data;
}

function drawChart() {


    var options = {
        height: 275,
        width:1177,
		backgroundColor: {fill: '#121212'},
		labelStyle: {
			fontName: "Roboto",
			fontSize: 14,
			color: '#757575'
		},
        gantt: {
            criticalPathEnabled: false,
            sortTasks: false,
			trackHeight: 19,
			barHeight: 17,
			percentEnabled: false,
			labelMaxWidth: 1,
			defaultStartDate: (new Date(2020, 0, 0))
			// backgroundColor: "black",
            /*innerGridHorizLine: {
                stroke: '#ffe0b2',
                strokeWidth: 2
            }, */
            //innerGridTrack: {fill: '#fff3e0'},
            //innerGridDarkTrack: {fill: '#ffcc80'},
            // backgroundColor: {fill: 'black'}

        },
		tooltip: {isHtml: true}
    };

    let chart = new google.visualization.Gantt(document.getElementById('chart_div'));

    console.log("draw chart")
    chart.draw(fillGanttChart(massnahmen), options);
}


new jBox('Tooltip', {
	attach: '.tooltip',
	getTitle: 'data-jbox-title',
	getContent: 'data-jbox-content'
});

// function to calculate the position in px with given position number
function position(posNumber){
	let position = "";
	position = (posNumber-1)*18 +"px";
	// console.log("position " + position);
	return position;

}

// function to reorder gantt bars according to which month in the line chart is highlighted
// TODO: refactor gantt chart to include start and end month & implement method to reposition and assign color depending on month
function reorderGanttBars(month){
	if (month.toString().includes("Mar") ){
		console.log("reorder");
		if(
massnahmen === [
	['maßnahme 2', 'Reiseeinschränkung', 'Die Grenzen zu Frankreich, Österreich, Luxemburg, Dänemark und der Schweiz gibt es Kontrollen und Einreiseverbote. In den meisten Bundesländern sind Schulen und Kitas geschlossen',
		new Date(2020, 2, 16), new Date(2020, 5, 16), null, 100, null],
	['maßnahme 1', 'Stop von Konzerten und Sportveranstaltungen', 'Immer mehr Theater und Konzerthäuser stellen den Spielbetrieb ein. Die Fußball-Bundesliga pausiert',
		new Date(2020, 2, 12), new Date(2020, 5, 16), null, 100, null],
	['maßnahme 3', '1. Lockdown', 'Verbot von Ansammlungen von mehr als zwei Menschen. Ausgenommen sind Angehörige, die im eigenen Haushalt leben. Cafés, Kneipen, Restaurants, aber auch Friseure zum Beispiel schließen',
		new Date(2020, 2, 22), new Date(2020, 5, 11), null, 100, null],
	['maßnahme 4', 'Schule schließt', 'Schule schließt',
		new Date(2020, 2, 22), new Date(2020, 4, 15), null, 100, null],
	['maßnahme 5', 'Maskenpflicht für alle Bundesländer', 'Maskenpflicht für alle Bundesländer',
		new Date(2020, 3, 22), new Date(2020, 12, 31), null, 100, null],
	['maßnahme 6', 'Reiseeinschränkung', 'Einreisende aus internationalen Risikogebieten müssen sich bei der Rückkehr nach Deutschland testen lassen',
		new Date(2020, 7, 8), new Date(2020, 12, 31), null, 100, null],
	['maßnahme 7', 'Beherbergungsverbot', 'Die Bundesländer beschließen ein Beherbergungsverbot für Urlauber aus inländischen Risikogebieten. Die Zahl der Neuinfektionen ist auf mehr als 4000 binnen eines Tages gestiegen',
		new Date(2020, 9, 7), new Date(2020, 12, 31), null, 100, null],
	['maßnahme 8', 'Beherbergungsverbot', 'Beherbergungsverbot bei Inzididenz > 50',
		new Date(2020, 9, 14), new Date(2020, 12, 31), null, 100, null],
	['maßnahme 9', 'Lockdown light', 'Lockdown light, Gastronomie schließt',
		new Date(2020, 10, 2), new Date(2020, 12, 31), null, 100, null],
	['2020', '2020', '2020',
		new Date(2020, 0, 0), new Date(2020, 12, 31), null, 100, null],

]){return}else {
			massnahmen = [
				['maßnahme 2', 'Reiseeinschränkung', 'Die Grenzen zu Frankreich, Österreich, Luxemburg, Dänemark und der Schweiz gibt es Kontrollen und Einreiseverbote. In den meisten Bundesländern sind Schulen und Kitas geschlossen',
					new Date(2020, 2, 16), new Date(2020, 5, 16), null, 100, null],
				['maßnahme 1', 'Stop von Konzerten und Sportveranstaltungen', 'Immer mehr Theater und Konzerthäuser stellen den Spielbetrieb ein. Die Fußball-Bundesliga pausiert',
					new Date(2020, 2, 12), new Date(2020, 5, 16), null, 100, null],
				['maßnahme 3', '1. Lockdown', 'Verbot von Ansammlungen von mehr als zwei Menschen. Ausgenommen sind Angehörige, die im eigenen Haushalt leben. Cafés, Kneipen, Restaurants, aber auch Friseure zum Beispiel schließen',
					new Date(2020, 2, 22), new Date(2020, 5, 11), null, 100, null],
				['maßnahme 4', 'Schule schließt', 'Schule schließt',
					new Date(2020, 2, 22), new Date(2020, 4, 15), null, 100, null],
				['maßnahme 5', 'Maskenpflicht für alle Bundesländer', 'Maskenpflicht für alle Bundesländer',
					new Date(2020, 3, 22), new Date(2020, 12, 31), null, 100, null],
				['maßnahme 6', 'Reiseeinschränkung', 'Einreisende aus internationalen Risikogebieten müssen sich bei der Rückkehr nach Deutschland testen lassen',
					new Date(2020, 7, 8), new Date(2020, 12, 31), null, 100, null],
				['maßnahme 7', 'Beherbergungsverbot', 'Die Bundesländer beschließen ein Beherbergungsverbot für Urlauber aus inländischen Risikogebieten. Die Zahl der Neuinfektionen ist auf mehr als 4000 binnen eines Tages gestiegen',
					new Date(2020, 9, 7), new Date(2020, 12, 31), null, 100, null],
				['maßnahme 8', 'Beherbergungsverbot', 'Beherbergungsverbot bei Inzididenz > 50',
					new Date(2020, 9, 14), new Date(2020, 12, 31), null, 100, null],
				['maßnahme 9', 'Lockdown light', 'Lockdown light, Gastronomie schließt',
					new Date(2020, 10, 2), new Date(2020, 12, 31), null, 100, null],
				['2020', '2020', '2020',
					new Date(2020, 0, 0), new Date(2020, 12, 31), null, 100, null],

			]
		drawChart();
		}}  else if (month.toString().includes("Apr")){

	}else if (month.toString().includes("May")){
	}else if (month.toString().includes("Jun")){

	}else if (month.toString().includes("Jul")){

	}else if (month.toString().includes("Aug")){

	}else if (month.toString().includes("Sep")){

	}else if (month.toString().includes("Oct")){

	}else if (month.toString().includes("Nov")){

	}else if (month.toString().includes("Dec")){

	}else{

	}
}

$(document).ready(function() {
$('#demo-tooltip-above').jBox('Tooltip', {
	theme: 'TooltipDark'
});

	$('#demo-tooltip-mouse').jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: 12.03.2020 - 16.05.2020 <br> Massnahmen: Immer mehr Theater und Konzerthäuser stellen den Spielbetrieb ein. Die Fußball-Bundesliga pausiert! </b>'
	});

	$('#demo-tooltip-mouse1').jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: 16.03.2020 - 16.05.2020 <br> Massnahmen: Die Grenzen zu Frankreich, Österreich, Luxemburg, Dänemark und der Schweiz gibt es Kontrollen und Einreiseverbote. In den meisten Bundesländern sind Schulen und Kitas geschlossen! </b>'
	});
	$('#demo-tooltip-mouse2').jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: 22.03.2020 - 11.05.2020 <br> Massnahmen: Verbot von Ansammlungen von mehr als zwei Menschen. Ausgenommen sind Angehörige, die im eigenen Haushalt leben. Cafés, Kneipen, Restaurants, aber auch Friseure zum Beispiel schließen! </b>'
	});
	$('#demo-tooltip-mouse3').jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: 22.03.2020 - 15.04.2020 <br> Massnahmen: Schulen müssen geschlossen werden! </b>'
	});
	$('#demo-tooltip-mouse4').jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: 22.04.2020 - 31.12.2020 <br> Massnahmen: Maskenpflicht für alle Bundesländer! </b>'
	});
	$('#demo-tooltip-mouse5').jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: 08.08.2020 - 31.12.2020 <br> Massnahmen: Einreisende aus internationalen Risikogebieten müssen sich bei der Rückkehr nach Deutschland testen lassen! </b>'
	});
	$('#demo-tooltip-mouse6').jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: 10.07.2020 - 31.12.2020 <br> Massnahmen: Die Bundesländer beschließen ein Beherbergungsverbot für Urlauber aus inländischen Risikogebieten. Die Zahl der Neuinfektionen ist auf mehr als 4000 binnen eines Tages gestiegen! </b>'
	});
	$('#demo-tooltip-mouse7').jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: 14.10.2020 - 31.12.2020 <br> Massnahmen: Beherbergungsverbot bei Inzididenz > 50! </b>'
	});
	$('#demo-tooltip-mouse8').jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: 02.11.2020 - 31.12.2020 <br> Massnahmen: Lockdown light, Gastronomie schließt! </b>'
	});
});
