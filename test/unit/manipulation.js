module("manipulation", { teardown: moduleTeardown });

// Ensure that an extended Array prototype doesn't break eQuery
Array.prototype.arrayProtoFn = function(arg) { throw("arrayProtoFn should not be called"); };

var manipulationBareObj = function(value) { return value; };
var manipulationFunctionReturningObj = function(value) { return (function() { return value; }); };


/*
	======== local reference =======
	manipulationBareObj and manipulationFunctionReturningObj can be used to test passing functions to setters
	See testVal below for an example

	bareObj( value );
		This function returns whatever value is passed in

	functionReturningObj( value );
		Returns a function that returns the value
*/

test("text()", function() {
	expect(5);
	var expected = "This link has class=\"blog\": Simon Willison's Weblog";
	equal( eQuery("#sap").text(), expected, "Check for merged text of more then one element." );

	// Check serialization of text values
	equal( eQuery(document.createTextNode("foo")).text(), "foo", "Text node was retreived from .text()." );
	notEqual( eQuery(document).text(), "", "Retrieving text for the document retrieves all text (#10724).");

	// Retrieve from document fragments #10864
	var frag = document.createDocumentFragment();
		frag.appendChild( document.createTextNode("foo") );

	equal( eQuery( frag ).text(), "foo", "Document Fragment Text node was retreived from .text().");

	var €newLineTest = eQuery("<div>test<br/>testy</div>").appendTo("#moretests");
	€newLineTest.find("br").replaceWith("\n");
	equal( €newLineTest.text(), "test\ntesty", "text() does not remove new lines (#11153)" );

	€newLineTest.remove();
});

test("text(undefined)", function() {
	expect(1);
	equal( eQuery("#foo").text("<div").text(undefined)[0].innerHTML, "&lt;div", ".text(undefined) is chainable (#5571)" );
});

var testText = function(valueObj) {
	expect(4);
	var val = valueObj("<div><b>Hello</b> cruel world!</div>");
	equal( eQuery("#foo").text(val)[0].innerHTML.replace(/>/g, "&gt;"), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );

	// using contents will get comments regular, text, and comment nodes
	var j = eQuery("#nonnodes").contents();
	j.text(valueObj("hi!"));
	equal( eQuery(j[0]).text(), "hi!", "Check node,textnode,comment with text()" );
	equal( j[1].nodeValue, " there ", "Check node,textnode,comment with text()" );

	// Blackberry 4.6 doesn't maintain comments in the DOM
	equal( eQuery("#nonnodes")[0].childNodes.length < 3 ? 8 : j[2].nodeType, 8, "Check node,textnode,comment with text()" );
};

test("text(String)", function() {
	testText(manipulationBareObj);
});

test("text(Function)", function() {
	testText(manipulationFunctionReturningObj);
});

test("text(Function) with incoming value", function() {
	expect(2);

	var old = "This link has class=\"blog\": Simon Willison's Weblog";

	eQuery("#sap").text(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "foobar";
	});

	equal( eQuery("#sap").text(), "foobar", "Check for merged text of more then one element." );

	QUnit.reset();
});

