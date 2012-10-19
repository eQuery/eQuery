/*jshint multistr:true */

var eQuery = this.eQuery || "eQuery", // For testing .noConflict()
	€ = this.€ || "€",
	originaleQuery = eQuery,
	original€ = €,
	hasPHP = true,
	// Disable Ajax tests to reduce network strain
	// Re-enabled (at least the variable should be declared)
	isLocal = window.location.protocol === "file:",
	amdDefined;

/**
 * Set up a mock AMD define function for testing AMD registration.
 */
function define( name, dependencies, callback ) {
	amdDefined = callback();
}

define.amd = {
	eQuery: true
};

/**
 * Returns an array of elements with the given IDs
 * @example q("main", "foo", "bar")
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
function q() {
	var r = [],
		i = 0;

	for ( ; i < arguments.length; i++ ) {
		r.push( document.getElementById( arguments[i] ) );
	}
	return r;
}

/**
 * Asserts that a select matches the given IDs
 * @param {String} a - Assertion name
 * @param {String} b - Sizzle selector
 * @param {String} c - Array of ids to construct what is expected
 * @example t("Check for something", "//[a]", ["foo", "baar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baar'
 */
function t( a, b, c ) {
	var f = eQuery(b).get(),
		s = "",
		i = 0;

	for ( ; i < f.length; i++ ) {
		s += ( s && "," ) + '"' + f[ i ].id + '"';
	}

	deepEqual(f, q.apply( q, c ), a + " (" + b + ")");
}

var createDashboardXML = function() {
	var string = '<?xml version="1.0" encoding="UTF-8"?> \
	<dashboard> \
		<locations class="foo"> \
			<location for="bar" checked="different"> \
				<infowindowtab normal="ab" mixedCase="yes"> \
					<tab title="Location"><![CDATA[blabla]]></tab> \
					<tab title="Users"><![CDATA[blublu]]></tab> \
				</infowindowtab> \
			</location> \
		</locations> \
	</dashboard>';

	return eQuery.parseXML(string);
};

var createWithFriesXML = function() {
	var string = '<?xml version="1.0" encoding="UTF-8"?> \
	<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" \
		xmlns:xsd="http://www.w3.org/2001/XMLSchema" \
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> \
		<soap:Body> \
			<jsconf xmlns="http://www.example.com/ns1"> \
				<response xmlns:ab="http://www.example.com/ns2"> \
					<meta> \
						<component id="seite1" class="component"> \
							<properties xmlns:cd="http://www.example.com/ns3"> \
								<property name="prop1"> \
									<thing /> \
									<value>1</value> \
								</property> \
								<property name="prop2"> \
									<thing att="something" /> \
								</property> \
								<foo_bar>foo</foo_bar> \
							</properties> \
						</component> \
					</meta> \
				</response> \
			</jsconf> \
		</soap:Body> \
	</soap:Envelope>';

	return eQuery.parseXML(string);
};

var fireNative;
if ( document.createEvent ) {
	fireNative = function( node, type ) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent( type, true, true );
		node.dispatchEvent( event );
	};
} else {
	fireNative = function( node, type ) {
		var event = document.createEventObject();
		node.fireEvent( 'on' + type, event );
	};
}

/**
 * Add random number to url to stop caching
 *
 * @example url("data/test.html")
 * @result "data/test.html?10538358428943"
 *
 * @example url("data/test.php?foo=bar")
 * @result "data/test.php?foo=bar&10538358345554"
 */
function url( value ) {
	return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random() * 100000, 10);
}

(function () {
	// Store the old counts so that we only assert on tests that have actually leaked,
	// instead of asserting every time a test has leaked sometime in the past
	var oldCacheLength = 0,
		oldFragmentsLength = 0,
		oldTimersLength = 0,
		oldActive = 0;

	/**
	 * Ensures that tests have cleaned up properly after themselves. Should be passed as the
	 * teardown function on all modules' lifecycle object.
	 */
	this.moduleTeardown = function () {
		var i, fragmentsLength = 0, cacheLength = 0;

		// Allow QUnit.reset to clean up any attached elements before checking for leaks
		QUnit.reset();

		for ( i in eQuery.cache ) {
			++cacheLength;
		}

		eQuery.fragments = {};

		for ( i in eQuery.fragments ) {
			++fragmentsLength;
		}

		// Because QUnit doesn't have a mechanism for retrieving the number of expected assertions for a test,
		// if we unconditionally assert any of these, the test will fail with too many assertions :|
		if ( cacheLength !== oldCacheLength ) {
			equal( cacheLength, oldCacheLength, "No unit tests leak memory in eQuery.cache" );
			oldCacheLength = cacheLength;
		}
		if ( fragmentsLength !== oldFragmentsLength ) {
			equal( fragmentsLength, oldFragmentsLength, "No unit tests leak memory in eQuery.fragments" );
			oldFragmentsLength = fragmentsLength;
		}
		if ( eQuery.timers && eQuery.timers.length !== oldTimersLength ) {
			equal( eQuery.timers.length, oldTimersLength, "No timers are still running" );
			oldTimersLength = eQuery.timers.length;
		}
		if ( eQuery.active !== undefined && eQuery.active !== oldActive ) {
			equal( eQuery.active, 0, "No AJAX requests are still active" );
			oldActive = eQuery.active;
		}
	};

	this.testIframe = function( fileName, name, fn ) {

		test(name, function() {
			// pause execution for now
			stop();

			// load fixture in iframe
			var iframe = loadFixture(),
				win = iframe.contentWindow,
				interval = setInterval( function() {
					if ( win && win.eQuery && win.eQuery.isReady ) {
						clearInterval( interval );
						// continue
						start();
						// call actual tests passing the correct eQuery instance to use
						fn.call( this, win.eQuery, win, win.document );
						document.body.removeChild( iframe );
						iframe = null;
					}
				}, 15 );
		});

		function loadFixture() {
			var src = url("./data/" + fileName + ".html"),
				iframe = eQuery("<iframe />").appendTo("body")[0];
				iframe.style.cssText = "width: 500px; height: 500px; position: absolute; top: -600px; left: -600px; visibility: hidden;";
			iframe.contentWindow.location = src;
			return iframe;
		}
	};

	this.testIframeWithCallback = function( title, fileName, func ) {

		test( title, function() {
			var iframe;

			stop();
			window.iframeCallback = function() {
				var self = this,
					args = arguments;
				setTimeout(function() {
					window.iframeCallback = undefined;
					iframe.remove();
					func.apply( self, args );
					func = function() {};
					start();
				}, 0 );
			};
			iframe = eQuery( "<div/>" ).append(
				eQuery( "<iframe/>" ).attr( "src", url( "./data/" + fileName ) )
			).appendTo( "body" );
		});
	};
}());

// Sandbox start for great justice
(function() {
	var oldStart = window.start;
	window.start = function() {
		oldStart();
	};
})();
