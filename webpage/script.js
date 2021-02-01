//JL: set variables for window height and width
var h = $(window).innerHeight();
var w = $(window).innerWidth();

/**
 * Runs code "on document ready"
 */

$(document).ready(function ($) {
    /**
     * scrollmagic:
     * - makes headline disappear on scroll
     * - makes content appear on scroll
     */

    // init ScrollMagic
    var controller = new ScrollMagic.Controller();

    // header1Container disapears
    var h1Disappears = TweenLite.to("#h1Container", 1, {
    opalineObject: 0,
    });

    // build scene for header1Container disappers
    var scene = new ScrollMagic.Scene({
    duration: h,
    triggerHook: 0,
    reverse: true,
    })
    .setTween(h1Disappears)
    .addTo(controller);

    // checkbox events
    $("#BeherbergungUmsatz").on("change", (event) => {
        if (!event.target.checked) {
            $(".line.lineObjects.Beherbergung.Umsatz").css({ display: "none" });
            $(".lineHoverText.Beherbergung.Umsatz").css({ display: "none" });
            $(".hoverCircle.Beherbergung.Umsatz").css({ display: "none" });
        } else {
            $(".line.lineObjects.Beherbergung.Umsatz").css({ display: "block" });
            $(".lineHoverText.Beherbergung.Umsatz").css({ display: "block" });
            $(".hoverCircle.Beherbergung.Umsatz").css({ display: "block" });
        }
    });
    $("#Beherbergungbeschäftigte").on("change", (event) => {
        if (!event.target.checked) {
            $(".line.lineObjects.Beherbergung.Beschäftigte").css({ display: "none" });
            $(".lineHoverText.Beherbergung.Beschäftigte").css({ display: "none" });
            $(".hoverCircle.Beherbergung.Beschäftigte").css({ display: "none" });
        } else {
            $(".line.lineObjects.Beherbergung.Beschäftigte").css({display: "block",});
            $(".lineHoverText.Beherbergung.Beschäftigte").css({ display: "block" });
            $(".hoverCircle.Beherbergung.Beschäftigte").css({ display: "block" });
        }
    });
    $("#GastronomieUmsatz").on("change", (event) => {
        if (!event.target.checked) {
            $(".line.lineObjects.Gastronomie.Umsatz").css({ display: "none" });
            $(".lineHoverText.Gastronomie.Umsatz").css({ display: "none" });
            $(".hoverCircle.Gastronomie.Umsatz").css({ display: "none" });
        } else {
            $(".line.lineObjects.Gastronomie.Umsatz").css({ display: "block" });
            $(".lineHoverText.Gastronomie.Umsatz").css({ display: "block" });
            $(".hoverCircle.Gastronomie.Umsatz").css({ display: "block" });
        }
    });
    $("#Gastronomiebeschäftigte").on("change", (event) => {
        if (!event.target.checked) {
            $(".line.lineObjects.Gastronomie.Beschäftigte").css({ display: "none" });
            $(".lineHoverText.Gastronomie.Beschäftigte").css({ display: "none" });
            $(".hoverCircle.Gastronomie.Beschäftigte").css({ display: "none" });
        } else {
            $(".line.lineObjects.Gastronomie.Beschäftigte").css({ display: "block" });
            $(".lineHoverText.Gastronomie.Beschäftigte").css({ display: "block" });
            $(".hoverCircle.Gastronomie.Beschäftigte").css({ display: "block" });
        }
    });

    //get's the csv data and runs the main function with it
    d3.csv("https://gist.githubusercontent.com/BilelAyech/aa74eaba3d8f09b49e4c0bac08572858/raw/40b14df4979e7a131bfe16092f005e25c79c317e/data2.csv")
    .then((d) => {
        main(d);
    });

});

