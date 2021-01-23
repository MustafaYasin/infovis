//JL: set variables for window height and width
var h = $(window).innerHeight();
var w = $(window).innerWidth();

let massnahmen = [
	{startDate : "01/01/2020", enddate: "11/31/2020", massnahme:"Massnahme 1"},
	{startDate : "03/03/2020", enddate: "11/04/2020", massnahme:"Massnahme 2"},
	{startDate : "11/01/2020", enddate: "11/11/2020", massnahme:"Massnahme 3"}
];


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


    ganttChart(massnahmen);

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

	let divLine = document.createElement("div");
	divLine.className = "ganttLine Line"+(key+1);
	divLine.id = "demo-tooltip-mouse" +key;
	divLine.style.top = (18*key)+"px";

	let titleSpan = document.createElement("span");
	titleSpan.className = "ganttTitle gTitle"+(key+1)+" unselectable"
	titleSpan.innerHTML = "" + value.massnahme;

	let div = document.createElement("div");
	let startdate = new Date(value.startDate);
	let enddate = new Date(value.enddate);
	let startofyear = new Date(2020,0,0);

	div.className = "barElement bar"+(key+1);
	div.id = "bar"+(key+1);
	div.style.width = ""+widthFromDate(startdate, enddate)+"px";
	div.style.left = ""+widthFromDate(startofyear,startdate)+"px";
	titleSpan.style.left = widthFromDate(startofyear,startdate) - 80 +"px"


	document.getElementById("ganttContainer").appendChild(divLine);
	document.getElementById("demo-tooltip-mouse"+key).appendChild(titleSpan);
	document.getElementById("demo-tooltip-mouse"+key).appendChild(div);


	$('#demo-tooltip-above').jBox('Tooltip', {
		theme: 'TooltipDark'
	});

	$('#demo-tooltip-mouse'+(key)).jBox('Mouse', {
		theme: 'TooltipDark',
		content: '<b> Zeitraum: ' + value.startDate + '-' +  value.enddate + '<br> Massnahmen: ' + value.massnahme +'! </b>'
	});
}

function widthFromDate(startdate, enddate){
	// time difference
	let timeDiff = Math.abs(enddate.getTime() - startdate.getTime());

	// days difference
	let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	let width = diffDays * (1177/365);
	// position = (1177/365) * (date.getDate() + ((date.getMonth())*30));
	// console.log("getday " + date.getDate()+"getMonth:"+ date.getMonth() + "position " + position);
	console.log("startdate " + startdate + "enddate "  + enddate + "tage " + diffDays +" " +  timeDiff);
	return width
}
function positionFromDate(startdate){
	let position = 0;
	position = ((1177/365) * (startdate.getTime() / (1000 * 3600 * 24)));
	console.log("posfromdate " + (startdate.getTime() / (1000 * 3600 * 24)));
	return position
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
function swapPosition(pos1,pos2){
	console.log("in swap position" + pos1 + pos2)
	document.getElementById("demo-tooltip-mouse"+(pos1-1)).style.top = position(pos2);
	document.getElementById("demo-tooltip-mouse"+(pos2-1)).style.top = position(pos1);
	// changeColorofBar(pos2, true);

}

function changeColorofBar(bar, active) {
	console.log("in bAR " + bar);

	if (active) {
		document.getElementById("bar" + bar).style.backgroundColor = "#70F0DE";
	} else{
		console.log("not active");
		document.getElementById("bar" + bar).style.backgroundColor = "#7E7E7E";
	}
}
// function to reorder gantt bars according to which month in the line chart is highlighted
// TODO: refactor gantt chart to include start and end month & implement method to reposition and assign color depending on month
function reorderGanttBars(month) {
	console.log("month " + (month));
	if (month.toString().includes("Jan")) {
		orderMassnahmeToMonth(1);}
	if (month.toString().includes("Feb")) {
		orderMassnahmeToMonth(2);}
	if (month.toString().includes("Mar")) {
		orderMassnahmeToMonth(3);}
	if (month.toString().includes("Apr")) {
		orderMassnahmeToMonth(4);}
	if (month.toString().includes("Mar")) {
		orderMassnahmeToMonth(5);}
	if (month.toString().includes("Jun")) {
		orderMassnahmeToMonth(6);}
	if (month.toString().includes("Jul")) {
		orderMassnahmeToMonth(7);}
	if (month.toString().includes("Aug")) {
		orderMassnahmeToMonth(8);}
	if (month.toString().includes("Sep")) {
		orderMassnahmeToMonth(9);}
	if (month.toString().includes("Okt")) {
		orderMassnahmeToMonth(10);}
	if (month.toString().includes("Nov")) {
		orderMassnahmeToMonth(11);}
	if (month.toString().includes("Dec")) {
		orderMassnahmeToMonth(12);}
	else{
		orderMassnahmeToMonth(0);}
}

function orderMassnahmeToMonth(month){
	// console.log("in massnahme to month" + month)
	let key2 = 1;
	massnahmen.forEach((value, key) => {
		console.log("massnahmen for each " + key);
	let startMonth = new Date(value.startDate).getMonth();
	let endMonth = new Date(value.enddate).getMonth();
		console.log("in massnahme to month" + month + "start " + startMonth + "end " + endMonth);
	if (startMonth+1 <= month && endMonth+1 >= month ){
		console.log("im if order " + key + key2)
		if(key+1!=key2){
			swapPosition(key2,(key+1));
		}
		changeColorofBar(key+1, true);
		key2++;

	}
	else if(startMonth+1 > month && endMonth+1 < month){
		changeColorofBar(key+1, false);
		swapPosition(key+1,key+1);

	}
	else if(endMonth+1 < month){
		// changeColorofBar(key+1, false);
		// swapPosition(key+1,key+1);

	}

	})
}



