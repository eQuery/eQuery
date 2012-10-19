module("core", { teardown: moduleTeardown });

test("Unit Testing Environment", function () {
	expect(2);
	ok( hasPHP, "Running in an environment with PHP support. The AJAX tests only run if the environment supports PHP!" );
	ok( !isLocal, "Unit tests are not ran from file:// (especially in Chrome. If you must test from file:// with Chrome, run it with the --allow-file-access-from-files flag!)" );
});

test("Basic requirements", function() {
	expect(7);
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( eQuery, "eQuery" );
	ok( €, "€" );
});

test("eQuery()", function() {

	var elem, i,
		obj = eQuery("div"),
		main = eQuery("#qunit-fixture"),
		code = eQuery("<code/>"),
		img = eQuery("<img/>"),
		div = eQuery("<div/><hr/><code/><b/>"),
		exec = false,
		lng = "",
		expected = 26,
		attrObj = {
			"click": function() { ok( exec, "Click executed." ); },
			"text": "test",
			"class": "test2",
			"id": "test3"
		};

	// The €(html, props) signature can stealth-call any €.fn method, check for a
	// few here but beware of modular builds where these methods may be excluded.
	if ( eQuery.fn.width ) {
		expected++;
		attrObj["width"] = 10;
	}
	if ( eQuery.fn.offset ) {
		expected++;
		attrObj["offset"] = { "top": 1, "left": 1 };
	}
	if ( eQuery.fn.css ) {
		expected += 2;
		attrObj["css"] = { "paddingLeft": 1, "paddingRight": 1 };
	}
	if ( eQuery.fn.attr ) {
		expected++;
		attrObj.attr = { "desired": "very" };
	}

	expect( expected );

	// Basic constructor's behavior
	equal( eQuery().length, 0, "eQuery() === eQuery([])" );
	equal( eQuery(undefined).length, 0, "eQuery(undefined) === eQuery([])" );
	equal( eQuery(null).length, 0, "eQuery(null) === eQuery([])" );
	equal( eQuery("").length, 0, "eQuery('') === eQuery([])" );
	equal( eQuery("#").length, 0, "eQuery('#') === eQuery([])" );

	equal( eQuery(obj).selector, "div", "eQuery(eQueryObj) == eQueryObj" );

	// can actually yield more than one, when iframes are included, the window is an array as well
	equal( eQuery(window).length, 1, "Correct number of elements generated for eQuery(window)" );

	deepEqual( eQuery("div p", main).get(), q("sndp", "en", "sap"), "Basic selector with eQuery object as context" );

/*
	// disabled since this test was doing nothing. i tried to fix it but i'm not sure
	// what the expected behavior should even be. FF returns "\n" for the text node
	// make sure this is handled
	var crlfContainer = eQuery('<p>\r\n</p>');
	var x = crlfContainer.contents().get(0).nodeValue;
	equal( x, what???, "Check for \\r and \\n in eQuery()" );
*/

	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		eQuery("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	ok( pass, "eQuery('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see #968" );*/

	equal( code.length, 1, "Correct number of elements generated for code" );
	equal( code.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( img.length, 1, "Correct number of elements generated for img" );
	equal( img.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( div.length, 4, "Correct number of elements generated for div hr code b" );
	equal( div.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( eQuery([1,2,3]).get(1), 2, "Test passing an array to the factory" );

	equal( eQuery(document.body).get(0), eQuery("body").get(0), "Test passing an html node to the factory" );

	elem = eQuery("<div/>", attrObj );

	if ( eQuery.fn.width ) {
		equal( elem[0].style.width, "10px", "eQuery() quick setter width");
	}

	if ( eQuery.fn.offset ) {
		equal( elem[0].style.top, "1px", "eQuery() quick setter offset");
	}

	if ( eQuery.fn.css ) {
		equal( elem[0].style.paddingLeft, "1px", "eQuery quick setter css");
		equal( elem[0].style.paddingRight, "1px", "eQuery quick setter css");
	}

	if ( eQuery.fn.attr ) {
		equal( elem[0].getAttribute("desired"), "very", "eQuery quick setter attr");
	}

	equal( elem[0].childNodes.length, 1, "eQuery quick setter text");
	equal( elem[0].firstChild.nodeValue, "test", "eQuery quick setter text");
	equal( elem[0].className, "test2", "eQuery() quick setter class");
	equal( elem[0].id, "test3", "eQuery() quick setter id");

	exec = true;
	elem.click();

	// manually clean up detached elements
	elem.remove();

	for ( i = 0; i < 3; ++i ) {
		elem = eQuery("<input type='text' value='TEST' />");
	}
	equal( elem[0].defaultValue, "TEST", "Ensure cached nodes are cloned properly (Bug #6655)" );

	// manually clean up detached elements
	elem.remove();

	equal( eQuery(" <div/> ").length, 1, "Make sure whitespace is trimmed." );
	equal( eQuery(" a<div/>b ").length, 1, "Make sure whitespace and other characters are trimmed." );

	for ( i = 0; i < 128; i++ ) {
		lng += "12345678";
	}

	equal( eQuery(" <div>" + lng + "</div> ").length, 1, "Make sure whitespace is trimmed on long strings." );
	equal( eQuery(" a<div>" + lng + "</div>b ").length, 1, "Make sure whitespace and other characters are trimmed on long strings." );
});

test("selector state", function() {
	expect(31);

	var test;

	test = eQuery(undefined);
	equal( test.selector, "", "Empty eQuery Selector" );
	equal( test.context, undefined, "Empty eQuery Context" );

	test = eQuery(document);
	equal( test.selector, "", "Document Selector" );
	equal( test.context, document, "Document Context" );

	test = eQuery(document.body);
	equal( test.selector, "", "Body Selector" );
	equal( test.context, document.body, "Body Context" );

	test = eQuery("#qunit-fixture");
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document, "#qunit-fixture Context" );

	test = eQuery("#notfoundnono");
	equal( test.selector, "#notfoundnono", "#notfoundnono Selector" );
	equal( test.context, document, "#notfoundnono Context" );

	test = eQuery("#qunit-fixture", document);
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document, "#qunit-fixture Context" );

	test = eQuery("#qunit-fixture", document.body);
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document.body, "#qunit-fixture Context" );

	// Test cloning
	test = eQuery(test);
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document.body, "#qunit-fixture Context" );

	test = eQuery(document.body).find("#qunit-fixture");
	equal( test.selector, "#qunit-fixture", "#qunit-fixture find Selector" );
	equal( test.context, document.body, "#qunit-fixture find Context" );

	test = eQuery("#qunit-fixture").filter("div");
	equal( test.selector, "#qunit-fixture.filter(div)", "#qunit-fixture filter Selector" );
	equal( test.context, document, "#qunit-fixture filter Context" );

	test = eQuery("#qunit-fixture").not("div");
	equal( test.selector, "#qunit-fixture.not(div)", "#qunit-fixture not Selector" );
	equal( test.context, document, "#qunit-fixture not Context" );

	test = eQuery("#qunit-fixture").filter("div").not("div");
	equal( test.selector, "#qunit-fixture.filter(div).not(div)", "#qunit-fixture filter, not Selector" );
	equal( test.context, document, "#qunit-fixture filter, not Context" );

	test = eQuery("#qunit-fixture").filter("div").not("div").end();
	equal( test.selector, "#qunit-fixture.filter(div)", "#qunit-fixture filter, not, end Selector" );
	equal( test.context, document, "#qunit-fixture filter, not, end Context" );

	test = eQuery("#qunit-fixture").parent("body");
	equal( test.selector, "#qunit-fixture.parent(body)", "#qunit-fixture parent Selector" );
	equal( test.context, document, "#qunit-fixture parent Context" );

	test = eQuery("#qunit-fixture").eq(0);
	equal( test.selector, "#qunit-fixture.slice(0,1)", "#qunit-fixture eq Selector" );
	equal( test.context, document, "#qunit-fixture eq Context" );

	var d = "<div />";
	equal(
		eQuery(d).appendTo(eQuery(d)).selector,
		eQuery(d).appendTo(d).selector,
		"manipulation methods make same selector for eQuery objects"
	);
});

test( "globalEval", function() {

	expect( 3 );

	eQuery.globalEval( "var globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test variable declarations are global" );

	window.globalEvalTest = false;

	eQuery.globalEval( "globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test variable assignments are global" );

	window.globalEvalTest = false;

	eQuery.globalEval( "this.globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test context (this) is the window object" );

	window.globalEvalTest = undefined;
});

test("noConflict", function() {
	expect(7);

	var €€ = eQuery;

	equal( eQuery, eQuery.noConflict(), "noConflict returned the eQuery object" );
	equal( window["eQuery"], €€, "Make sure eQuery wasn't touched." );
	equal( window["€"], original€, "Make sure € was reverted." );

	eQuery = € = €€;

	equal( eQuery.noConflict(true), €€, "noConflict returned the eQuery object" );
	equal( window["eQuery"], originaleQuery, "Make sure eQuery was reverted." );
	equal( window["€"], original€, "Make sure € was reverted." );
	ok( €€("#qunit-fixture").html("test"), "Make sure that eQuery still works." );

	window["eQuery"] = eQuery = €€;
});

test("trim", function() {
	expect(13);

	var nbsp = String.fromCharCode(160);

	equal( eQuery.trim("hello  "), "hello", "trailing space" );
	equal( eQuery.trim("  hello"), "hello", "leading space" );
	equal( eQuery.trim("  hello   "), "hello", "space on both sides" );
	equal( eQuery.trim("  " + nbsp + "hello  " + nbsp + " "), "hello", "&nbsp;" );

	equal( eQuery.trim(), "", "Nothing in." );
	equal( eQuery.trim( undefined ), "", "Undefined" );
	equal( eQuery.trim( null ), "", "Null" );
	equal( eQuery.trim( 5 ), "5", "Number" );
	equal( eQuery.trim( false ), "false", "Boolean" );

	equal( eQuery.trim(" "), "", "space should be trimmed" );
	equal( eQuery.trim("ipad\xA0"), "ipad", "nbsp should be trimmed" );
	equal( eQuery.trim("\uFEFF"), "", "zwsp should be trimmed" );
	equal( eQuery.trim("\uFEFF \xA0! | \uFEFF"), "! |", "leading/trailing should be trimmed" );
});

test("type", function() {
	expect(23);

	equal( eQuery.type(null), "null", "null" );
	equal( eQuery.type(undefined), "undefined", "undefined" );
	equal( eQuery.type(true), "boolean", "Boolean" );
	equal( eQuery.type(false), "boolean", "Boolean" );
	equal( eQuery.type(Boolean(true)), "boolean", "Boolean" );
	equal( eQuery.type(0), "number", "Number" );
	equal( eQuery.type(1), "number", "Number" );
	equal( eQuery.type(Number(1)), "number", "Number" );
	equal( eQuery.type(""), "string", "String" );
	equal( eQuery.type("a"), "string", "String" );
	equal( eQuery.type(String("a")), "string", "String" );
	equal( eQuery.type({}), "object", "Object" );
	equal( eQuery.type(/foo/), "regexp", "RegExp" );
	equal( eQuery.type(new RegExp("asdf")), "regexp", "RegExp" );
	equal( eQuery.type([1]), "array", "Array" );
	equal( eQuery.type(new Date()), "date", "Date" );
	equal( eQuery.type(new Function("return;")), "function", "Function" );
	equal( eQuery.type(function(){}), "function", "Function" );
	equal( eQuery.type(window), "object", "Window" );
	equal( eQuery.type(document), "object", "Document" );
	equal( eQuery.type(document.body), "object", "Element" );
	equal( eQuery.type(document.createTextNode("foo")), "object", "TextNode" );
	equal( eQuery.type(document.getElementsByTagName("*")), "object", "NodeList" );
});

asyncTest("isPlainObject", function() {
	expect(15);

	var iframe;

	// The use case that we want to match
	ok(eQuery.isPlainObject({}), "{}");

	// Not objects shouldn't be matched
	ok(!eQuery.isPlainObject(""), "string");
	ok(!eQuery.isPlainObject(0) && !eQuery.isPlainObject(1), "number");
	ok(!eQuery.isPlainObject(true) && !eQuery.isPlainObject(false), "boolean");
	ok(!eQuery.isPlainObject(null), "null");
	ok(!eQuery.isPlainObject(undefined), "undefined");

	// Arrays shouldn't be matched
	ok(!eQuery.isPlainObject([]), "array");

	// Instantiated objects shouldn't be matched
	ok(!eQuery.isPlainObject(new Date()), "new Date");

	var fnplain = function(){};

	// Functions shouldn't be matched
	ok(!eQuery.isPlainObject(fnplain), "fn");

	/** @constructor */
	var fn = function() {};

	// Again, instantiated objects shouldn't be matched
	ok(!eQuery.isPlainObject(new fn()), "new fn (no methods)");

	// Makes the function a little more realistic
	// (and harder to detect, incidentally)
	fn.prototype["someMethod"] = function(){};

	// Again, instantiated objects shouldn't be matched
	ok(!eQuery.isPlainObject(new fn()), "new fn");

	// DOM Element
	ok(!eQuery.isPlainObject(document.createElement("div")), "DOM Element");

	// Window
	ok(!eQuery.isPlainObject(window), "window");

	try {
		eQuery.isPlainObject( window.location );
		ok( true, "Does not throw exceptions on host objects");
	} catch ( e ) {
		ok( false, "Does not throw exceptions on host objects -- FAIL");
	}

	try {
		iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		window.iframeDone = function(otherObject){
			// Objects from other windows should be matched
			ok(eQuery.isPlainObject(new otherObject()), "new otherObject");
			document.body.removeChild( iframe );
			start();
		};

		var doc = iframe.contentDocument || iframe.contentWindow.document;
		doc.open();
		doc.write("<body onload='window.parent.iframeDone(Object);'>");
		doc.close();
	} catch(e) {
		document.body.removeChild( iframe );

		ok(true, "new otherObject - iframes not supported");
		start();
	}
});

test("isFunction", function() {
	expect(19);

	// Make sure that false values return false
	ok( !eQuery.isFunction(), "No Value" );
	ok( !eQuery.isFunction( null ), "null Value" );
	ok( !eQuery.isFunction( undefined ), "undefined Value" );
	ok( !eQuery.isFunction( "" ), "Empty String Value" );
	ok( !eQuery.isFunction( 0 ), "0 Value" );

	// Check built-ins
	// Safari uses "(Internal Function)"
	ok( eQuery.isFunction(String), "String Function("+String+")" );
	ok( eQuery.isFunction(Array), "Array Function("+Array+")" );
	ok( eQuery.isFunction(Object), "Object Function("+Object+")" );
	ok( eQuery.isFunction(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	var mystr = "function";
	ok( !eQuery.isFunction(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	var myarr = [ "function" ];
	ok( !eQuery.isFunction(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	var myfunction = { "function": "test" };
	ok( !eQuery.isFunction(myfunction), "Function Object" );

	// Make sure normal functions still work
	var fn = function(){};
	ok( eQuery.isFunction(fn), "Normal Function" );

	var obj = document.createElement("object");

	// Firefox says this is a function
	ok( !eQuery.isFunction(obj), "Object Element" );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( eQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	var nodes = document.body.childNodes;

	// Safari says this is a function
	ok( !eQuery.isFunction(nodes), "childNodes Property" );

	var first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !eQuery.isFunction(first), "A normal DOM Element" );

	var input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( eQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	var a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !eQuery.isFunction(a), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme(callback){
		function fn(response){
			callback(response);
		}

		ok( eQuery.isFunction(fn), "Recursive Function Call" );

		fn({ some: "data" });
	}

	callme(function(){
		callme(function(){});
	});
});

test( "isNumeric", function() {
	expect( 36 );

	var t = eQuery.isNumeric,
		Traditionalists = /** @constructor */ function(n) {
			this.value = n;
			this.toString = function(){
				return String(this.value);
			};
		},
		answer = new Traditionalists( "42" ),
		rong = new Traditionalists( "Devo" );

	ok( t("-10"), "Negative integer string");
	ok( t("0"), "Zero string");
	ok( t("5"), "Positive integer string");
	ok( t(-16), "Negative integer number");
	ok( t(0), "Zero integer number");
	ok( t(32), "Positive integer number");
	ok( t("040"), "Octal integer literal string");
	// OctalIntegerLiteral has been deprecated since ES3/1999
	// It doesn't pass lint, so disabling until a solution can be found
	//ok( t(0144), "Octal integer literal");
	ok( t("0xFF"), "Hexadecimal integer literal string");
	ok( t(0xFFF), "Hexadecimal integer literal");
	ok( t("-1.6"), "Negative floating point string");
	ok( t("4.536"), "Positive floating point string");
	ok( t(-2.6), "Negative floating point number");
	ok( t(3.1415), "Positive floating point number");
	ok( t(8e5), "Exponential notation");
	ok( t("123e-2"), "Exponential notation string");
	ok( t(answer), "Custom .toString returning number");
	equal( t(""), false, "Empty string");
	equal( t("        "), false, "Whitespace characters string");
	equal( t("\t\t"), false, "Tab characters string");
	equal( t("abcdefghijklm1234567890"), false, "Alphanumeric character string");
	equal( t("xabcdefx"), false, "Non-numeric character string");
	equal( t(true), false, "Boolean true literal");
	equal( t(false), false, "Boolean false literal");
	equal( t("bcfed5.2"), false, "Number with preceding non-numeric characters");
	equal( t("7.2acdgs"), false, "Number with trailling non-numeric characters");
	equal( t(undefined), false, "Undefined value");
	equal( t(null), false, "Null value");
	equal( t(NaN), false, "NaN value");
	equal( t(Infinity), false, "Infinity primitive");
	equal( t(Number.POSITIVE_INFINITY), false, "Positive Infinity");
	equal( t(Number.NEGATIVE_INFINITY), false, "Negative Infinity");
	equal( t(rong), false, "Custom .toString returning non-number");
	equal( t({}), false, "Empty object");
	equal( t(function(){} ), false, "Instance of a function");
	equal( t( new Date() ), false, "Instance of a Date");
	equal( t(function(){} ), false, "Instance of a function");
});

test("isXMLDoc - HTML", function() {
	expect(4);

	ok( !eQuery.isXMLDoc( document ), "HTML document" );
	ok( !eQuery.isXMLDoc( document.documentElement ), "HTML documentElement" );
	ok( !eQuery.isXMLDoc( document.body ), "HTML Body Element" );

	var iframe = document.createElement("iframe");
	document.body.appendChild( iframe );

	try {
		var body = eQuery(iframe).contents()[0];

		try {
			ok( !eQuery.isXMLDoc( body ), "Iframe body element" );
		} catch(e) {
			ok( false, "Iframe body element exception" );
		}

	} catch(e) {
		ok( true, "Iframe body element - iframe not working correctly" );
	}

	document.body.removeChild( iframe );
});

test("XSS via location.hash", function() {
	expect(1);

	stop();
	eQuery["_check9521"] = function(x){
		ok( x, "script called from #id-like selector with inline handler" );
		eQuery("#check9521").remove();
		delete eQuery["_check9521"];
		start();
	};
	try {
		// This throws an error because it's processed like an id
		eQuery( "#<img id='check9521' src='no-such-.gif' onerror='eQuery._check9521(false)'>" ).appendTo("#qunit-fixture");
	} catch (err) {
		eQuery["_check9521"](true);
	}
});

test("isXMLDoc - XML", function() {
	expect(3);
	var xml = createDashboardXML();
	ok( eQuery.isXMLDoc( xml ), "XML document" );
	ok( eQuery.isXMLDoc( xml.documentElement ), "XML documentElement" );
	ok( eQuery.isXMLDoc( eQuery("tab", xml)[0] ), "XML Tab Element" );
});

test("isWindow", function() {
	expect( 14 );

	ok( eQuery.isWindow(window), "window" );
	ok( eQuery.isWindow(document.getElementsByTagName("iframe")[0].contentWindow), "iframe.contentWindow" );
	ok( !eQuery.isWindow(), "empty" );
	ok( !eQuery.isWindow(null), "null" );
	ok( !eQuery.isWindow(undefined), "undefined" );
	ok( !eQuery.isWindow(document), "document" );
	ok( !eQuery.isWindow(document.documentElement), "documentElement" );
	ok( !eQuery.isWindow(""), "string" );
	ok( !eQuery.isWindow(1), "number" );
	ok( !eQuery.isWindow(true), "boolean" );
	ok( !eQuery.isWindow({}), "object" );
	ok( !eQuery.isWindow({ setInterval: function(){} }), "fake window" );
	ok( !eQuery.isWindow(/window/), "regexp" );
	ok( !eQuery.isWindow(function(){}), "function" );
});

test("eQuery('html')", function() {
	expect( 15 );

	QUnit.reset();
	eQuery["foo"] = false;
	var s = eQuery("<script>eQuery.foo='test';</script>")[0];
	ok( s, "Creating a script" );
	ok( !eQuery["foo"], "Make sure the script wasn't executed prematurely" );
	eQuery("body").append("<script>eQuery.foo='test';</script>");
	ok( eQuery["foo"], "Executing a scripts contents in the right context" );

	// Test multi-line HTML
	var div = eQuery("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>")[0];
	equal( div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div." );
	equal( div.firstChild.nodeType, 3, "Text node." );
	equal( div.lastChild.nodeType, 3, "Text node." );
	equal( div.childNodes[1].nodeType, 1, "Paragraph." );
	equal( div.childNodes[1].firstChild.nodeType, 3, "Paragraph text." );

	QUnit.reset();
	ok( eQuery("<link rel='stylesheet'/>")[0], "Creating a link" );

	ok( !eQuery("<script/>")[0].parentNode, "Create a script" );

	ok( eQuery("<input/>").attr("type", "hidden"), "Create an input and set the type." );

	var j = eQuery("<span>hi</span> there <!-- mon ami -->");
	ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	ok( !eQuery("<option>test</option>")[0].selected, "Make sure that options are auto-selected #2050" );

	ok( eQuery("<div></div>")[0], "Create a div with closing tag." );
	ok( eQuery("<table></table>")[0], "Create a table with closing tag." );

	// equal( eQuery("element[attribute='<div></div>']").length, 0, "When html is within brackets, do not recognize as html." );
	// equal( eQuery("element[attribute=<div></div>]").length, 0, "When html is within brackets, do not recognize as html." );
	// equal( eQuery("element:not(<div></div>)").length, 0, "When html is within parens, do not recognize as html." );
	// equal( eQuery("\\<div\\>").length, 0, "Ignore escaped html characters" );
});

test("eQuery('massive html #7990')", function() {
	expect( 3 );

	var i;
	var li = "<li>very very very very large html string</li>";
	var html = ["<ul>"];
	for ( i = 0; i < 30000; i += 1 ) {
		html[html.length] = li;
	}
	html[html.length] = "</ul>";
	html = eQuery(html.join(""))[0];
	equal( html.nodeName.toLowerCase(), "ul");
	equal( html.firstChild.nodeName.toLowerCase(), "li");
	equal( html.childNodes.length, 30000 );
});

test("eQuery('html', context)", function() {
	expect(1);

	var €div = eQuery("<div/>")[0];
	var €span = eQuery("<span/>", €div);
	equal(€span.length, 1, "Verify a span created with a div context works, #1763");
});

test("eQuery(selector, xml).text(str) - Loaded via XML document", function() {
	expect(2);

	var xml = createDashboardXML();
	// tests for #1419 where IE was a problem
	var tab = eQuery("tab", xml).eq(0);
	equal( tab.text(), "blabla", "Verify initial text correct" );
	tab.text("newtext");
	equal( tab.text(), "newtext", "Verify new text correct" );
});

test("end()", function() {
	expect(3);
	equal( "Yahoo", eQuery("#yahoo").parent().end().text(), "Check for end" );
	ok( eQuery("#yahoo").end(), "Check for end with nothing to end" );

	var x = eQuery("#yahoo");
	x.parent();
	equal( "Yahoo", eQuery("#yahoo").text(), "Check for non-destructive behaviour" );
});

test("length", function() {
	expect(1);
	equal( eQuery("#qunit-fixture p").length, 6, "Get Number of Elements Found" );
});

test("size()", function() {
	expect(1);
	equal( eQuery("#qunit-fixture p").size(), 6, "Get Number of Elements Found" );
});

test("get()", function() {
	expect(1);
	deepEqual( eQuery("#qunit-fixture p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("toArray()", function() {
	expect(1);
	deepEqual( eQuery("#qunit-fixture p").toArray(),
		q("firstp","ap","sndp","en","sap","first"),
		"Convert eQuery object to an Array" );
});

test("inArray()", function() {
	expect(19);

	var selections = {
		p:   q("firstp", "sap", "ap", "first"),
		em:  q("siblingnext", "siblingfirst"),
		div: q("qunit-testrunner-toolbar", "nothiddendiv", "nothiddendivchild", "foo"),
		a:   q("mark", "groups", "google", "simon1"),
		empty: []
	},
	tests = {
		p:    { elem: eQuery("#ap")[0],           index: 2 },
		em:   { elem: eQuery("#siblingfirst")[0], index: 1 },
		div:  { elem: eQuery("#nothiddendiv")[0], index: 1 },
		a:    { elem: eQuery("#simon1")[0],       index: 3 }
	},
	falseTests = {
		p:  eQuery("#liveSpan1")[0],
		em: eQuery("#nothiddendiv")[0],
		empty: ""
	};

	eQuery.each( tests, function( key, obj ) {
		equal( eQuery.inArray( obj.elem, selections[ key ] ), obj.index, "elem is in the array of selections of its tag" );
		// Third argument (fromIndex)
		equal( !!~eQuery.inArray( obj.elem, selections[ key ], 5 ), false, "elem is NOT in the array of selections given a starting index greater than its position" );
		equal( !!~eQuery.inArray( obj.elem, selections[ key ], 1 ), true, "elem is in the array of selections given a starting index less than or equal to its position" );
		equal( !!~eQuery.inArray( obj.elem, selections[ key ], -3 ), true, "elem is in the array of selections given a negative index" );
	});

	eQuery.each( falseTests, function( key, elem ) {
		equal( !!~eQuery.inArray( elem, selections[ key ] ), false, "elem is NOT in the array of selections" );
	});

});

test("get(Number)", function() {
	expect(2);
	equal( eQuery("#qunit-fixture p").get(0), document.getElementById("firstp"), "Get A Single Element" );
	strictEqual( eQuery("#firstp").get(1), undefined, "Try get with index larger elements count" );
});

test("get(-Number)",function() {
	expect(2);
	equal( eQuery("p").get(-1), document.getElementById("first"), "Get a single element with negative index" );
	strictEqual( eQuery("#firstp").get(-2), undefined, "Try get with index negative index larger then elements count" );
});

test("each(Function)", function() {
	expect(1);
	var div = eQuery("div");
	div.each(function(){this.foo = "zoo";});
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).foo != "zoo" ) {
			pass = false;
		}
	}
	ok( pass, "Execute a function, Relative" );
});

test("slice()", function() {
	expect(7);

	var €links = eQuery("#ap a");

	deepEqual( €links.slice(1,2).get(), q("groups"), "slice(1,2)" );
	deepEqual( €links.slice(1).get(), q("groups", "anchor1", "mark"), "slice(1)" );
	deepEqual( €links.slice(0,3).get(), q("google", "groups", "anchor1"), "slice(0,3)" );
	deepEqual( €links.slice(-1).get(), q("mark"), "slice(-1)" );

	deepEqual( €links.eq(1).get(), q("groups"), "eq(1)" );
	deepEqual( €links.eq("2").get(), q("anchor1"), "eq('2')" );
	deepEqual( €links.eq(-1).get(), q("mark"), "eq(-1)" );
});

test("first()/last()", function() {
	expect(4);

	var €links = eQuery("#ap a"), €none = eQuery("asdf");

	deepEqual( €links.first().get(), q("google"), "first()" );
	deepEqual( €links.last().get(), q("mark"), "last()" );

	deepEqual( €none.first().get(), [], "first() none" );
	deepEqual( €none.last().get(), [], "last() none" );
});

test("map()", function() {
	expect(8);

	deepEqual(
		eQuery("#ap").map(function(){
			return eQuery(this).find("a").get();
		}).get(),
		q("google", "groups", "anchor1", "mark"),
		"Array Map"
	);

	deepEqual(
		eQuery("#ap > a").map(function(){
			return this.parentNode;
		}).get(),
		q("ap","ap","ap"),
		"Single Map"
	);

	var keys, values, scripts, nonsense, mapped, flat;
	//for #2616
	keys = eQuery.map( {"a":1,"b":2}, function( v, k ){
		return k;
	});
	equal( keys.join(""), "ab", "Map the keys from a hash to an array" );

	values = eQuery.map( {a:1,b:2}, function( v, k ){
		return v;
	});
	equal( values.join(""), "12", "Map the values from a hash to an array" );

	// object with length prop
	values = eQuery.map( {a:1,b:2, length:3}, function( v, k ){
		return v;
	});
	equal( values.join(""), "123", "Map the values from a hash with a length property to an array" );

	scripts = document.getElementsByTagName("script");
	mapped = eQuery.map( scripts, function( v, k ){
		return v;
	});
	equal( mapped.length, scripts.length, "Map an array(-like) to a hash" );

	nonsense = document.getElementsByTagName("asdf");
	mapped = eQuery.map( nonsense, function( v, k ){
		return v;
	});
	equal( mapped.length, nonsense.length, "Map an empty array(-like) to a hash" );

	flat = eQuery.map( Array(4), function( v, k ){
		return k % 2 ? k : [k,k,k];//try mixing array and regular returns
	});
	equal( flat.join(""), "00012223", "try the new flatten technique(#2616)" );
});

test("eQuery.merge()", function() {
	expect(8);

	var parse = eQuery.merge;

	deepEqual( parse([],[]), [], "Empty arrays" );

	deepEqual( parse([1],[2]), [1,2], "Basic" );
	deepEqual( parse([1,2],[3,4]), [1,2,3,4], "Basic" );

	deepEqual( parse([1,2],[]), [1,2], "Second empty" );
	deepEqual( parse([],[1,2]), [1,2], "First empty" );

	// Fixed at [5998], #3641
	deepEqual( parse([-2,-1], [0,1,2]), [-2,-1,0,1,2], "Second array including a zero (falsy)");

	// After fixing #5527
	deepEqual( parse([], [null, undefined]), [null, undefined], "Second array including null and undefined values");
	deepEqual( parse({"length":0}, [1,2]), {length:2, 0:1, 1:2}, "First array like");
});

test("eQuery.extend(Object, Object)", function() {
	expect(28);

	var settings = { "xnumber1": 5, "xnumber2": 7, "xstring1": "peter", "xstring2": "pan" },
		options = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		optionsCopy = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		merged = { "xnumber1": 5, "xnumber2": 1, "xstring1": "peter", "xstring2": "x", "xxx": "newstring" },
		deep1 = { "foo": { "bar": true } },
		deep1copy = { "foo": { "bar": true } },
		deep2 = { "foo": { "baz": true }, "foo2": document },
		deep2copy = { "foo": { "baz": true }, "foo2": document },
		deepmerged = { "foo": { "bar": true, "baz": true }, "foo2": document },
		arr = [1, 2, 3],
		nestedarray = { "arr": arr };

	eQuery.extend(settings, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	eQuery.extend(settings, null, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	eQuery.extend(true, deep1, deep2);
	deepEqual( deep1["foo"], deepmerged["foo"], "Check if foo: settings must be extended" );
	deepEqual( deep2["foo"], deep2copy["foo"], "Check if not deep2: options must not be modified" );
	equal( deep1["foo2"], document, "Make sure that a deep clone was not attempted on the document" );

	ok( eQuery.extend(true, {}, nestedarray)["arr"] !== arr, "Deep extend of object must clone child array" );

	// #5991
	ok( eQuery.isArray( eQuery.extend(true, { "arr": {} }, nestedarray)["arr"] ), "Cloned array heve to be an Array" );
	ok( eQuery.isPlainObject( eQuery.extend(true, { "arr": arr }, { "arr": {} })["arr"] ), "Cloned object heve to be an plain object" );

	var empty = {};
	var optionsWithLength = { "foo": { "length": -1 } };
	eQuery.extend(true, empty, optionsWithLength);
	deepEqual( empty["foo"], optionsWithLength["foo"], "The length property must copy correctly" );

	empty = {};
	var optionsWithDate = { "foo": { "date": new Date() } };
	eQuery.extend(true, empty, optionsWithDate);
	deepEqual( empty["foo"], optionsWithDate["foo"], "Dates copy correctly" );

	/** @constructor */
	var myKlass = function() {};
	var customObject = new myKlass();
	var optionsWithCustomObject = { "foo": { "date": customObject } };
	empty = {};
	eQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty["foo"] && empty["foo"]["date"] === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { "someMethod": function(){} };
	empty = {};
	eQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty["foo"] && empty["foo"]["date"] === customObject, "Custom objects copy correctly" );

	var MyNumber = Number;
	var ret = eQuery.extend(true, { "foo": 4 }, { "foo": new MyNumber(5) } );
	ok( ret.foo == 5, "Wrapped numbers copy correctly" );

	var nullUndef;
	nullUndef = eQuery.extend({}, options, { "xnumber2": null });
	ok( nullUndef["xnumber2"] === null, "Check to make sure null values are copied");

	nullUndef = eQuery.extend({}, options, { "xnumber2": undefined });
	ok( nullUndef["xnumber2"] === options["xnumber2"], "Check to make sure undefined values are not copied");

	nullUndef = eQuery.extend({}, options, { "xnumber0": null });
	ok( nullUndef["xnumber0"] === null, "Check to make sure null values are inserted");

	var target = {};
	var recursive = { foo:target, bar:5 };
	eQuery.extend(true, target, recursive);
	deepEqual( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	ret = eQuery.extend(true, { foo: [] }, { foo: [0] } ); // 1907
	equal( ret.foo.length, 1, "Check to make sure a value with coersion 'false' copies over when necessary to fix #1907" );

	ret = eQuery.extend(true, { foo: "1,2,3" }, { foo: [1, 2, 3] } );
	ok( typeof ret.foo != "string", "Check to make sure values equal with coersion (but not actually equal) overwrite correctly" );

	ret = eQuery.extend(true, { foo:"bar" }, { foo:null } );
	ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for #1908" );

	var obj = { foo:null };
	eQuery.extend(true, obj, { foo:"notnull" } );
	equal( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	eQuery.extend(func, { key: "value" } );
	equal( func.key, "value", "Verify a function can be extended" );

	var defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options1 = { xnumber2: 1, xstring2: "x" },
		options1Copy = { xnumber2: 1, xstring2: "x" },
		options2 = { xstring2: "xx", xxx: "newstringx" },
		options2Copy = { xstring2: "xx", xxx: "newstringx" },
		merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	settings = eQuery.extend({}, defaults, options1, options2);
	deepEqual( settings, merged2, "Check if extended: settings must be extended" );
	deepEqual( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	deepEqual( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	deepEqual( options2, options2Copy, "Check if not modified: options2 must not be modified" );
});

test("eQuery.each(Object,Function)", function() {
	expect(14);
	eQuery.each( [0,1,2], function(i, n){
		equal( i, n, "Check array iteration" );
	});

	eQuery.each( [5,6,7], function(i, n){
		equal( i, n - 5, "Check array iteration" );
	});

	eQuery.each( { name: "name", lang: "lang" }, function(i, n){
		equal( i, n, "Check object iteration" );
	});

	var total = 0;
	eQuery.each([1,2,3], function(i,v){ total += v; });
	equal( total, 6, "Looping over an array" );
	total = 0;
	eQuery.each([1,2,3], function(i,v){
		total += v;
		if ( i == 1 ) {
			return false;
		}
	});
	equal( total, 3, "Looping over an array, with break" );
	total = 0;
	eQuery.each({"a":1,"b":2,"c":3}, function(i,v){ total += v; });
	equal( total, 6, "Looping over an object" );
	total = 0;
	eQuery.each({"a":3,"b":3,"c":3}, function(i,v){ total += v; return false; });
	equal( total, 3, "Looping over an object, with break" );

	var f = function(){};
	f.foo = "bar";
	eQuery.each(f, function(i){
		f[i] = "baz";
	});
	equal( "baz", f.foo, "Loop over a function" );

	var stylesheet_count = 0;
	eQuery.each(document.styleSheets, function(i){
		stylesheet_count++;
	});
	equal(stylesheet_count, 2, "should not throw an error in IE while looping over document.styleSheets and return proper amount");

});

test("eQuery.makeArray", function(){
	expect(17);

	equal( eQuery.makeArray(eQuery("html>*"))[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a eQuery object" );

	equal( eQuery.makeArray(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

	equal( (function(arg1, arg2){ return eQuery.makeArray(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );

	equal( eQuery.makeArray([1,2,3]).join(""), "123", "Pass makeArray a real array" );

	equal( eQuery.makeArray().length, 0, "Pass nothing to makeArray and expect an empty array" );

	equal( eQuery.makeArray( 0 )[0], 0 , "Pass makeArray a number" );

	equal( eQuery.makeArray( "foo" )[0], "foo", "Pass makeArray a string" );

	equal( eQuery.makeArray( true )[0].constructor, Boolean, "Pass makeArray a boolean" );

	equal( eQuery.makeArray( document.createElement("div") )[0].nodeName.toUpperCase(), "DIV", "Pass makeArray a single node" );

	equal( eQuery.makeArray( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );

	ok( !!eQuery.makeArray( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );

	// function, is tricky as it has length
	equal( eQuery.makeArray( function(){ return 1;} )[0](), 1, "Pass makeArray a function" );

	//window, also has length
	equal( eQuery.makeArray(window)[0], window, "Pass makeArray the window" );

	equal( eQuery.makeArray(/a/)[0].constructor, RegExp, "Pass makeArray a regex" );

	ok( eQuery.makeArray(document.getElementById("form")).length >= 13, "Pass makeArray a form (treat as elements)" );

	// For #5610
	deepEqual( eQuery.makeArray({length: "0"}), [], "Make sure object is coerced properly.");
	deepEqual( eQuery.makeArray({length: "5"}), [], "Make sure object is coerced properly.");
});

test("eQuery.inArray", function(){
	expect(3);

	equal( eQuery.inArray( 0, false ), -1 , "Search in 'false' as array returns -1 and doesn't throw exception" );

	equal( eQuery.inArray( 0, null ), -1 , "Search in 'null' as array returns -1 and doesn't throw exception" );

	equal( eQuery.inArray( 0, undefined ), -1 , "Search in 'undefined' as array returns -1 and doesn't throw exception" );
});

test("eQuery.isEmptyObject", function(){
	expect(2);

	equal(true, eQuery.isEmptyObject({}), "isEmptyObject on empty object literal" );
	equal(false, eQuery.isEmptyObject({a:1}), "isEmptyObject on non-empty object literal" );

	// What about this ?
	// equal(true, eQuery.isEmptyObject(null), "isEmptyObject on null" );
});

test("eQuery.proxy", function(){
	expect(7);

	var test = function(){ equal( this, thisObject, "Make sure that scope is set properly." ); };
	var thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	eQuery.proxy( test, thisObject )();

	// Another take on it
	eQuery.proxy( thisObject, "method" )();

	// Make sure it doesn't freak out
	equal( eQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

	// Partial application
	var test2 = function( a ){ equal( a, "pre-applied", "Ensure arguments can be pre-applied." ); };
	eQuery.proxy( test2, null, "pre-applied" )();

	// Partial application w/ normal arguments
	var test3 = function( a, b ){ equal( b, "normal", "Ensure arguments can be pre-applied and passed as usual." ); };
	eQuery.proxy( test3, null, "pre-applied" )( "normal" );

	// Test old syntax
	var test4 = { "meth": function( a ){ equal( a, "boom", "Ensure old syntax works." ); } };
	eQuery.proxy( test4, "meth" )( "boom" );
});

test("eQuery.parseHTML", function() {
	expect( 11 );

	equal( eQuery.parseHTML(), null, "Nothing in, null out." );
	equal( eQuery.parseHTML( null ), null, "Nothing in, null out." );
	equal( eQuery.parseHTML( "" ), null, "Nothing in, null out." );
	raises(function() {
		eQuery.parseHTML( "<div>", document.getElementById("form") );
	}, "Passing an element as the context raises an exception (context should be a document)");

	var elems = eQuery.parseHTML( eQuery("body").html() );
	ok( elems.length > 10, "Parse a large html string" );
	equal( eQuery.type( elems ), "array", "parseHTML returns an array rather than a nodelist" );

	var script = "<script>undefined()</script>";
	equal( eQuery.parseHTML( script ).length, 0, "Passing a script is not allowed by default" );
	raises(function() {
		eQuery(eQuery.parseHTML( script, true )).appendTo("#qunit-fixture");
	}, "Passing a script is allowed if allowScripts is true");

	var html = script + "<div></div>";
	equal( eQuery.parseHTML( html )[0].nodeName.toLowerCase(), "div", "Ignore scripts by default" );
	raises(function() {
		eQuery(eQuery.parseHTML( html, true )).appendTo("#qunit-fixture");
	}, "Passing a script is allowed if allowScripts is true");

	equal( eQuery.parseHTML("text")[0].nodeType, 3, "Parsing text returns a text node" );
});

test("eQuery.parseJSON", function(){
	expect(8);

	raises(function() {
		eQuery.parseJSON();
	}, null, "parseJson now matches JSON.parse for empty input." );
	equal(eQuery.parseJSON( null ), null, "parseJson now matches JSON.parse on null input." );
	raises( function() {
		eQuery.parseJSON( "" );
	}, null, "parseJson now matches JSON.parse for empty strings." );

	deepEqual( eQuery.parseJSON("{}"), {}, "Plain object parsing." );
	deepEqual( eQuery.parseJSON("{\"test\":1}"), {"test":1}, "Plain object parsing." );

	deepEqual( eQuery.parseJSON("\n{\"test\":1}"), {"test":1}, "Make sure leading whitespaces are handled." );

	try {
		eQuery.parseJSON("{a:1}");
		ok( false, "Test malformed JSON string." );
	} catch( e ) {
		ok( true, "Test malformed JSON string." );
	}

	try {
		eQuery.parseJSON("{'a':1}");
		ok( false, "Test malformed JSON string." );
	} catch( e ) {
		ok( true, "Test malformed JSON string." );
	}
});

test("eQuery.parseXML", 8, function(){
	var xml, tmp;
	try {
		xml = eQuery.parseXML( "<p>A <b>well-formed</b> xml string</p>" );
		tmp = xml.getElementsByTagName( "p" )[ 0 ];
		ok( !!tmp, "<p> present in document" );
		tmp = tmp.getElementsByTagName( "b" )[ 0 ];
		ok( !!tmp, "<b> present in document" );
		strictEqual( tmp.childNodes[ 0 ].nodeValue, "well-formed", "<b> text is as expected" );
	} catch (e) {
		strictEqual( e, undefined, "unexpected error" );
	}
	try {
		xml = eQuery.parseXML( "<p>Not a <<b>well-formed</b> xml string</p>" );
		ok( false, "invalid xml not detected" );
	} catch( e ) {
		strictEqual( e.message, "Invalid XML: <p>Not a <<b>well-formed</b> xml string</p>", "invalid xml detected" );
	}
	try {
		xml = eQuery.parseXML( "" );
		strictEqual( xml, null, "empty string => null document" );
		xml = eQuery.parseXML();
		strictEqual( xml, null, "undefined string => null document" );
		xml = eQuery.parseXML( null );
		strictEqual( xml, null, "null string => null document" );
		xml = eQuery.parseXML( true );
		strictEqual( xml, null, "non-string => null document" );
	} catch( e ) {
		ok( false, "empty input throws exception" );
	}
});

// Skip this test because IE6 takes too long; reinstate in the compat plugin
if ( eQuery.sub_runs_too_slow_in_IE6 ) {

test("eQuery.sub() - Static Methods", function(){
	expect(18);
	var Subclass = eQuery.sub();
	Subclass.extend({
		"topLevelMethod": function() {return this.debug;},
		"debug": false,
		"config": {
			"locale": "en_US"
		},
		"setup": function(config) {
			this.extend(true, this["config"], config);
		}
	});
	Subclass.fn.extend({"subClassMethod": function() { return this;}});

	//Test Simple Subclass
	ok(Subclass["topLevelMethod"]() === false, "Subclass.topLevelMethod thought debug was true");
	ok(Subclass["config"]["locale"] == "en_US", Subclass["config"]["locale"] + " is wrong!");
	deepEqual(Subclass["config"]["test"], undefined, "Subclass.config.test is set incorrectly");
	equal(eQuery.ajax, Subclass.ajax, "The subclass failed to get all top level methods");

	//Create a SubSubclass
	var SubSubclass = Subclass.sub();

	//Make Sure the SubSubclass inherited properly
	ok(SubSubclass["topLevelMethod"]() === false, "SubSubclass.topLevelMethod thought debug was true");
	ok(SubSubclass["config"]["locale"] == "en_US", SubSubclass["config"]["locale"] + " is wrong!");
	deepEqual(SubSubclass["config"]["test"], undefined, "SubSubclass.config.test is set incorrectly");
	equal(eQuery.ajax, SubSubclass.ajax, "The subsubclass failed to get all top level methods");

	//Modify The Subclass and test the Modifications
	SubSubclass.fn.extend({"subSubClassMethod": function() { return this;}});
	SubSubclass["setup"]({"locale": "es_MX", "test": "worked"});
	SubSubclass["debug"] = true;
	SubSubclass.ajax = function() {return false;};
	ok(SubSubclass["topLevelMethod"](), "SubSubclass.topLevelMethod thought debug was false");
	deepEqual(SubSubclass(document)["subClassMethod"], Subclass.fn["subClassMethod"], "Methods Differ!");
	ok(SubSubclass["config"]["locale"] == "es_MX", SubSubclass["config"]["locale"] + " is wrong!");
	ok(SubSubclass["config"]["test"] == "worked", "SubSubclass.config.test is set incorrectly");
	notEqual(eQuery.ajax, SubSubclass.ajax, "The subsubclass failed to get all top level methods");

	//This shows that the modifications to the SubSubClass did not bubble back up to it's superclass
	ok(Subclass["topLevelMethod"]() === false, "Subclass.topLevelMethod thought debug was true");
	ok(Subclass["config"]["locale"] == "en_US", Subclass["config"]["locale"] + " is wrong!");
	deepEqual(Subclass["config"]["test"], undefined, "Subclass.config.test is set incorrectly");
	deepEqual(Subclass(document)["subSubClassMethod"], undefined, "subSubClassMethod set incorrectly");
	equal(eQuery.ajax, Subclass.ajax, "The subclass failed to get all top level methods");
});

test("eQuery.sub() - .fn Methods", function(){
	expect(378);

	var Subclass = eQuery.sub(),
			SubclassSubclass = Subclass.sub(),
			eQueryDocument = eQuery(document),
			selectors, contexts, methods, method, arg, description;

	eQueryDocument.toString = function(){ return "eQueryDocument"; };

	Subclass.fn.subclassMethod = function(){};
	SubclassSubclass.fn.subclassSubclassMethod = function(){};

	selectors = [
		"body",
		"html, body",
		"<div></div>"
	];

	contexts = [undefined, document, eQueryDocument];

	eQuery.expandedEach = eQuery.each;
	eQuery.each(selectors, function(i, selector){

		eQuery.expandedEach({ // all methods that return a new eQuery instance
			"eq": 1 ,
			"add": document,
			"end": undefined,
			"has": undefined,
			"closest": "div",
			"filter": document,
			"find": "div"
		}, function(method, arg){
			eQuery.each(contexts, function(i, context){

				description = "(\""+selector+"\", "+context+")."+method+"("+(arg||"")+")";

				deepEqual(
					(function(var_args){ return eQuery.fn[method].apply(eQuery(selector, context), arguments).subclassMethod; })(arg),
					undefined, "eQuery"+description+" doesn't have Subclass methods"
				);
				deepEqual(
					(function(var_args){ return eQuery.fn[method].apply(eQuery(selector, context), arguments).subclassSubclassMethod; })(arg),
					undefined, "eQuery"+description+" doesn't have SubclassSubclass methods"
				);
				deepEqual(
					Subclass(selector, context)[method](arg).subclassMethod, Subclass.fn.subclassMethod,
					"Subclass"+description+" has Subclass methods"
				);
				deepEqual(
					Subclass(selector, context)[method](arg).subclassSubclassMethod, undefined,
					"Subclass"+description+" doesn't have SubclassSubclass methods"
				);
				deepEqual(
					SubclassSubclass(selector, context)[method](arg).subclassMethod, Subclass.fn.subclassMethod,
					"SubclassSubclass"+description+" has Subclass methods"
				);
				deepEqual(
					SubclassSubclass(selector, context)[method](arg).subclassSubclassMethod, SubclassSubclass.fn.subclassSubclassMethod,
					"SubclassSubclass"+description+" has SubclassSubclass methods"
				);

			});
		});
	});

});

} // eQuery.sub

test("eQuery.camelCase()", function() {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla",
		"-ms-take": "msTake"
	};

	expect(7);

	eQuery.each( tests, function( key, val ) {
		equal( eQuery.camelCase( key ), val, "Converts: " + key + " => " + val );
	});
});

test( "JQuery.parseJSON() test internal parseJson (using fallback) to make sure that it throws like JSON.parse", function() {
	expect( 10 );

	var jsonParse = window.JSON;
	window.JSON = null;

	raises(function() {
		jsonParse.parse("''");
	});

	raises(function() {
		eQuery.parseJSON("''");
	});

	raises(function() {
		jsonParse.parse("");
	});

	raises(function() {
		eQuery.parseJSON("");
	});

	raises(function() {
		jsonParse.parse({});
	});

	raises(function() {
		eQuery.parseJSON({});
	});

	var parsedValue = jsonParse.parse(null);
	equal( parsedValue, null );

	parsedValue = eQuery.parseJSON(null);
	equal( parsedValue, null );

	parsedValue = jsonParse.parse("{}");
	equal( (typeof parsedValue === "object"), true );

	parsedValue = eQuery.parseJSON("{}");
	equal( (typeof parsedValue === "object"), true );
	

	window.JSON = jsonParse;
} );

