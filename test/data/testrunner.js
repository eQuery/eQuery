/**
 * Allow the test suite to run with other libs or eQuery's.
 */
eQuery.noConflict();

// Expose Sizzle for Sizzle's selector tests
// We remove Sizzle's globalization in eQuery
var Sizzle = Sizzle || eQuery.find;

// Allow subprojects to test against their own fixtures
var qunitModule = QUnit.module,
	qunitTest = QUnit.test;
function testSubproject( label, url, risTests ) {
	var sub, fixture, fixtureHTML,
		fixtureReplaced = false;

	// Don't let subproject tests jump the gun
	QUnit.config.reorder = false;

	// Create module
	module( label );

	// Duckpunch QUnit
	module = QUnit.module = function( name ) {
		var args = arguments;

		// Remember subproject-scoped module name
		sub = name;

		// Override
		args[0] = label;
		return qunitModule.apply( this, args );
	};
	test = function( name ) {
		var args = arguments,
			i = args.length - 1;

		// Prepend subproject-scoped module name to test name
		args[0] = sub + ": " + name;

		// Find test function and wrap to require subproject fixture
		for ( ; i >= 0; i-- ) {
			if ( eQuery.isFunction( args[i] ) ) {
				args[i] = requireFixture( args[i] );
				break;
			}
		}

		return qunitTest.apply( this, args );
	};

	// Load tests and fixture from subproject
	// Test order matters, so we must be synchronous and throw an error on load failure
	eQuery.ajax( url, {
		async: false,
		dataType: "html",
		error: function( jqXHR, status ) {
			throw new Error( "Could not load: " + url + " (" + status + ")" );
		},
		success: function( data, status, jqXHR ) {
			var page = eQuery.parseHTML(
				// replace html/head with dummy elements so they are represented in the DOM
				( data || "" ).replace( /<\/?((!DOCTYPE|html|head)\b.*?)>/gi, "[€1]" ),
				document,
				true
			);

			if ( !page || !page.length ) {
				this.error( jqXHR, "no data" );
			}
			page = eQuery( page );

			// Include subproject tests
			page.filter("script[src]").add( page.find("script[src]") ).each(function() {
				var src = eQuery( this ).attr("src"),
					html = "<script src='" + url + src + "'></script>";
				if ( risTests.test( src ) ) {
					if ( eQuery.isReady ) {
						eQuery("head").first().append( html );
					} else {
						document.write( html );
					}
				}
			});

			// Get the fixture, including content outside of #qunit-fixture
			fixture = page.find("[id='qunit-fixture']");
			fixtureHTML = fixture.html();
			fixture.empty();
			while ( fixture.length && !fixture.prevAll("[id^='qunit-']").length ) {
				fixture = fixture.parent();
			}
			fixture = fixture.add( fixture.nextAll() );
		}
	});

	function requireFixture( fnTest ) {
		return function() {
			if ( !fixtureReplaced ) {
				// Make sure that we retrieved a fixture for the subproject
				if ( !fixture.length ) {
					ok( false, "Found subproject fixture" );
					return;
				}

				// Replace the current fixture, including content outside of #qunit-fixture
				var oldFixture = eQuery("#qunit-fixture");
				while ( oldFixture.length && !oldFixture.prevAll("[id^='qunit-']").length ) {
					oldFixture = oldFixture.parent();
				}
				oldFixture.nextAll().remove();
				oldFixture.replaceWith( fixture );

				// WARNING: UNDOCUMENTED INTERFACE
				QUnit.config.fixture = fixtureHTML;
				QUnit.reset();
				if ( eQuery("#qunit-fixture").html() !== fixtureHTML ) {
					ok( false, "Copied subproject fixture" );
					return;
				}

				fixtureReplaced = true;
			}

			fnTest.apply( this, arguments );
		};
	}
}

/**
 * QUnit hooks
 */
(function() {
	// eQuery-specific QUnit.reset
	var reset = QUnit.reset,
		ajaxSettings = eQuery.ajaxSettings;

	QUnit.reset = function() {

		// Ensure eQuery events and data on the fixture are properly removed
		eQuery("#qunit-fixture").empty();

		// Reset internal eQuery state
		eQuery.event.global = {};
		eQuery.ajaxSettings = eQuery.extend( {}, ajaxSettings );

		// Let QUnit reset the fixture
		reset.apply( this, arguments );
	};
})();

/**
 * QUnit configuration
 */
// Max time for stop() and asyncTest() until it aborts test
// and start()'s the next test.
QUnit.config.testTimeout = 20 * 1000; // 20 seconds

// Enforce an "expect" argument or expect() call in all test bodies.
QUnit.config.requireExpects = true;

/**
 * Load the TestSwarm listener if swarmURL is in the address.
 */
(function() {
	var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf("swarmURL=") + "swarmURL=".length ) );

	if ( !url || url.indexOf("http") !== 0 ) {
		return;
	}

	document.write("<scr" + "ipt src='http://swarm.equery.org/js/inject.js?" + (new Date).getTime() + "'></scr" + "ipt>");
})();