/**
* Runs all functions related to the D3 Line Chart
*/
function main(data) {
    chart(data);
    adjustLineChartColors();
    ganttChart(data2);
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
    bisectDate = d3.bisector((d) => d.date).left,
    formatValue = d3.format(".1f");

    data.forEach(function (d) {
        d.date = parseTime(d.date);
        return d;
    });

    let svg = d3.select("#chart"),
    margin = { top: 15, right: 35, bottom: 15, left: 35 },
    width = svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3
        .scaleTime()
        .rangeRound([margin.left, width - margin.right])
        .domain(d3.extent(data, (d) => d.date));

    var y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

    var z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3
        .line()
        .curve(d3.curveCardinal)
        .x((d) => x(d.date))
        .y((d) => y(d.degrees));

    //draw x axis
    svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")));

    //draw y axis
    svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + ",0)");

    //defining the focus to enable hover text & animation in line chart
    var focus = svg.append("g").attr("class", "focus").style("display", "none");

    //focus line to generate
    focus
        .append("line")
        .attr("class", "lineHover")
        .style("stroke", "#70F0DE")
        .attr("stroke-width", 2)
        .style("shape-rendering", "crispEdges")
        .style("opalineObject", 0.5)
        .attr("y1", -height)
        .attr("y2", 0);

    //defining the overlay
    var overlay = svg
        .append("rect")
        .attr("class", "overlay")
        .attr("x", margin.left)
        .attr("width", width - margin.right - margin.left)
        .attr("height", height);

    var lineObjects = keys.map(function (id) {
        return {
            id: id,
            values: data.map((d) => {
            return { date: d.date, degrees: +d[id] };
            }),
        };
    });

    //assigns the y values to the csv data
    y.domain([
        d3.min(lineObjects, (d) => d3.min(d.values, (c) => c.degrees)),
        d3.max(lineObjects, (d) => d3.max(d.values, (c) => c.degrees)),
    ]).nice();

    //draw y axis + horizontal guidelines
    svg.selectAll(".y-axis").transition().duration(1, 0).call(d3.axisLeft(y));

    var lineObject = svg.selectAll(".lineObjects").data(lineObjects);

    lineObject.exit().remove();

    //assign each line to it's lineObject
    lineObject
        .enter()
        .insert("g", ".focus")
        .append("path")
        .attr("class", (d) => "line lineObjects " + d.id)
        .style("stroke", (d) => z(d.id))
        .merge(lineObject)
        .transition()
        .duration(1, 0)
        .attr("d", (d) => line(d.values));

    var labels = focus.selectAll(".lineHoverText").data(keys);

    labels
        .enter()
        .append("text")
        .attr("class", (d) => "lineHoverText " + d)
        .style("fill", (d) => z(d))
        .attr("text-anchor", "start")
        .attr("font-size", 12)
        .attr("dy", (_, i) => 1 + i * 2 + "em")
        .merge(labels);

    var circles = focus.selectAll(".hoverCircle").data(keys);

    circles
        .enter()
        .append("circle")
        .attr("class", (d) => "hoverCircle " + d)
        .style("fill", (d) => z(d))
        .attr("r", 4)
        .merge(circles);

    //draws the overlay
    svg
        .selectAll(".overlay")
        .on("mouseover", function () {
          focus.style("display", null);
        })
        .on("mouseout", function () {
          focus.style("display", "none");
        })
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

        focus
          .select(".lineHover")
          .attr("transform", "translate(" + x(d.date) + "," + height + ")");

        focus
          .select(".lineHoverDate")
          .attr(
            "transform",
            "translate(" + x(d.date) + "," + (height + margin.bottom) + ")"
          )
          .text(formatDate(d.date));

        focus
          .selectAll(".hoverCircle")
          .attr("cy", (e) => y(d[e]))
          .attr("cx", x(d.date));

        focus
          .selectAll(".lineHoverText")
          .attr("transform", "translate(" + x(d.date) + "," + height / 2.5 + ")")
          .text((e) => e + " " + formatValue(d[e]) + "%");

        x(d.date) > width - width / 4
          ? focus
              .selectAll("text.lineHoverText")
              .attr("text-anchor", "end")
              .attr("dx", -10)
          : focus
              .selectAll("text.lineHoverText")
              .attr("text-anchor", "start")
              .attr("dx", 10);

        //reorders Gantt bars depending on the mouse position
        reorderGanttBars(d.date);
    }
}

function adjustLineChartColors() {
    $(".line.lineObjects.Beherbergung.Umsatz").css({ stroke: "#8525FD" });
    $(".lineHoverText.Beherbergung.Umsatz").css({ fill: "#8525FD" });
    $(".hoverCircle.Beherbergung.Umsatz").css({ fill: "#8525FD" });

    $(".line.lineObjects.Beherbergung.Beschäftigte").css({ stroke: "#866FA2" });
    $(".lineHoverText.Beherbergung.Beschäftigte").css({ fill: "#866FA2" });
    $(".hoverCircle.Beherbergung.Beschäftigte").css({ fill: "#866FA2" });

    $(".line.lineObjects.Gastronomie.Umsatz").css({ stroke: "#007DFA" });
    $(".lineHoverText.Gastronomie.Umsatz").css({ fill: "#007DFA" });
    $(".hoverCircle.Gastronomie.Umsatz").css({ fill: "#007DFA" });

    $(".line.lineObjects.Gastronomie.Beschäftigte").css({ stroke: "#4E7C91" });
    $(".lineHoverText.Gastronomie.Beschäftigte").css({ fill: "#4E7C91" });
    $(".hoverCircle.Gastronomie.Beschäftigte").css({ fill: "#4E7C91" });
}