var testWrap = function(val) {
	expect(19);
	var defaultText = "Try them out:";
	var result = eQuery("#first").wrap(val( "<div class='red'><span></span></div>" )).text();
	equal( defaultText, result, "Check for wrapping of on-the-fly html" );
	ok( eQuery("#first").parent().parent().is(".red"), "Check if wrapper has class 'red'" );

	QUnit.reset();
	result = eQuery("#first").wrap(val( document.getElementById("empty") )).parent();
	ok( result.is("ol"), "Check for element wrapping" );
	equal( result.text(), defaultText, "Check for element wrapping" );

	QUnit.reset();
	eQuery("#check1").click(function() {
		var checkbox = this;
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
		eQuery(checkbox).wrap(val( "<div id='c1' style='display:none;'></div>" ));
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
	}).click();

	// using contents will get comments regular, text, and comment nodes
	var j = eQuery("#nonnodes").contents();
	j.wrap(val( "<i></i>" ));

	// Blackberry 4.6 doesn't maintain comments in the DOM
	equal( eQuery("#nonnodes > i").length, eQuery("#nonnodes")[0].childNodes.length, "Check node,textnode,comment wraps ok" );
	equal( eQuery("#nonnodes > i").text(), j.text(), "Check node,textnode,comment wraps doesn't hurt text" );

	// Try wrapping a disconnected node
	var cacheLength = 0;
	for (var i in eQuery.cache) {
		cacheLength++;
	}

	j = eQuery("<label/>").wrap(val( "<li/>" ));
	equal( j[0].nodeName.toUpperCase(), "LABEL", "Element is a label" );
	equal( j[0].parentNode.nodeName.toUpperCase(), "LI", "Element has been wrapped" );

	for (i in eQuery.cache) {
		cacheLength--;
	}
	equal(cacheLength, 0, "No memory leak in eQuery.cache (bug #7165)");

	// Wrap an element containing a text node
	j = eQuery("<span/>").wrap("<div>test</div>");
	equal( j[0].previousSibling.nodeType, 3, "Make sure the previous node is a text element" );
	equal( j[0].parentNode.nodeName.toUpperCase(), "DIV", "And that we're in the div element." );

	// Try to wrap an element with multiple elements (should fail)
	j = eQuery("<div><span></span></div>").children().wrap("<p></p><div></div>");
	equal( j[0].parentNode.parentNode.childNodes.length, 1, "There should only be one element wrapping." );
	equal( j.length, 1, "There should only be one element (no cloning)." );
	equal( j[0].parentNode.nodeName.toUpperCase(), "P", "The span should be in the paragraph." );

	// Wrap an element with a eQuery set
	j = eQuery("<span/>").wrap(eQuery("<div></div>"));
	equal( j[0].parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	// Wrap an element with a eQuery set and event
	result = eQuery("<div></div>").click(function(){
		ok(true, "Event triggered.");

		// Remove handlers on detached elements
		result.unbind();
		eQuery(this).unbind();
	});

	j = eQuery("<span/>").wrap(result);
	equal( j[0].parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	j.parent().trigger("click");

	// clean up attached elements
	QUnit.reset();
};

test("wrap(String|Element)", function() {
	testWrap(manipulationBareObj);
});

test("wrap(Function)", function() {
	testWrap(manipulationFunctionReturningObj);
});

test("wrap(Function) with index (#10177)", function() {
	var expectedIndex = 0,
			targets = eQuery("#qunit-fixture p");

	expect(targets.length);
	targets.wrap(function(i) {
		equal( i, expectedIndex, "Check if the provided index (" + i + ") is as expected (" + expectedIndex + ")" );
		expectedIndex++;

		return "<div id='wrap_index_'" + i + "'></div>";
	});
});

test("wrap(String) consecutive elements (#10177)", function() {
	var targets = eQuery("#qunit-fixture p");

	expect(targets.length * 2);
	targets.wrap("<div class='wrapper'></div>");

	targets.each(function() {
		var €this = eQuery(this);

		ok( €this.parent().is(".wrapper"), "Check each elements parent is correct (.wrapper)" );
		equal( €this.siblings().length, 0, "Each element should be wrapped individually" );
	});
});

var testWrapAll = function(val) {
	expect(8);
	var prev = eQuery("#firstp")[0].previousSibling;
	var p = eQuery("#firstp,#first")[0].parentNode;

	var result = eQuery("#firstp,#first").wrapAll(val( "<div class='red'><div class='tmp'></div></div>" ));
	equal( result.parent().length, 1, "Check for wrapping of on-the-fly html" );
	ok( eQuery("#first").parent().parent().is(".red"), "Check if wrapper has class 'red'" );
	ok( eQuery("#firstp").parent().parent().is(".red"), "Check if wrapper has class 'red'" );
	equal( eQuery("#first").parent().parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equal( eQuery("#first").parent().parent()[0].parentNode, p, "Correct Parent" );

	QUnit.reset();
	prev = eQuery("#firstp")[0].previousSibling;
	p = eQuery("#first")[0].parentNode;
	result = eQuery("#firstp,#first").wrapAll(val( document.getElementById("empty") ));
	equal( eQuery("#first").parent()[0], eQuery("#firstp").parent()[0], "Same Parent" );
	equal( eQuery("#first").parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equal( eQuery("#first").parent()[0].parentNode, p, "Correct Parent" );
};

test("wrapAll(String|Element)", function() {
	testWrapAll(manipulationBareObj);
});

var testWrapInner = function(val) {
	expect(11);
	var num = eQuery("#first").children().length;
	var result = eQuery("#first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equal( eQuery("#first").children().length, 1, "Only one child" );
	ok( eQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( eQuery("#first").children().children().children().length, num, "Verify Elements Intact" );

	QUnit.reset();
	num = eQuery("#first").html("foo<div>test</div><div>test2</div>").children().length;
	result = eQuery("#first").wrapInner(val("<div class='red'><div id='tmp'></div></div>"));
	equal( eQuery("#first").children().length, 1, "Only one child" );
	ok( eQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( eQuery("#first").children().children().children().length, num, "Verify Elements Intact" );

	QUnit.reset();
	num = eQuery("#first").children().length;
	result = eQuery("#first").wrapInner(val(document.getElementById("empty")));
	equal( eQuery("#first").children().length, 1, "Only one child" );
	ok( eQuery("#first").children().is("#empty"), "Verify Right Element" );
	equal( eQuery("#first").children().children().length, num, "Verify Elements Intact" );

	var div = eQuery("<div/>");
	div.wrapInner(val("<span></span>"));
	equal(div.children().length, 1, "The contents were wrapped.");
	equal(div.children()[0].nodeName.toLowerCase(), "span", "A span was inserted.");
};

test("wrapInner(String|Element)", function() {
	testWrapInner(manipulationBareObj);
});

test("wrapInner(Function)", function() {
	testWrapInner(manipulationFunctionReturningObj);
});

test("unwrap()", function() {
	expect(9);

	eQuery("body").append("  <div id='unwrap' style='display: none;'> <div id='unwrap1'> <span class='unwrap'>a</span> <span class='unwrap'>b</span> </div> <div id='unwrap2'> <span class='unwrap'>c</span> <span class='unwrap'>d</span> </div> <div id='unwrap3'> <b><span class='unwrap unwrap3'>e</span></b> <b><span class='unwrap unwrap3'>f</span></b> </div> </div>");

	var abcd = eQuery("#unwrap1 > span, #unwrap2 > span").get(),
		abcdef = eQuery("#unwrap span").get();

	equal( eQuery("#unwrap1 span").add("#unwrap2 span:first").unwrap().length, 3, "make #unwrap1 and #unwrap2 go away" );
	deepEqual( eQuery("#unwrap > span").get(), abcd, "all four spans should still exist" );

	deepEqual( eQuery("#unwrap3 span").unwrap().get(), eQuery("#unwrap3 > span").get(), "make all b in #unwrap3 go away" );

	deepEqual( eQuery("#unwrap3 span").unwrap().get(), eQuery("#unwrap > span.unwrap3").get(), "make #unwrap3 go away" );

	deepEqual( eQuery("#unwrap").children().get(), abcdef, "#unwrap only contains 6 child spans" );

	deepEqual( eQuery("#unwrap > span").unwrap().get(), eQuery("body > span.unwrap").get(), "make the 6 spans become children of body" );

	deepEqual( eQuery("body > span.unwrap").unwrap().get(), eQuery("body > span.unwrap").get(), "can't unwrap children of body" );
	deepEqual( eQuery("body > span.unwrap").unwrap().get(), abcdef, "can't unwrap children of body" );

	deepEqual( eQuery("body > span.unwrap").get(), abcdef, "body contains 6 .unwrap child spans" );

	eQuery("body > span.unwrap").remove();
});

var getWrappedElement = function() {
	return eQuery("#sap");
};

var getWrappedDocumentFragment = function() {
	var f = document.createDocumentFragment();

	// copy contents of #sap into new fragment
	var clone = eQuery("#sap")[0].cloneNode(true);
	var childs = clone.childNodes;
	while (clone.childNodes.length) {
		f.appendChild(clone.childNodes[0]);
	}

	clone = null;
	return eQuery(f);
};

var testAppendForObject = function(valueObj, isFragment) {
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	var objType = " " + (isFragment ? "(DocumentFragment)" : "(Element)");
	var getObj = isFragment ? getWrappedDocumentFragment : getWrappedElement;

	var obj = getObj();
	obj.append(valueObj(document.getElementById("first")));
	equal( obj.text(), expected, "Check for appending of element" + objType);

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	obj = getObj();
	obj.append(valueObj([document.getElementById("first"), document.getElementById("yahoo")]));
	equal( obj.text(), expected, "Check for appending of array of elements" + objType );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	obj = getObj();
	obj.append(valueObj(eQuery("#yahoo, #first")));
	equal( obj.text(), expected, "Check for appending of eQuery object" + objType );

	QUnit.reset();
	obj = getObj();
	obj.append(valueObj( 5 ));
	ok( obj.text().match( /5€/ ), "Check for appending a number" + objType );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:GoogleYahoo";
	obj = getObj();
	obj.append( valueObj( [ eQuery("#first"), eQuery("#yahoo, #google") ] ) );
	equal( obj.text(), expected, "Check for appending of array of eQuery objects" );

	QUnit.reset();
	obj = getObj();
	obj.append(valueObj( " text with spaces " ));
	ok( obj.text().match(/ text with spaces €/), "Check for appending text with spaces" + objType );

	QUnit.reset();
	obj = getObj();
	ok( obj.append(valueObj( [] )), "Check for appending an empty array." + objType );
	ok( obj.append(valueObj( "" )), "Check for appending an empty string." + objType );
	ok( obj.append(valueObj( document.getElementsByTagName("foo") )), "Check for appending an empty nodelist." + objType );

	QUnit.reset();
	obj = getObj();
	obj.append(valueObj( document.getElementById("form") ));
	equal( obj.children("form").size(), 1, "Check for appending a form" + objType ); // Bug #910

	QUnit.reset();
	obj = getObj();

	var prev = obj.children().length;

	obj.append(
		"<span></span>",
		"<span></span>",
		"<span></span>"
	);

	equal( obj.children().length, prev + 3, "Make sure that multiple arguments works." + objType );
	QUnit.reset();
};

var testAppend = function(valueObj) {
	expect(58);
	testAppendForObject(valueObj, false);
	testAppendForObject(valueObj, true);

	var defaultText = "Try them out:";
	var result = eQuery("#first").append(valueObj("<b>buga</b>"));
	equal( result.text(), defaultText + "buga", "Check if text appending works" );
	equal( eQuery("#select3").append(valueObj("<option value='appendTest'>Append Test</option>")).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	eQuery("form").append(valueObj("<input name='radiotest' type='radio' checked='checked' />"));
	eQuery("form input[name=radiotest]").each(function(){
		ok( eQuery(this).is(":checked"), "Append checked radio");
	}).remove();

	QUnit.reset();
	eQuery("form").append(valueObj("<input name='radiotest' type='radio' checked    =   'checked' />"));
	eQuery("form input[name=radiotest]").each(function(){
		ok( eQuery(this).is(":checked"), "Append alternately formated checked radio");
	}).remove();

	QUnit.reset();
	eQuery("form").append(valueObj("<input name='radiotest' type='radio' checked />"));
	eQuery("form input[name=radiotest]").each(function(){
		ok( eQuery(this).is(":checked"), "Append HTML5-formated checked radio");
	}).remove();

	QUnit.reset();
	eQuery("form").append(valueObj("<input type='radio' checked='checked' name='radiotest' />"));
	eQuery("form input[name=radiotest]").each(function(){
		ok( eQuery(this).is(":checked"), "Append with name attribute after checked attribute");
	}).remove();

	QUnit.reset();
	var pass = true;
	try {
		var body = eQuery("#iframe")[0].contentWindow.document.body;

		pass = false;
		eQuery( body ).append(valueObj( "<div>test</div>" ));
		pass = true;
	} catch(e) {}

	ok( pass, "Test for appending a DOM node to the contents of an IFrame" );

	QUnit.reset();
	eQuery("<fieldset/>").appendTo("#form").append(valueObj( "<legend id='legend'>test</legend>" ));
	t( "Append legend", "#legend", ["legend"] );

	QUnit.reset();
	eQuery("#select1").append(valueObj( "<OPTION>Test</OPTION>" ));
	equal( eQuery("#select1 option:last").text(), "Test", "Appending &lt;OPTION&gt; (all caps)" );

	eQuery("#table").append(valueObj( "<colgroup></colgroup>" ));
	ok( eQuery("#table colgroup").length, "Append colgroup" );

	eQuery("#table colgroup").append(valueObj( "<col/>" ));
	ok( eQuery("#table colgroup col").length, "Append col" );

	QUnit.reset();
	eQuery("#table").append(valueObj( "<caption></caption>" ));
	ok( eQuery("#table caption").length, "Append caption" );

	QUnit.reset();
	eQuery("form:last")
		.append(valueObj( "<select id='appendSelect1'></select>" ))
		.append(valueObj( "<select id='appendSelect2'><option>Test</option></select>" ));

	t( "Append Select", "#appendSelect1, #appendSelect2", ["appendSelect1", "appendSelect2"] );

	equal( "Two nodes", eQuery("<div />").append("Two", " nodes").text(), "Appending two text nodes (#4011)" );

	// using contents will get comments regular, text, and comment nodes
	var j = eQuery("#nonnodes").contents();
	var d = eQuery("<div/>").appendTo("#nonnodes").append(j);
	equal( eQuery("#nonnodes").length, 1, "Check node,textnode,comment append moved leaving just the div" );
	ok( d.contents().length >= 2, "Check node,textnode,comment append works" );
	d.contents().appendTo("#nonnodes");
	d.remove();
	ok( eQuery("#nonnodes").contents().length >= 2, "Check node,textnode,comment append cleanup worked" );

	QUnit.reset();
	var €input = eQuery("<input />").attr({ "type": "checkbox", "checked": true }).appendTo("#testForm");
	equal( €input[0].checked, true, "A checked checkbox that is appended stays checked" );

	QUnit.reset();
	var €radios = eQuery("input:radio[name='R1']"),
		€radioNot = eQuery("<input type='radio' name='R1' checked='checked'/>").insertAfter( €radios ),
		€radio = €radios.eq(1).click();
	€radioNot[0].checked = false;
	€radios.parent().wrap("<div></div>");
	equal( €radio[0].checked, true, "Reappending radios uphold which radio is checked" );
	equal( €radioNot[0].checked, false, "Reappending radios uphold not being checked" );
	QUnit.reset();
};

test("append(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	testAppend(manipulationBareObj);
});

test("append(Function)", function() {
	testAppend(manipulationFunctionReturningObj);
});

test("append(param) to object, see #11280", function() {
	expect(11);

	var objectElement = document.createElement("object"),
	    €objectElement = eQuery( objectElement ),
	    paramElement = eQuery("<param type='wmode' value='transparent'/>"),
	    paramElement2 = eQuery("<param name='' type='wmode2' value='transparent2' />"),
	    paramElement3 = eQuery("<param type='wmode' name='foo' >"),
	    newObject = eQuery("<object><param type='foo' ><param name='' value='foo2'/><param type='baz' name='bar'></object>");

	equal( objectElement.childNodes.length, 0, "object did not have childNodes previously" );

	document.body.appendChild( objectElement );

	€objectElement.append( paramElement );
	equal( €objectElement.children().length, 1, "param single insertion ok" );
	equal( eQuery(objectElement.childNodes[0]).attr("type"), "wmode", "param.eq(0) has type=wmode" );

	€objectElement.html( paramElement2 );
	equal( €objectElement.children().length, 1, "param single insertion ok" );
	equal( eQuery(objectElement.childNodes[0]).attr("type"), "wmode2", "param.eq(0) has type=wmode2" );

	€objectElement.html( paramElement3 );
	equal( €objectElement.children().length, 1, "param single insertion ok" );
	equal( eQuery(objectElement.childNodes[0]).attr("name"), "foo", "param.eq(0) has name=foo" );

	equal( newObject.children().length, 3, "param wrapper multiple insertion ok" );
	equal( newObject.children().eq(0).attr("type"), "foo", "param.eq(0) has type=foo" );
	equal( newObject.children().eq(1).attr("value"), "foo2", "param.eq(1) has value=foo2" );
	equal( newObject.children().eq(2).attr("name"), "bar", "param.eq(2) has name=bar" );
});

test("append(Function) with incoming value", function() {
	expect(12);

	var defaultText = "Try them out:", old = eQuery("#first").html();

	var result = eQuery("#first").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});
	equal( result.text(), defaultText + "buga", "Check if text appending works" );

	var select = eQuery("#select3");
	old = select.html();

	equal( select.append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='appendTest'>Append Test</option>";
	}).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	old = eQuery("#sap").html();

	eQuery("#sap").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});
	equal( eQuery("#sap").text(), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	old = eQuery("#sap").html();

	eQuery("#sap").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return [document.getElementById("first"), document.getElementById("yahoo")];
	});
	equal( eQuery("#sap").text(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	old = eQuery("#sap").html();

	eQuery("#sap").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return eQuery("#yahoo, #first");
	});
	equal( eQuery("#sap").text(), expected, "Check for appending of eQuery object" );

	QUnit.reset();
	old = eQuery("#sap").html();

	eQuery("#sap").append(function(i, val){
		equal( val, old, "Make sure the incoming value is correct." );
		return 5;
	});
	ok( eQuery("#sap")[0].innerHTML.match( /5€/ ), "Check for appending a number" );

	QUnit.reset();
});

test("append the same fragment with events (Bug #6997, 5566)", function () {
	var doExtra = !eQuery.support.noCloneEvent && document["fireEvent"];
	expect(2 + (doExtra ? 1 : 0));
	stop();

	var element;

	// This patch modified the way that cloning occurs in IE; we need to make sure that
	// native event handlers on the original object don't get disturbed when they are
	// modified on the clone
	if ( doExtra ) {
		element = eQuery("div:first").click(function () {
			ok(true, "Event exists on original after being unbound on clone");
			eQuery(this).unbind("click");
		});
		var clone = element.clone(true).unbind("click");
		clone[0].fireEvent("onclick");
		element[0].fireEvent("onclick");

		// manually clean up detached elements
		clone.remove();
	}

	element = eQuery("<a class='test6997'></a>").click(function () {
		ok(true, "Append second element events work");
	});

	eQuery("#listWithTabIndex li").append(element)
		.find("a.test6997").eq(1).click();

	element = eQuery("<li class='test6997'></li>").click(function () {
		ok(true, "Before second element events work");
		start();
	});

	eQuery("#listWithTabIndex li").before(element);
	eQuery("#listWithTabIndex li.test6997").eq(1).click();
});

test("append HTML5 sectioning elements (Bug #6485)", function () {
	expect(2);

	eQuery("#qunit-fixture").append("<article style='font-size:10px'><section><aside>HTML5 elements</aside></section></article>");

	var article = eQuery("article"),
	aside = eQuery("aside");

	equal( article.get( 0 ).style.fontSize, "10px", "HTML5 elements are styleable");
	equal( aside.length, 1, "HTML5 elements do not collapse their children");
});

if ( eQuery.css ) {
	test("HTML5 Elements inherit styles from style rules (Bug #10501)", function () {
		expect(1);

		eQuery("#qunit-fixture").append("<article id='article'></article>");
		eQuery("#article").append("<section>This section should have a pink background.</section>");

		// In IE, the missing background color will claim its value is "transparent"
		notEqual( eQuery("section").css("background-color"), "transparent", "HTML5 elements inherit styles");
	});
}

test("html5 clone() cannot use the fragment cache in IE (#6485)", function () {
	expect(1);

	eQuery("<article><section><aside>HTML5 elements</aside></section></article>").appendTo("#qunit-fixture");

	var clone = eQuery("article").clone();

	eQuery("#qunit-fixture").append( clone );

	equal( eQuery("aside").length, 2, "clone()ing HTML5 elems does not collapse them" );
});

test("html(String) with HTML5 (Bug #6485)", function() {
	expect(2);

	eQuery("#qunit-fixture").html("<article><section><aside>HTML5 elements</aside></section></article>");
	equal( eQuery("#qunit-fixture").children().children().length, 1, "Make sure HTML5 article elements can hold children. innerHTML shortcut path" );
	equal( eQuery("#qunit-fixture").children().children().children().length, 1, "Make sure nested HTML5 elements can hold children." );
});



test("IE8 serialization bug", function () {
	expect(2);
	var wrapper = eQuery("<div></div>");

	wrapper.html("<div></div><article></article>");
	equal( wrapper.children("article").length, 1, "HTML5 elements are insertable with .html()");

	wrapper.html("<div></div><link></link>");
	equal( wrapper.children("link").length, 1, "Link elements are insertable with .html()");
});

test("html() object element #10324", function() {
	expect( 1 );

	var object = eQuery("<object id='object2'><param name='object2test' value='test'></param></object>?").appendTo("#qunit-fixture"),
			clone = object.clone();

	equal( clone.html(), object.html(), "html() returns correct innerhtml of cloned object elements" );
});

test("append(xml)", function() {
	expect( 1 );

	function createXMLDoc() {
		// Initialize DOM based upon latest installed MSXML or Netscape
		var elem,
			aActiveX =
				[ "MSXML6.DomDocument",
				"MSXML3.DomDocument",
				"MSXML2.DomDocument",
				"MSXML.DomDocument",
				"Microsoft.XmlDom" ];

		if ( document.implementation && "createDocument" in document.implementation ) {
			return document.implementation.createDocument( "", "", null );
		} else {
			// IE
			for ( var n = 0, len = aActiveX.length; n < len; n++ ) {
				try {
					elem = new ActiveXObject( aActiveX[ n ] );
					return elem;
				} catch(_){}
			}
		}
	}

	var xmlDoc = createXMLDoc(),
		xml1 = xmlDoc.createElement("head"),
		xml2 = xmlDoc.createElement("test");

	ok( eQuery( xml1 ).append( xml2 ), "Append an xml element to another without raising an exception." );

});

test("appendTo(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	expect( 16 + ( eQuery.getScript ? 1 : 0 ) );

	var defaultText = "Try them out:";

	eQuery("<b>buga</b>").appendTo("#first");
	equal( eQuery("#first").text(), defaultText + "buga", "Check if text appending works" );
	equal( eQuery("<option value='appendTest'>Append Test</option>").appendTo("#select3").parent().find("option:last-child").attr("value"), "appendTest", "Appending html options to select element");

	QUnit.reset();
	var l = eQuery("#first").children().length + 2;
	eQuery("<strong>test</strong>");
	eQuery("<strong>test</strong>");
	eQuery([ eQuery("<strong>test</strong>")[0], eQuery("<strong>test</strong>")[0] ])
		.appendTo("#first");
	equal( eQuery("#first").children().length, l, "Make sure the elements were inserted." );
	equal( eQuery("#first").children().last()[0].nodeName.toLowerCase(), "strong", "Verify the last element." );

	QUnit.reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	eQuery(document.getElementById("first")).appendTo("#sap");
	equal( eQuery("#sap").text(), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	eQuery([document.getElementById("first"), document.getElementById("yahoo")]).appendTo("#sap");
	equal( eQuery("#sap").text(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	ok( eQuery(document.createElement("script")).appendTo("body").length, "Make sure a disconnected script can be appended." );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	eQuery("#yahoo, #first").appendTo("#sap");
	equal( eQuery("#sap").text(), expected, "Check for appending of eQuery object" );

	QUnit.reset();
	eQuery("#select1").appendTo("#foo");
	t( "Append select", "#foo select", ["select1"] );

	QUnit.reset();
	var div = eQuery("<div/>").click(function(){
		ok(true, "Running a cloned click.");
	});
	div.appendTo("#qunit-fixture, #moretests");

	eQuery("#qunit-fixture div:last").click();
	eQuery("#moretests div:last").click();

	QUnit.reset();
	div = eQuery("<div/>").appendTo("#qunit-fixture, #moretests");

	equal( div.length, 2, "appendTo returns the inserted elements" );

	div.addClass("test");

	ok( eQuery("#qunit-fixture div:last").hasClass("test"), "appendTo element was modified after the insertion" );
	ok( eQuery("#moretests div:last").hasClass("test"), "appendTo element was modified after the insertion" );

	QUnit.reset();

	div = eQuery("<div/>");
	eQuery("<span>a</span><b>b</b>").filter("span").appendTo( div );

	equal( div.children().length, 1, "Make sure the right number of children were inserted." );

	div = eQuery("#moretests div");

	var num = eQuery("#qunit-fixture div").length;
	div.remove().appendTo("#qunit-fixture");

	equal( eQuery("#qunit-fixture div").length, num, "Make sure all the removed divs were inserted." );

	QUnit.reset();

	if ( eQuery.getScript ) {
		stop();
		eQuery.getScript("data/test.js", function() {
			eQuery("script[src*='data\\/test\\.js']").remove();
			start();
		});
	}
});

var testPrepend = function(val) {
	expect(6);
	var defaultText = "Try them out:",
			result = eQuery("#first").prepend(val( "<b>buga</b>" ));

	equal( result.text(), "buga" + defaultText, "Check if text prepending works" );
	equal( eQuery("#select3").prepend(val( "<option value='prependTest'>Prepend Test</option>" )).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	eQuery("#sap").prepend(val( document.getElementById("first") ));
	equal( eQuery("#sap").text(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	eQuery("#sap").prepend(val( [document.getElementById("first"), document.getElementById("yahoo")] ));
	equal( eQuery("#sap").text(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	eQuery("#sap").prepend(val( eQuery("#yahoo, #first") ));
	equal( eQuery("#sap").text(), expected, "Check for prepending of eQuery object" );

	QUnit.reset();
	expected = "Try them out:GoogleYahooThis link has class=\"blog\": Simon Willison's Weblog";
	eQuery("#sap").prepend( val( [ eQuery("#first"), eQuery("#yahoo, #google") ] ) );
	equal( eQuery("#sap").text(), expected, "Check for prepending of array of eQuery objects" );
};

test("prepend(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	testPrepend(manipulationBareObj);
});

test("prepend(Function)", function() {
	testPrepend(manipulationFunctionReturningObj);
});

test("prepend(Function) with incoming value", function() {
	expect(10);

	var defaultText = "Try them out:", old = eQuery("#first").html();
	var result = eQuery("#first").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});
	equal( result.text(), "buga" + defaultText, "Check if text prepending works" );

	old = eQuery("#select3").html();

	equal( eQuery("#select3").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='prependTest'>Prepend Test</option>";
	}).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = eQuery("#sap").html();

	eQuery("#sap").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});

	equal( eQuery("#sap").text(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	old = eQuery("#sap").html();

	eQuery("#sap").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return [document.getElementById("first"), document.getElementById("yahoo")];
	});

	equal( eQuery("#sap").text(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = eQuery("#sap").html();

	eQuery("#sap").prepend(function(i, val) {
		equal( val, old, "Make sure the incoming value is correct." );
		return eQuery("#yahoo, #first");
	});

	equal( eQuery("#sap").text(), expected, "Check for prepending of eQuery object" );
});

test("prependTo(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	expect(6);
	var defaultText = "Try them out:";
	eQuery("<b>buga</b>").prependTo("#first");
	equal( eQuery("#first").text(), "buga" + defaultText, "Check if text prepending works" );
	equal( eQuery("<option value='prependTest'>Prepend Test</option>").prependTo("#select3").parent().find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element");

	QUnit.reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	eQuery(document.getElementById("first")).prependTo("#sap");
	equal( eQuery("#sap").text(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	eQuery([document.getElementById("first"), document.getElementById("yahoo")]).prependTo("#sap");
	equal( eQuery("#sap").text(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	eQuery("#yahoo, #first").prependTo("#sap");
	equal( eQuery("#sap").text(), expected, "Check for prepending of eQuery object" );

	QUnit.reset();
	eQuery("<select id='prependSelect1'></select>").prependTo("form:last");
	eQuery("<select id='prependSelect2'><option>Test</option></select>").prependTo("form:last");

	t( "Prepend Select", "#prependSelect2, #prependSelect1", ["prependSelect2", "prependSelect1"] );
});

var testBefore = function(val) {
	expect(7);
	var expected = "This is a normal link: bugaYahoo";
	eQuery("#yahoo").before(val( "<b>buga</b>" ));
	equal( eQuery("#en").text(), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	eQuery("#yahoo").before(val( document.getElementById("first") ));
	equal( eQuery("#en").text(), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	eQuery("#yahoo").before(val( [document.getElementById("first"), document.getElementById("mark")] ));
	equal( eQuery("#en").text(), expected, "Insert array of elements before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	eQuery("#yahoo").before(val( eQuery("#mark, #first") ));
	equal( eQuery("#en").text(), expected, "Insert eQuery before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:GooglediveintomarkYahoo";
	eQuery("#yahoo").before( val( [ eQuery("#first"), eQuery("#mark, #google") ] ) );
	equal( eQuery("#en").text(), expected, "Insert array of eQuery objects before" );

	var set = eQuery("<div/>").before("<span>test</span>");
	equal( set[0].nodeName.toLowerCase(), "div", "Insert before a disconnected node should be a no-op" );
	equal( set.length, 1, "Insert the element before the disconnected node. should be a no-op" );
};

test("before(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	testBefore(manipulationBareObj);
});

test("before(Function)", function() {
	testBefore(manipulationFunctionReturningObj);
});

test("before and after w/ empty object (#10812)", function() {
	expect(1);

	var res = eQuery( "#notInTheDocument" ).before( "(" ).after( ")" );
	equal( res.length, 0, "didn't choke on empty object" );
});

test("before and after on disconnected node (#10517)", function() {
	expect(6);
	var expectedBefore = "This is a normal link: bugaYahoo",
		expectedAfter = "This is a normal link: Yahoobuga";

	equal( eQuery("<input type='checkbox'/>").before("<div/>").length, 1, "before() on disconnected node is no-op" );
	equal( eQuery("<input type='checkbox'/>").after("<div/>").length, 1, "after() on disconnected node is no-op" );

	QUnit.reset();
	eQuery("#yahoo").add("<span/>").before("<b>buga</b>");
	equal( eQuery("#en").text(), expectedBefore, "Insert String before with disconnected node last" );

	QUnit.reset();
	eQuery("<span/>").add("#yahoo").before("<b>buga</b>");
	equal( eQuery("#en").text(), expectedBefore, "Insert String before with disconnected node first" );

	QUnit.reset();
	eQuery("#yahoo").add("<span/>").after("<b>buga</b>");
	equal( eQuery("#en").text(), expectedAfter, "Insert String after with disconnected node last" );

	QUnit.reset();
	eQuery("<span/>").add("#yahoo").after("<b>buga</b>");
	equal( eQuery("#en").text(), expectedAfter, "Insert String after with disconnected node first" );
});

test("insertBefore(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	expect(4);
	var expected = "This is a normal link: bugaYahoo";
	eQuery("<b>buga</b>").insertBefore("#yahoo");
	equal( eQuery("#en").text(), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	eQuery(document.getElementById("first")).insertBefore("#yahoo");
	equal( eQuery("#en").text(), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	eQuery([document.getElementById("first"), document.getElementById("mark")]).insertBefore("#yahoo");
	equal( eQuery("#en").text(), expected, "Insert array of elements before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	eQuery("#mark, #first").insertBefore("#yahoo");
	equal( eQuery("#en").text(), expected, "Insert eQuery before" );
});

var testAfter = function(val) {
	expect(7);
	var expected = "This is a normal link: Yahoobuga";
	eQuery("#yahoo").after(val( "<b>buga</b>" ));
	equal( eQuery("#en").text(), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	eQuery("#yahoo").after(val( document.getElementById("first") ));
	equal( eQuery("#en").text(), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	eQuery("#yahoo").after(val( [document.getElementById("first"), document.getElementById("mark")] ));
	equal( eQuery("#en").text(), expected, "Insert array of elements after" );

	QUnit.reset();
	expected = "This is a normal link: YahoodiveintomarkTry them out:";
	eQuery("#yahoo").after(val( eQuery("#mark, #first") ));
	equal( eQuery("#en").text(), expected, "Insert eQuery after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:Googlediveintomark";
	eQuery("#yahoo").after( val( [ eQuery("#first"), eQuery("#mark, #google") ] ) );
	equal( eQuery("#en").text(), expected, "Insert array of eQuery objects after" );

	var set = eQuery("<div/>").before("<span>test</span>");
	equal( set[0].nodeName.toLowerCase(), "div", "Insert after a disconnected node should be a no-op" );
	equal( set.length, 1, "Insert the element after the disconnected node should be a no-op" );
};

test("after(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	testAfter(manipulationBareObj);
});

test("after(Function)", function() {
	testAfter(manipulationFunctionReturningObj);
});

test("insertAfter(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	expect(4);
	var expected = "This is a normal link: Yahoobuga";
	eQuery("<b>buga</b>").insertAfter("#yahoo");
	equal( eQuery("#en").text(), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	eQuery(document.getElementById("first")).insertAfter("#yahoo");
	equal( eQuery("#en").text(), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	eQuery([document.getElementById("first"), document.getElementById("mark")]).insertAfter("#yahoo");
	equal( eQuery("#en").text(), expected, "Insert array of elements after" );

	QUnit.reset();
	expected = "This is a normal link: YahoodiveintomarkTry them out:";
	eQuery("#mark, #first").insertAfter("#yahoo");
	equal( eQuery("#en").text(), expected, "Insert eQuery after" );
});

var testReplaceWith = function(val) {
	expect(22);
	eQuery("#yahoo").replaceWith(val( "<b id='replace'>buga</b>" ));
	ok( eQuery("#replace")[0], "Replace element with string" );
	ok( !eQuery("#yahoo")[0], "Verify that original element is gone, after string" );

	QUnit.reset();
	eQuery("#yahoo").replaceWith(val( document.getElementById("first") ));
	ok( eQuery("#first")[0], "Replace element with element" );
	ok( !eQuery("#yahoo")[0], "Verify that original element is gone, after element" );

	QUnit.reset();
	eQuery("#qunit-fixture").append("<div id='bar'><div id='baz'</div></div>");
	eQuery("#baz").replaceWith("Baz");
	equal( eQuery("#bar").text(),"Baz", "Replace element with text" );
	ok( !eQuery("#baz")[0], "Verify that original element is gone, after element" );

	QUnit.reset();
	eQuery("#yahoo").replaceWith(val( [document.getElementById("first"), document.getElementById("mark")] ));
	ok( eQuery("#first")[0], "Replace element with array of elements" );
	ok( eQuery("#mark")[0], "Replace element with array of elements" );
	ok( !eQuery("#yahoo")[0], "Verify that original element is gone, after array of elements" );

	QUnit.reset();
	eQuery("#yahoo").replaceWith(val( eQuery("#mark, #first") ));
	ok( eQuery("#first")[0], "Replace element with set of elements" );
	ok( eQuery("#mark")[0], "Replace element with set of elements" );
	ok( !eQuery("#yahoo")[0], "Verify that original element is gone, after set of elements" );

	QUnit.reset();
	var tmp = eQuery("<div/>").appendTo("body").click(function(){ ok(true, "Newly bound click run." ); });
	var y = eQuery("<div/>").appendTo("body").click(function(){ ok(true, "Previously bound click run." ); });
	var child = y.append("<b>test</b>").find("b").click(function(){ ok(true, "Child bound click run." ); return false; });

	y.replaceWith( tmp );

	tmp.click();
	y.click(); // Shouldn't be run
	child.click(); // Shouldn't be run

	tmp.remove();
	y.remove();
	child.remove();

	QUnit.reset();

	y = eQuery("<div/>").appendTo("body").click(function(){ ok(true, "Previously bound click run." ); });
	var child2 = y.append("<u>test</u>").find("u").click(function(){ ok(true, "Child 2 bound click run." ); return false; });

	y.replaceWith( child2 );

	child2.click();

	y.remove();
	child2.remove();

	QUnit.reset();

	var set = eQuery("<div/>").replaceWith(val("<span>test</span>"));
	equal( set[0].nodeName.toLowerCase(), "span", "Replace the disconnected node." );
	equal( set.length, 1, "Replace the disconnected node." );

	// #11338
	ok( eQuery("<div>1</div>").replaceWith( val("<span/>") ).is("span"), "#11338, Make sure disconnected node with content is replaced");

	var non_existant = eQuery("#does-not-exist").replaceWith( val("<b>should not throw an error</b>") );
	equal( non_existant.length, 0, "Length of non existant element." );

	var €div = eQuery("<div class='replacewith'></div>").appendTo("body");
	// TODO: Work on eQuery(...) inline script execution
	//€div.replaceWith("<div class='replacewith'></div><script>" +
		//"equal(eQuery('.replacewith').length, 1, 'Check number of elements in page.');" +
		//"</script>");
	equal(eQuery(".replacewith").length, 1, "Check number of elements in page.");
	eQuery(".replacewith").remove();

	QUnit.reset();

	eQuery("#qunit-fixture").append("<div id='replaceWith'></div>");
	equal( eQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	eQuery("#replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equal( eQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );

	eQuery("#replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equal( eQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );
};

test("replaceWith(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	testReplaceWith(manipulationBareObj);
});

test("replaceWith(Function)", function() {
	testReplaceWith(manipulationFunctionReturningObj);

	expect(23);

	var y = eQuery("#yahoo")[0];

	eQuery(y).replaceWith(function(){
		equal( this, y, "Make sure the context is coming in correctly." );
	});

	QUnit.reset();
});

test("replaceWith(string) for more than one element", function(){
	expect(3);

	equal(eQuery("#foo p").length, 3, "ensuring that test data has not changed");

	eQuery("#foo p").replaceWith("<span>bar</span>");
	equal(eQuery("#foo span").length, 3, "verify that all the three original element have been replaced");
	equal(eQuery("#foo p").length, 0, "verify that all the three original element have been replaced");
});

test("replaceWith(string) for collection with disconnected element", function(){
	expect(18);

	var elem = eQuery("<div />"),
		testSet, newSet;

	QUnit.reset();
	testSet = eQuery("#foo p").add(elem);
	equal(testSet.length, 4, "ensuring that test data has not changed");

	newSet = testSet.replaceWith("<span>bar</span>");
	equal(testSet.length, 4, "ensure that we still have the same number of elements");
	equal(eQuery("#foo span").length, 3, "verify that all the three original elements have been replaced");
	equal(eQuery("#foo p").length, 0, "verify that all the three original elements have been replaced");
	equal(testSet.filter("p").length, 3, "ensure we still have the original set of attached elements");
	equal(testSet.filter("div").length, 0, "ensure the detached element is not in the original set");
	equal(newSet.filter("p").length, 3, "ensure we still have the original set of attached elements in new set");
	equal(newSet.filter("div").length, 0, "ensure the detached element has been replaced in the new set");
	equal(newSet.filter("span").length, 1, "ensure the new element is in the new set");

	QUnit.reset();
	testSet = elem.add(eQuery("#foo p"));
	equal(testSet.length, 4, "ensuring that test data has not changed");

	testSet.replaceWith("<span>bar</span>");
	equal(testSet.length, 4, "ensure that we still have the same number of elements");
	equal(eQuery("#foo span").length, 3, "verify that all the three original elements have been replaced");
	equal(eQuery("#foo p").length, 0, "verify that all the three original elements have been replaced");
	equal(testSet.filter("p").length, 3, "ensure we still have the original set of attached elements");
	equal(testSet.filter("div").length, 0, "ensure the detached element is not in the original set");
	equal(newSet.filter("p").length, 3, "ensure we still have the original set of attached elements in new set");
	equal(newSet.filter("div").length, 0, "ensure the detached element has been replaced in the new set");
	equal(newSet.filter("span").length, 1, "ensure the new element is in the new set");
});

test("replaceAll(String|Element|Array&lt;Element&gt;|eQuery)", function() {
	expect(10);
	eQuery("<b id='replace'>buga</b>").replaceAll("#yahoo");
	ok( eQuery("#replace")[0], "Replace element with string" );
	ok( !eQuery("#yahoo")[0], "Verify that original element is gone, after string" );

	QUnit.reset();
	eQuery(document.getElementById("first")).replaceAll("#yahoo");
	ok( eQuery("#first")[0], "Replace element with element" );
	ok( !eQuery("#yahoo")[0], "Verify that original element is gone, after element" );

	QUnit.reset();
	eQuery([document.getElementById("first"), document.getElementById("mark")]).replaceAll("#yahoo");
	ok( eQuery("#first")[0], "Replace element with array of elements" );
	ok( eQuery("#mark")[0], "Replace element with array of elements" );
	ok( !eQuery("#yahoo")[0], "Verify that original element is gone, after array of elements" );

	QUnit.reset();
	eQuery("#mark, #first").replaceAll("#yahoo");
	ok( eQuery("#first")[0], "Replace element with set of elements" );
	ok( eQuery("#mark")[0], "Replace element with set of elements" );
	ok( !eQuery("#yahoo")[0], "Verify that original element is gone, after set of elements" );
});

test("eQuery.clone() (#8017)", function() {

	expect(2);

	ok( eQuery.clone && eQuery.isFunction( eQuery.clone ) , "eQuery.clone() utility exists and is a function.");

	var main = eQuery("#qunit-fixture")[0],
			clone = eQuery.clone( main );

	equal( main.childNodes.length, clone.childNodes.length, "Simple child length to ensure a large dom tree copies correctly" );
});

test("clone() (#8070)", function () {
	expect(2);

	eQuery("<select class='test8070'></select><select class='test8070'></select>").appendTo("#qunit-fixture");
	var selects = eQuery(".test8070");
	selects.append("<OPTION>1</OPTION><OPTION>2</OPTION>");

	equal( selects[0].childNodes.length, 2, "First select got two nodes" );
	equal( selects[1].childNodes.length, 2, "Second select got two nodes" );

	selects.remove();
});

test("clone()", function() {
	expect( 44 );

	equal( "This is a normal link: Yahoo", eQuery("#en").text(), "Assert text for #en" );
	var clone = eQuery("#yahoo").clone();
	equal( "Try them out:Yahoo", eQuery("#first").append(clone).text(), "Check for clone" );
	equal( "This is a normal link: Yahoo", eQuery("#en").text(), "Reassert text for #en" );

	var cloneTags = [
		"<table/>", "<tr/>", "<td/>", "<div/>",
		"<button/>", "<ul/>", "<ol/>", "<li/>",
		"<input type='checkbox' />", "<select/>", "<option/>", "<textarea/>",
		"<tbody/>", "<thead/>", "<tfoot/>", "<iframe/>"
	];
	for (var i = 0; i < cloneTags.length; i++) {
		var j = eQuery(cloneTags[i]);
		equal( j[0].tagName, j.clone()[0].tagName, "Clone a " + cloneTags[i]);
	}

	// using contents will get comments regular, text, and comment nodes
	var cl = eQuery("#nonnodes").contents().clone();
	ok( cl.length >= 2, "Check node,textnode,comment clone works (some browsers delete comments on clone)" );

	var div = eQuery("<div><ul><li>test</li></ul></div>").click(function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);

	// manually clean up detached elements
	div.remove();

	div = clone.clone(true);

	// manually clean up detached elements
	clone.remove();

	equal( div.length, 1, "One element cloned" );
	equal( div[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div.trigger("click");

	// manually clean up detached elements
	div.remove();

	div = eQuery("<div/>").append([ document.createElement("table"), document.createElement("table") ]);
	div.find("table").click(function(){
		ok( true, "Bound event still exists." );
	});

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	equal( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	clone.find("table:last").trigger("click");

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var divEvt = eQuery("<div><ul><li>test</li></ul></div>").click(function(){
		ok( false, "Bound event still exists after .clone()." );
	}),
		cloneEvt = divEvt.clone();

	// Make sure that doing .clone() doesn't clone events
	cloneEvt.trigger("click");

	cloneEvt.remove();
	divEvt.remove();

	// Test both html() and clone() for <embed and <object types
	div = eQuery("<div/>").html("<embed height='355' width='425' src='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'></embed>");

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	equal( clone.html(), div.html(), "Element contents cloned" );
	equal( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// this is technically an invalid object, but because of the special
	// classid instantiation it is the only kind that IE has trouble with,
	// so let's test with it too.
	div = eQuery("<div/>").html("<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	(function checkForAttributes( € ) {
		// IE6/7 adds some extra parameters so just test for existance of a defined set
		var parameters = ["height", "width", "classid"],
			€divObject = div.find("object"),
			€cloneObject = clone.find("object");

		€.each( parameters, function(index, parameter)  {
			equal( €cloneObject.attr(parameter), €divObject.attr(parameter), "Element attributes cloned: " + parameter );
		});
	})( eQuery );
	(function checkForParams() {
		// IE6/7/8 adds a bunch of extram param elements so just test for those that are trying to clone
		var params = {};

		clone.find("param").each(function(index, param) {
			params[param.attributes.name.nodeValue.toLowerCase()] =
				param.attributes.value.nodeValue.toLowerCase();
		});

		div.find("param").each(function(index, param) {
			var actualValue = params[param.attributes.name.nodeValue.toLowerCase()],
				expectedValue = param.attributes.value.nodeValue.toLowerCase();

			equal( actualValue, expectedValue, "Param cloned: " + param.attributes.name.nodeValue );
		});
	})();
	equal( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// and here's a valid one.
	div = eQuery("<div/>").html("<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	equal( clone.html(), div.html(), "Element contents cloned" );
	equal( clone[0].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	div = eQuery("<div/>").data({ "a": true });
	clone = div.clone(true);
	equal( clone.data("a"), true, "Data cloned." );
	clone.data("a", false);
	equal( clone.data("a"), false, "Ensure cloned element data object was correctly modified" );
	equal( div.data("a"), true, "Ensure cloned element data object is copied, not referenced" );

	// manually clean up detached elements
	div.remove();
	clone.remove();

	var form = document.createElement("form");
	form.action = "/test/";

	div = document.createElement("div");
	div.appendChild( document.createTextNode("test") );
	form.appendChild( div );

	equal( eQuery(form).clone().children().length, 1, "Make sure we just get the form back." );

	equal( eQuery("body").clone().children()[0].id, "qunit-header", "Make sure cloning body works" );
});

test("clone(script type=non-javascript) (#11359)", function() {
	expect(3);
	var src = eQuery("<script type='text/filler'>Lorem ipsum dolor sit amet</script><q><script type='text/filler'>consectetur adipiscing elit</script></q>");
	var dest = src.clone();
	equal( dest[0].text, "Lorem ipsum dolor sit amet", "Cloning preserves script text" );
	equal( dest.last().html(), src.last().html(), "Cloning preserves nested script text" );
	ok( /^\s*<scr.pt\s+type=['"]?text\/filler['"]?\s*>consectetur adipiscing elit<\/scr.pt>\s*€/i.test( dest.last().html() ), "Cloning preserves nested script text" );
});

test("clone(form element) (Bug #3879, #6655)", function() {
	expect(5);
	var clone,
			element = eQuery("<select><option>Foo</option><option selected>Bar</option></select>");

	equal( element.clone().find("option:selected").val(), element.find("option:selected").val(), "Selected option cloned correctly" );

	element = eQuery("<input type='checkbox' value='foo'>").attr("checked", "checked");
	clone = element.clone();

	equal( clone.is(":checked"), element.is(":checked"), "Checked input cloned correctly" );
	equal( clone[0].defaultValue, "foo", "Checked input defaultValue cloned correctly" );

	// defaultChecked also gets set now due to setAttribute in attr, is this check still valid?
	// equal( clone[0].defaultChecked, !eQuery.support.noCloneChecked, "Checked input defaultChecked cloned correctly" );

	element = eQuery("<input type='text' value='foo'>");
	clone = element.clone();
	equal( clone[0].defaultValue, "foo", "Text input defaultValue cloned correctly" );

	element = eQuery("<textarea>foo</textarea>");
	clone = element.clone();
	equal( clone[0].defaultValue, "foo", "Textarea defaultValue cloned correctly" );
});

test("clone(multiple selected options) (Bug #8129)", function() {
	expect(1);
	var element = eQuery("<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>");

	equal( element.clone().find("option:selected").length, element.find("option:selected").length, "Multiple selected options cloned correctly" );

});

test("clone() on XML nodes", function() {
	expect(2);
	var xml = createDashboardXML();
	var root = eQuery(xml.documentElement).clone();
	var origTab = eQuery("tab", xml).eq(0);
	var cloneTab = eQuery("tab", root).eq(0);
	origTab.text("origval");
	cloneTab.text("cloneval");
	equal(origTab.text(), "origval", "Check original XML node was correctly set");
	equal(cloneTab.text(), "cloneval", "Check cloned XML node was correctly set");
});

test("clone() on local XML nodes with html5 nodename", function() {
	expect(2);

	var €xmlDoc = eQuery( eQuery.parseXML( "<root><meter /></root>" ) ),
		€meter = €xmlDoc.find( "meter" ).clone();

	equal( €meter[0].nodeName, "meter", "Check if nodeName was not changed due to cloning" );
	equal( €meter[0].nodeType, 1, "Check if nodeType is not changed due to cloning" );
});

test("html(undefined)", function() {
	expect(1);
	equal( eQuery("#foo").html("<i>test</i>").html(undefined).html().toLowerCase(), "<i>test</i>", ".html(undefined) is chainable (#5571)" );
});

test("html() on empty set", function() {
	expect(1);
	strictEqual( eQuery().html(), undefined, ".html() returns undefined for empty sets (#11962)" );
});

var testHtml = function(valueObj) {
	expect(35);

	eQuery["scriptorder"] = 0;

	var div = eQuery("#qunit-fixture > div");
	div.html(valueObj("<b>test</b>"));
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).childNodes.length != 1 ) {
			pass = false;
		}
	}
	ok( pass, "Set HTML" );

	div = eQuery("<div/>").html( valueObj("<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>") );

	equal( div.children().length, 2, "Make sure two child nodes exist." );
	equal( div.children().children().length, 1, "Make sure that a grandchild exists." );

	var space = eQuery("<div/>").html(valueObj("&#160;"))[0].innerHTML;
	ok( /^\xA0€|^&nbsp;€/.test( space ), "Make sure entities are passed through correctly." );
	equal( eQuery("<div/>").html(valueObj("&amp;"))[0].innerHTML, "&amp;", "Make sure entities are passed through correctly." );

	eQuery("#qunit-fixture").html(valueObj("<style>.foobar{color:green;}</style>"));

	equal( eQuery("#qunit-fixture").children().length, 1, "Make sure there is a child element." );
	equal( eQuery("#qunit-fixture").children()[0].nodeName.toUpperCase(), "STYLE", "And that a style element was inserted." );

	QUnit.reset();
	// using contents will get comments regular, text, and comment nodes
	var j = eQuery("#nonnodes").contents();
	j.html(valueObj("<b>bold</b>"));

	// this is needed, or the expando added by eQuery unique will yield a different html
	j.find("b").removeData();
	equal( j.html().replace(/ xmlns="[^"]+"/g, "").toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	eQuery("#qunit-fixture").html(valueObj("<select/>"));
	eQuery("#qunit-fixture select").html(valueObj("<option>O1</option><option selected='selected'>O2</option><option>O3</option>"));
	equal( eQuery("#qunit-fixture select").val(), "O2", "Selected option correct" );

	var €div = eQuery("<div />");
	equal( €div.html(valueObj( 5 )).html(), "5", "Setting a number as html" );
	equal( €div.html(valueObj( 0 )).html(), "0", "Setting a zero as html" );

	var €div2 = eQuery("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equal( €div2.html(insert).html().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );
	equal( €div2.html("x" + insert).html().replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion." );
	equal( €div2.html(" " + insert).html().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );

	var map = eQuery("<map/>").html(valueObj("<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.equery.com/' alt='eQuery'>"));

	equal( map[0].childNodes.length, 1, "The area was inserted." );
	equal( map[0].firstChild.nodeName.toLowerCase(), "area", "The area was inserted." );

	QUnit.reset();

	eQuery("#qunit-fixture").html(valueObj("<script type='something/else'>ok( false, 'Non-script evaluated.' );</script><script type='text/javascript'>ok( true, 'text/javascript is evaluated.' );</script><script>ok( true, 'No type is evaluated.' );</script><div><script type='text/javascript'>ok( true, 'Inner text/javascript is evaluated.' );</script><script>ok( true, 'Inner No type is evaluated.' );</script><script type='something/else'>ok( false, 'Non-script evaluated.' );</script><script type='type/ecmascript'>ok( true, 'type/ecmascript evaluated.' );</script></div>"));

	var child = eQuery("#qunit-fixture").find("script");

	equal( child.length, 2, "Make sure that two non-JavaScript script tags are left." );
	equal( child[0].type, "something/else", "Verify type of script tag." );
	equal( child[1].type, "something/else", "Verify type of script tag." );

	eQuery("#qunit-fixture").html(valueObj("<script>ok( true, 'Test repeated injection of script.' );</script>"));
	eQuery("#qunit-fixture").html(valueObj("<script>ok( true, 'Test repeated injection of script.' );</script>"));
	eQuery("#qunit-fixture").html(valueObj("<script>ok( true, 'Test repeated injection of script.' );</script>"));

	eQuery("#qunit-fixture").html(valueObj("<script type='text/javascript'>ok( true, 'eQuery().html().evalScripts() Evals Scripts Twice in Firefox, see #975 (1)' );</script>"));

	eQuery("#qunit-fixture").html(valueObj("foo <form><script type='text/javascript'>ok( true, 'eQuery().html().evalScripts() Evals Scripts Twice in Firefox, see #975 (2)' );</script></form>"));

	eQuery("#qunit-fixture").html(valueObj("<script>equal(eQuery.scriptorder++, 0, 'Script is executed in order');equal(eQuery('#scriptorder').length, 1,'Execute after html (even though appears before)')<\/script><span id='scriptorder'><script>equal(eQuery.scriptorder++, 1, 'Script (nested) is executed in order');equal(eQuery('#scriptorder').length, 1,'Execute after html')<\/script></span><script>equal(eQuery.scriptorder++, 2, 'Script (unnested) is executed in order');equal(eQuery('#scriptorder').length, 1,'Execute after html')<\/script>"));
};

test("html(String)", function() {
	testHtml(manipulationBareObj);
});

test("html(Function)", function() {
	testHtml(manipulationFunctionReturningObj);

	expect(37);

	QUnit.reset();

	eQuery("#qunit-fixture").html(function(){
		return eQuery(this).text();
	});

	ok( !/</.test( eQuery("#qunit-fixture").html() ), "Replace html with text." );
	ok( eQuery("#qunit-fixture").html().length > 0, "Make sure text exists." );
});

test("html(Function) with incoming value", function() {
	expect(20);

	var div = eQuery("#qunit-fixture > div"), old = div.map(function(){ return eQuery(this).html(); });

	div.html(function(i, val) {
		equal( val, old[i], "Make sure the incoming value is correct." );
		return "<b>test</b>";
	});

	var pass = true;
	div.each(function(){
		if ( this.childNodes.length !== 1 ) {
			pass = false;
		}
	});
	ok( pass, "Set HTML" );

	QUnit.reset();
	// using contents will get comments regular, text, and comment nodes
	var j = eQuery("#nonnodes").contents();
	old = j.map(function(){ return eQuery(this).html(); });

	j.html(function(i, val) {
		equal( val, old[i], "Make sure the incoming value is correct." );
		return "<b>bold</b>";
	});

	// Handle the case where no comment is in the document
	if ( j.length === 2 ) {
		equal( null, null, "Make sure the incoming value is correct." );
	}

	j.find("b").removeData();
	equal( j.html().replace(/ xmlns="[^"]+"/g, "").toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	var €div = eQuery("<div />");

	equal( €div.html(function(i, val) {
		equal( val, "", "Make sure the incoming value is correct." );
		return 5;
	}).html(), "5", "Setting a number as html" );

	equal( €div.html(function(i, val) {
		equal( val, "5", "Make sure the incoming value is correct." );
		return 0;
	}).html(), "0", "Setting a zero as html" );

	var €div2 = eQuery("<div/>"), insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equal( €div2.html(function(i, val) {
		equal( val, "", "Make sure the incoming value is correct." );
		return insert;
	}).html().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );

	equal( €div2.html(function(i, val) {
		equal( val.replace(/>/g, "&gt;"), insert, "Make sure the incoming value is correct." );
		return "x" + insert;
	}).html().replace(/>/g, "&gt;"), "x" + insert, "Verify escaped insertion." );

	equal( €div2.html(function(i, val) {
		equal( val.replace(/>/g, "&gt;"), "x" + insert, "Make sure the incoming value is correct." );
		return " " + insert;
	}).html().replace(/>/g, "&gt;"), " " + insert, "Verify escaped insertion." );
});

var testRemove = function(method) {
	expect(9);

	var cleanUp, count,
			first = eQuery("#ap").children(":first");

	first.data("foo", "bar");

	eQuery("#ap").children()[method]();
	ok( eQuery("#ap").text().length > 10, "Check text is not removed" );
	equal( eQuery("#ap").children().length, 0, "Check remove" );

	equal( first.data("foo"), method == "remove" ? null : "bar" );

	QUnit.reset();
	eQuery("#ap").children()[method]("a");
	ok( eQuery("#ap").text().length > 10, "Check text is not removed" );
	equal( eQuery("#ap").children().length, 1, "Check filtered remove" );

	eQuery("#ap").children()[method]("a, code");
	equal( eQuery("#ap").children().length, 0, "Check multi-filtered remove" );

	// using contents will get comments regular, text, and comment nodes
	// Handle the case where no comment is in the document
	ok( eQuery("#nonnodes").contents().length >= 2, "Check node,textnode,comment remove works" );
	eQuery("#nonnodes").contents()[method]();
	equal( eQuery("#nonnodes").contents().length, 0, "Check node,textnode,comment remove works" );

	// manually clean up detached elements
	if (method === "detach") {
		first.remove();
	}

	QUnit.reset();

	count = 0;

	first = eQuery("#ap").children(":first");

	cleanUp = first.click(function() { count++; })[method]().appendTo("#qunit-fixture").click();

	equal( method == "remove" ? 0 : 1, count );

	// manually clean up detached elements
	cleanUp.remove();
};

test("remove()", function() {
	testRemove("remove");
});

test("detach()", function() {
	testRemove("detach");
});

test("empty()", function() {
	expect(3);
	equal( eQuery("#ap").children().empty().text().length, 0, "Check text is removed" );
	equal( eQuery("#ap").children().length, 4, "Check elements are not removed" );

	// using contents will get comments regular, text, and comment nodes
	var j = eQuery("#nonnodes").contents();
	j.empty();
	equal( j.html(), "", "Check node,textnode,comment empty works" );
});

test("eQuery.cleanData", function() {
	expect(14);

	var type, pos, div, child;

	type = "remove";

	// Should trigger 4 remove event
	div = getDiv().remove();

	// Should both do nothing
	pos = "Outer";
	div.trigger("click");

	pos = "Inner";
	div.children().trigger("click");

	type = "empty";
	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.empty();

	// Should trigger 1
	pos = "Outer";
	div.trigger("click");

	// Should do nothing
	pos = "Inner";
	child.trigger("click");

	// Should trigger 2
	div.remove();

	type = "html";

	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.html("<div></div>");

	// Should trigger 1
	pos = "Outer";
	div.trigger("click");

	// Should do nothing
	pos = "Inner";
	child.trigger("click");

	// Should trigger 2
	div.remove();

	function getDiv() {
		var div = eQuery("<div class='outer'><div class='inner'></div></div>").click(function(){
			ok( true, type + " " + pos + " Click event fired." );
		}).focus(function(){
			ok( true, type + " " + pos + " Focus event fired." );
		}).find("div").click(function(){
			ok( false, type + " " + pos + " Click event fired." );
		}).focus(function(){
			ok( false, type + " " + pos + " Focus event fired." );
		}).end().appendTo("body");

		div[0].detachEvent = div[0].removeEventListener = function(t){
			ok( true, type + " Outer " + t + " event unbound" );
		};

		div[0].firstChild.detachEvent = div[0].firstChild.removeEventListener = function(t){
			ok( true, type + " Inner " + t + " event unbound" );
		};

		return div;
	}
});

test("eQuery.buildFragment - no plain-text caching (Bug #6779)", function() {
	expect(1);

	// DOM manipulation fails if added text matches an Object method
	var €f = eQuery( "<div />" ).appendTo( "#qunit-fixture" ),
		bad = [ "start-", "toString", "hasOwnProperty", "append", "here&there!", "-end" ];

	for ( var i=0; i < bad.length; i++ ) {
		try {
			€f.append( bad[i] );
		}
		catch(e) {}
	}
	equal(€f.text(), bad.join(""), "Cached strings that match Object properties");
	€f.remove();
});

test( "eQuery.html - execute scripts escaped with html comment or CDATA (#9221)", function() {
	expect( 3 );
	eQuery( [
					 "<script type='text/javascript'>",
					 "<!--",
					 "ok( true, '<!-- handled' );",
					 "//-->",
					 "</script>"
			 ].join ( "\n" ) ).appendTo( "#qunit-fixture" );
	eQuery( [
					 "<script type='text/javascript'>",
					 "<![CDATA[",
					 "ok( true, '<![CDATA[ handled' );",
					 "//]]>",
					 "</script>"
			 ].join ( "\n" ) ).appendTo( "#qunit-fixture" );
	eQuery( [
					 "<script type='text/javascript'>",
					 "<!--//--><![CDATA[//><!--",
					 "ok( true, '<!--//--><![CDATA[//><!-- (Drupal case) handled' );",
					 "//--><!]]>",
					 "</script>"
			 ].join ( "\n" ) ).appendTo( "#qunit-fixture" );
});

test("eQuery.buildFragment - plain objects are not a document #8950", function() {
	expect(1);

	try {
		eQuery("<input type='hidden'>", {});
		ok( true, "Does not allow attribute object to be treated like a doc object");
	} catch (e) {}

});

test("eQuery.clone - no exceptions for object elements #9587", function() {
	expect(1);

	try {
		eQuery("#no-clone-exception").clone();
		ok( true, "cloned with no exceptions" );
	} catch( e ) {
		ok( false, e.message );
	}
});

test("eQuery(<tag>) & wrap[Inner/All]() handle unknown elems (#10667)", function() {
	expect(2);

	var €wraptarget = eQuery( "<div id='wrap-target'>Target</div>" ).appendTo( "#qunit-fixture" ),
			€section = eQuery( "<section>" ).appendTo( "#qunit-fixture" );

	€wraptarget.wrapAll("<aside style='background-color:green'></aside>");

	notEqual( €wraptarget.parent("aside").get( 0 ).style.backgroundColor, "transparent", "HTML5 elements created with wrapAll inherit styles" );
	notEqual( €section.get( 0 ).style.backgroundColor, "transparent", "HTML5 elements create with eQuery( string ) inherit styles" );
});

test("Cloned, detached HTML5 elems (#10667,10670)", function() {
	expect(7);

	var €section = eQuery( "<section>" ).appendTo( "#qunit-fixture" ),
			€clone;

	// First clone
	€clone = €section.clone();

	// Infer that the test is being run in IE<=8
	if ( €clone[0].outerHTML && !eQuery.support.opacity ) {
		// This branch tests cloning nodes by reading the outerHTML, used only in IE<=8
		equal( €clone[0].outerHTML, "<section></section>", "detached clone outerHTML matches '<section></section>'" );
	} else {
		// This branch tests a known behaviour in modern browsers that should never fail.
		// Included for expected test count symmetry (expecting 1)
		equal( €clone[0].nodeName, "SECTION", "detached clone nodeName matches 'SECTION' in modern browsers" );
	}

	// Bind an event
	€section.bind( "click", function( event ) {
		ok( true, "clone fired event" );
	});

	// Second clone (will have an event bound)
	€clone = €section.clone( true );

	// Trigger an event from the first clone
	€clone.trigger( "click" );
	€clone.unbind( "click" );

	// Add a child node with text to the original
	€section.append( "<p>Hello</p>" );

	// Third clone (will have child node and text)
	€clone = €section.clone( true );

	equal( €clone.find("p").text(), "Hello", "Assert text in child of clone" );

	// Trigger an event from the third clone
	€clone.trigger( "click" );
	€clone.unbind( "click" );

	// Add attributes to copy
	€section.attr({
		"class": "foo bar baz",
		"title": "This is a title"
	});

	// Fourth clone (will have newly added attributes)
	€clone = €section.clone( true );

	equal( €clone.attr("class"), €section.attr("class"), "clone and element have same class attribute" );
	equal( €clone.attr("title"), €section.attr("title"), "clone and element have same title attribute" );

	// Remove the original
	€section.remove();

	// Clone the clone
	€section = €clone.clone( true );

	// Remove the clone
	€clone.remove();

	// Trigger an event from the clone of the clone
	€section.trigger( "click" );

	// Unbind any remaining events
	€section.unbind( "click" );
	€clone.unbind( "click" );
});

test("eQuery.fragments cache expectations", function() {

	expect( 10 );

	eQuery.fragments = {};

	function fragmentCacheSize() {
		var n = 0, c;

		for ( c in eQuery.fragments ) {
			n++;
		}
		return n;
	}

	eQuery("<li></li>");
	eQuery("<li>?</li>");
	eQuery("<li>whip</li>");
	eQuery("<li>it</li>");
	eQuery("<li>good</li>");
	eQuery("<div></div>");
	eQuery("<div><div><span></span></div></div>");
	eQuery("<tr><td></td></tr>");
	eQuery("<tr><td></tr>");
	eQuery("<li>aaa</li>");
	eQuery("<ul><li>?</li></ul>");
	eQuery("<div><p>arf</p>nnn</div>");
	eQuery("<div><p>dog</p>?</div>");
	eQuery("<span><span>");

	equal( fragmentCacheSize(), 12, "12 entries exist in eQuery.fragments, 1" );

	eQuery.each( [
		"<tr><td></td></tr>",
		"<ul><li>?</li></ul>",
		"<div><p>dog</p>?</div>",
		"<span><span>"
	], function( i, frag ) {

		eQuery( frag );

		equal( eQuery.fragments[ frag ].nodeType, 11, "Second call with " + frag + " creates a cached DocumentFragment, has nodeType 11" );
		ok( eQuery.fragments[ frag ].childNodes.length, "Second call with " + frag + " creates a cached DocumentFragment, has childNodes with length" );
	});

	equal( fragmentCacheSize(), 12, "12 entries exist in eQuery.fragments, 2" );
});

test("Guard against exceptions when clearing safeChildNodes", function() {
	expect( 1 );

	var div;

	try {
		div = eQuery("<div/><hr/><code/><b/>");
	} catch(e) {}

	ok( div && div.equery, "Created nodes safely, guarded against exceptions on safeChildNodes[ -1 ]" );
});

test("Ensure oldIE creates a new set on appendTo (#8894)", function() {
	expect( 5 );

	strictEqual( eQuery("<div/>").clone().addClass("test").appendTo("<div/>").end().hasClass("test"), false, "Check eQuery.fn.appendTo after eQuery.clone" );
	strictEqual( eQuery("<div/>").find("p").end().addClass("test").appendTo("<div/>").end().hasClass("test"), false, "Check eQuery.fn.appendTo after eQuery.fn.find" );
	strictEqual( eQuery("<div/>").text("test").addClass("test").appendTo("<div/>").end().hasClass("test"), false, "Check eQuery.fn.appendTo after eQuery.fn.text" );
	strictEqual( eQuery("<bdi/>").clone().addClass("test").appendTo("<div/>").end().hasClass("test"), false, "Check eQuery.fn.appendTo after clone html5 element" );
	strictEqual( eQuery("<p/>").appendTo("<div/>").end().length, eQuery("<p>test</p>").appendTo("<div/>").end().length, "Elements created with createElement and with createDocumentFragment should be treated alike" );
});

test("html() - script exceptions bubble (#11743)", function() {
	expect(2);

	raises(function() {
		eQuery("#qunit-fixture").html("<script>undefined(); ok( false, 'error not thrown' );</script>");
		ok( false, "error ignored" );
	}, "exception bubbled from inline script" );

	raises(function() {
		eQuery("#qunit-fixture").html("<script src='data/badcall.js'></script>");
		ok( false, "error ignored" );
	}, "exception bubbled from remote script" );
});

test("checked state is cloned with clone()", function(){
	expect(2);

	var elem = eQuery.parseHTML("<input type='checkbox' checked='checked'/>")[0];
	elem.checked = false;
	equal( eQuery(elem).clone().attr("id","clone")[0].checked, false, "Checked false state correctly cloned" );

	elem = eQuery.parseHTML("<input type='checkbox'/>")[0];
	elem.checked = true;
	equal( eQuery(elem).clone().attr("id","clone")[0].checked, true, "Checked true state correctly cloned" );
});

test("manipulate mixed eQuery and text (#12384, #12346)", function() {
	expect(2);

	var div = eQuery("<div>a</div>").append( "&nbsp;", eQuery("<span>b</span>"), "&nbsp;", eQuery("<span>c</span>") ),
		nbsp = String.fromCharCode(160);
	equal( div.text(), "a" + nbsp + "b" + nbsp+ "c", "Appending mixed eQuery with text nodes" );

	div = eQuery("<div><div></div></div>")
		.find("div")
		.after("<p>a</p>", "<p>b</p>" )
		.parent();
	equal( div.find("*").length, 3, "added 2 paragraphs after inner div" );
});

testIframeWithCallback( "buildFragment works even if document[0] is iframe's window object in IE9/10 (#12266)", "manipulation/iframe-denied.html", function( test ) {
	expect( 1 );

	ok( test.status, test.description );
});
