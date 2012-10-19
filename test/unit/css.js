if ( eQuery.css ) {

module("css", { teardown: moduleTeardown });

test("css(String|Hash)", function() {
	expect( 46 );

	equal( eQuery("#qunit-fixture").css("display"), "block", "Check for css property \"display\"" );

	ok( eQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible" );
	eQuery("#nothiddendiv").css({ display: "none" });
	ok( !eQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden" );
	var €child = eQuery("#nothiddendivchild").css({ "width": "20%", "height": "20%" });
	notEqual( €child.css("width"), "20px", "Retrieving a width percentage on the child of a hidden div returns percentage" );
	notEqual( €child.css("height"), "20px", "Retrieving a height percentage on the child of a hidden div returns percentage" );

	eQuery("#nothiddendiv").css({"display": "block"});
	ok( eQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");
	ok( eQuery(window).is(":visible"), "Calling is(':visible') on window does not throw an error in IE.");
	ok( eQuery(document).is(":visible"), "Calling is(':visible') on document does not throw an error in IE.");

	var div = eQuery( "<div>" );

	// These should be "auto" (or some better value)
	// temporarily provide "0px" for backwards compat
	equal( div.css("width"), "0px", "Width on disconnected node." );
	equal( div.css("height"), "0px", "Height on disconnected node." );

	div.css({ "width": 4, "height": 4 });

	equal( div.css("width"), "4px", "Width on disconnected node." );
	equal( div.css("height"), "4px", "Height on disconnected node." );

	var div2 = eQuery( "<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'/><div style='height:20px;'></div></div>").appendTo("body");

	equal( div2.find("input").css("height"), "20px", "Height on hidden input." );
	equal( div2.find("textarea").css("height"), "20px", "Height on hidden textarea." );
	equal( div2.find("div").css("height"), "20px", "Height on hidden textarea." );

	div2.remove();

	// handle negative numbers by setting to zero #11604
	eQuery("#nothiddendiv").css( {"width": 1, "height": 1} );

	var width = parseFloat(eQuery("#nothiddendiv").css("width")), height = parseFloat(eQuery("#nothiddendiv").css("height"));
	eQuery("#nothiddendiv").css({ "overflow":"hidden", "width": -1, "height": -1 });
	equal( parseFloat(eQuery("#nothiddendiv").css("width")), 0, "Test negative width set to 0");
	equal( parseFloat(eQuery("#nothiddendiv").css("height")), 0, "Test negative height set to 0");

	equal( eQuery("<div style='display: none;'>").css("display"), "none", "Styles on disconnected nodes");

	eQuery("#floatTest").css({"float": "right"});
	equal( eQuery("#floatTest").css("float"), "right", "Modified CSS float using \"float\": Assert float is right");
	eQuery("#floatTest").css({"font-size": "30px"});
	equal( eQuery("#floatTest").css("font-size"), "30px", "Modified CSS font-size: Assert font-size is 30px");
	eQuery.each("0,0.25,0.5,0.75,1".split(","), function(i, n) {
		eQuery("#foo").css({"opacity": n});

		equal( eQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		eQuery("#foo").css({"opacity": parseFloat(n)});
		equal( eQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	eQuery("#foo").css({"opacity": ""});
	equal( eQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	equal( eQuery("#empty").css("opacity"), "0", "Assert opacity is accessible via filter property set in stylesheet in IE" );
	eQuery("#empty").css({ "opacity": "1" });
	equal( eQuery("#empty").css("opacity"), "1", "Assert opacity is taken from style attribute when set vs stylesheet in IE with filters" );
	eQuery.support.opacity ?
		ok(true, "Requires the same number of tests"):
		ok( ~eQuery("#empty")[0].currentStyle.filter.indexOf("gradient"), "Assert setting opacity doesn't overwrite other filters of the stylesheet in IE" );

	div = eQuery("#nothiddendiv");
	var child = eQuery("#nothiddendivchild");

	equal( parseInt(div.css("fontSize"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(div.css("font-size"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("fontSize"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("font-size"), 10), 16, "Verify fontSize px set." );

	child.css("height", "100%");
	equal( child[0].style.height, "100%", "Make sure the height is being set correctly." );

	child.attr("class", "em");
	equal( parseInt(child.css("fontSize"), 10), 32, "Verify fontSize em set." );

	// Have to verify this as the result depends upon the browser's CSS
	// support for font-size percentages
	child.attr("class", "prct");
	var prctval = parseInt(child.css("fontSize"), 10), checkval = 0;
	if ( prctval === 16 || prctval === 24 ) {
		checkval = prctval;
	}

	equal( prctval, checkval, "Verify fontSize % set." );

	equal( typeof child.css("width"), "string", "Make sure that a string width is returned from css('width')." );

	var old = child[0].style.height;

	// Test NaN
	child.css("height", parseFloat("zoo"));
	equal( child[0].style.height, old, "Make sure height isn't changed on NaN." );

	// Test null
	child.css("height", null);
	equal( child[0].style.height, old, "Make sure height isn't changed on null." );

	old = child[0].style.fontSize;

	// Test NaN
	child.css("font-size", parseFloat("zoo"));
	equal( child[0].style.fontSize, old, "Make sure font-size isn't changed on NaN." );

	// Test null
	child.css("font-size", null);
	equal( child[0].style.fontSize, old, "Make sure font-size isn't changed on null." );
});

test("css() explicit and relative values", function() {
	expect(29);
	var €elem = eQuery("#nothiddendiv");

	€elem.css({ "width": 1, "height": 1, "paddingLeft": "1px", "opacity": 1 });
	equal( €elem.css("width"), "1px", "Initial css set or width/height works (hash)" );
	equal( €elem.css("paddingLeft"), "1px", "Initial css set of paddingLeft works (hash)" );
	equal( €elem.css("opacity"), "1", "Initial css set of opacity works (hash)" );

	€elem.css({ width: "+=9" });
	equal( €elem.css("width"), "10px", "'+=9' on width (hash)" );

	€elem.css({ "width": "-=9" });
	equal( €elem.css("width"), "1px", "'-=9' on width (hash)" );

	€elem.css({ "width": "+=9px" });
	equal( €elem.css("width"), "10px", "'+=9px' on width (hash)" );

	€elem.css({ "width": "-=9px" });
	equal( €elem.css("width"), "1px", "'-=9px' on width (hash)" );

	€elem.css( "width", "+=9" );
	equal( €elem.css("width"), "10px", "'+=9' on width (params)" );

	€elem.css( "width", "-=9" ) ;
	equal( €elem.css("width"), "1px", "'-=9' on width (params)" );

	€elem.css( "width", "+=9px" );
	equal( €elem.css("width"), "10px", "'+=9px' on width (params)" );

	€elem.css( "width", "-=9px" );
	equal( €elem.css("width"), "1px", "'-=9px' on width (params)" );

	€elem.css( "width", "-=-9px" );
	equal( €elem.css("width"), "10px", "'-=-9px' on width (params)" );

	€elem.css( "width", "+=-9px" );
	equal( €elem.css("width"), "1px", "'+=-9px' on width (params)" );

	€elem.css({ "paddingLeft": "+=4" });
	equal( €elem.css("paddingLeft"), "5px", "'+=4' on paddingLeft (hash)" );

	€elem.css({ "paddingLeft": "-=4" });
	equal( €elem.css("paddingLeft"), "1px", "'-=4' on paddingLeft (hash)" );

	€elem.css({ "paddingLeft": "+=4px" });
	equal( €elem.css("paddingLeft"), "5px", "'+=4px' on paddingLeft (hash)" );

	€elem.css({ "paddingLeft": "-=4px" });
	equal( €elem.css("paddingLeft"), "1px", "'-=4px' on paddingLeft (hash)" );

	€elem.css({ "padding-left": "+=4" });
	equal( €elem.css("paddingLeft"), "5px", "'+=4' on padding-left (hash)" );

	€elem.css({ "padding-left": "-=4" });
	equal( €elem.css("paddingLeft"), "1px", "'-=4' on padding-left (hash)" );

	€elem.css({ "padding-left": "+=4px" });
	equal( €elem.css("paddingLeft"), "5px", "'+=4px' on padding-left (hash)" );

	€elem.css({ "padding-left": "-=4px" });
	equal( €elem.css("paddingLeft"), "1px", "'-=4px' on padding-left (hash)" );

	€elem.css( "paddingLeft", "+=4" );
	equal( €elem.css("paddingLeft"), "5px", "'+=4' on paddingLeft (params)" );

	€elem.css( "paddingLeft", "-=4" );
	equal( €elem.css("paddingLeft"), "1px", "'-=4' on paddingLeft (params)" );

	€elem.css( "padding-left", "+=4px" );
	equal( €elem.css("paddingLeft"), "5px", "'+=4px' on padding-left (params)" );

	€elem.css( "padding-left", "-=4px" );
	equal( €elem.css("paddingLeft"), "1px", "'-=4px' on padding-left (params)" );

	€elem.css({ "opacity": "-=0.5" });
	equal( €elem.css("opacity"), "0.5", "'-=0.5' on opacity (hash)" );

	€elem.css({ "opacity": "+=0.5" });
	equal( €elem.css("opacity"), "1", "'+=0.5' on opacity (hash)" );

	€elem.css( "opacity", "-=0.5" );
	equal( €elem.css("opacity"), "0.5", "'-=0.5' on opacity (params)" );

	€elem.css( "opacity", "+=0.5" );
	equal( €elem.css("opacity"), "1", "'+=0.5' on opacity (params)" );
});

test("css(String, Object)", function() {
	expect(22);

	ok( eQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible");
	eQuery("#nothiddendiv").css("display", "none");
	ok( !eQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden");
	eQuery("#nothiddendiv").css("display", "block");
	ok( eQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");

	eQuery("#nothiddendiv").css("top", "-1em");
	ok( eQuery("#nothiddendiv").css("top"), -16, "Check negative number in EMs." );

	eQuery("#floatTest").css("float", "left");
	equal( eQuery("#floatTest").css("float"), "left", "Modified CSS float using \"float\": Assert float is left");
	eQuery("#floatTest").css("font-size", "20px");
	equal( eQuery("#floatTest").css("font-size"), "20px", "Modified CSS font-size: Assert font-size is 20px");

	eQuery.each("0,0.25,0.5,0.75,1".split(","), function(i, n) {
		eQuery("#foo").css("opacity", n);
		equal( eQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		eQuery("#foo").css("opacity", parseFloat(n));
		equal( eQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	eQuery("#foo").css("opacity", "");
	equal( eQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	// using contents will get comments regular, text, and comment nodes
	var j = eQuery("#nonnodes").contents();
	j.css("overflow", "visible");
	equal( j.css("overflow"), "visible", "Check node,textnode,comment css works" );
	// opera sometimes doesn't update 'display' correctly, see #2037
	eQuery("#t2037")[0].innerHTML = eQuery("#t2037")[0].innerHTML;
	equal( eQuery("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );

	var div = eQuery("#nothiddendiv"),
		display = div.css("display"),
		ret = div.css("display", undefined);

	equal( ret, div, "Make sure setting undefined returns the original set." );
	equal( div.css("display"), display, "Make sure that the display wasn't changed." );

	// Test for Bug #5509
	var success = true;
	try {
		eQuery("#foo").css("backgroundColor", "rgba(0, 0, 0, 0.1)");
	}
	catch (e) {
		success = false;
	}
	ok( success, "Setting RGBA values does not throw Error" );
});

if ( !eQuery.support.opacity ) {
	test("css(String, Object) for MSIE", function() {
		expect( 5 );
		// for #1438, IE throws JS error when filter exists but doesn't have opacity in it
		eQuery("#foo").css("filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
		equal( eQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when a different filter is set in IE, #1438" );

		var filterVal = "progid:DXImageTransform.Microsoft.Alpha(opacity=30) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		var filterVal2 = "progid:DXImageTransform.Microsoft.alpha(opacity=100) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		var filterVal3 = "progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		eQuery("#foo").css("filter", filterVal);
		equal( eQuery("#foo").css("filter"), filterVal, "css('filter', val) works" );
		eQuery("#foo").css("opacity", 1);
		equal( eQuery("#foo").css("filter"), filterVal2, "Setting opacity in IE doesn't duplicate opacity filter" );
		equal( eQuery("#foo").css("opacity"), 1, "Setting opacity in IE with other filters works" );
		eQuery("#foo").css("filter", filterVal3).css("opacity", 1);
		ok( eQuery("#foo").css("filter").indexOf(filterVal3) !== -1, "Setting opacity in IE doesn't clobber other filters" );
	});

	test( "Setting opacity to 1 properly removes filter: style (#6652)", function() {
		var rfilter = /filter:[^;]*/i,
			test = eQuery( "#t6652" ).css( "opacity", 1 ),
			test2 = test.find( "div" ).css( "opacity", 1 );

		function hasFilter( elem ) {
			var match = rfilter.exec( elem[0].style.cssText );
			if ( match ) {
				return true;
			}
			return false;
		}
		expect( 2 );
		ok( !hasFilter( test ), "Removed filter attribute on element without filter in stylesheet" );
		ok( hasFilter( test2 ), "Filter attribute remains on element that had filter in stylesheet" );
	});
}

test("css(String, Function)", function() {
	expect(3);

	var sizes = ["10px", "20px", "30px"];

	eQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	var index = 0;

	eQuery("#cssFunctionTest div").css("font-size", function() {
		var size = sizes[index];
		index++;
		return size;
	});

	index = 0;

	eQuery("#cssFunctionTest div").each(function() {
		var computedSize = eQuery(this).css("font-size");
		var expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	});

	eQuery("#cssFunctionTest").remove();
});

test("css(String, Function) with incoming value", function() {
	expect(3);

	var sizes = ["10px", "20px", "30px"];

	eQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	var index = 0;

	eQuery("#cssFunctionTest div").css("font-size", function() {
		var size = sizes[index];
		index++;
		return size;
	});

	index = 0;

	eQuery("#cssFunctionTest div").css("font-size", function(i, computedSize) {
		var expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	});

	eQuery("#cssFunctionTest").remove();
});

test("css(Object) where values are Functions", function() {
	expect(3);

	var sizes = ["10px", "20px", "30px"];

	eQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	var index = 0;

	eQuery("#cssFunctionTest div").css({"fontSize": function() {
		var size = sizes[index];
		index++;
		return size;
	}});

	index = 0;

	eQuery("#cssFunctionTest div").each(function() {
		var computedSize = eQuery(this).css("font-size");
		var expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	});

	eQuery("#cssFunctionTest").remove();
});

test("css(Object) where values are Functions with incoming values", function() {
	expect(3);

	var sizes = ["10px", "20px", "30px"];

	eQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	var index = 0;

	eQuery("#cssFunctionTest div").css({"fontSize": function() {
		var size = sizes[index];
		index++;
		return size;
	}});

	index = 0;

	eQuery("#cssFunctionTest div").css({"font-size": function(i, computedSize) {
		var expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	}});

	eQuery("#cssFunctionTest").remove();
});

test("show(); hide()", function() {
	expect(22);

	var hiddendiv = eQuery("div.hidden");
	hiddendiv.hide();
	equal( hiddendiv.css("display"), "none", "Non-detached div hidden" );
	hiddendiv.show();
	equal( hiddendiv.css("display"), "block", "Pre-hidden div shown" );

	var div = eQuery("<div>").hide();
	equal( div.css("display"), "none", "Detached div hidden" );
	div.appendTo("#qunit-fixture").show();
	equal( div.css("display"), "block", "Pre-hidden div shown" );

	QUnit.reset();

	hiddendiv = eQuery("div.hidden");

	equal(eQuery.css( hiddendiv[0], "display"), "none", "hiddendiv is display: none");

	hiddendiv.css("display", "block");
	equal(eQuery.css( hiddendiv[0], "display"), "block", "hiddendiv is display: block");

	hiddendiv.show();
	equal(eQuery.css( hiddendiv[0], "display"), "block", "hiddendiv is display: block");

	hiddendiv.css("display","");

	var pass = true;
	div = eQuery("#qunit-fixture div");
	div.show().each(function(){
		if ( this.style.display == "none" ) {
			pass = false;
		}
	});
	ok( pass, "Show" );

	// #show-tests * is set display: none in CSS
	eQuery("#qunit-fixture").append("<div id='show-tests'><div><p><a href='#'></a></p><code></code><pre></pre><span></span></div><table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table><ul><li></li></ul></div><table id='test-table'></table>");

	var old = eQuery("#test-table").show().css("display") !== "table";
	eQuery("#test-table").remove();

	var test = {
		"div"      : "block",
		"p"        : "block",
		"a"        : "inline",
		"code"     : "inline",
		"pre"      : "block",
		"span"     : "inline",
		"table"    : old ? "block" : "table",
		"thead"    : old ? "block" : "table-header-group",
		"tbody"    : old ? "block" : "table-row-group",
		"tr"       : old ? "block" : "table-row",
		"th"       : old ? "block" : "table-cell",
		"td"       : old ? "block" : "table-cell",
		"ul"       : "block",
		"li"       : old ? "block" : "list-item"
	};

	eQuery.each(test, function(selector, expected) {
		var elem = eQuery(selector, "#show-tests").show();
		equal( elem.css("display"), expected, "Show using correct display type for " + selector );
	});

	// Make sure that showing or hiding a text node doesn't cause an error
	eQuery("<div>test</div> text <span>test</span>").show().remove();
	eQuery("<div>test</div> text <span>test</span>").hide().remove();
});

test("show() resolves correct default display #8099", function() {
	expect(7);
	var tt8099 = eQuery("<tt/>").appendTo("body"),
			dfn8099 = eQuery("<dfn/>", { "html": "foo"}).appendTo("body");

	equal( tt8099.css("display"), "none", "default display override for all tt" );
	equal( tt8099.show().css("display"), "inline", "Correctly resolves display:inline" );

	equal( eQuery("#foo").hide().show().css("display"), "block", "Correctly resolves display:block after hide/show" );

	equal( tt8099.hide().css("display"), "none", "default display override for all tt" );
	equal( tt8099.show().css("display"), "inline", "Correctly resolves display:inline" );

	equal( dfn8099.css("display"), "none", "default display override for all dfn" );
	equal( dfn8099.show().css("display"), "inline", "Correctly resolves display:inline" );

	tt8099.remove();
	dfn8099.remove();
});

test( "show() resolves correct default display, detached nodes (#10006)", function(){
	// Tests originally contributed by Orkel in
	// https://github.com/equery/equery/pull/458
	expect( 11 );

	var div, span;

	div = eQuery("<div class='hidden'>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through stylesheets ) div is visible." );

	div = eQuery("<div style='display: none'>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through inline style ) div is visible." );

	span = eQuery("<span class='hidden'/>");
	span.show().appendTo("#qunit-fixture");
	equal( span.css("display"), "inline", "Make sure a detached, pre-hidden( through stylesheets ) span has default display." );

	span = eQuery("<span style='display: inline'/>");
	span.show().appendTo("#qunit-fixture");
	equal( span.css("display"), "inline", "Make sure a detached, pre-hidden( through inline style ) span has default display." );

	div = eQuery("<div><div class='hidden'></div></div>").children("div");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through stylesheets ) div inside another visible div is visible." );

	div = eQuery("<div><div style='display: none'></div></div>").children("div");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through inline style ) div inside another visible div is visible." );

	div = eQuery("div.hidden");
	div.detach().show();
	equal( div.css("display"), "block", "Make sure a detached( through detach() ), pre-hidden div is visible." );
	div.remove();

	span = eQuery("<span>");
	span.appendTo("#qunit-fixture").detach().show().appendTo("#qunit-fixture" );
	equal( span.css("display"), "inline", "Make sure a detached( through detach() ), pre-hidden span has default display." );
	span.remove();

	div = eQuery("<div>");
	div.show().appendTo("#qunit-fixture");
	ok( !!div.get( 0 ).style.display, "Make sure not hidden div has a inline style." );
	div.remove();

	div = eQuery( document.createElement("div") );
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a pre-created element has default display." );
	div.remove();

	div = eQuery("<div style='display: inline'/>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "inline", "Make sure that element has same display when it was created." );
	div.remove();
});

test("show() resolves correct default display #10227", function() {
	expect(2);

	eQuery("html").append(
		"<p id='ddisplay'>a<style>body{display:none}</style></p>"
	);

	equal( eQuery("body").css("display"), "none", "Initial display: none" );

	eQuery("body").show();

	equal( eQuery("body").css("display"), "block", "Correct display: block" );

	eQuery("#ddisplay").remove();

	eQuery.cache = {};
});

test("toggle()", function() {
	expect(9);
	var div,
		x = eQuery("#foo");

	ok( x.is(":visible"), "is visible" );
	x.toggle();
	ok( x.is(":hidden"), "is hidden" );
	x.toggle();
	ok( x.is(":visible"), "is visible again" );

	x.toggle(true);
	ok( x.is(":visible"), "is visible" );
	x.toggle(false);
	ok( x.is(":hidden"), "is hidden" );
	x.toggle(true);
	ok( x.is(":visible"), "is visible again" );

	div = eQuery("<div style='display:none'><div></div></div>").appendTo("#qunit-fixture");
	x = div.find("div");
	strictEqual( x.toggle().css( "display" ), "none", "is hidden" );
	strictEqual( x.toggle().css( "display" ), "block", "is visible" );

	// Ensure hide() is called when toggled (#12148)
	var oldHide = eQuery.fn.hide;
	eQuery.fn.hide = function() {
		ok( true, name + " method called on toggle" );
		return oldHide.apply( this, arguments );
	};
	x.toggle( name === "show" );
	eQuery.fn.hide = oldHide;
});

test("hide hidden elements (bug #7141)", function() {
	expect(3);
	QUnit.reset();

	var div = eQuery("<div style='display:none'></div>").appendTo("#qunit-fixture");
	equal( div.css("display"), "none", "Element is hidden by default" );
	div.hide();
	ok( !eQuery._data(div, "olddisplay"), "olddisplay is undefined after hiding an already-hidden element" );
	div.show();
	equal( div.css("display"), "block", "Show a double-hidden element" );

	div.remove();
});

test("eQuery.css(elem, 'height') doesn't clear radio buttons (bug #1095)", function () {
	expect(4);

	var €checkedtest = eQuery("#checkedtest");
	// IE6 was clearing "checked" in eQuery.css(elem, "height");
	eQuery.css(€checkedtest[0], "height");
	ok( !! eQuery(":radio:first", €checkedtest).attr("checked"), "Check first radio still checked." );
	ok( ! eQuery(":radio:last", €checkedtest).attr("checked"), "Check last radio still NOT checked." );
	ok( !! eQuery(":checkbox:first", €checkedtest).attr("checked"), "Check first checkbox still checked." );
	ok( ! eQuery(":checkbox:last", €checkedtest).attr("checked"), "Check last checkbox still NOT checked." );
});

test(":visible selector works properly on table elements (bug #4512)", function () {
	expect(1);

	eQuery("#table").html("<tr><td style='display:none'>cell</td><td>cell</td></tr>");
	equal(eQuery("#table td:visible").length, 1, "hidden cell is not perceived as visible");
});

test(":visible selector works properly on children with a hidden parent (bug #4512)", function () {
	expect(1);
	eQuery("#table").css("display", "none").html("<tr><td>cell</td><td>cell</td></tr>");
	equal(eQuery("#table td:visible").length, 0, "hidden cell children not perceived as visible");
});

test("internal ref to elem.runtimeStyle (bug #7608)", function () {
	expect(1);
	var result = true;

	try {
		eQuery("#foo").css( { "width": "0%" } ).css("width");
	} catch (e) {
		result = false;
	}

	ok( result, "elem.runtimeStyle does not throw exception" );
});

test("marginRight computed style (bug #3333)", function() {
	expect(1);

	var €div = eQuery("#foo");
	€div.css({
		"width": "1px",
		"marginRight": 0
	});

	equal(€div.css("marginRight"), "0px", "marginRight correctly calculated with a width and display block");
});

test("box model properties incorrectly returning % instead of px, see #10639 and #12088", function() {
	expect( 2 );

	var container = eQuery("<div/>").width( 400 ).appendTo("#qunit-fixture"),
		el = eQuery("<div/>").css({ "width": "50%", "marginRight": "50%" }).appendTo( container ),
		el2 = eQuery("<div/>").css({ "width": "50%", "minWidth": "300px", "marginLeft": "25%" }).appendTo( container );

	equal( el.css("marginRight"), "200px", "css('marginRight') returning % instead of px, see #10639" );
	equal( el2.css("marginLeft"), "100px", "css('marginLeft') returning incorrect pixel value, see #12088" );
});

test("eQuery.cssProps behavior, (bug #8402)", function() {
	expect( 2 );

	var div = eQuery( "<div>" ).appendTo(document.body).css({
		"position": "absolute",
		"top": 0,
		"left": 10
	});
	eQuery.cssProps.top = "left";
	equal( div.css("top"), "10px", "the fixed property is used when accessing the computed style");
	div.css("top", "100px");
	equal( div[0].style.left, "100px", "the fixed property is used when setting the style");
	// cleanup eQuery.cssProps
	eQuery.cssProps.top = undefined;
});

test("widows & orphans #8936", function () {

	var €p = eQuery("<p>").appendTo("#qunit-fixture");

	if ( "widows" in €p[0].style ) {
		expect(4);
		€p.css({
			"widows": 0,
			"orphans": 0
		});

		equal( €p.css("widows") || eQuery.style( €p[0], "widows" ), 0, "widows correctly start with value 0");
		equal( €p.css("orphans") || eQuery.style( €p[0], "orphans" ), 0, "orphans correctly start with value 0");

		€p.css({
			"widows": 3,
			"orphans": 3
		});

		equal( €p.css("widows") || eQuery.style( €p[0], "widows" ), 3, "widows correctly set to 3");
		equal( €p.css("orphans") || eQuery.style( €p[0], "orphans" ), 3, "orphans correctly set to 3");
	} else {

		expect(1);
		ok( true, "eQuery does not attempt to test for style props that definitely don't exist in older versions of IE");
	}


	€p.remove();
});

test("can't get css for disconnected in IE<9, see #10254 and #8388", function() {
	expect( 2 );
	var span = eQuery( "<span/>" ).css( "background-image", "url(http://static.equery.com/files/rocker/images/logo_equery_215x53.gif)" );
	notEqual( span.css( "background-image" ), null, "can't get background-image in IE<9, see #10254" );

	var div = eQuery( "<div/>" ).css( "top", 10 );
	equal( div.css( "top" ), "10px", "can't get top in IE<9, see #8388" );
});

test("can't get background-position in IE<9, see #10796", function() {
	var div = eQuery( "<div/>" ).appendTo( "#qunit-fixture" ),
		units = [
			"0 0",
			"12px 12px",
			"13px 12em",
			"12em 13px",
			"12em center",
			"+12em center",
			"12.2em center",
			"center center"
		],
		l = units.length,
		i = 0;

	expect( l );

	for( ; i < l; i++ ) {
		div.css( "background-position", units [ i ] );
		ok( div.css( "background-position" ), "can't get background-position in IE<9, see #10796" );
	}
});

test("percentage properties for bottom and right in IE<9 should not be incorrectly transformed to pixels, see #11311", function() {
	expect( 1 );
	var div = eQuery("<div style='position: absolute; width: 1px; height: 20px; bottom:50%;'></div>").appendTo( "#qunit-fixture" );
	ok( window.getComputedStyle || div.css( "bottom" ) === "50%", "position properties get incorrectly transformed in IE<8, see #11311" );
});

if ( eQuery.fn.offset ) {
	test("percentage properties for left and top should be transformed to pixels, see #9505", function() {
		expect( 2 );
		var parent = eQuery("<div style='position:relative;width:200px;height:200px;margin:0;padding:0;border-width:0'></div>").appendTo( "#qunit-fixture" ),
			div = eQuery("<div style='position: absolute; width: 20px; height: 20px; top:50%; left:50%'></div>").appendTo( parent );

		equal( div.css("top"), "100px", "position properties not transformed to pixels, see #9505" );
		equal( div.css("left"), "100px", "position properties not transformed to pixels, see #9505" );
	});
}

test("Do not append px to 'fill-opacity' #9548", function() {
	expect( 1 );

	var €div = eQuery("<div>").appendTo("#qunit-fixture").css("fill-opacity", 1);
	equal( €div.css("fill-opacity"), 1, "Do not append px to 'fill-opacity'");
});

test("css('width') and css('height') should respect box-sizing, see #11004", function() {
	expect( 4 );

	var el_dis = eQuery("<div style='width:300px;height:300px;margin:2px;padding:2px;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;'>test</div>"),
		el = el_dis.clone().appendTo("#qunit-fixture");

	equal( el.css("width"), el.css("width", el.css("width")).css("width"), "css('width') is not respecting box-sizing, see #11004");
	equal( el_dis.css("width"), el_dis.css("width", el_dis.css("width")).css("width"), "css('width') is not respecting box-sizing for disconnected element, see #11004");
	equal( el.css("height"), el.css("height", el.css("height")).css("height"), "css('height') is not respecting box-sizing, see #11004");
	equal( el_dis.css("height"), el_dis.css("height", el_dis.css("height")).css("height"), "css('height') is not respecting box-sizing for disconnected element, see #11004");
});

test("certain css values of 'normal' should be convertable to a number, see #8627", function() {
	expect ( 2 );

	var el = eQuery("<div style='letter-spacing:normal;font-weight:normal;'>test</div>").appendTo("#qunit-fixture");

	ok( eQuery.isNumeric( parseFloat( el.css("letterSpacing") ) ), "css('letterSpacing') not convertable to number, see #8627" );
	ok( eQuery.isNumeric( parseFloat( el.css("fontWeight") ) ), "css('fontWeight') not convertable to number, see #8627" );
});

// only run this test in IE9
if ( document.documentMode === 9 ) {
	test( ".css('filter') returns a string in IE9, see #12537", 1, function() {
		equal( eQuery("<div style='-ms-filter:\"progid:DXImageTransform.Microsoft.gradient(startColorstr=#FFFFFF, endColorstr=#ECECEC)\";'></div>").css("filter"), "progid:DXImageTransform.Microsoft.gradient(startColorstr=#FFFFFF, endColorstr=#ECECEC)", "IE9 returns the correct value from css('filter')." );
	});
}

test( "cssHooks - expand", function() {
	expect( 15 );
	var result,
		properties = {
			margin: [ "marginTop", "marginRight", "marginBottom", "marginLeft" ],
			borderWidth: [ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
			padding: [ "paddingTop", "paddingRight", "paddingBottom", "paddingLeft" ]
		};

	eQuery.each( properties, function( property, keys ) {
		var hook = eQuery.cssHooks[ property ],
			expected = {};
		eQuery.each( keys, function( _, key ) {
			expected[ key ] = 10;
		});
		result = hook.expand( 10 );
		deepEqual( result, expected, property + " expands properly with a number" );

		eQuery.each( keys, function( _, key ) {
			expected[ key ] = "10px";
		});
		result = hook.expand( "10px" );
		deepEqual( result, expected, property + " expands properly with '10px'" );

		expected[ keys[1] ] = expected[ keys[3] ] = "20px";
		result = hook.expand( "10px 20px" );
		deepEqual( result, expected, property + " expands properly with '10px 20px'" );

		expected[ keys[2] ] = "30px";
		result = hook.expand( "10px 20px 30px" );
		deepEqual( result, expected, property + " expands properly with '10px 20px 30px'" );

		expected[ keys[3] ] = "40px";
		result = hook.expand( "10px 20px 30px 40px" );
		deepEqual( result, expected, property + " expands properly with '10px 20px 30px 40px'" );

	});

});

}