let massnahmen = [
    {
    startdate: "3/12/2020",
    enddate: "5/16/2020",
    sanctions:"Immer mehr Theater und Konzerthäuser stellen den Spielbetrieb ein. Die Fußball-Bundesliga pausiert.",
    titel: "Bundesliga pausiert",
    },
    {
    startdate: "3/16/2020",
    enddate: "5/16/2020",
    sanctions:"Die Grenzen zu Frankreich, Österreich, Luxemburg, Dänemark und der Schweiz gibt es Kontrollen und Einreiseverbote. In den meisten Bundesländern sind Schulen und Kitas geschlossen.",
    titel: "Reiseeinschränkung",
    },
    {
    startdate: "3/22/2020",
    enddate: "5/11/2020",
    sanctions:"Verbot von Ansammlungen von mehr als zwei Menschen. Ausgenommen sind Angehörige, die im eigenen Haushalt leben. Cafés, Kneipen, Restaurants, aber auch Friseure zum Beispiel schließen.",
    titel: "1. Lockdown",
    },
    {
    startdate: "3/22/2020",
    enddate: "4/15/2020",
    sanctions: "Schule schließt",
    titel: "Schule schließt",
    },
    {
    startdate: "4/22/2020",
    enddate: "12/31/2020",
    sanctions: "Das bayerische Kabinett beschloss, dass 250.000 Pflegekräfte in bayerischen Krankenhäusern, Altenheimen und in der ambulanten Pflege und auch Rettungsassistenten und Notfallsanitäter eine steuerfreie Einmalzahlung erhalten.",
    titel: "Boni für Pflegekräfte",
    },
    {
    startdate: "4/22/2020",
    enddate: "12/31/2020",
    sanctions: "Maskenpflicht für alle Bundesländer.",
    titel: "Maskenpflicht",
    },
    {
    startdate: "7/10/2020",
    enddate: "12/31/2020",
    sanctions:"Ministerpräsident Söder gibt bekannt, dass kostenlose, freiwillige Corona-Tests „schneller, kostenlos und für jedermann“ ermöglicht werden.",
    titel: "Testmöglichkeit",
    },
    {
    startdate: "7/10/2020",
    enddate: "12/31/2020",
    sanctions:"Die Bundesländer beschließen ein Beherbergungsverbot für Urlauber aus inländischen Risikogebieten. Die Zahl der Neuinfektionen ist auf mehr als 4000 binnen eines Tages gestiegen.",
    titel: "Beherbergungsverbot",
    },
    {
    startdate: "8/8/2020",
    enddate: "12/31/2020",
    sanctions:"Einreisende aus internationalen Risikogebieten müssen sich bei der Rückkehr nach Deutschland testen lassen.",
    titel: "Reiseeinschränkung",
    },
    {
    startdate: "10/14/2020",
    enddate: "12/31/2020",
    sanctions: "Beherbergungsverbot bei Inzididenz > 50.",
    titel: "Beherbergungsverbot",
    },
    {
    startdate: "10/17/2020",
    enddate: "12/31/2020",
    sanctions:"In der Sitzung vom 15. Oktober 2020 beschloss das bayerische Kabinett die Einführung eines „Ampelsystems“ auf Ebene der Landkreise bzw. kreisfreien Städte für vorerst vier Wochen.",
    titel: "Ampelsystem",
    },
    {
    startdate: "11/2/2020",
    enddate: "12/31/2020",
    sanctions: "Lockdown light, Gastronomie schließt.",
    titel: 'Lockdown "light',
    },
    {
    startdate: "11/3/2020",
    enddate: "12/31/2020",
    sanctions:"Der Notfallplan Corona-Pandemie: Allgemeinverfügung zur Bewältigung erheblicher Patientenzahlen in Krankenhäusern wurde bekannt gegeben.",
    titel: "Allgemeinverfügung ",
    },
    {
    startdate: "11/9/2020",
    enddate: "11/30/2020",
    sanctions:"Die Verordnung über Quarantänemaßnahmen für Einreisende zur Bekämpfung des Coronavirus vom bayerischen Staatsministerium für Gesundheit und Pflege bekannt gegeben.",
    titel: "Quarantäneverordnung",
    },
    {
    startdate: "12/9/2020",
    enddate: "12/31/2020",
    sanctions:"Die Ausrufung des Katastrophenfalls sowie weitere einschränkende Maßnahmen beschlossen.",
    titel: "Katastrophenfall",
    },
];

