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


var data = [
    {
        actualStart: Date.UTC(2020,3,12),
        actualEnd: Date.UTC(2020,5,16),
        massnahmen: "Immer mehr Theater und Konzerthäuser stellen den Spielbetrieb ein. Die Fußball-Bundesliga pausiert",
        name: "Stop von Konzerten und Sportveranstaltungen"
    },
    {
        actualStart: Date.UTC(2020, 3, 16),
        actualEnd: Date.UTC(2020, 5, 16),
        massnahmen: "Die Grenzen zu Frankreich, Österreich, Luxemburg, Dänemark und der Schweiz gibt es Kontrollen und Einreiseverbote. In den meisten Bundesländern sind Schulen und Kitas geschlossen",
        name: "Reiseeinschränkung"
    },
    {
        actualStart: Date.UTC(2020, 3, 22),
        actualEnd: Date.UTC(2020, 5, 11),
        massnahmen: "Verbot von Ansammlungen von mehr als zwei Menschen. Ausgenommen sind Angehörige, die im eigenen Haushalt leben. Cafés, Kneipen, Restaurants, aber auch Friseure zum Beispiel schließen",
        name: "1. Lockdown"
    },
    {
        actualStart: Date.UTC(2020, 3, 22),
        actualEnd: Date.UTC(2020, 4, 15),
        massnahmen: "Schule schließt",
        name: "Schule schließt"
    },
    {
        actualStart: Date.UTC(2020, 4, 22),
        actualEnd: Date.UTC(2020, 12, 31),
        massnahmen: "Maskenpflicht für alle Bundesländer",
        name: "Maskenpflicht"
    },
    {
        actualStart: Date.UTC(2020, 8, 8),
        actualEnd: Date.UTC(2020, 12, 31),
        massnahmen: "Einreisende aus internationalen Risikogebieten müssen sich bei der Rückkehr nach Deutschland testen lassen",
        name: "Reiseeinschränkung"
    },
    {
        actualStart: Date.UTC(2020, 10, 7),
        actualEnd: Date.UTC(2020, 12, 31),
        massnahmen: "Die Bundesländer beschließen ein Beherbergungsverbot für Urlauber aus inländischen Risikogebieten. Die Zahl der Neuinfektionen ist auf mehr als 4000 binnen eines Tages gestiegen",
        name: "Beherbergungsverbot"
    },
    {
        actualStart: Date.UTC(2020, 10, 14),
        actualEnd: Date.UTC(2020, 12, 31),
        massnahmen: "Beherbergungsverbot bei Inzididenz > 50",
        name: "Beherbergungsverbot"
    },
    {
        actualStart: Date.UTC(2020, 11, 2),
        actualEnd: Date.UTC(2020, 12, 31),
        massnahmen: "Lockdown light, Gastronomie schließt",
        name: "Lockdown \"light"
    }];

google.charts.load('current', {'packages':['gantt']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task ID');
    data.addColumn('string', 'Task Name');
    data.addColumn('string', 'Resource');
    data.addColumn('date', 'Start Date');
    data.addColumn('date', 'End Date');
    data.addColumn('number', 'Duration');
    data.addColumn('number', 'Percent Complete');
    data.addColumn('string', 'Dependencies');

    data.addRows([

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

    var options = {
        height: 400,
        gantt: {
            trackHeight: 30
        }
    };

    var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

    chart.draw(data, options);
}
