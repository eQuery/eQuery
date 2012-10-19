if ( eQuery.fn.offset ) {

module("offset", { setup: function(){
	// force a scroll value on the main window
	// this insures that the results will be wrong
	// if the offset method is using the scroll offset
	// of the parent window
	var forceScroll = eQuery("<div>").css({ "width": 2000, "height": 2000 });
	// this needs to be body, because #qunit-fixture is hidden and elements inside it don't have a scrollTop
	forceScroll.appendTo("body");
	var checkDiv = eQuery("<div>").appendTo("#qunit-fixture")[0];

	window.scrollTo( 200, 200 );
	window.supportsScroll = ( document.documentElement.scrollTop || document.body.scrollTop );
	window.scrollTo( 1, 1 );

	checkDiv.style.position = "fixed";
	checkDiv.style.top = "20px";
	// safari subtracts parent border width here which is 5px
	window.supportsFixedPosition = ( checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15 );
	checkDiv.style.position = checkDiv.style.top = "";
	eQuery( checkDiv ).remove();
	forceScroll.remove();
}, teardown: moduleTeardown });

/*
	Closure-compiler will roll static methods off of the eQuery object and so they will
	not be passed with the eQuery object across the windows. To differentiate this, the
	testIframe callbacks use the "€" symbol to refer to the eQuery object passed from
	the iframe window and the "eQuery" symbol is used to access any static methods.
*/

test("empty set", function() {
	expect(2);
	strictEqual( eQuery().offset(), undefined, "offset() returns undefined for empty set (#11962)" );
	strictEqual( eQuery().position(), undefined, "position() returns undefined for empty set (#11962)" );
});

test("object without getBoundingClientRect", function() {
	expect(2);

	// Simulates a browser without gBCR on elements, we just want to return 0,0
	var result = eQuery({ ownerDocument: document }).offset();
	equal( result.top, 0, "Check top" );
	equal( result.left, 0, "Check left" );
});

test("disconnected node", function() {
	expect(2);

	var result = eQuery( document.createElement("div") ).offset();

	equal( result.top, 0, "Check top" );
	equal( result.left, 0, "Check left" );
});

testIframe("offset/absolute", "absolute", function(€, iframe) {
	expect(4);

	var doc = iframe.document,
			tests;

	// get offset
	tests = [
		{ "id": "#absolute-1", "top": 1, "left": 1 }
	];
	eQuery.each( tests, function() {
		equal( eQuery( this["id"], doc ).offset().top,  this["top"],  "eQuery('" + this["id"] + "').offset().top" );
		equal( eQuery( this["id"], doc ).offset().left, this["left"], "eQuery('" + this["id"] + "').offset().left" );
	});


	// get position
	tests = [
		{ "id": "#absolute-1", "top": 0, "left": 0 }
	];
	eQuery.each( tests, function() {
		equal( eQuery( this["id"], doc ).position().top,  this["top"],  "eQuery('" + this["id"] + "').position().top" );
		equal( eQuery( this["id"], doc ).position().left, this["left"], "eQuery('" + this["id"] + "').position().left" );
	});
});

testIframe("offset/absolute", "absolute", function( € ) {
	expect(178);

	// get offset tests
	var tests = [
		{ "id": "#absolute-1",     "top":  1, "left":  1 },
		{ "id": "#absolute-1-1",   "top":  5, "left":  5 },
		{ "id": "#absolute-1-1-1", "top":  9, "left":  9 },
		{ "id": "#absolute-2",     "top": 20, "left": 20 }
	];
	eQuery.each( tests, function() {
		equal( €( this["id"] ).offset().top,  this["top"],  "eQuery('" + this["id"] + "').offset().top" );
		equal( €( this["id"] ).offset().left, this["left"], "eQuery('" + this["id"] + "').offset().left" );
	});


	// get position
	tests = [
		{ "id": "#absolute-1",     "top":  0, "left":  0 },
		{ "id": "#absolute-1-1",   "top":  1, "left":  1 },
		{ "id": "#absolute-1-1-1", "top":  1, "left":  1 },
		{ "id": "#absolute-2",     "top": 19, "left": 19 }
	];
	eQuery.each( tests, function() {
		equal( €( this["id"] ).position().top,  this["top"],  "eQuery('" + this["id"] + "').position().top" );
		equal( €( this["id"] ).position().left, this["left"], "eQuery('" + this["id"] + "').position().left" );
	});

	// test #5781
	var offset = €( "#positionTest" ).offset({ "top": 10, "left": 10 }).offset();
	equal( offset.top,  10, "Setting offset on element with position absolute but 'auto' values." );
	equal( offset.left, 10, "Setting offset on element with position absolute but 'auto' values." );


	// set offset
	tests = [
		{ "id": "#absolute-2",     "top": 30, "left": 30 },
		{ "id": "#absolute-2",     "top": 10, "left": 10 },
		{ "id": "#absolute-2",     "top": -1, "left": -1 },
		{ "id": "#absolute-2",     "top": 19, "left": 19 },
		{ "id": "#absolute-1-1-1", "top": 15, "left": 15 },
		{ "id": "#absolute-1-1-1", "top":  5, "left":  5 },
		{ "id": "#absolute-1-1-1", "top": -1, "left": -1 },
		{ "id": "#absolute-1-1-1", "top":  9, "left":  9 },
		{ "id": "#absolute-1-1",   "top": 10, "left": 10 },
		{ "id": "#absolute-1-1",   "top":  0, "left":  0 },
		{ "id": "#absolute-1-1",   "top": -1, "left": -1 },
		{ "id": "#absolute-1-1",   "top":  5, "left":  5 },
		{ "id": "#absolute-1",     "top":  2, "left":  2 },
		{ "id": "#absolute-1",     "top":  0, "left":  0 },
		{ "id": "#absolute-1",     "top": -1, "left": -1 },
		{ "id": "#absolute-1",     "top":  1, "left":  1 }
	];
	eQuery.each( tests, function() {
		€( this["id"] ).offset({ "top": this["top"], "left": this["left"] });
		equal( €( this["id"] ).offset().top,  this["top"],  "eQuery('" + this["id"] + "').offset({ top: "  + this["top"]  + " })" );
		equal( €( this["id"] ).offset().left, this["left"], "eQuery('" + this["id"] + "').offset({ left: " + this["left"] + " })" );

		var top = this["top"], left = this["left"];

		€( this["id"] ).offset(function(i, val){
			equal( val.top, top, "Verify incoming top position." );
			equal( val.left, left, "Verify incoming top position." );
			return { "top": top + 1, "left": left + 1 };
		});
		equal( €( this["id"] ).offset().top,  this["top"]  + 1, "eQuery('" + this["id"] + "').offset({ top: "  + (this["top"]  + 1) + " })" );
		equal( €( this["id"] ).offset().left, this["left"] + 1, "eQuery('" + this["id"] + "').offset({ left: " + (this["left"] + 1) + " })" );

		€( this["id"] )
			.offset({ "left": this["left"] + 2 })
			.offset({ "top":  this["top"]  + 2 });
		equal( €( this["id"] ).offset().top,  this["top"]  + 2, "Setting one property at a time." );
		equal( €( this["id"] ).offset().left, this["left"] + 2, "Setting one property at a time." );

		€( this["id"] ).offset({ "top": this["top"], "left": this["left"], "using": function( props ) {
			€( this ).css({
				"top":  props.top  + 1,
				"left": props.left + 1
			});
		}});
		equal( €( this["id"] ).offset().top,  this["top"]  + 1, "eQuery('" + this["id"] + "').offset({ top: "  + (this["top"]  + 1) + ", using: fn })" );
		equal( €( this["id"] ).offset().left, this["left"] + 1, "eQuery('" + this["id"] + "').offset({ left: " + (this["left"] + 1) + ", using: fn })" );
	});
});

testIframe("offset/relative", "relative", function( € ) {
	expect(60);

	// IE is collapsing the top margin of 1px; detect and adjust accordingly
	var ie = €("#relative-1").offset().top === 6;

	// get offset
	var tests = [
		{ "id": "#relative-1",   "top": ie ?   6 :   7, "left":  7 },
		{ "id": "#relative-1-1", "top": ie ?  13 :  15, "left": 15 },
		{ "id": "#relative-2",   "top": ie ? 141 : 142, "left": 27 }
	];
	eQuery.each( tests, function() {
		equal( €( this["id"] ).offset().top,  this["top"],  "eQuery('" + this["id"] + "').offset().top" );
		equal( €( this["id"] ).offset().left, this["left"], "eQuery('" + this["id"] + "').offset().left" );
	});


	// get position
	tests = [
		{ "id": "#relative-1",   "top": ie ?   5 :   6, "left":  6 },
		{ "id": "#relative-1-1", "top": ie ?   4 :   5, "left":  5 },
		{ "id": "#relative-2",   "top": ie ? 140 : 141, "left": 26 }
	];
	eQuery.each( tests, function() {
		equal( €( this["id"] ).position().top,  this["top"],  "eQuery('" + this["id"] + "').position().top" );
		equal( €( this["id"] ).position().left, this["left"], "eQuery('" + this["id"] + "').position().left" );
	});


	// set offset
	tests = [
		{ "id": "#relative-2",   "top": 200, "left":  50 },
		{ "id": "#relative-2",   "top": 100, "left":  10 },
		{ "id": "#relative-2",   "top":  -5, "left":  -5 },
		{ "id": "#relative-2",   "top": 142, "left":  27 },
		{ "id": "#relative-1-1", "top": 100, "left": 100 },
		{ "id": "#relative-1-1", "top":   5, "left":   5 },
		{ "id": "#relative-1-1", "top":  -1, "left":  -1 },
		{ "id": "#relative-1-1", "top":  15, "left":  15 },
		{ "id": "#relative-1",   "top": 100, "left": 100 },
		{ "id": "#relative-1",   "top":   0, "left":   0 },
		{ "id": "#relative-1",   "top":  -1, "left":  -1 },
		{ "id": "#relative-1",   "top":   7, "left":   7 }
	];
	eQuery.each( tests, function() {
		€( this["id"] ).offset({ "top": this["top"], "left": this["left"] });
		equal( €( this["id"] ).offset().top,  this["top"],  "eQuery('" + this["id"] + "').offset({ top: "  + this["top"]  + " })" );
		equal( €( this["id"] ).offset().left, this["left"], "eQuery('" + this["id"] + "').offset({ left: " + this["left"] + " })" );

		€( this["id"] ).offset({ "top": this["top"], "left": this["left"], "using": function( props ) {
			€( this ).css({
				"top":  props.top  + 1,
				"left": props.left + 1
			});
		}});
		equal( €( this["id"] ).offset().top,  this["top"]  + 1, "eQuery('" + this["id"] + "').offset({ top: "  + (this["top"]  + 1) + ", using: fn })" );
		equal( €( this["id"] ).offset().left, this["left"] + 1, "eQuery('" + this["id"] + "').offset({ left: " + (this["left"] + 1) + ", using: fn })" );
	});
});

testIframe("offset/static", "static", function( € ) {

	// IE is collapsing the top margin of 1px; detect and adjust accordingly
	var ie = €("#static-1").offset().top === 6;

	expect( 80 );

	// get offset
	var tests = [
		{ "id": "#static-1",     "top": ie ?   6 :   7, "left":  7 },
		{ "id": "#static-1-1",   "top": ie ?  13 :  15, "left": 15 },
		{ "id": "#static-1-1-1", "top": ie ?  20 :  23, "left": 23 },
		{ "id": "#static-2", "top": ie ? 121 : 122, left: 7 }
	];
	eQuery.each( tests, function() {
		equal( €( this["id"] ).offset().top,  this["top"],  "eQuery('" + this["id"] + "').offset().top" );
		equal( €( this["id"] ).offset().left, this["left"], "eQuery('" + this["id"] + "').offset().left" );
	});


	// get position
	tests = [
		{ "id": "#static-1",     "top": ie ?   5 :   6, "left":  6 },
		{ "id": "#static-1-1",   "top": ie ?  12 :  14, "left": 14 },
		{ "id": "#static-1-1-1", "top": ie ?  19 :  22, "left": 22 },
		{ "id": "#static-2", "top": ie ? 120 : 121, "left": 6 }
	];
	eQuery.each( tests, function() {
		equal( €( this["id"] ).position().top,  this["top"],  "eQuery('" + this["top"]  + "').position().top" );
		equal( €( this["id"] ).position().left, this["left"], "eQuery('" + this["left"] +"').position().left" );
	});


	// set offset
	tests = [
		{ "id": "#static-2",     "top": 200, "left": 200 },
		{ "id": "#static-2",     "top": 100, "left": 100 },
		{ "id": "#static-2",     "top":  -2, "left":  -2 },
		{ "id": "#static-2",     "top": 121, "left":   6 },
		{ "id": "#static-1-1-1", "top":  50, "left":  50 },
		{ "id": "#static-1-1-1", "top":  10, "left":  10 },
		{ "id": "#static-1-1-1", "top":  -1, "left":  -1 },
		{ "id": "#static-1-1-1", "top":  22, "left":  22 },
		{ "id": "#static-1-1",   "top":  25, "left":  25 },
		{ "id": "#static-1-1",   "top":  10, "left":  10 },
		{ "id": "#static-1-1",   "top":  -3, "left":  -3 },
		{ "id": "#static-1-1",   "top":  14, "left":  14 },
		{ "id": "#static-1",     "top":  30, "left":  30 },
		{ "id": "#static-1",     "top":   2, "left":   2 },
		{ "id": "#static-1",     "top":  -2, "left":  -2 },
		{ "id": "#static-1",     "top":   7, "left":   7 }
	];
	eQuery.each( tests, function() {
		€( this["id"] ).offset({ "top": this["top"], "left": this["left"] });
		equal( €( this["id"] ).offset().top,  this["top"],  "eQuery('" + this["id"] + "').offset({ top: "  + this["top"]  + " })" );
		equal( €( this["id"] ).offset().left, this["left"], "eQuery('" + this["id"] + "').offset({ left: " + this["left"] + " })" );

		€( this["id"] ).offset({ "top": this["top"], "left": this["left"], "using": function( props ) {
			€( this ).css({
				"top":  props.top  + 1,
				"left": props.left + 1
			});
		}});
		equal( €( this["id"] ).offset().top,  this["top"]  + 1, "eQuery('" + this["id"] + "').offset({ top: "  + (this["top"]  + 1) + ", using: fn })" );
		equal( €( this["id"] ).offset().left, this["left"] + 1, "eQuery('" + this["id"] + "').offset({ left: " + (this["left"] + 1) + ", using: fn })" );
	});
});

testIframe("offset/fixed", "fixed", function( € ) {
	// IE is collapsing the top margin of 1px; detect and adjust accordingly
	var ie = €("#fixed-1").position().top === 2;

	expect(34);

	var tests = [
		{
			"id": "#fixed-1",
			"offsetTop": 1001,
			"offsetLeft": 1001,
			"positionTop": ie ? 2 : 0,
			"positionLeft": ie ? 2 : 0
		},
		{
			"id": "#fixed-2",
			"offsetTop": 1021,
			"offsetLeft": 1021,
			"positionTop": ie ? 22 : 20,
			"positionLeft": ie ? 22 : 20
		}
	];

	eQuery.each( tests, function() {
		if ( !window.supportsScroll ) {
			ok( true, "Browser doesn't support scroll position." );
			ok( true, "Browser doesn't support scroll position." );
			ok( true, "Browser doesn't support scroll position." );
			ok( true, "Browser doesn't support scroll position." );

		} else if ( window.supportsFixedPosition ) {
			equal( €( this["id"] ).offset().top,  this["offsetTop"],  "eQuery('" + this["id"] + "').offset().top" );
			equal( €( this["id"] ).position().top,  this["positionTop"],  "eQuery('" + this["id"] + "').position().top" );
			equal( €( this["id"] ).offset().left, this["offsetLeft"], "eQuery('" + this["id"] + "').offset().left" );
			equal( €( this["id"] ).position().left,  this["positionLeft"],  "eQuery('" + this["id"] + "').position().left" );
		} else {
			// need to have same number of assertions
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
		}
	});

	tests = [
		{ "id": "#fixed-1", "top": 100, "left": 100 },
		{ "id": "#fixed-1", "top":   0, "left":   0 },
		{ "id": "#fixed-1", "top":  -4, "left":  -4 },
		{ "id": "#fixed-2", "top": 200, "left": 200 },
		{ "id": "#fixed-2", "top":   0, "left":   0 },
		{ "id": "#fixed-2", "top":  -5, "left":  -5 }
	];

	eQuery.each( tests, function() {
		if ( window.supportsFixedPosition ) {
			€( this["id"] ).offset({ "top": this["top"], "left": this["left"] });
			equal( €( this["id"] ).offset().top,  this["top"],  "eQuery('" + this["id"] + "').offset({ top: "  + this["top"]  + " })" );
			equal( €( this["id"] ).offset().left, this["left"], "eQuery('" + this["id"] + "').offset({ left: " + this["left"] + " })" );

			€( this["id"] ).offset({ "top": this["top"], "left": this["left"], "using": function( props ) {
				€( this ).css({
					"top":  props.top  + 1,
					"left": props.left + 1
				});
			}});
			equal( €( this["id"] ).offset().top,  this["top"]  + 1, "eQuery('" + this["id"] + "').offset({ top: "  + (this["top"]  + 1) + ", using: fn })" );
			equal( €( this["id"] ).offset().left, this["left"] + 1, "eQuery('" + this["id"] + "').offset({ left: " + (this["left"] + 1) + ", using: fn })" );
		} else {
			// need to have same number of assertions
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
		}
	});

	// Bug 8316
	var €noTopLeft = €("#fixed-no-top-left");
	if ( window.supportsFixedPosition ) {
		equal( €noTopLeft.offset().top,  1007,  "Check offset top for fixed element with no top set" );
		equal( €noTopLeft.offset().left, 1007, "Check offset left for fixed element with no left set" );
	} else {
		// need to have same number of assertions
		ok( true, "Fixed position is not supported" );
		ok( true, "Fixed position is not supported" );
	}
});

testIframe("offset/table", "table", function( € ) {
	expect(4);

	equal( €("#table-1").offset().top, 6, "eQuery('#table-1').offset().top" );
	equal( €("#table-1").offset().left, 6, "eQuery('#table-1').offset().left" );

	equal( €("#th-1").offset().top, 10, "eQuery('#th-1').offset().top" );
	equal( €("#th-1").offset().left, 10, "eQuery('#th-1').offset().left" );
});

testIframe("offset/scroll", "scroll", function( €, win ) {
	expect(24);

	// IE is collapsing the top margin of 1px; detect and adjust accordingly
	var ie = €("#scroll-1").offset().top == 6;

	// IE is collapsing the top margin of 1px
	equal( €("#scroll-1").offset().top, ie ? 6 : 7, "eQuery('#scroll-1').offset().top" );
	equal( €("#scroll-1").offset().left, 7, "eQuery('#scroll-1').offset().left" );

	// IE is collapsing the top margin of 1px
	equal( €("#scroll-1-1").offset().top, ie ? 9 : 11, "eQuery('#scroll-1-1').offset().top" );
	equal( €("#scroll-1-1").offset().left, 11, "eQuery('#scroll-1-1').offset().left" );


	// scroll offset tests .scrollTop/Left
	equal( €("#scroll-1").scrollTop(), 5, "eQuery('#scroll-1').scrollTop()" );
	equal( €("#scroll-1").scrollLeft(), 5, "eQuery('#scroll-1').scrollLeft()" );

	equal( €("#scroll-1-1").scrollTop(), 0, "eQuery('#scroll-1-1').scrollTop()" );
	equal( €("#scroll-1-1").scrollLeft(), 0, "eQuery('#scroll-1-1').scrollLeft()" );

	// scroll method chaining
	equal( €("#scroll-1").scrollTop(undefined).scrollTop(), 5, ".scrollTop(undefined) is chainable (#5571)" );
	equal( €("#scroll-1").scrollLeft(undefined).scrollLeft(), 5, ".scrollLeft(undefined) is chainable (#5571)" );

	win.name = "test";

	if ( !window.supportsScroll ) {
		ok( true, "Browser doesn't support scroll position." );
		ok( true, "Browser doesn't support scroll position." );

		ok( true, "Browser doesn't support scroll position." );
		ok( true, "Browser doesn't support scroll position." );
	} else {
		equal( €(win).scrollTop(), 1000, "eQuery(window).scrollTop()" );
		equal( €(win).scrollLeft(), 1000, "eQuery(window).scrollLeft()" );

		equal( €(win.document).scrollTop(), 1000, "eQuery(document).scrollTop()" );
		equal( €(win.document).scrollLeft(), 1000, "eQuery(document).scrollLeft()" );
	}

	// test eQuery using parent window/document
	// eQuery reference here is in the iframe
	window.scrollTo(0,0);
	equal( €(window).scrollTop(), 0, "eQuery(window).scrollTop() other window" );
	equal( €(window).scrollLeft(), 0, "eQuery(window).scrollLeft() other window" );
	equal( €(document).scrollTop(), 0, "eQuery(window).scrollTop() other document" );
	equal( €(document).scrollLeft(), 0, "eQuery(window).scrollLeft() other document" );

	// Tests scrollTop/Left with empty equery objects
	notEqual( €().scrollTop(100), null, "eQuery().scrollTop(100) testing setter on empty equery object" );
	notEqual( €().scrollLeft(100), null, "eQuery().scrollLeft(100) testing setter on empty equery object" );
	notEqual( €().scrollTop(null), null, "eQuery().scrollTop(null) testing setter on empty equery object" );
	notEqual( €().scrollLeft(null), null, "eQuery().scrollLeft(null) testing setter on empty equery object" );
	strictEqual( €().scrollTop(), null, "eQuery().scrollTop(100) testing setter on empty equery object" );
	strictEqual( €().scrollLeft(), null, "eQuery().scrollLeft(100) testing setter on empty equery object" );
});

testIframe("offset/body", "body", function( € ) {
	expect(2);

	equal( €("body").offset().top, 1, "eQuery('#body').offset().top" );
	equal( €("body").offset().left, 1, "eQuery('#body').offset().left" );
});

test("chaining", function() {
	expect(3);
	var coords = { "top":  1, "left":  1 };
	equal( eQuery("#absolute-1").offset(coords).selector, "#absolute-1", "offset(coords) returns eQuery object" );
	equal( eQuery("#non-existent").offset(coords).selector, "#non-existent", "offset(coords) with empty eQuery set returns eQuery object" );
	equal( eQuery("#absolute-1").offset(undefined).selector, "#absolute-1", "offset(undefined) returns eQuery object (#5571)" );
});

test("offsetParent", function(){
	expect(12);

	var body = eQuery("body").offsetParent();
	equal( body.length, 1, "Only one offsetParent found." );
	equal( body[0], document.body, "The body is its own offsetParent." );

	var header = eQuery("#qunit-header").offsetParent();
	equal( header.length, 1, "Only one offsetParent found." );
	equal( header[0], document.body, "The body is the offsetParent." );

	var div = eQuery("#nothiddendivchild").offsetParent();
	equal( div.length, 1, "Only one offsetParent found." );
	equal( div[0], document.body, "The body is the offsetParent." );

	eQuery("#nothiddendiv").css("position", "relative");

	div = eQuery("#nothiddendivchild").offsetParent();
	equal( div.length, 1, "Only one offsetParent found." );
	equal( div[0], eQuery("#nothiddendiv")[0], "The div is the offsetParent." );

	div = eQuery("body, #nothiddendivchild").offsetParent();
	equal( div.length, 2, "Two offsetParent found." );
	equal( div[0], document.body, "The body is the offsetParent." );
	equal( div[1], eQuery("#nothiddendiv")[0], "The div is the offsetParent." );

	var area = eQuery("#imgmap area").offsetParent();
	equal( area[0], document.body, "The body is the offsetParent." );
});

test("fractions (see #7730 and #7885)", function() {
	expect(2);

	eQuery("body").append("<div id='fractions'/>");

	var expected = { "top": 1000, "left": 1000 };
	var div = eQuery("#fractions");

	div.css({
		"position": "absolute",
		"left": "1000.7432222px",
		"top": "1000.532325px",
		"width": 100,
		"height": 100
	});

	div.offset(expected);

	var result = div.offset();

	equal( result.top, expected.top, "Check top" );
	equal( result.left, expected.left, "Check left" );

	div.remove();
});

}