const data2 = massnahmen.map((item) => {
    let dataMap = new Map();
    dataMap["Startdatum"] = item.startdate;
    dataMap["Enddatum"] = item.enddate;
    dataMap["massnahme"] = item.sanctions;
    dataMap["title"] = item.titel;

    return dataMap;
});

// function to iterate over massnahmen map and draw gantt bars for each
function ganttChart(massnahmen) {
    massnahmen.forEach((value, key, map) => {
        // console.log(value.Startdatum);
        drawBar(key, value);
    });
}

// this function gets massnahmen objects and creates the bars accoring to the start and end date
function drawBar(key, value) {

    // outer div "lane" of the bar
    let divLine = document.createElement("div");
    divLine.className = "ganttLine Line" + (key + 1);
    divLine.id = "demo-tooltip-mouse" + key;
    divLine.style.top = 18 * key + "px";

    // Title of the Massnahme
    let titleSpan = document.createElement("span");
    titleSpan.className = "ganttTitle gTitle" + (key + 1) + " unselectable";
    titleSpan.innerHTML = "" + value.title;

    // the actual bar
    let div = document.createElement("div");
    let startdate = new Date(value.Startdatum);
    let enddate = new Date(value.Enddatum);
    let startofyear = new Date(2020, 0, 0);

    div.className = "barElement bar" + (key + 1);
    div.id = "bar" + (key + 1);

    // use widthFromDate function to calculate the with and the starting point of bar & text
    div.style.width = "" + widthFromDate(startdate, enddate) + "px";
    div.style.left = "" + widthFromDate(startofyear, startdate) + "px";
    titleSpan.style.left = widthFromDate(startofyear, startdate) - (12)  + "px";

    document.getElementById("ganttContainer").appendChild(divLine);
    document.getElementById("demo-tooltip-mouse" + key).appendChild(titleSpan);
    document.getElementById("demo-tooltip-mouse" + key).appendChild(div);

    // Tooltipp divs
    $("#demo-tooltip-above").jBox("Tooltip", {
        theme: "TooltipDark",
    });

    $("#demo-tooltip-mouse" + key).jBox("Mouse", {
        theme: "TooltipDark",
        content:
            "<b> Zeitraum: " +
            value.Startdatum +
            "-" +
            value.Enddatum +
            "<br> Massnahmen: " +
            value.massnahme +
            "</b>",
    });
}

// function to calculate the width in px with a given start and end date
// time difference in days gets calculated
// and then divided by (width of gantt chart / duration of gantt chart in days)
function widthFromDate(startdate, enddate) {
    // time difference
    let timeDiff = Math.abs(enddate.getTime() - startdate.getTime());
    // days difference
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // width of gantt chart / duration of gantt chart in days
    let widthperday = (1160 / 365)
    let width = diffDays * widthperday;
    return width;
}

new jBox("Tooltip", {
    attach: ".tooltip",
    getTitle: "data-jbox-title",
    getContent: "data-jbox-content",
});

// function to calculate the position on the y axis in px with given position number
function position(posNumber) {
    let position = "";
    position = (posNumber - 1) * 18 + "px";
    // console.log("position " + position);
    return position;
}

// reset positions (is used to make the ordering of gantt bars work)
function resetPosition() {
    data2.forEach((value, key) => {
        putAtPosition(key,key);
    });
}

// unused function that gets two positions and swaps them
// first approach with this did not work and was replaced by putAtPosition
function swapPosition(pos1, pos2) {
    document.getElementById("demo-tooltip-mouse" + (pos1 - 1)).style.top = position(pos2);
    document.getElementById("demo-tooltip-mouse" + (pos2 - 1)).style.top = position(pos1);
}

