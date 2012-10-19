module("traversing", { teardown: moduleTeardown });

test("find(String)", function() {
	expect(5);
	equal( "Yahoo", eQuery("#foo").find(".blogTest").text(), "Check for find" );

	// using contents will get comments regular, text, and comment nodes
	var j = eQuery("#nonnodes").contents();
	equal( j.find("div").length, 0, "Check node,textnode,comment to find zero divs" );

	deepEqual( eQuery("#qunit-fixture").find("> div").get(), q("foo", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest"), "find child elements" );
	deepEqual( eQuery("#qunit-fixture").find("> #foo, > #moretests").get(), q("foo", "moretests"), "find child elements" );
	deepEqual( eQuery("#qunit-fixture").find("> #foo > p").get(), q("sndp", "en", "sap"), "find child elements" );
});

test("find(node|eQuery object)", function() {
	expect( 11 );

	var €foo = eQuery("#foo"),
		€blog = eQuery(".blogTest"),
		€first = eQuery("#first"),
		€two = €blog.add( €first ),
		€fooTwo = €foo.add( €blog );

	equal( €foo.find( €blog ).text(), "Yahoo", "Find with blog eQuery object" );
	equal( €foo.find( €blog[0] ).text(), "Yahoo", "Find with blog node" );
	equal( €foo.find( €first ).length, 0, "#first is not in #foo" );
	equal( €foo.find( €first[0]).length, 0, "#first not in #foo (node)" );
	ok( €foo.find( €two ).is(".blogTest"), "Find returns only nodes within #foo" );
	ok( €fooTwo.find( €blog ).is(".blogTest"), "Blog is part of the collection, but also within foo" );
	ok( €fooTwo.find( €blog[0] ).is(".blogTest"), "Blog is part of the collection, but also within foo(node)" );

	equal( €two.find( €foo ).length, 0, "Foo is not in two elements" );
	equal( €two.find( €foo[0] ).length, 0, "Foo is not in two elements(node)" );
	equal( €two.find( €first ).length, 0, "first is in the collection and not within two" );
	equal( €two.find( €first ).length, 0, "first is in the collection and not within two(node)" );

});

test("is(String|undefined)", function() {
	expect(30);
	ok( eQuery("#form").is("form"), "Check for element: A form must be a form" );
	ok( !eQuery("#form").is("div"), "Check for element: A form is not a div" );
	ok( eQuery("#mark").is(".blog"), "Check for class: Expected class 'blog'" );
	ok( !eQuery("#mark").is(".link"), "Check for class: Did not expect class 'link'" );
	ok( eQuery("#simon").is(".blog.link"), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !eQuery("#simon").is(".blogTest"), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( eQuery("#en").is("[lang=\"en\"]"), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !eQuery("#en").is("[lang=\"de\"]"), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( eQuery("#text1").is("[type=\"text\"]"), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !eQuery("#text1").is("[type=\"radio\"]"), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( eQuery("#text2").is(":disabled"), "Check for pseudoclass: Expected to be disabled" );
	ok( !eQuery("#text1").is(":disabled"), "Check for pseudoclass: Expected not disabled" );
	ok( eQuery("#radio2").is(":checked"), "Check for pseudoclass: Expected to be checked" );
	ok( !eQuery("#radio1").is(":checked"), "Check for pseudoclass: Expected not checked" );
	ok( eQuery("#foo").is(":has(p)"), "Check for child: Expected a child 'p' element" );
	ok( !eQuery("#foo").is(":has(ul)"), "Check for child: Did not expect 'ul' element" );
	ok( eQuery("#foo").is(":has(p):has(a):has(code)"), "Check for childs: Expected 'p', 'a' and 'code' child elements" );
	ok( !eQuery("#foo").is(":has(p):has(a):has(code):has(ol)"), "Check for childs: Expected 'p', 'a' and 'code' child elements, but no 'ol'" );

	ok( !eQuery("#foo").is(0), "Expected false for an invalid expression - 0" );
	ok( !eQuery("#foo").is(null), "Expected false for an invalid expression - null" );
	ok( !eQuery("#foo").is(""), "Expected false for an invalid expression - \"\"" );
	ok( !eQuery("#foo").is(undefined), "Expected false for an invalid expression - undefined" );
	ok( !eQuery("#foo").is({ plain: "object" }), "Check passing invalid object" );

	// test is() with comma-seperated expressions
	ok( eQuery("#en").is("[lang=\"en\"],[lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( eQuery("#en").is("[lang=\"de\"],[lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( eQuery("#en").is("[lang=\"en\"] , [lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( eQuery("#en").is("[lang=\"de\"] , [lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );

	ok( !eQuery(window).is("a"), "Checking is on a window does not throw an exception(#10178)" );
	ok( !eQuery(document).is("a"), "Checking is on a document does not throw an exception(#10178)" );

	ok( eQuery("#option1b").is("#select1 option:not(:first)"), "POS inside of :not() (#10970)" );
});

test("is(eQuery)", function() {
	expect(21);
	ok( eQuery("#form").is( eQuery("form") ), "Check for element: A form is a form" );
	ok( !eQuery("#form").is( eQuery("div") ), "Check for element: A form is not a div" );
	ok( eQuery("#mark").is( eQuery(".blog") ), "Check for class: Expected class 'blog'" );
	ok( !eQuery("#mark").is( eQuery(".link") ), "Check for class: Did not expect class 'link'" );
	ok( eQuery("#simon").is( eQuery(".blog.link") ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !eQuery("#simon").is( eQuery(".blogTest") ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( eQuery("#en").is( eQuery("[lang=\"en\"]") ), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !eQuery("#en").is( eQuery("[lang=\"de\"]") ), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( eQuery("#text1").is( eQuery("[type=\"text\"]") ), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !eQuery("#text1").is( eQuery("[type=\"radio\"]") ), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( !eQuery("#text1").is( eQuery("input:disabled") ), "Check for pseudoclass: Expected not disabled" );
	ok( eQuery("#radio2").is( eQuery("input:checked") ), "Check for pseudoclass: Expected to be checked" );
	ok( !eQuery("#radio1").is( eQuery("input:checked") ), "Check for pseudoclass: Expected not checked" );
	ok( eQuery("#foo").is( eQuery("div:has(p)") ), "Check for child: Expected a child 'p' element" );
	ok( !eQuery("#foo").is( eQuery("div:has(ul)") ), "Check for child: Did not expect 'ul' element" );

	// Some raw elements
	ok( eQuery("#form").is( eQuery("form")[0] ), "Check for element: A form is a form" );
	ok( !eQuery("#form").is( eQuery("div")[0] ), "Check for element: A form is not a div" );
	ok( eQuery("#mark").is( eQuery(".blog")[0] ), "Check for class: Expected class 'blog'" );
	ok( !eQuery("#mark").is( eQuery(".link")[0] ), "Check for class: Did not expect class 'link'" );
	ok( eQuery("#simon").is( eQuery(".blog.link")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !eQuery("#simon").is( eQuery(".blogTest")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
});

test("is() with positional selectors", function() {
	expect(23);

	var html = eQuery(
				"<p id='posp'><a class='firsta' href='#'><em>first</em></a><a class='seconda' href='#'><b>test</b></a><em></em></p>"
			).appendTo( "body" ),
		isit = function(sel, match, expect) {
			equal( eQuery( sel ).is( match ), expect, "eQuery( " + sel + " ).is( " + match + " )" );
		};

	isit( "#posp", "#posp:first", true );
	isit( "#posp", "#posp:eq(2)", false );
	isit( "#posp", "#posp a:first", false );

	isit( "#posp .firsta", "#posp a:first", true );
	isit( "#posp .firsta", "#posp a:last", false );
	isit( "#posp .firsta", "#posp a:even", true );
	isit( "#posp .firsta", "#posp a:odd", false );
	isit( "#posp .firsta", "#posp a:eq(0)", true );
	isit( "#posp .firsta", "#posp a:eq(9)", false );
	isit( "#posp .firsta", "#posp em:eq(0)", false );
	isit( "#posp .firsta", "#posp em:first", false );
	isit( "#posp .firsta", "#posp:first", false );

	isit( "#posp .seconda", "#posp a:first", false );
	isit( "#posp .seconda", "#posp a:last", true );
	isit( "#posp .seconda", "#posp a:gt(0)", true );
	isit( "#posp .seconda", "#posp a:lt(5)", true );
	isit( "#posp .seconda", "#posp a:lt(1)", false );

	isit( "#posp em", "#posp a:eq(0) em", true );
	isit( "#posp em", "#posp a:lt(1) em", true );
	isit( "#posp em", "#posp a:gt(1) em", false );
	isit( "#posp em", "#posp a:first em", true );
	isit( "#posp em", "#posp a em:last", true );
	isit( "#posp em", "#posp a em:eq(2)", false );

	html.remove();
});

test("index()", function() {
	expect( 2 );

	equal( eQuery("#text2").index(), 2, "Returns the index of a child amongst its siblings" );

	equal( eQuery("<div/>").index(), -1, "Node without parent returns -1" );
});

test("index(Object|String|undefined)", function() {
	expect(16);

	var elements = eQuery([window, document]),
		inputElements = eQuery("#radio1,#radio2,#check1,#check2");

	// Passing a node
	equal( elements.index(window), 0, "Check for index of elements" );
	equal( elements.index(document), 1, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("radio1")), 0, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("radio2")), 1, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("check1")), 2, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("check2")), 3, "Check for index of elements" );
	equal( inputElements.index(window), -1, "Check for not found index" );
	equal( inputElements.index(document), -1, "Check for not found index" );

	// Passing a eQuery object
	// enabled since [5500]
	equal( elements.index( elements ), 0, "Pass in a eQuery object" );
	equal( elements.index( elements.eq(1) ), 1, "Pass in a eQuery object" );
	equal( eQuery("#form :radio").index( eQuery("#radio2") ), 1, "Pass in a eQuery object" );

	// Passing a selector or nothing
	// enabled since [6330]
	equal( eQuery("#text2").index(), 2, "Check for index amongst siblings" );
	equal( eQuery("#form").children().eq(4).index(), 4, "Check for index amongst siblings" );
	equal( eQuery("#radio2").index("#form :radio") , 1, "Check for index within a selector" );
	equal( eQuery("#form :radio").index( eQuery("#radio2") ), 1, "Check for index within a selector" );
	equal( eQuery("#radio2").index("#form :text") , -1, "Check for index not found within a selector" );
});

test("filter(Selector|undefined)", function() {
	expect(9);
	deepEqual( eQuery("#form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	deepEqual( eQuery("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	deepEqual( eQuery("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );

	deepEqual( eQuery("p").filter(null).get(),      [], "filter(null) should return an empty eQuery object");
	deepEqual( eQuery("p").filter(undefined).get(), [], "filter(undefined) should return an empty eQuery object");
	deepEqual( eQuery("p").filter(0).get(),         [], "filter(0) should return an empty eQuery object");
	deepEqual( eQuery("p").filter("").get(),        [], "filter('') should return an empty eQuery object");

	// using contents will get comments regular, text, and comment nodes
	var j = eQuery("#nonnodes").contents();
	equal( j.filter("span").length, 1, "Check node,textnode,comment to filter the one span" );
	equal( j.filter("[name]").length, 0, "Check node,textnode,comment to filter the one span" );
});

test("filter(Function)", function() {
	expect(2);

	deepEqual( eQuery("#qunit-fixture p").filter(function() {
		return !eQuery("a", this).length;
	}).get(), q("sndp", "first"), "filter(Function)" );

	deepEqual( eQuery("#qunit-fixture p").filter(function(i, elem) { return !eQuery("a", elem).length; }).get(), q("sndp", "first"), "filter(Function) using arg" );
});

test("filter(Element)", function() {
	expect(1);

	var element = document.getElementById("text1");
	deepEqual( eQuery("#form input").filter(element).get(), q("text1"), "filter(Element)" );
});

test("filter(Array)", function() {
	expect(1);

	var elements = [ document.getElementById("text1") ];
	deepEqual( eQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
});

test("filter(eQuery)", function() {
	expect(1);

	var elements = eQuery("#text1");
	deepEqual( eQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
});


test("filter() with positional selectors", function() {
	expect(19);

	var html = eQuery( "" +
		"<p id='posp'>" +
			"<a class='firsta' href='#'>" +
				"<em>first</em>" +
			"</a>" +
			"<a class='seconda' href='#'>" +
				"<b>test</b>" +
			"</a>" +
			"<em></em>" +
		"</p>" ).appendTo( "body" ),
		filterit = function(sel, filter, length) {
			equal( eQuery( sel ).filter( filter ).length, length, "eQuery( " + sel + " ).filter( " + filter + " )" );
		};

	filterit( "#posp", "#posp:first", 1);
	filterit( "#posp", "#posp:eq(2)", 0 );
	filterit( "#posp", "#posp a:first", 0 );

	// Keep in mind this is within the selection and
	// not in relation to other elements (.is() is a different story)
	filterit( "#posp .firsta", "#posp a:first", 1 );
	filterit( "#posp .firsta", "#posp a:last", 1 );
	filterit( "#posp .firsta", "#posp a:last-child", 0 );
	filterit( "#posp .firsta", "#posp a:even", 1 );
	filterit( "#posp .firsta", "#posp a:odd", 0 );
	filterit( "#posp .firsta", "#posp a:eq(0)", 1 );
	filterit( "#posp .firsta", "#posp a:eq(9)", 0 );
	filterit( "#posp .firsta", "#posp em:eq(0)", 0 );
	filterit( "#posp .firsta", "#posp em:first", 0 );
	filterit( "#posp .firsta", "#posp:first", 0 );

	filterit( "#posp .seconda", "#posp a:first", 1 );
	filterit( "#posp .seconda", "#posp em:first", 0 );
	filterit( "#posp .seconda", "#posp a:last", 1 );
	filterit( "#posp .seconda", "#posp a:gt(0)", 0 );
	filterit( "#posp .seconda", "#posp a:lt(5)", 1 );
	filterit( "#posp .seconda", "#posp a:lt(1)", 1 );
	html.remove();
});

test("closest()", function() {
	expect( 14 );

	deepEqual( eQuery("body").closest("body").get(), q("body"), "closest(body)" );
	deepEqual( eQuery("body").closest("html").get(), q("html"), "closest(html)" );
	deepEqual( eQuery("body").closest("div").get(), [], "closest(div)" );
	deepEqual( eQuery("#qunit-fixture").closest("span,#html").get(), q("html"), "closest(span,#html)" );

	deepEqual( eQuery("div:eq(1)").closest("div:first").get(), [], "closest(div:first)" );
	deepEqual( eQuery("div").closest("body:first div:last").get(), q("fx-tests"), "closest(body:first div:last)" );

	// Test .closest() limited by the context
	var jq = eQuery("#nothiddendivchild");
	deepEqual( jq.closest("html", document.body).get(), [], "Context limited." );
	deepEqual( jq.closest("body", document.body).get(), [], "Context limited." );
	deepEqual( jq.closest("#nothiddendiv", document.body).get(), q("nothiddendiv"), "Context not reached." );

	//Test that .closest() returns unique'd set
	equal( eQuery("#qunit-fixture p").closest("#qunit-fixture").length, 1, "Closest should return a unique set" );

	// Test on disconnected node
	equal( eQuery("<div><p></p></div>").find("p").closest("table").length, 0, "Make sure disconnected closest work." );

	// Bug #7369
	equal( eQuery("<div foo='bar'></div>").closest("[foo]").length, 1, "Disconnected nodes with attribute selector" );
	equal( eQuery("<div>text</div>").closest("[lang]").length, 0, "Disconnected nodes with text and non-existent attribute selector" );

	ok( !eQuery(document).closest("#foo").length, "Calling closest on a document fails silently" );
});

test("closest(eQuery)", function() {
	expect(8);
	var €child = eQuery("#nothiddendivchild"),
		€parent = eQuery("#nothiddendiv"),
		€main = eQuery("#qunit-fixture"),
		€body = eQuery("body");
	ok( €child.closest( €parent ).is("#nothiddendiv"), "closest( eQuery('#nothiddendiv') )" );
	ok( €child.closest( €parent[0] ).is("#nothiddendiv"), "closest( eQuery('#nothiddendiv') ) :: node" );
	ok( €child.closest( €child ).is("#nothiddendivchild"), "child is included" );
	ok( €child.closest( €child[0] ).is("#nothiddendivchild"), "child is included  :: node" );
	equal( €child.closest( document.createElement("div") ).length, 0, "created element is not related" );
	equal( €child.closest( €main ).length, 0, "Main not a parent of child" );
	equal( €child.closest( €main[0] ).length, 0, "Main not a parent of child :: node" );
	ok( €child.closest( €body.add(€parent) ).is("#nothiddendiv"), "Closest ancestor retrieved." );
});

test("not(Selector|undefined)", function() {
	expect(11);
	equal( eQuery("#qunit-fixture > p#ap > a").not("#google").length, 2, "not('selector')" );
	deepEqual( eQuery("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	deepEqual( eQuery("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	deepEqual( eQuery("#form option").not("option.emptyopt:contains('Nothing'),[selected],[value='1']").get(), q("option1c", "option1d", "option2c", "option3d", "option3e", "option4e","option5b"), "not('complex selector')");

	deepEqual( eQuery("#ap *").not("code").get(), q("google", "groups", "anchor1", "mark"), "not('tag selector')" );
	deepEqual( eQuery("#ap *").not("code, #mark").get(), q("google", "groups", "anchor1"), "not('tag, ID selector')" );
	deepEqual( eQuery("#ap *").not("#mark, code").get(), q("google", "groups", "anchor1"), "not('ID, tag selector')");

	var all = eQuery("p").get();
	deepEqual( eQuery("p").not(null).get(),      all, "not(null) should have no effect");
	deepEqual( eQuery("p").not(undefined).get(), all, "not(undefined) should have no effect");
	deepEqual( eQuery("p").not(0).get(),         all, "not(0) should have no effect");
	deepEqual( eQuery("p").not("").get(),        all, "not('') should have no effect");
});

test("not(Element)", function() {
	expect(1);

	var selects = eQuery("#form select");
	deepEqual( selects.not( selects[1] ).get(), q("select1", "select3", "select4", "select5"), "filter out DOM element");
});

test("not(Function)", function() {
	expect(1);

	deepEqual( eQuery("#qunit-fixture p").not(function() { return eQuery("a", this).length; }).get(), q("sndp", "first"), "not(Function)" );
});

test("not(Array)", function() {
	expect(2);

	equal( eQuery("#qunit-fixture > p#ap > a").not(document.getElementById("google")).length, 2, "not(DOMElement)" );
	equal( eQuery("p").not(document.getElementsByTagName("p")).length, 0, "not(Array-like DOM collection)" );
});

test("not(eQuery)", function() {
	expect( 1 );

	deepEqual( eQuery("p").not(eQuery("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(eQuery)" );
});

test("has(Element)", function() {
	expect(3);

	var obj = eQuery("#qunit-fixture").has(eQuery("#sndp")[0]);
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have the element as a descendant" );

	var detached = eQuery("<a><b><i/></b></a>");
	deepEqual( detached.has( detached.find("i")[0] ).get(), detached.get(), "...Even when detached" );

	var multipleParent = eQuery("#qunit-fixture, #header").has(eQuery("#sndp")[0]);
	deepEqual( obj.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );
});

test("has(Selector)", function() {
	expect( 5 );

	var obj = eQuery("#qunit-fixture").has("#sndp");
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have any element matching the selector as a descendant" );

	var detached = eQuery("<a><b><i/></b></a>");
	deepEqual( detached.has("i").get(), detached.get(), "...Even when detached" );

	var multipleParent = eQuery("#qunit-fixture, #header").has("#sndp");
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );

	multipleParent = eQuery("#select1, #select2, #select3").has("#option1a, #option3a");
	deepEqual( multipleParent.get(), q("select1", "select3"), "Multiple contexts are checks correctly" );

	var multipleHas = eQuery("#qunit-fixture").has("#sndp, #first");
	deepEqual( multipleHas.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("has(Arrayish)", function() {
	expect(4);

	var simple = eQuery("#qunit-fixture").has(eQuery("#sndp"));
	deepEqual( simple.get(), q("qunit-fixture"), "Keeps elements that have any element in the eQuery list as a descendant" );

	var detached = eQuery("<a><b><i/></b></a>");
	deepEqual( detached.has( detached.find("i") ).get(), detached.get(), "...Even when detached" );

	var multipleParent = eQuery("#qunit-fixture, #header").has(eQuery("#sndp"));
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have an element in the eQuery list as a descendant" );

	var multipleHas = eQuery("#qunit-fixture").has(eQuery("#sndp, #first"));
	deepEqual( simple.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("addBack()", function() {
	expect(5);
	deepEqual( eQuery("#en").siblings().addBack().get(), q("sndp", "en", "sap"), "Check for siblings and self" );
	deepEqual( eQuery("#foo").children().addBack().get(), q("foo", "sndp", "en", "sap"), "Check for children and self" );
	deepEqual( eQuery("#sndp, #en").parent().addBack().get(), q("foo","sndp","en"), "Check for parent and self" );
	deepEqual( eQuery("#groups").parents("p, div").addBack().get(), q("qunit-fixture", "ap", "groups"), "Check for parents and self" );
	deepEqual( eQuery("#select1 > option").filter(":first-child").addBack(":last-child").get(), q("option1a", "option1d"), "Should contain the last elems plus the *filtered* prior set elements" );
});

test("siblings([String])", function() {
	expect(7);
	deepEqual( eQuery("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	deepEqual( eQuery("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	deepEqual( eQuery("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	deepEqual( eQuery("#foo").siblings("form, b").get(), q("form", "floatTest", "lengthtest", "name-tests", "testForm"), "Check for multiple filters" );
	var set = q("sndp", "en", "sap");
	deepEqual( eQuery("#en, #sndp").siblings().get(), set, "Check for unique results from siblings" );
	deepEqual( eQuery("#option5a").siblings("option[data-attr]").get(), q("option5c"), "Has attribute selector in siblings (#9261)" );
	equal( eQuery("<a/>").siblings().length, 0, "Detached elements have no siblings (#11370)" );
});

test("children([String])", function() {
	expect(3);
	deepEqual( eQuery("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	deepEqual( eQuery("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
	deepEqual( eQuery("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("parent([String])", function() {
	expect(5);
	equal( eQuery("#groups").parent()[0].id, "ap", "Simple parent check" );
	equal( eQuery("#groups").parent("p")[0].id, "ap", "Filtered parent check" );
	equal( eQuery("#groups").parent("div").length, 0, "Filtered parent check, no match" );
	equal( eQuery("#groups").parent("div, p")[0].id, "ap", "Check for multiple filters" );
	deepEqual( eQuery("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );
});

test("parents([String])", function() {
	expect(5);
	equal( eQuery("#groups").parents()[0].id, "ap", "Simple parents check" );
	equal( eQuery("#groups").parents("p")[0].id, "ap", "Filtered parents check" );
	equal( eQuery("#groups").parents("div")[0].id, "qunit-fixture", "Filtered parents check2" );
	deepEqual( eQuery("#groups").parents("p, div").get(), q("ap", "qunit-fixture"), "Check for multiple filters" );
	deepEqual( eQuery("#en, #sndp").parents().get(), q("foo", "qunit-fixture", "dl", "body", "html"), "Check for unique results from parents" );
});

test("parentsUntil([String])", function() {
	expect(9);

	var parents = eQuery("#groups").parents();

	deepEqual( eQuery("#groups").parentsUntil().get(), parents.get(), "parentsUntil with no selector (nextAll)" );
	deepEqual( eQuery("#groups").parentsUntil(".foo").get(), parents.get(), "parentsUntil with invalid selector (nextAll)" );
	deepEqual( eQuery("#groups").parentsUntil("#html").get(), parents.not(":last").get(), "Simple parentsUntil check" );
	equal( eQuery("#groups").parentsUntil("#ap").length, 0, "Simple parentsUntil check" );
	deepEqual( eQuery("#groups").parentsUntil("#html, #body").get(), parents.slice( 0, 3 ).get(), "Less simple parentsUntil check" );
	deepEqual( eQuery("#groups").parentsUntil("#html", "div").get(), eQuery("#qunit-fixture").get(), "Filtered parentsUntil check" );
	deepEqual( eQuery("#groups").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multiple-filtered parentsUntil check" );
	equal( eQuery("#groups").parentsUntil("#html", "span").length, 0, "Filtered parentsUntil check, no match" );
	deepEqual( eQuery("#groups, #ap").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multi-source, multiple-filtered parentsUntil check" );
});

test("next([String])", function() {
	expect(5);
	equal( eQuery("#ap").next()[0].id, "foo", "Simple next check" );
	equal( eQuery("#ap").next("div")[0].id, "foo", "Filtered next check" );
	equal( eQuery("#ap").next("p").length, 0, "Filtered next check, no match" );
	equal( eQuery("#ap").next("div, p")[0].id, "foo", "Multiple filters" );
	equal( eQuery("body").next().length, 0, "Simple next check, no match" );
});

test("prev([String])", function() {
	expect(4);
	equal( eQuery("#foo").prev()[0].id, "ap", "Simple prev check" );
	equal( eQuery("#foo").prev("p")[0].id, "ap", "Filtered prev check" );
	equal( eQuery("#foo").prev("div").length, 0, "Filtered prev check, no match" );
	equal( eQuery("#foo").prev("p, div")[0].id, "ap", "Multiple filters" );
});

test("nextAll([String])", function() {
	expect(4);

	var elems = eQuery("#form").children();

	deepEqual( eQuery("#label-for").nextAll().get(), elems.not(":first").get(), "Simple nextAll check" );
	deepEqual( eQuery("#label-for").nextAll("input").get(), elems.not(":first").filter("input").get(), "Filtered nextAll check" );
	deepEqual( eQuery("#label-for").nextAll("input,select").get(), elems.not(":first").filter("input,select").get(), "Multiple-filtered nextAll check" );
	deepEqual( eQuery("#label-for, #hidden1").nextAll("input,select").get(), elems.not(":first").filter("input,select").get(), "Multi-source, multiple-filtered nextAll check" );
});

test("prevAll([String])", function() {
	expect(4);

	var elems = eQuery( eQuery("#form").children().slice(0, 12).get().reverse() );

	deepEqual( eQuery("#area1").prevAll().get(), elems.get(), "Simple prevAll check" );
	deepEqual( eQuery("#area1").prevAll("input").get(), elems.filter("input").get(), "Filtered prevAll check" );
	deepEqual( eQuery("#area1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multiple-filtered prevAll check" );
	deepEqual( eQuery("#area1, #hidden1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multi-source, multiple-filtered prevAll check" );
});

test("nextUntil([String])", function() {
	expect(11);

	var elems = eQuery("#form").children().slice( 2, 12 );

	deepEqual( eQuery("#text1").nextUntil().get(), eQuery("#text1").nextAll().get(), "nextUntil with no selector (nextAll)" );
	deepEqual( eQuery("#text1").nextUntil(".foo").get(), eQuery("#text1").nextAll().get(), "nextUntil with invalid selector (nextAll)" );
	deepEqual( eQuery("#text1").nextUntil("#area1").get(), elems.get(), "Simple nextUntil check" );
	equal( eQuery("#text1").nextUntil("#text2").length, 0, "Simple nextUntil check" );
	deepEqual( eQuery("#text1").nextUntil("#area1, #radio1").get(), eQuery("#text1").next().get(), "Less simple nextUntil check" );
	deepEqual( eQuery("#text1").nextUntil("#area1", "input").get(), elems.not("button").get(), "Filtered nextUntil check" );
	deepEqual( eQuery("#text1").nextUntil("#area1", "button").get(), elems.not("input").get(), "Filtered nextUntil check" );
	deepEqual( eQuery("#text1").nextUntil("#area1", "button,input").get(), elems.get(), "Multiple-filtered nextUntil check" );
	equal( eQuery("#text1").nextUntil("#area1", "div").length, 0, "Filtered nextUntil check, no match" );
	deepEqual( eQuery("#text1, #hidden1").nextUntil("#area1", "button,input").get(), elems.get(), "Multi-source, multiple-filtered nextUntil check" );

	deepEqual( eQuery("#text1").nextUntil("[class=foo]").get(), eQuery("#text1").nextAll().get(), "Non-element nodes must be skipped, since they have no attributes" );
});

test("prevUntil([String])", function() {
	expect(10);

	var elems = eQuery("#area1").prevAll();

	deepEqual( eQuery("#area1").prevUntil().get(), elems.get(), "prevUntil with no selector (prevAll)" );
	deepEqual( eQuery("#area1").prevUntil(".foo").get(), elems.get(), "prevUntil with invalid selector (prevAll)" );
	deepEqual( eQuery("#area1").prevUntil("label").get(), elems.not(":last").get(), "Simple prevUntil check" );
	equal( eQuery("#area1").prevUntil("#button").length, 0, "Simple prevUntil check" );
	deepEqual( eQuery("#area1").prevUntil("label, #search").get(), eQuery("#area1").prev().get(), "Less simple prevUntil check" );
	deepEqual( eQuery("#area1").prevUntil("label", "input").get(), elems.not(":last").not("button").get(), "Filtered prevUntil check" );
	deepEqual( eQuery("#area1").prevUntil("label", "button").get(), elems.not(":last").not("input").get(), "Filtered prevUntil check" );
	deepEqual( eQuery("#area1").prevUntil("label", "button,input").get(), elems.not(":last").get(), "Multiple-filtered prevUntil check" );
	equal( eQuery("#area1").prevUntil("label", "div").length, 0, "Filtered prevUntil check, no match" );
	deepEqual( eQuery("#area1, #hidden1").prevUntil("label", "button,input").get(), elems.not(":last").get(), "Multi-source, multiple-filtered prevUntil check" );
});

test("contents()", function() {
	expect(12);
	equal( eQuery("#ap").contents().length, 9, "Check element contents" );
	ok( eQuery("#iframe").contents()[0], "Check existance of IFrame document" );
	var ibody = eQuery("#loadediframe").contents()[0].body;
	ok( ibody, "Check existance of IFrame body" );

	equal( eQuery("span", ibody).text(), "span text", "Find span in IFrame and check its text" );

	eQuery(ibody).append("<div>init text</div>");
	equal( eQuery("div", ibody).length, 2, "Check the original div and the new div are in IFrame" );

	equal( eQuery("div:last", ibody).text(), "init text", "Add text to div in IFrame" );

	eQuery("div:last", ibody).text("div text");
	equal( eQuery("div:last", ibody).text(), "div text", "Add text to div in IFrame" );

	eQuery("div:last", ibody).remove();
	equal( eQuery("div", ibody).length, 1, "Delete the div and check only one div left in IFrame" );

	equal( eQuery("div", ibody).text(), "span text", "Make sure the correct div is still left after deletion in IFrame" );

	eQuery("<table/>", ibody).append("<tr><td>cell</td></tr>").appendTo(ibody);
	eQuery("table", ibody).remove();
	equal( eQuery("div", ibody).length, 1, "Check for JS error on add and delete of a table in IFrame" );

	// using contents will get comments regular, text, and comment nodes
	var c = eQuery("#nonnodes").contents().contents();
	equal( c.length, 1, "Check node,textnode,comment contents is just one" );
	equal( c[0].nodeValue, "hi", "Check node,textnode,comment contents is just the one from span" );
});

test("add(String|Element|Array|undefined)", function() {
	expect( 15 );
	deepEqual( eQuery("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	deepEqual( eQuery("#sndp").add( eQuery("#en")[0] ).add( eQuery("#sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );

	// We no longer support .add(form.elements), unfortunately.
	// There is no way, in browsers, to reliably determine the difference
	// between form.elements and form - and doing .add(form) and having it
	// add the form elements is way to unexpected, so this gets the boot.
	// ok( eQuery([]).add(eQuery("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for eQuery(form.elements) since it's ambiguous in IE
	// use eQuery([]).add(form.elements) instead.
	//equal( eQuery([]).add(eQuery("#form")[0].elements).length, eQuery(eQuery("#form")[0].elements).length, "Array in constructor must equals array in add()" );

	var divs = eQuery("<div/>").add("#sndp");
	ok( divs[0].parentNode, "Sort with the disconnected node last (started with disconnected first)." );

	divs = eQuery("#sndp").add("<div/>");
	ok( !divs[1].parentNode, "Sort with the disconnected node last." );

	var tmp = eQuery("<div/>");

	var x = eQuery([]).add(eQuery("<p id='x1'>xxx</p>").appendTo(tmp)).add(eQuery("<p id='x2'>xxx</p>").appendTo(tmp));
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	x = eQuery([]).add(eQuery("<p id='x1'>xxx</p>").appendTo(tmp)[0]).add(eQuery("<p id='x2'>xxx</p>").appendTo(tmp)[0]);
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	x = eQuery([]).add(eQuery("<p id='x1'>xxx</p>")).add(eQuery("<p id='x2'>xxx</p>"));
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	x = eQuery([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	var notDefined;
	equal( eQuery([]).add(notDefined).length, 0, "Check that undefined adds nothing" );

	equal( eQuery([]).add( document.getElementById("form") ).length, 1, "Add a form" );
	equal( eQuery([]).add( document.getElementById("select1") ).length, 1, "Add a select" );
});

test("add(String, Context)", function() {
	expect(6);

	deepEqual( eQuery( "#firstp" ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add selector to selector " );
	deepEqual( eQuery( document.getElementById("firstp") ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add gEBId to selector" );
	deepEqual( eQuery( document.getElementById("firstp") ).add( document.getElementById("ap") ).get(), q( "firstp", "ap" ), "Add gEBId to gEBId" );

	var ctx = document.getElementById("firstp");
	deepEqual( eQuery( "#firstp" ).add( "#ap", ctx ).get(), q( "firstp" ), "Add selector to selector " );
	deepEqual( eQuery( document.getElementById("firstp") ).add( "#ap", ctx ).get(), q( "firstp" ), "Add gEBId to selector, not in context" );
	deepEqual( eQuery( document.getElementById("firstp") ).add( "#ap", document.getElementsByTagName("body")[0] ).get(), q( "firstp", "ap" ), "Add gEBId to selector, in context" );
});

test("eq('-1') #10616", function() {
	expect(3);
	var €divs = eQuery( "div" );

	equal( €divs.eq( -1 ).length, 1, "The number -1 returns a selection that has length 1" );
	equal( €divs.eq( "-1" ).length, 1, "The string '-1' returns a selection that has length 1" );
	deepEqual( €divs.eq( "-1" ), €divs.eq( -1 ), "String and number -1 match" );
});

test("index(no arg) #10977", function() {
	expect(1);
	
	var €list = eQuery("<ul id='indextest'><li>THIS ONE</li><li class='one'>a</li><li class='two'>b</li><li class='three'>c</li></ul>");
	eQuery("#qunit-fixture").append( €list );
	strictEqual ( eQuery( "#indextest li:not(.one,.two)" ).index() , 0, "No Argument Index Check" );
	€list.remove();
});
