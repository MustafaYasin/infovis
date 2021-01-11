//JL: set variables for window height and width
var h = $(window).innerHeight();
var w = $(window).innerWidth();


/*JL: scrollmagic:
 - makes headline disappear on scroll
 - makes content appear on scroll
 */

$(document).ready(function()  { // wait for document ready
    // init ScrollMagic
    var controller = new ScrollMagic.Controller();

    // header1Container disapears
    var h1Disappears = TweenLite.to("#h1Container", 1, {
        opacity: 0
    });
    // build scene for header1Container disappers
    var scene = new ScrollMagic.Scene({ duration: h, triggerHook: 0, reverse:true})
        .setTween(h1Disappears)
        //.addIndicators() // add indicators (requires plugin)
        .addTo(controller);
});


//JL:Multiline Chart
d3.csv("https://gist.githubusercontent.com/BilelAyech/aa74eaba3d8f09b49e4c0bac08572858/raw/744830f7016c9fc8e18a265b3169909764f5364a/data2.csv").then(d => chart(d))

function chart(data) {

	var keys = data.columns.slice(1);

	var parseTime = d3.timeParse("%Y%m%d"),
		formatDate = d3.timeFormat("%Y-%m-%d"),
		bisectDate = d3.bisector(d => d.date).left,
		formatValue = d3.format(",.0f");

	data.forEach(function(d) {
		d.date = parseTime(d.date);
		return d;
	})

	var svg = d3.select("#chart"),
		margin = {top: 15, right: 35, bottom: 15, left: 35},
		width = +svg.attr("width") - margin.left - margin.right,
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

	svg.append("g")
		.attr("class","x-axis")
		.attr("transform", "translate(0," + (height - margin.bottom) + ")")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")));

	svg.append("g")
		.attr("class", "y-axis")
		.attr("transform", "translate(" + margin.left + ",0)");

	var focus = svg.append("g")
		.attr("class", "focus")
		.style("display", "none");

	focus.append("line").attr("class", "lineHover")
		.style("stroke", "#999")
		.attr("stroke-width", 1)
		.style("shape-rendering", "crispEdges")
		.style("opacity", 0.5)
		.attr("y1", -height)
		.attr("y2",0);

	focus.append("text").attr("class", "lineHoverDate")
		.attr("text-anchor", "middle")
		.attr("font-size", 12);

	var overlay = svg.append("rect")
		.attr("class", "overlay")
		.attr("x", margin.left)
		.attr("width", width - margin.right - margin.left)
		.attr("height", height)

	// set width of gantt chart to be equal to line chart
	// document.getElementById('chart').style.width = document.getElementById('timeline').width;

	update(1, 0);

	function update(speed) {

		var copy = keys.filter(f => f.includes(1))

		var cities = copy.map(function(id) {
			return {
				id: id,
				values: data.map(d => {return {date: d.date, degrees: +d[id]}})
			};
		});

		y.domain([
			d3.min(cities, d => d3.min(d.values, c => c.degrees)),
			d3.max(cities, d => d3.max(d.values, c => c.degrees))
		]).nice();

		svg.selectAll(".y-axis").transition()
			.duration(speed)
			.call(d3.axisLeft(y).tickSize(-width + margin.right + margin.left))

		var city = svg.selectAll(".cities")
			.data(cities);

		city.exit().remove();

		city.enter().insert("g", ".focus").append("path")
			.attr("class", "line cities")
			.style("stroke", d => z(d.id))
			.merge(city)
		.transition().duration(speed)
			.attr("d", d => line(d.values))

		tooltip(copy);
	}

	function tooltip(copy) {

		var labels = focus.selectAll(".lineHoverText")
			.data(copy)

		labels.enter().append("text")
			.attr("class", "lineHoverText")
			.style("fill", d => z(d))
			.attr("text-anchor", "start")
			.attr("font-size",12)
			.attr("dy", (_, i) => 1 + i * 2 + "em")
			.merge(labels);

		var circles = focus.selectAll(".hoverCircle")
			.data(copy)

		circles.enter().append("circle")
			.attr("class", "hoverCircle")
			.style("fill", d => z(d))
			.attr("r", 2.5)
			.merge(circles);

		svg.selectAll(".overlay")
			.on("mouseover", function() { focus.style("display", null); })
			.on("mouseout", function() { focus.style("display", "none"); })
			.on("mousemove", mousemove);

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
				.text(e => e + " " + "º" + formatValue(d[e]));

			x(d.date) > (width - width / 4)
				? focus.selectAll("text.lineHoverText")
					.attr("text-anchor", "end")
					.attr("dx", -10)
				: focus.selectAll("text.lineHoverText")
					.attr("text-anchor", "start")
					.attr("dx", 10)

			reorderGanttBars(d.date);
		}
	}

}

