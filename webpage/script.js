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