// Puts a bar at a certain position
function putAtPosition(element, pos) {
    console.log("put at Position " + element +" " + pos);
    document.getElementById("demo-tooltip-mouse" + (element)).style.top = position(pos);
}

// changes the color of a bar (active or not)
function changeColorofBar(bar, active) {
    if (active) {
        document.getElementById("bar" + bar).style.backgroundColor = "#70F0DE";
    } else {
        document.getElementById("bar" + bar).style.backgroundColor = "#7E7E7E";
    }
}


// function to reorder gantt bars according to which month in the line chart is highlighted
// because the chart hoover function would call this function all the time while hovering over a month
// we check if the month has changed
function reorderGanttBars(month) {
  if (month.toString().includes("Jan")) {
    if (currentMonth != 1){
      console.log("in month " + month);
      orderMassnahmeToMonth(1);
    }
  }
  if (month.toString().includes("Feb")) {
    if (currentMonth != 2){
      console.log("in month " + month);
      orderMassnahmeToMonth(2);
    }
  }
  if (month.toString().includes("Mar")) {
    if (currentMonth != 3){console.log("in month " + month);

      orderMassnahmeToMonth(3);
    }
  }
  if (month.toString().includes("Apr")) {
    if (currentMonth != 4){
      console.log("in month " + month);
      orderMassnahmeToMonth(4);
    }
  }
  if (month.toString().includes("May")) {
    if (currentMonth != 5){
      console.log("in month " + month);
      orderMassnahmeToMonth(5);
    }
  }
  if (month.toString().includes("Jun")) {
    if (currentMonth != 6){
      console.log("in month " + month);
      orderMassnahmeToMonth(6);
    }
  }
  if (month.toString().includes("Jul")) {
    if (currentMonth != 7){
      console.log("in month " + month);
      orderMassnahmeToMonth(7);
    }
  }
  if (month.toString().includes("Aug")) {
    if (currentMonth != 8){
      console.log("in month " + month);
      orderMassnahmeToMonth(8);
    }
  }
  if (month.toString().includes("Sep")) {
    if (currentMonth != 9){
      console.log("in month " + month);
      orderMassnahmeToMonth(9);
    }
  }
  if (month.toString().includes("Oct")) {
    if (currentMonth != 10){
      console.log("in month " + month);
      orderMassnahmeToMonth(10);
    }
  }
  if (month.toString().includes("Nov")) {
    if (currentMonth != 11){
      console.log("in month " + month);
      orderMassnahmeToMonth(11);
    }
  }
  if (month.toString().includes("Dec")) {
    if (currentMonth != 12){
      console.log("in month " + month);
      orderMassnahmeToMonth(12);
    }
  } else {
  }
}

// function to sort massnahmen with a given month
let currentMonth = 0;

function orderMassnahmeToMonth(month) {
    // first reset all positions
    currentMonth = month;
    resetPosition();

    // arrays to hold the active and inactive bar indices
    let active = [];
    let inactive = [];

    // var to check when forEach is finished
    let itemsProcessed = 0;
    data2.forEach((value, key) => {
        // get a int value for start and end month
        let startMonth = new Date(value.Startdatum).getMonth() + 1;
        let endMonth = new Date(value.Enddatum).getMonth() + 1;

        // if startMonth <= month && endMonth >= month it means a massnahme should be active
        // else if startMonth >= month || endMonth <= month it means it should be inactive
        if (startMonth <= month && endMonth >= month) {
            // console.log("im active push " + startMonth + " " + endMonth + " aktueller Monat " + month);
            // add the key of active massnahme to the array
            active.push(key);
        } else if (startMonth >= month || endMonth <= month) {
            inactive.push(key);
        }
        itemsProcessed++;
    });
    
    // check if all items have been iterated
    if (itemsProcessed === data2.length) {
        // first sort all active massnahmen to the top
        active.forEach(sortActive);
        // offset to know where to place the first inactive massnahme
        let offset = active.length;
        inactive.forEach(function (item, index) {
            sortInactive(item, index, offset);
        });
    }
}


let key2 = 0;
// put all massnahmen from array on top and highlight them
function sortActive(item,index) {
    //console.log("im sort" + item);
    putAtPosition(item, index);
    changeColorofBar(item + 1, true);
    key2++;
};

// put all massnahmen from array behind active ones and change the color to inactive
function sortInactive(item, index, offset) {
    changeColorofBar(item + 1, false);
    putAtPosition(item, index+offset);
};