new jBox('Tooltip', {
	attach: '.tooltip',
	getTitle: 'data-jbox-title',
	getContent: 'data-jbox-content'
});

function reorderGanttBars(month){
	var pos1="0px";
	var pos2="18px";
	var pos3="36px";
	var pos4="54px";
	var pos5="72px";
	var pos6="90px";
	var pos7="108px";
	var pos8="126px";
	var pos9="144px";
	console.log("in reorder methode" + month);
	if (month.toString().includes("Mar") ){
		document.getElementById("bar1").style.backgroundColor = "#70F0DE";
		document.getElementById("bar2").style.backgroundColor = "#70F0DE";
		document.getElementById("bar3").style.backgroundColor = "#70F0DE";
		document.getElementById("bar4").style.backgroundColor = "#70F0DE";
		document.getElementById("bar5").style.backgroundColor = "#FFFF";
		document.getElementById("bar6").style.backgroundColor = "#FFFF";
		document.getElementById("bar7").style.backgroundColor = "#FFFF";
		document.getElementById("bar8").style.backgroundColor = "#FFFF";
		document.getElementById("bar9").style.backgroundColor = "#FFFF";
		document.getElementById("demo-tooltip-mouse").style.top = pos1;
		document.getElementById("demo-tooltip-mouse1").style.top = pos2;
		document.getElementById("demo-tooltip-mouse2").style.top = pos3;
		document.getElementById("demo-tooltip-mouse3").style.top = pos4;
		document.getElementById("demo-tooltip-mouse4").style.top = pos5;
		document.getElementById("demo-tooltip-mouse5").style.top = pos6;
		document.getElementById("demo-tooltip-mouse6").style.top = pos7;
		document.getElementById("demo-tooltip-mouse7").style.top = pos8;
		document.getElementById("demo-tooltip-mouse8").style.top = pos9;
	}  else if (month.toString().includes("Apr")){
		document.getElementById("bar1").style.backgroundColor = "#70F0DE";
		document.getElementById("bar2").style.backgroundColor = "#70F0DE";
		document.getElementById("bar3").style.backgroundColor = "#70F0DE";
		document.getElementById("bar4").style.backgroundColor = "#70F0DE";
		document.getElementById("bar5").style.backgroundColor = "#70F0DE";
		document.getElementById("bar6").style.backgroundColor = "#FFFF";
		document.getElementById("bar7").style.backgroundColor = "#FFFF";
		document.getElementById("bar8").style.backgroundColor = "#FFFF";
		document.getElementById("bar9").style.backgroundColor = "#FFFF";
		document.getElementById("demo-tooltip-mouse").style.top = pos1;
		document.getElementById("demo-tooltip-mouse1").style.top = pos2;
		document.getElementById("demo-tooltip-mouse2").style.top = pos3;
		document.getElementById("demo-tooltip-mouse3").style.top = pos4;
		document.getElementById("demo-tooltip-mouse4").style.top = pos5;
		document.getElementById("demo-tooltip-mouse5").style.top = pos6;
		document.getElementById("demo-tooltip-mouse6").style.top = pos7;
		document.getElementById("demo-tooltip-mouse7").style.top = pos8;
		document.getElementById("demo-tooltip-mouse8").style.top = pos9;
	}else if (month.toString().includes("May")){
		document.getElementById("bar1").style.backgroundColor = "#70F0DE";
		document.getElementById("bar2").style.backgroundColor = "#70F0DE";
		document.getElementById("bar3").style.backgroundColor = "#70F0DE";
		document.getElementById("bar4").style.backgroundColor = "#FFFF";
		document.getElementById("bar5").style.backgroundColor = "#70F0DE";
		document.getElementById("bar6").style.backgroundColor = "#FFFF";
		document.getElementById("bar7").style.backgroundColor = "#FFFF";
		document.getElementById("bar8").style.backgroundColor = "#FFFF";
		document.getElementById("bar9").style.backgroundColor = "#FFFF";
		document.getElementById("demo-tooltip-mouse").style.top = pos1;
		document.getElementById("demo-tooltip-mouse1").style.top = pos2;
		document.getElementById("demo-tooltip-mouse2").style.top = pos3;
		document.getElementById("demo-tooltip-mouse3").style.top = pos5;
		document.getElementById("demo-tooltip-mouse4").style.top = pos4;
		document.getElementById("demo-tooltip-mouse5").style.top = pos6;
		document.getElementById("demo-tooltip-mouse6").style.top = pos7;
		document.getElementById("demo-tooltip-mouse7").style.top = pos8;
		document.getElementById("demo-tooltip-mouse8").style.top = pos9;
	}else if (month.toString().includes("Jun")){
		document.getElementById("bar1").style.backgroundColor = "#FFFF";
		document.getElementById("bar2").style.backgroundColor = "#FFFF";
		document.getElementById("bar3").style.backgroundColor = "#FFFF";
		document.getElementById("bar4").style.backgroundColor = "#FFFF";
		document.getElementById("bar5").style.backgroundColor = "#70F0DE";
		document.getElementById("bar6").style.backgroundColor = "#FFFF";
		document.getElementById("bar7").style.backgroundColor = "#FFFF";
		document.getElementById("bar8").style.backgroundColor = "#FFFF";
		document.getElementById("bar9").style.backgroundColor = "#FFFF";
		document.getElementById("demo-tooltip-mouse").style.top = pos2;
		document.getElementById("demo-tooltip-mouse1").style.top = pos3;
		document.getElementById("demo-tooltip-mouse2").style.top = pos4;
		document.getElementById("demo-tooltip-mouse3").style.top = pos5;
		document.getElementById("demo-tooltip-mouse4").style.top = pos1;
		document.getElementById("demo-tooltip-mouse5").style.top = pos6;
		document.getElementById("demo-tooltip-mouse6").style.top = pos7;
		document.getElementById("demo-tooltip-mouse7").style.top = pos8;
		document.getElementById("demo-tooltip-mouse8").style.top = pos9;
	}else if (month.toString().includes("Jul")){
		document.getElementById("bar1").style.backgroundColor = "#FFFF";
		document.getElementById("bar2").style.backgroundColor = "#FFFF";
		document.getElementById("bar3").style.backgroundColor = "#FFFF";
		document.getElementById("bar4").style.backgroundColor = "#FFFF";
		document.getElementById("bar5").style.backgroundColor = "#70F0DE";
		document.getElementById("bar6").style.backgroundColor = "#FFFF";
		document.getElementById("bar7").style.backgroundColor = "#FFFF";
		document.getElementById("bar8").style.backgroundColor = "#FFFF";
		document.getElementById("bar9").style.backgroundColor = "#FFFF";
		document.getElementById("demo-tooltip-mouse").style.top = pos2;
		document.getElementById("demo-tooltip-mouse1").style.top = pos3;
		document.getElementById("demo-tooltip-mouse2").style.top = pos4;
		document.getElementById("demo-tooltip-mouse3").style.top = pos5;
		document.getElementById("demo-tooltip-mouse4").style.top = pos1;
		document.getElementById("demo-tooltip-mouse5").style.top = pos6;
		document.getElementById("demo-tooltip-mouse6").style.top = pos7;
		document.getElementById("demo-tooltip-mouse7").style.top = pos8;
		document.getElementById("demo-tooltip-mouse8").style.top = pos9;
	}else if (month.toString().includes("Aug")){
		document.getElementById("bar1").style.backgroundColor = "#FFFF";
		document.getElementById("bar2").style.backgroundColor = "#FFFF";
		document.getElementById("bar3").style.backgroundColor = "#FFFF";
		document.getElementById("bar4").style.backgroundColor = "#FFFF";
		document.getElementById("bar5").style.backgroundColor = "#70F0DE";
		document.getElementById("bar6").style.backgroundColor = "#70F0DE";
		document.getElementById("bar7").style.backgroundColor = "#FFFF";
		document.getElementById("bar8").style.backgroundColor = "#FFFF";
		document.getElementById("bar9").style.backgroundColor = "#FFFF";
		document.getElementById("demo-tooltip-mouse").style.top = pos3;
		document.getElementById("demo-tooltip-mouse1").style.top = pos4;
		document.getElementById("demo-tooltip-mouse2").style.top = pos5;
		document.getElementById("demo-tooltip-mouse3").style.top = pos6;
		document.getElementById("demo-tooltip-mouse4").style.top = pos1;
		document.getElementById("demo-tooltip-mouse5").style.top = pos2;
		document.getElementById("demo-tooltip-mouse6").style.top = pos7;
		document.getElementById("demo-tooltip-mouse7").style.top = pos8;
		document.getElementById("demo-tooltip-mouse8").style.top = pos9;
	}else if (month.toString().includes("Sep")){
		document.getElementById("bar1").style.backgroundColor = "#FFFF";
		document.getElementById("bar2").style.backgroundColor = "#FFFF";
		document.getElementById("bar3").style.backgroundColor = "#FFFF";
		document.getElementById("bar4").style.backgroundColor = "#FFFF";
		document.getElementById("bar5").style.backgroundColor = "#70F0DE";
		document.getElementById("bar6").style.backgroundColor = "#70F0DE";
		document.getElementById("bar7").style.backgroundColor = "#FFFF";
		document.getElementById("bar8").style.backgroundColor = "#FFFF";
		document.getElementById("bar9").style.backgroundColor = "#FFFF";
		document.getElementById("demo-tooltip-mouse").style.top = pos3;
		document.getElementById("demo-tooltip-mouse1").style.top = pos4;
		document.getElementById("demo-tooltip-mouse2").style.top = pos5;
		document.getElementById("demo-tooltip-mouse3").style.top = pos6;
		document.getElementById("demo-tooltip-mouse4").style.top = pos1;
		document.getElementById("demo-tooltip-mouse5").style.top = pos2;
		document.getElementById("demo-tooltip-mouse6").style.top = pos7;
		document.getElementById("demo-tooltip-mouse7").style.top = pos8;
		document.getElementById("demo-tooltip-mouse8").style.top = pos9;
	}else if (month.toString().includes("Oct")){
		document.getElementById("bar1").style.backgroundColor = "#FFFF";
		document.getElementById("bar2").style.backgroundColor = "#FFFF";
		document.getElementById("bar3").style.backgroundColor = "#FFFF";
		document.getElementById("bar4").style.backgroundColor = "#FFFF";
		document.getElementById("bar5").style.backgroundColor = "#70F0DE";
		document.getElementById("bar6").style.backgroundColor = "#70F0DE";
		document.getElementById("bar7").style.backgroundColor = "#70F0DE";
		document.getElementById("bar8").style.backgroundColor = "#70F0DE";
		document.getElementById("bar9").style.backgroundColor = "#FFFF";
		document.getElementById("demo-tooltip-mouse").style.top = pos5;
		document.getElementById("demo-tooltip-mouse1").style.top = pos6;
		document.getElementById("demo-tooltip-mouse2").style.top = pos7;
		document.getElementById("demo-tooltip-mouse3").style.top = pos8;
		document.getElementById("demo-tooltip-mouse4").style.top = pos1;
		document.getElementById("demo-tooltip-mouse5").style.top = pos2;
		document.getElementById("demo-tooltip-mouse6").style.top = pos3;
		document.getElementById("demo-tooltip-mouse7").style.top = pos4;
		document.getElementById("demo-tooltip-mouse8").style.top = pos9;
	}else if (month.toString().includes("Nov")){
		document.getElementById("bar1").style.backgroundColor = "#FFFF";
		document.getElementById("bar2").style.backgroundColor = "#FFFF";
		document.getElementById("bar3").style.backgroundColor = "#FFFF";
		document.getElementById("bar4").style.backgroundColor = "#FFFF";
		document.getElementById("bar5").style.backgroundColor = "#70F0DE";
		document.getElementById("bar6").style.backgroundColor = "#70F0DE";
		document.getElementById("bar7").style.backgroundColor = "#70F0DE";
		document.getElementById("bar8").style.backgroundColor = "#70F0DE";
		document.getElementById("bar9").style.backgroundColor = "#70F0DE";
		document.getElementById("demo-tooltip-mouse").style.top = pos6;
		document.getElementById("demo-tooltip-mouse1").style.top = pos7;
		document.getElementById("demo-tooltip-mouse2").style.top = pos8;
		document.getElementById("demo-tooltip-mouse3").style.top = pos9;
		document.getElementById("demo-tooltip-mouse4").style.top = pos1;
		document.getElementById("demo-tooltip-mouse5").style.top = pos2;
		document.getElementById("demo-tooltip-mouse6").style.top = pos3;
		document.getElementById("demo-tooltip-mouse7").style.top = pos4;
		document.getElementById("demo-tooltip-mouse8").style.top = pos5;
	}else if (month.toString().includes("Dec")){
		document.getElementById("bar1").style.backgroundColor = "#FFFF";
		document.getElementById("bar2").style.backgroundColor = "#FFFF";
		document.getElementById("bar3").style.backgroundColor = "#FFFF";
		document.getElementById("bar4").style.backgroundColor = "#FFFF";
		document.getElementById("bar5").style.backgroundColor = "#70F0DE";
		document.getElementById("bar6").style.backgroundColor = "#70F0DE";
		document.getElementById("bar7").style.backgroundColor = "#70F0DE";
		document.getElementById("bar8").style.backgroundColor = "#70F0DE";
		document.getElementById("bar9").style.backgroundColor = "#70F0DE";
		document.getElementById("demo-tooltip-mouse").style.top = pos6;
		document.getElementById("demo-tooltip-mouse1").style.top = pos7;
		document.getElementById("demo-tooltip-mouse2").style.top = pos8;
		document.getElementById("demo-tooltip-mouse3").style.top = pos9;
		document.getElementById("demo-tooltip-mouse4").style.top = pos1;
		document.getElementById("demo-tooltip-mouse5").style.top = pos2;
		document.getElementById("demo-tooltip-mouse6").style.top = pos3;
		document.getElementById("demo-tooltip-mouse7").style.top = pos4;
		document.getElementById("demo-tooltip-mouse8").style.top = pos5;
	}else{
		document.getElementById("bar1").style.backgroundColor = "#FFFF";
		document.getElementById("bar2").style.backgroundColor = "#FFFF";
		document.getElementById("bar3").style.backgroundColor = "#FFFF";
		document.getElementById("bar4").style.backgroundColor = "#FFFF";
		document.getElementById("bar5").style.backgroundColor = "#FFFF";
		document.getElementById("bar6").style.backgroundColor = "#FFFF";
		document.getElementById("bar7").style.backgroundColor = "#FFFF";
		document.getElementById("bar8").style.backgroundColor = "#FFFF";
		document.getElementById("bar9").style.backgroundColor = "#FFFF";
		document.getElementById("demo-tooltip-mouse").style.top = pos1;
		document.getElementById("demo-tooltip-mouse1").style.top = pos2;
		document.getElementById("demo-tooltip-mouse2").style.top = pos3;
		document.getElementById("demo-tooltip-mouse3").style.top = pos4;
		document.getElementById("demo-tooltip-mouse4").style.top = pos5;
		document.getElementById("demo-tooltip-mouse5").style.top = pos6;
		document.getElementById("demo-tooltip-mouse6").style.top = pos7;
		document.getElementById("demo-tooltip-mouse7").style.top = pos8;
		document.getElementById("demo-tooltip-mouse8").style.top = pos9;
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