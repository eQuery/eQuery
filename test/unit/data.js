module("data", { teardown: moduleTeardown });

test("expando", function(){
	expect(1);

	equal(eQuery.expando !== undefined, true, "eQuery is exposing the expando");
});

function dataTests (elem) {
	// expect(31)

	function getCacheLength() {
		var cacheLength = 0;
		for (var i in eQuery.cache) {
			++cacheLength;
		}

		return cacheLength;
	}

	var oldCacheLength, dataObj, internalDataObj, expected, actual;
	
	equal( eQuery.data(elem, "foo"), undefined, "No data exists initially" );
	strictEqual( eQuery.hasData(elem), false, "eQuery.hasData agrees no data exists initially" );

	dataObj = eQuery.data(elem);
	equal( typeof dataObj, "object", "Calling data with no args gives us a data object reference" );
	strictEqual( eQuery.data(elem), dataObj, "Calling eQuery.data returns the same data object when called multiple times" );

	strictEqual( eQuery.hasData(elem), false, "eQuery.hasData agrees no data exists even when an empty data obj exists" );

	dataObj["foo"] = "bar";
	equal( eQuery.data(elem, "foo"), "bar", "Data is readable by eQuery.data when set directly on a returned data object" );

	strictEqual( eQuery.hasData(elem), true, "eQuery.hasData agrees data exists when data exists" );

	eQuery.data(elem, "foo", "baz");
	equal( eQuery.data(elem, "foo"), "baz", "Data can be changed by eQuery.data" );
	equal( dataObj["foo"], "baz", "Changes made through eQuery.data propagate to referenced data object" );

	eQuery.data(elem, "foo", undefined);
	equal( eQuery.data(elem, "foo"), "baz", "Data is not unset by passing undefined to eQuery.data" );

	eQuery.data(elem, "foo", null);
	strictEqual( eQuery.data(elem, "foo"), null, "Setting null using eQuery.data works OK" );

	eQuery.data(elem, "foo", "foo1");

	eQuery.data(elem, { "bar" : "baz", "boom" : "bloz" });
	strictEqual( eQuery.data(elem, "foo"), "foo1", "Passing an object extends the data object instead of replacing it" );
	equal( eQuery.data(elem, "boom"), "bloz", "Extending the data object works" );

	eQuery._data(elem, "foo", "foo2", true);
	equal( eQuery._data(elem, "foo"), "foo2", "Setting internal data works" );
	equal( eQuery.data(elem, "foo"), "foo1", "Setting internal data does not override user data" );

	internalDataObj = eQuery._data( elem );
	ok( internalDataObj, "Internal data object exists" );
	notStrictEqual( dataObj, internalDataObj, "Internal data object is not the same as user data object" );

	strictEqual( elem.boom, undefined, "Data is never stored directly on the object" );

	eQuery.removeData(elem, "foo");
	strictEqual( eQuery.data(elem, "foo"), undefined, "eQuery.removeData removes single properties" );

	eQuery.removeData(elem);
	strictEqual( eQuery._data(elem), internalDataObj, "eQuery.removeData does not remove internal data if it exists" );

	eQuery._removeData(elem);

	strictEqual( eQuery._data(elem, eQuery.expando), undefined, "eQuery.removeData on internal data works" );
	strictEqual( eQuery.hasData(elem), false, "eQuery.hasData agrees all data has been removed from object" );

	eQuery._data(elem, "foo", "foo2");
	strictEqual( eQuery.hasData(elem), true, "eQuery.hasData shows data exists even if it is only internal data" );

	eQuery.data(elem, "foo", "foo1");
	equal( eQuery._data(elem, "foo"), "foo2", "Setting user data does not override internal data" );

	// delete the last private data key so we can test removing public data
	// will destroy the cache
	eQuery._removeData( elem, "foo" );

	if (elem.nodeType) {
		oldCacheLength = getCacheLength();
		eQuery.removeData(elem, "foo");

		equal( getCacheLength(), oldCacheLength - 1, "Removing the last item in the data object destroys it" );
	}
	else {
		eQuery.removeData(elem, "foo");


		if (eQuery.support.deleteExpando) {
			expected = false;
			actual = eQuery.expando in elem;
		}
		else {
			expected = null;
			actual = elem[ eQuery.expando ];
		}

		equal( actual, expected, "Removing the last item in the data object destroys it" );
	}

	eQuery.data(elem, "foo", "foo1");
	eQuery._data(elem, "foo", "foo2");

	equal( eQuery.data(elem, "foo"), "foo1", "(sanity check) Ensure data is set in user data object" );
	equal( eQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure data is set in internal data object" );

	eQuery._removeData(elem, "foo");

	strictEqual( eQuery._data(elem, eQuery.expando), undefined, "Removing the last item in internal data destroys the internal data object" );

	eQuery._data(elem, "foo", "foo2");
	equal( eQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure data is set in internal data object" );

	eQuery.removeData(elem, "foo");
	equal( eQuery._data(elem, "foo"), "foo2", "(sanity check) eQuery.removeData for user data does not remove internal data" );

	if ( elem.nodeType ) {
		oldCacheLength = getCacheLength();
		eQuery._removeData(elem, "foo");
		equal( getCacheLength(), oldCacheLength - 1, "Removing the last item in the internal data object also destroys the user data object when it is empty" );
	}
	else {
		eQuery._removeData(elem, "foo");

		if (eQuery.support.deleteExpando) {
			expected = false;
			actual = eQuery.expando in elem;
		}
		else {
			expected = null;
			actual = elem[ eQuery.expando ];
		}

		equal( actual, expected, "Removing the last item in the internal data object also destroys the user data object when it is empty" );
	}
}

test("eQuery.data", function() {
	expect(124);

	var div = document.createElement("div");

	dataTests(div);
	dataTests({});

	// remove bound handlers from window object to stop potential false positives caused by fix for #5280 in
	// transports/xhr.js
	eQuery(window).unbind("unload");

	dataTests(window);
	dataTests(document);

	// clean up unattached element
	eQuery(div).remove();
});

test("eQuery.acceptData", function() {
	expect(7);

	ok( eQuery.acceptData( document ), "document" );
	ok( eQuery.acceptData( document.documentElement ), "documentElement" );
	ok( eQuery.acceptData( {} ), "object" );
	ok( !eQuery.acceptData( document.createElement("embed") ), "embed" );
	ok( !eQuery.acceptData( document.createElement("applet") ), "applet" );

	var flash = document.createElement("object");
	flash.setAttribute("classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
	ok( eQuery.acceptData( flash ), "flash" );

	var applet = document.createElement("object");
	applet.setAttribute("classid", "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93");
	ok( !eQuery.acceptData( applet ), "applet" );
});

test(".data()", function() {
	expect(5);

	var div = eQuery("#foo");
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is undefined" );
	div.data("test", "success");

	var dataObj = div.data();

	deepEqual( dataObj, {test: "success"}, "data() get the entire data object" );
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is still undefined" );

	var nodiv = eQuery("#unfound");
	equal( nodiv.data(), null, "data() on empty set returns null" );

	var obj = { foo: "bar" };
	eQuery(obj).data("foo", "baz");

	dataObj = eQuery.extend(true, {}, eQuery(obj).data());

	deepEqual( dataObj, { "foo": "baz" }, "Retrieve data object from a wrapped JS object (#7524)" );
});

test(".data(String) and .data(String, Object)", function() {
	expect(29);
	var parent = eQuery("<div><div></div></div>"),
		div = parent.children();

	parent
		.bind("getData", function(){ ok( false, "getData bubbled." ); })
		.bind("setData", function(){ ok( false, "setData bubbled." ); })
		.bind("changeData", function(){ ok( false, "changeData bubbled." ); });

	ok( div.data("test") === undefined, "Check for no data exists" );

	div.data("test", "success");
	equal( div.data("test"), "success", "Check for added data" );

	div.data("test", "overwritten");
	equal( div.data("test"), "overwritten", "Check for overwritten data" );

	equal( div.data("test", undefined).data("test"), "overwritten", "Check that .data('key',undefined) does nothing but is chainable (#5571)");

	div.data("test", null);
	ok( div.data("test") === null, "Check for null data");

	ok( div.data("notexist") === undefined, "Check for no data exists" );

	div.data("test", "overwritten");
	var hits = {test:0}, gets = {test:0}, changes = {test:0, value:null};


	function logChangeData(e,key,value) {
		var dataKey = key;
		if ( e.namespace ) {
			dataKey = dataKey + "." + e.namespace;
		}
		changes[key] += value;
		changes.value = eQuery.data(e.target, dataKey);
	}

	div
		.bind("setData",function(e,key,value){ hits[key] += value; })
		.bind("setData.foo",function(e,key,value){ hits[key] += value; })
		.bind("changeData",logChangeData)
		.bind("changeData.foo",logChangeData)
		.bind("getData",function(e,key){ gets[key] += 1; })
		.bind("getData.foo",function(e,key){ gets[key] += 3; });

	div.data("test.foo", 2);
	equal( div.data("test"), "overwritten", "Check for original data" );
	equal( div.data("test.foo"), 2, "Check for namespaced data" );
	equal( div.data("test.bar"), "overwritten", "Check for unmatched namespace" );
	equal( hits.test, 2, "Check triggered setter functions" );
	equal( gets.test, 5, "Check triggered getter functions" );
	equal( changes.test, 2, "Check sets raise changeData");
	equal( changes.value, 2, "Check changeData after data has been set" );

	hits.test = 0;
	gets.test = 0;
	changes.test = 0;
	changes.value = null;

	div.data("test", 1);
	equal( div.data("test"), 1, "Check for original data" );
	equal( div.data("test.foo"), 2, "Check for namespaced data" );
	equal( div.data("test.bar"), 1, "Check for unmatched namespace" );
	equal( hits.test, 1, "Check triggered setter functions" );
	equal( gets.test, 5, "Check triggered getter functions" );
	equal( changes.test, 1, "Check sets raise changeData" );
	equal( changes.value, 1, "Check changeData after data has been set" );

	div
		.bind("getData",function(e,key){ return key + "root"; })
		.bind("getData.foo",function(e,key){ return key + "foo"; });

	equal( div.data("test"), "testroot", "Check for original data" );
	equal( div.data("test.foo"), "testfoo", "Check for namespaced data" );
	equal( div.data("test.bar"), "testroot", "Check for unmatched namespace" );

	// #3748
	var €elem = eQuery({exists:true});
	equal( €elem.data("nothing"), undefined, "Non-existent data returns undefined");
	equal( €elem.data("null", null).data("null"), null, "null's are preserved");
	equal( €elem.data("emptyString", "").data("emptyString"), "", "Empty strings are preserved");
	equal( €elem.data("false", false).data("false"), false, "false's are preserved");
	equal( €elem.data("exists"), undefined, "Existing data is not returned" );

	// Clean up
	€elem.removeData();
	deepEqual( €elem[0], {exists:true}, "removeData does not clear the object" );

	// manually clean up detached elements
	parent.remove();
});

test("data-* attributes", function() {
	expect(40);
	var div = eQuery("<div>"),
		child = eQuery("<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>"),
		dummy = eQuery("<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>");

	equal( div.data("attr"), undefined, "Check for non-existing data-attr attribute" );

	div.attr("data-attr", "exists");
	equal( div.data("attr"), "exists", "Check for existing data-attr attribute" );

	div.attr("data-attr", "exists2");
	equal( div.data("attr"), "exists", "Check that updates to data- don't update .data()" );

	div.data("attr", "internal").attr("data-attr", "external");
	equal( div.data("attr"), "internal", "Check for .data('attr') precedence (internal > external data-* attribute)" );

	div.remove();

	child.appendTo("#qunit-fixture");
	equal( child.data("myobj"), "old data", "Value accessed from data-* attribute");

	child.data("myobj", "replaced");
	equal( child.data("myobj"), "replaced", "Original data overwritten");

	child.data("ignored", "cache");
	equal( child.data("ignored"), "cache", "Cached data used before DOM data-* fallback");

	var prop,
			obj = child.data(),
			obj2 = dummy.data(),
			check = [ "myobj", "ignored", "other" ],
			num = 0,
			num2 = 0;

	dummy.remove();

	for ( var i = 0, l = check.length; i < l; i++ ) {
		ok( obj[ check[i] ], "Make sure data- property exists when calling data-." );
		ok( obj2[ check[i] ], "Make sure data- property exists when calling data-." );
	}

	for ( prop in obj ) {
		num++;
	}

	equal( num, check.length, "Make sure that the right number of properties came through." );

	for ( prop in obj2 ) {
		num2++;
	}

	equal( num2, check.length, "Make sure that the right number of properties came through." );

	child.attr("data-other", "newvalue");

	equal( child.data("other"), "test", "Make sure value was pulled in properly from a .data()." );

	child
		.attr("data-true", "true")
		.attr("data-false", "false")
		.attr("data-five", "5")
		.attr("data-point", "5.5")
		.attr("data-pointe", "5.5E3")
		.attr("data-grande", "5.574E9")
		.attr("data-hexadecimal", "0x42")
		.attr("data-pointbad", "5..5")
		.attr("data-pointbad2", "-.")
		.attr("data-bigassnum", "123456789123456789123456789")
		.attr("data-badjson", "{123}")
		.attr("data-badjson2", "[abc]")
		.attr("data-empty", "")
		.attr("data-space", " ")
		.attr("data-null", "null")
		.attr("data-string", "test");

	strictEqual( child.data("true"), true, "Primitive true read from attribute");
	strictEqual( child.data("false"), false, "Primitive false read from attribute");
	strictEqual( child.data("five"), 5, "Primitive number read from attribute");
	strictEqual( child.data("point"), 5.5, "Primitive number read from attribute");
	strictEqual( child.data("pointe"), "5.5E3", "Floating point exponential number read from attribute");
	strictEqual( child.data("grande"), "5.574E9", "Big exponential number read from attribute");
	strictEqual( child.data("hexadecimal"), "0x42", "Hexadecimal number read from attribute");
	strictEqual( child.data("pointbad"), "5..5", "Bad number read from attribute");
	strictEqual( child.data("pointbad2"), "-.", "Bad number read from attribute");
	strictEqual( child.data("bigassnum"), "123456789123456789123456789", "Bad bigass number read from attribute");
	strictEqual( child.data("badjson"), "{123}", "Bad number read from attribute");
	strictEqual( child.data("badjson2"), "[abc]", "Bad number read from attribute");
	strictEqual( child.data("empty"), "", "Empty string read from attribute");
	strictEqual( child.data("space"), " ", "Empty string read from attribute");
	strictEqual( child.data("null"), null, "Primitive null read from attribute");
	strictEqual( child.data("string"), "test", "Typical string read from attribute");

	child.remove();

	// tests from metadata plugin
	function testData(index, elem) {
		switch (index) {
		case 0:
			equal(eQuery(elem).data("foo"), "bar", "Check foo property");
			equal(eQuery(elem).data("bar"), "baz", "Check baz property");
			break;
		case 1:
			equal(eQuery(elem).data("test"), "bar", "Check test property");
			equal(eQuery(elem).data("bar"), "baz", "Check bar property");
			break;
		case 2:
			equal(eQuery(elem).data("zoooo"), "bar", "Check zoooo property");
			deepEqual(eQuery(elem).data("bar"), {"test":"baz"}, "Check bar property");
			break;
		case 3:
			equal(eQuery(elem).data("number"), true, "Check number property");
			deepEqual(eQuery(elem).data("stuff"), [2,8], "Check stuff property");
			break;
		default:
			ok(false, ["Assertion failed on index ", index, ", with data"].join(""));
		}
	}

	var metadata = "<ol><li class='test test2' data-foo='bar' data-bar='baz' data-arr='[1,2]'>Some stuff</li><li class='test test2' data-test='bar' data-bar='baz'>Some stuff</li><li class='test test2' data-zoooo='bar' data-bar='{\"test\":\"baz\"}'>Some stuff</li><li class='test test2' data-number=true data-stuff='[2,8]'>Some stuff</li></ol>",
		elem = eQuery(metadata).appendTo("#qunit-fixture");

	elem.find("li").each(testData);
	elem.remove();
});

test(".data(Object)", function() {
	expect(4);

	var div = eQuery("<div/>");

	div.data({ "test": "in", "test2": "in2" });
	equal( div.data("test"), "in", "Verify setting an object in data" );
	equal( div.data("test2"), "in2", "Verify setting an object in data" );

	var obj = {test:"unset"},
		jqobj = eQuery(obj);
	jqobj.data("test", "unset");
	jqobj.data({ "test": "in", "test2": "in2" });
	equal( eQuery.data(obj)["test"], "in", "Verify setting an object on an object extends the data object" );
	equal( obj["test2"], undefined, "Verify setting an object on an object does not extend the object" );

	// manually clean up detached elements
	div.remove();
});

test("eQuery.removeData", function() {
	expect(10);
	var div = eQuery("#foo")[0];
	eQuery.data(div, "test", "testing");
	eQuery.removeData(div, "test");
	equal( eQuery.data(div, "test"), undefined, "Check removal of data" );

	eQuery.data(div, "test2", "testing");
	eQuery.removeData( div );
	ok( !eQuery.data(div, "test2"), "Make sure that the data property no longer exists." );
	ok( !div[ eQuery.expando ], "Make sure the expando no longer exists, as well." );

	eQuery.data(div, {
		test3: "testing",
		test4: "testing"
	});
	eQuery.removeData( div, "test3 test4" );
	ok( !eQuery.data(div, "test3") || eQuery.data(div, "test4"), "Multiple delete with spaces." );

	eQuery.data(div, {
		test3: "testing",
		test4: "testing"
	});
	eQuery.removeData( div, [ "test3", "test4" ] );
	ok( !eQuery.data(div, "test3") || eQuery.data(div, "test4"), "Multiple delete by array." );

	eQuery.data(div, {
		"test3 test4": "testing",
		"test3": "testing"
	});
	eQuery.removeData( div, "test3 test4" );
	ok( !eQuery.data(div, "test3 test4"), "Multiple delete with spaces deleted key with exact name" );
	ok( eQuery.data(div, "test3"), "Left the partial matched key alone" );

	var obj = {};
	eQuery.data(obj, "test", "testing");
	equal( eQuery(obj).data("test"), "testing", "verify data on plain object");
	eQuery.removeData(obj, "test");
	equal( eQuery.data(obj, "test"), undefined, "Check removal of data on plain object" );

	eQuery.data( window, "BAD", true );
	eQuery.removeData( window, "BAD" );
	ok( !eQuery.data( window, "BAD" ), "Make sure that the value was not still set." );
});

test(".removeData()", function() {
	expect(6);
	var div = eQuery("#foo");
	div.data("test", "testing");
	div.removeData("test");
	equal( div.data("test"), undefined, "Check removal of data" );

	div.data("test", "testing");
	div.data("test.foo", "testing2");
	div.removeData("test.bar");
	equal( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equal( div.data("test"), "testing", "Make sure data is intact" );

	div.removeData("test");
	equal( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equal( div.data("test"), undefined, "Make sure data is intact" );

	div.removeData("test.foo");
	equal( div.data("test.foo"), undefined, "Make sure data is intact" );
});

if (window.JSON && window.JSON.stringify) {
	test("JSON serialization (#8108)", function () {
		expect(1);

		var obj = { "foo": "bar" };
		eQuery.data(obj, "hidden", true);

		equal( JSON.stringify(obj), "{\"foo\":\"bar\"}", "Expando is hidden from JSON.stringify" );
	});
}

test("eQuery.data should follow html5 specification regarding camel casing", function() {
	expect(10);

	var div = eQuery("<div id='myObject' data-w-t-f='ftw' data-big-a-little-a='bouncing-b' data-foo='a' data-foo-bar='b' data-foo-bar-baz='c'></div>")
		.prependTo("body");

	equal( div.data()["wTF"], "ftw", "Verify single letter data-* key" );
	equal( div.data()["bigALittleA"], "bouncing-b", "Verify single letter mixed data-* key" );

	equal( div.data()["foo"], "a", "Verify single word data-* key" );
	equal( div.data()["fooBar"], "b", "Verify multiple word data-* key" );
	equal( div.data()["fooBarBaz"], "c", "Verify multiple word data-* key" );

	equal( div.data("foo"), "a", "Verify single word data-* key" );
	equal( div.data("fooBar"), "b", "Verify multiple word data-* key" );
	equal( div.data("fooBarBaz"), "c", "Verify multiple word data-* key" );

	div.data("foo-bar", "d");

	equal( div.data("fooBar"), "d", "Verify updated data-* key" );
	equal( div.data("foo-bar"), "d", "Verify updated data-* key" );

	div.remove();
});

test("eQuery.data should not miss data with preset hyphenated property names", function() {

	expect(2);

	var div = eQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		test = {
			"camelBar": "camelBar",
			"hyphen-foo": "hyphen-foo"
		};

	div.data( test );

	eQuery.each( test , function(i, k) {
		equal( div.data(k), k, "data with property '"+k+"' was correctly found");
	});
});

test("eQuery.data supports interoperable hyphenated/camelCase get/set of properties with arbitrary non-null|NaN|undefined values", function() {

	var div = eQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		datas = {
			"non-empty": "a string",
			"empty-string": "",
			"one-value": 1,
			"zero-value": 0,
			"an-array": [],
			"an-object": {},
			"bool-true": true,
			"bool-false": false,
			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": "{ \"foo\": \"bar\" }",
			"num-1-middle": true,
			"num-end-2": true,
			"2-num-start": true
		};

	expect( 24 );

	eQuery.each( datas, function( key, val ) {
		div.data( key, val );

		deepEqual( div.data( key ), val, "get: " + key );
		deepEqual( div.data( eQuery.camelCase( key ) ), val, "get: " + eQuery.camelCase( key ) );
	});
});

test("eQuery.data supports interoperable removal of hyphenated/camelCase properties", function() {
	var div = eQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		datas = {
			"non-empty": "a string",
			"empty-string": "",
			"one-value": 1,
			"zero-value": 0,
			"an-array": [],
			"an-object": {},
			"bool-true": true,
			"bool-false": false,
			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": "{ \"foo\": \"bar\" }"
		};

	expect( 27 );

	eQuery.each( datas, function( key, val ) {
		div.data( key, val );

		deepEqual( div.data( key ), val, "get: " + key );
		deepEqual( div.data( eQuery.camelCase( key ) ), val, "get: " + eQuery.camelCase( key ) );

		div.removeData( key );

		equal( div.data( key ), undefined, "get: " + key );

	});
});

// Test originally by Moschel
test("Triggering the removeData should not throw exceptions. (#10080)", function() {
	expect(1);
	stop();
	var frame = eQuery("#loadediframe");
	eQuery(frame[0].contentWindow).bind("unload", function() {
		ok(true, "called unload");
		start();
	});
	// change the url to trigger unload
	frame.attr("src", "data/iframe.html?param=true");
});

test( "Only check element attributes once when calling .data() - #8909", function() {
	expect( 2 );
	var testing = {
			"test": "testing",
			"test2": "testing"
		},
		element = eQuery( "<div data-test='testing'>" ),
		node = element[ 0 ];

	// set an attribute using attr to ensure it
	node.setAttribute( "data-test2", "testing" );
	deepEqual( element.data(), testing, "Sanity Check" );

	node.setAttribute( "data-test3", "testing" );
	deepEqual( element.data(), testing, "The data didn't change even though the data-* attrs did" );

	// clean up data cache
	element.remove();
});

test( "JSON data- attributes can have newlines", function() {
	expect(1);

	var x = eQuery("<div data-some='{\n\"foo\":\n\t\"bar\"\n}'></div>");
	equal( x.data("some").foo, "bar", "got a JSON data- attribute with spaces" );
	x.remove();
});