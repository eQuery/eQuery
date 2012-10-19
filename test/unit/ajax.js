module( "ajax", {
	teardown: moduleTeardown
});

if ( eQuery.ajax && ( !isLocal || hasPHP ) ) {

	var isOpera = !!window.opera;

	test( "eQuery.ajax() - success callbacks", function() {
		expect( 8 );

		eQuery.ajaxSetup({
			timeout: 0
		});

		stop();

		eQuery("#foo").ajaxStart(function() {
			ok( true, "ajaxStart" );
		}).ajaxStop(function() {
			ok( true, "ajaxStop" );
			start();
		}).ajaxSend(function() {
			ok( true, "ajaxSend" );
		}).ajaxComplete(function() {
			ok( true, "ajaxComplete" );
		}).ajaxError(function() {
			ok( false, "ajaxError" );
		}).ajaxSuccess(function() {
			ok( true, "ajaxSuccess" );
		});

		eQuery.ajax({
			url: url("data/name.html"),
			beforeSend: function() {
				ok( true, "beforeSend" );
			},
			success: function() {
				ok( true, "success" );
			},
			error: function() {
				ok( false, "error" );
			},
			complete: function() {
				ok( true, "complete");
			}
		});
	});

	test( "eQuery.ajax() - success callbacks - (url, options) syntax", function() {
		expect( 8 );

		eQuery.ajaxSetup({
			timeout: 0
		});

		stop();

		setTimeout(function() {
			eQuery("#foo").ajaxStart(function() {
				ok( true, "ajaxStart" );
			}).ajaxStop(function() {
				ok( true, "ajaxStop" );
				start();
			}).ajaxSend(function() {
				ok( true, "ajaxSend" );
			}).ajaxComplete(function() {
				ok( true, "ajaxComplete" );
			}).ajaxError(function() {
				ok( false, "ajaxError" );
			}).ajaxSuccess(function() {
				ok( true, "ajaxSuccess" );
			});

			eQuery.ajax( url("data/name.html"), {
				beforeSend: function() {
					ok( true, "beforeSend" );
				},
				success: function() {
					ok( true, "success" );
				},
				error: function() {
					ok( false, "error" );
				},
				complete: function() {
					ok( true, "complete" );
				}
			});
		}, 13 );
	});

	test( "eQuery.ajax() - success callbacks (late binding)", function() {
		expect( 8 );

		eQuery.ajaxSetup({
			timeout: 0
		});

		stop();

		setTimeout(function() {
			eQuery("#foo").ajaxStart(function() {
				ok( true, "ajaxStart" );
			}).ajaxStop(function() {
				ok( true, "ajaxStop" );
				start();
			}).ajaxSend(function() {
				ok( true, "ajaxSend" );
			}).ajaxComplete(function() {
				ok( true, "ajaxComplete" );
			}).ajaxError(function() {
				ok( false, "ajaxError" );
			}).ajaxSuccess(function() {
				ok( true, "ajaxSuccess" );
			});

			eQuery.ajax({
				url: url("data/name.html"),
				beforeSend: function() {
					ok( true, "beforeSend" );
				}
			}).complete(function() {
				ok( true, "complete" );
			}).success(function() {
				ok( true, "success" );
			}).error(function() {
				ok( false, "error" );
			});
		}, 13 );
	});

	test( "eQuery.ajax() - success callbacks (oncomplete binding)", function() {
		expect( 8 );

		eQuery.ajaxSetup({
			timeout: 0
		});

		stop();

		setTimeout(function() {
			eQuery("#foo").ajaxStart(function() {
				ok( true, "ajaxStart" );
			}).ajaxStop(function() {
				ok( true, "ajaxStop" );
			}).ajaxSend(function() {
				ok( true, "ajaxSend" );
			}).ajaxComplete(function() {
				ok( true, "ajaxComplete" );
			}).ajaxError(function() {
				ok( false, "ajaxError" );
			}).ajaxSuccess(function() {
				ok( true, "ajaxSuccess" );
			});

			eQuery.ajax({
				url: url("data/name.html"),
				beforeSend: function() {
					ok( true, "beforeSend" );
				},
				complete: function( xhr ) {
					xhr.complete(function() {
						ok( true, "complete" );
					}).success(function() {
						ok( true, "success" );
					}).error(function() {
						ok( false, "error" );
					}).complete(function() {
						start();
					});
				}
			});
		}, 13 );
	});

	test( "eQuery.ajax() - success callbacks (very late binding)", function() {
		expect( 8 );

		eQuery.ajaxSetup({
			timeout: 0
		});

		stop();

		setTimeout(function() {
			eQuery("#foo").ajaxStart(function() {
				ok( true, "ajaxStart" );
			}).ajaxStop(function() {
				ok( true, "ajaxStop" );
			}).ajaxSend(function() {
				ok( true, "ajaxSend" );
			}).ajaxComplete(function() {
				ok( true, "ajaxComplete" );
			}).ajaxError(function() {
				ok( false, "ajaxError" );
			}).ajaxSuccess(function() {
				ok( true, "ajaxSuccess" );
			});

			eQuery.ajax({
				url: url("data/name.html"),
				beforeSend: function() {
					ok(true, "beforeSend");
				},
				complete: function( xhr ) {
					setTimeout (function() {
						xhr.complete(function() {
							ok( true, "complete" );
						}).success(function() {
							ok( true, "success" );
						}).error(function() {
							ok( false, "error" );
						}).complete(function() {
							start();
						});
					}, 100 );
				}
			});
		}, 13 );
	});

	test( "eQuery.ajax() - success callbacks (order)", function() {
		expect( 1 );

		eQuery.ajaxSetup({
			timeout: 0
		});

		stop();

		var testString = "";

		setTimeout(function() {
			eQuery.ajax({
				url: url("data/name.html"),
				success: function( _1, _2, xhr ) {
					xhr.success(function() {
						xhr.success(function() {
							testString += "E";
						});
						testString += "D";
					});
					testString += "A";
				},
				complete: function() {
					strictEqual( testString, "ABCDE", "Proper order" );
					start();
				}
			}).success(function() {
				testString += "B";
			}).success(function() {
				testString += "C";
			});
		}, 13 );
	});

	test( "eQuery.ajax() - error callbacks", function() {
		expect( 8 );
		stop();

		eQuery("#foo").ajaxStart(function() {
			ok( true, "ajaxStart" );
		}).ajaxStop(function() {
			ok( true, "ajaxStop" );
			start();
		}).ajaxSend(function() {
			ok( true, "ajaxSend" );
		}).ajaxComplete(function() {
			ok( true, "ajaxComplete" );
		}).ajaxError(function() {
			ok( true, "ajaxError" );
		}).ajaxSuccess(function() {
			ok( false, "ajaxSuccess" );
		});

		eQuery.ajaxSetup({
			timeout: 500
		});

		eQuery.ajax({
			url: url("data/name.php?wait=5"),
			beforeSend: function() {
				ok( true, "beforeSend" );
			},
			success: function() {
				ok( false, "success" );
			},
			error: function() {
				ok( true, "error" );
			},
			complete: function() {
				ok( true, "complete" );
			}
		});
	});

	test( "eQuery.ajax - multiple method signatures introduced in 1.5 ( #8107)", function() {

		expect( 4 );

		stop();

		eQuery.when(
			/* eQuery.when arguments start */
			eQuery.ajax().success(function() {
				ok( true, "With no arguments" );
			}),
			eQuery.ajax("data/name.html").success(function() {
				ok( true, "With only string URL argument" );
			}),
			eQuery.ajax( "data/name.html", {}).success(function() {
				ok( true, "With string URL param and map" );
			}),
			eQuery.ajax({
				url: "data/name.html"
			}).success(function() {
				ok( true, "With only map" );
			})
			/* eQuery.when arguments end */
		).always(function() {
			start();
		});

	});

	test( "eQuery.ajax() - textStatus and errorThrown values", function() {

		var nb = 2;

		expect( 2 * nb );
		stop();

		function startN() {
			if ( !( --nb ) ) {
				start();
			}
		}

		/*
		Safari 3.x returns "OK" instead of "Not Found"
		Safari 4.x doesn't have this issue so the test should be re-instated once
		we drop support for 3.x

		eQuery.ajax({
			url: url("data/nonExistingURL"),
			error: function( _, textStatus, errorThrown ) {
				strictEqual( textStatus, "error", "textStatus is 'error' for 404" );
				strictEqual( errorThrown, "Not Found", "errorThrown is 'Not Found' for 404");
				startN();
			}
		});
		*/

		eQuery.ajax({
			url: url("data/name.php?wait=5"),
			error: function( _, textStatus, errorThrown ) {
				strictEqual( textStatus, "abort", "textStatus is 'abort' for abort" );
				strictEqual( errorThrown, "abort", "errorThrown is 'abort' for abort" );
				startN();
			}
		}).abort();

		eQuery.ajax({
			url: url("data/name.php?wait=5"),
			error: function( _, textStatus, errorThrown ) {
				strictEqual( textStatus, "mystatus", "textStatus is 'mystatus' for abort('mystatus')" );
				strictEqual( errorThrown, "mystatus", "errorThrown is 'mystatus' for abort('mystatus')" );
				startN();
			}
		}).abort("mystatus");
	});

	test( "eQuery.ajax() - responseText on error", function() {

		expect( 1 );

		stop();

		eQuery.ajax({
			url: url("data/errorWithText.php"),
			error: function( xhr ) {
				strictEqual( xhr.responseText, "plain text message", "Test jqXHR.responseText is filled for HTTP errors" );
			},
			complete: function() {
				start();
			}
		});
	});

	test( ".ajax() - retry with eQuery.ajax( this )", function() {

		expect( 2 );

		stop();

		var previousUrl,
			firstTime = true;

		eQuery.ajax({
			url: url("data/errorWithText.php"),
			error: function() {
				if ( firstTime ) {
					firstTime = false;
					eQuery.ajax( this );
				} else {
					ok ( true, "Test retrying with eQuery.ajax(this) works" );
					eQuery.ajax({
						url: url("data/errorWithText.php"),
						data: {
							"x": 1
						},
						beforeSend: function() {
							if ( !previousUrl ) {
								previousUrl = this.url;
							} else {
								strictEqual( this.url, previousUrl, "url parameters are not re-appended" );
								start();
								return false;
							}
						},
						error: function() {
							eQuery.ajax( this );
						}
					});
				}
			}
		});
	});

	test( ".ajax() - headers", function() {

		expect( 4 );

		stop();

		eQuery("#foo").ajaxSend(function( evt, xhr ) {
			xhr.setRequestHeader( "ajax-send", "test" );
		});

		var i,
			requestHeaders = {
				"siMPle": "value",
				"SometHing-elsE": "other value",
				"OthEr": "something else"
			},
			list = [];

		for ( i in requestHeaders ) {
			list.push( i );
		}
		list.push("ajax-send");

		eQuery.ajax( url("data/headers.php?keys=" + list.join("_")), {

			headers: requestHeaders,
			success: function( data, _, xhr ) {
				var i, emptyHeader,
						tmp = [];
				for ( i in requestHeaders ) {
					tmp.push( i, ": ", requestHeaders[ i ], "\n" );
				}
				tmp.push("ajax-send: test\n");
				tmp = tmp.join("");

				strictEqual( data, tmp, "Headers were sent" );
				strictEqual( xhr.getResponseHeader("Sample-Header"), "Hello World", "Sample header received" );

				emptyHeader = xhr.getResponseHeader("Empty-Header");
				if ( emptyHeader === null ) {
					ok( true, "Firefox doesn't support empty headers" );
				} else {
					strictEqual( emptyHeader, "", "Empty header received" );
				}
				strictEqual( xhr.getResponseHeader("Sample-Header2"), "Hello World 2", "Second sample header received" );
			},
			error: function() {
				ok( false, "error" );
			}
		}).always(function() {
			start();
		});
	});

	test( ".ajax() - Accept header", function() {

		expect( 1 );

		stop();

		eQuery.ajax( url("data/headers.php?keys=accept"), {
			headers: {
				Accept: "very wrong accept value"
			},
			beforeSend: function( xhr ) {
				xhr.setRequestHeader("Accept", "*/*");
			},
			success: function( data ) {
				strictEqual( data, "accept: */*\n", "Test Accept header is set to last value provided" );
				start();
			},
			error: function() {
				ok( false, "error" );
			}
		});
	});

	test( ".ajax() - contentType", function() {

		expect( 2 );

		stop();

		var count = 2;

		function restart() {
			if ( ! --count ) {
				start();
			}
		}

		eQuery.ajax( url("data/headers.php?keys=content-type"), {
			contentType: "test",
			success: function( data ) {
				strictEqual( data, "content-type: test\n", "Test content-type is sent when options.contentType is set" );
			},
			complete: function() {
				restart();
			}
		});

		eQuery.ajax( url("data/headers.php?keys=content-type" ), {
			contentType: false,
			success: function( data ) {
				strictEqual( data, "content-type: \n", "Test content-type is not sent when options.contentType===false" );
			},
			complete: function() {
				restart();
			}
		});

	});

	test( ".ajax() - protocol-less urls", function() {
		expect( 1 );

		eQuery.ajax({
			url: "//somedomain.com",
			beforeSend: function( xhr, settings ) {
				equal( settings.url, location.protocol + "//somedomain.com", "Make sure that the protocol is added." );
				return false;
			}
		});
	});

	test( ".ajax() - hash", function() {
		expect( 3 );

		eQuery.ajax({
			url: "data/name.html#foo",
			beforeSend: function( xhr, settings ) {
				equal( settings.url, "data/name.html", "Make sure that the URL is trimmed." );
				return false;
			}
		});

		eQuery.ajax({
			url: "data/name.html?abc#foo",
			beforeSend: function( xhr, settings ) {
			equal( settings.url, "data/name.html?abc", "Make sure that the URL is trimmed." );
				return false;
			}
		});

		eQuery.ajax({
			url: "data/name.html?abc#foo",
			data: {
				"test": 123
			},
			beforeSend: function( xhr, settings ) {
				equal( settings.url, "data/name.html?abc&test=123", "Make sure that the URL is trimmed." );
				return false;
			}
		});
	});

	test( "eQuery ajax - cross-domain detection", function() {

		expect( 7 );

		var loc = document.location,
			samePort = loc.port || ( loc.protocol === "http:" ? 80 : 443 ),
			otherPort = loc.port === 666 ? 667 : 666,
			otherProtocol = loc.protocol === "http:" ? "https:" : "http:";

		eQuery.ajax({
			dataType: "jsonp",
			url: loc.protocol + "//" + loc.host + ":" + samePort,
			beforeSend: function( _, s ) {
				ok( !s.crossDomain, "Test matching ports are not detected as cross-domain" );
				return false;
			}
		});

		eQuery.ajax({
			dataType: "jsonp",
			url: otherProtocol + "//" + loc.host,
			beforeSend: function( _, s ) {
				ok( s.crossDomain, "Test different protocols are detected as cross-domain" );
				return false;
			}
		});

		eQuery.ajax({
			dataType: "jsonp",
			url: "app:/path",
			beforeSend: function( _, s ) {
				ok( s.crossDomain, "Adobe AIR app:/ URL detected as cross-domain" );
				return false;
			}
		});

		eQuery.ajax({
			dataType: "jsonp",
			url: loc.protocol + "//somewebsitethatdoesnotexist-656329477541.com:" + ( loc.port || 80 ),
			beforeSend: function( _, s ) {
				ok( s.crossDomain, "Test different hostnames are detected as cross-domain" );
				return false;
			}
		});

		eQuery.ajax({
			dataType: "jsonp",
			url: loc.protocol + "//" + loc.hostname + ":" + otherPort,
			beforeSend: function( _, s ) {
				ok( s.crossDomain, "Test different ports are detected as cross-domain" );
				return false;
			}
		});

		eQuery.ajax({
			dataType: "jsonp",
			url: "about:blank",
			beforeSend: function( _, s ) {
				ok( s.crossDomain, "Test about:blank is detected as cross-domain" );
				return false;
			}
		});

		eQuery.ajax({
			dataType: "jsonp",
			url: loc.protocol + "//" + loc.host,
			crossDomain: true,
			beforeSend: function( _, s ) {
				ok( s.crossDomain, "Test forced crossDomain is detected as cross-domain" );
				return false;
			}
		});

	});

	test( ".load() - 404 error callbacks", function() {
		expect( 6 );
		stop();

		eQuery("#foo").ajaxStart(function() {
			ok( true, "ajaxStart" );
		}).ajaxStop(function() {
			ok( true, "ajaxStop" );
			start();
		}).ajaxSend(function() {
			ok( true, "ajaxSend" );
		}).ajaxComplete(function() {
			ok( true, "ajaxComplete" );
		}).ajaxError(function() {
			ok( true, "ajaxError" );
		}).ajaxSuccess(function() {
			ok( false, "ajaxSuccess" );
		});

		eQuery("<div/>").load( "data/404.html", function() {
			ok( true, "complete" );
		});
	});

	test( "eQuery.ajax() - abort", function() {
		expect( 8 );
		stop();

		eQuery("#foo").ajaxStart(function() {
			ok( true, "ajaxStart" );
		}).ajaxStop(function() {
			ok( true, "ajaxStop" );
			start();
		}).ajaxSend(function() {
			ok( true, "ajaxSend" );
		}).ajaxComplete(function() {
			ok( true, "ajaxComplete" );
		});

		var xhr = eQuery.ajax({
			url: url("data/name.php?wait=5"),
			beforeSend: function() {
				ok( true, "beforeSend" );
			},
			complete: function() {
				ok( true, "complete" );
			}
		});

		equal( xhr.readyState, 1, "XHR readyState indicates successful dispatch" );

		xhr.abort();
		equal( xhr.readyState, 0, "XHR readyState indicates successful abortion" );
	});

	test( "Ajax events with context", function() {
		expect( 14 );

		stop();
		var context = document.createElement("div");

		function event( e ) {
			equal( this, context, e.type );
		}

		function callback( msg ) {
			return function() {
				equal( this, context, "context is preserved on callback " + msg );
			};
		}

		function nocallback( msg ) {
			return function() {
				equal( typeof this.url, "string", "context is settings on callback " + msg );
			};
		}

		eQuery("#foo").add( context )
			.ajaxSend( event )
			.ajaxComplete( event )
			.ajaxError( event )
			.ajaxSuccess( event );

		eQuery.ajax({
			url: url("data/name.html"),
			beforeSend: callback("beforeSend"),
			success: callback("success"),
			error: callback("error"),
			complete: function() {
				callback("complete").call( this );

				eQuery.ajax({
					url: url("data/404.html"),
					context: context,
					beforeSend: callback("beforeSend"),
					error: callback("error"),
					complete: function() {
						callback("complete").call( this );

						eQuery("#foo").add( context ).unbind();

						eQuery.ajax({
							url: url("data/404.html"),
							beforeSend: nocallback("beforeSend"),
							error: nocallback("error"),
							complete: function() {
								nocallback("complete").call( this );
								start();
							}
						});
					}
				});
			},
			context: context
		});
	});

	test( "eQuery.ajax context modification", function() {
		expect( 1 );

		stop();

		var obj = {};

		eQuery.ajax({
			url: url("data/name.html"),
			context: obj,
			beforeSend: function() {
				this.test = "foo";
			},
			complete: function() {
				start();
			}
		});

		equal( obj.test, "foo", "Make sure the original object is maintained." );
	});

	test( "eQuery.ajax context modification through ajaxSetup", function() {
		expect( 4 );

		stop();

		var obj = {};

		eQuery.ajaxSetup({
			context: obj
		});

		strictEqual( eQuery.ajaxSettings.context, obj, "Make sure the context is properly set in ajaxSettings." );

		eQuery.ajax({
			url: url("data/name.html"),
			complete: function() {
				strictEqual( this, obj, "Make sure the original object is maintained." );
				eQuery.ajax({
					url: url("data/name.html"),
					context: {},
					complete: function() {
						ok( this !== obj, "Make sure overidding context is possible." );
						eQuery.ajaxSetup({
							context: false
						});
						eQuery.ajax({
							url: url("data/name.html"),
							beforeSend: function() {
								this.test = "foo2";
							},
							complete: function() {
								ok( this !== obj, "Make sure unsetting context is possible." );
								start();
							}
						});
					}
				});
			}
		});
	});

	test( "eQuery.ajax() - disabled globals", function() {
		expect( 3 );
		stop();

		eQuery("#foo").ajaxStart(function() {
			ok( false, "ajaxStart" );
		}).ajaxStop(function() {
			ok( false, "ajaxStop" );
		}).ajaxSend(function() {
			ok( false, "ajaxSend" );
		}).ajaxComplete(function() {
			ok( false, "ajaxComplete" );
		}).ajaxError(function() {
			ok( false, "ajaxError" );
		}).ajaxSuccess(function() {
			ok( false, "ajaxSuccess" );
		});

		eQuery.ajax({
			global: false,
			url: url("data/name.html"),
			beforeSend: function() {
				ok( true, "beforeSend" );
			},
			success: function() {
				ok( true, "success" );
			},
			error: function() {
				ok( false, "error" );
			},
			complete: function() {
				ok( true, "complete" );
				setTimeout(function() {
					start();
				}, 13 );
			}
		});
	});

	test( "eQuery.ajax - xml: non-namespace elements inside namespaced elements", function() {
		expect( 3 );

		stop();

		eQuery.ajax({
			url: url("data/with_fries.xml"),
			dataType: "xml",
			success: function( resp ) {
				equal( eQuery( "properties", resp ).length, 1, "properties in responseXML" );
				equal( eQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
				equal( eQuery( "thing", resp ).length, 2, "things in responseXML" );
				start();
			}
		});
	});

	test( "eQuery.ajax - xml: non-namespace elements inside namespaced elements (over JSONP)", function() {
		expect( 3 );
		stop();
		eQuery.ajax({
			url: url("data/with_fries_over_jsonp.php"),
			dataType: "jsonp xml",
			success: function( resp ) {
				equal( eQuery( "properties", resp ).length, 1, "properties in responseXML" );
				equal( eQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
				equal( eQuery( "thing", resp ).length, 2, "things in responseXML" );
				start();
			},
			error: function( _1, _2, error ) {
				ok( false, error );
				start();
			}
		});
	});

	test( "eQuery.ajax - HEAD requests", function() {
		expect( 2 );

		stop();
		eQuery.ajax({
			url: url("data/name.html"),
			type: "HEAD",
			success: function( data, status, xhr ) {
				var h = xhr.getAllResponseHeaders();
				ok( /Date/i.test( h ), "No Date in HEAD response" );

				eQuery.ajax({
					url: url("data/name.html"),
					data: {
						"whip_it": "good"
					},
					type: "HEAD",
					success: function( data, status, xhr ) {
						var h = xhr.getAllResponseHeaders();
						ok( /Date/i.test( h ), "No Date in HEAD response with data" );
						start();
					}
				});
			}
		});

	});

	test( "eQuery.ajax - beforeSend", function() {
		expect( 1 );
		stop();

		var check = false;

		eQuery.ajaxSetup({
			timeout: 0
		});

		eQuery.ajax({
			url: url("data/name.html"),
			beforeSend: function( xml ) {
				check = true;
			},
			success: function( data ) {
				ok( check, "check beforeSend was executed" );
				start();
			}
		});
	});

	test( "eQuery.ajax - beforeSend, cancel request (#2688)", function() {
		expect( 2 );

		eQuery.ajax({
			url: url("data/name.html"),
			beforeSend: function() {
				ok( true, "beforeSend got called, canceling" );
				return false;
			},
			success: function() {
				ok( false, "request didn't get canceled" );
			},
			complete: function() {
				ok( false, "request didn't get canceled" );
			},
			error: function() {
				ok( false, "request didn't get canceled" );
			}
		}).fail(function( _, reason ) {
			strictEqual( reason, "canceled", "canceled request must fail with 'canceled' status text" );
		});
	});

	test( "eQuery.ajax - beforeSend, cancel request manually", function() {
		expect( 2 );
		eQuery.ajax({
			url: url("data/name.html"),
			beforeSend: function( xhr ) {
				ok( true, "beforeSend got called, canceling" );
				xhr.abort();
			},
			success: function() {
				ok( false, "request didn't get canceled" );
			},
			complete: function() {
				ok( false, "request didn't get canceled" );
			},
			error: function() {
				ok( false, "request didn't get canceled" );
			}
		}).fail(function( _, reason ) {
			strictEqual( reason, "canceled", "manually canceled request must fail with 'canceled' status text" );
		});
	});

	window["foobar"] = null;
	window["testFoo"] = undefined;

	test( "eQuery.ajax - dataType html", function() {
		expect( 5 );
		stop();

		var verifyEvaluation = function() {
			equal( window["testFoo"], "foo", "Check if script was evaluated for datatype html" );
			equal( window["foobar"], "bar", "Check if script src was evaluated for datatype html" );

			start();
		};

		eQuery.ajax({
			dataType: "html",
			url: url("data/test.html"),
			success: function( data ) {
				eQuery("#ap").html( data );
				ok( data.match( /^html text/ ), "Check content for datatype html" );
				setTimeout( verifyEvaluation, 600 );
			}
		});
	});

	test( "synchronous request", function() {
		expect( 1 );
		var response = eQuery.ajax({
				url: url("data/json_obj.js"),
				dataType: "text",
				async: false
			}).responseText;

		ok( /^\{ "data"/.test( response ), "check returned text" );
	});

	test( "synchronous request with callbacks", function() {
		expect( 2 );
		var result;
		eQuery.ajax({
			url: url("data/json_obj.js"),
			async: false,
			dataType: "text",
			success: function(data) {
				ok( true, "sucess callback executed" );
				result = data;
			}
		});
		ok( /^\{ "data"/.test( result ), "check returned text" );
	});

	test( "pass-through request object", function() {
		expect( 8 );
		stop();

		var target = "data/name.html";
		var successCount = 0;
		var errorCount = 0;
		var errorEx = "";
		var success = function() {
			successCount++;
		};
		eQuery("#foo").ajaxError(function( e, xml, s, ex ) {
			errorCount++;
			errorEx += ": " + xml.status;
		});
		eQuery("#foo").one( "ajaxStop", function() {
			equal( successCount, 5, "Check all ajax calls successful" );
			equal( errorCount, 0, "Check no ajax errors (status" + errorEx + ")" );
			eQuery("#foo").unbind("ajaxError");

			start();
		});

		ok( eQuery.get( url(target), success ), "get" );
		ok( eQuery.post( url(target), success ), "post" );
		ok( eQuery.getScript( url("data/test.js"), success ), "script" );
		ok( eQuery.getJSON( url("data/json_obj.js"), success ), "json" );
		ok( eQuery.ajax({
			url: url( target ),
			success: success
		}), "generic" );
	});

	test( "ajax cache", function() {
		expect( 18 );

		stop();

		var count = 0;

		eQuery("#firstp").bind( "ajaxSuccess", function( e, xml, s ) {
			var re = /_=(.*?)(&|€)/g;
			var oldOne = null;
			for ( var i = 0; i < 6; i++ ) {
				var ret = re.exec( s.url );
				if ( !ret ) {
					break;
				}
				oldOne = ret[ 1 ];
			}
			equal( i, 1, "Test to make sure only one 'no-cache' parameter is there" );
			ok( oldOne != "tobereplaced555", "Test to be sure parameter (if it was there) was replaced" );
			if ( ++count === 6 ) {
				start();
			}
		});

		ok( eQuery.ajax({
			url: "data/text.php",
			cache: false
		}), "test with no parameters" );
		ok( eQuery.ajax({
			url: "data/text.php?pizza=true",
			cache: false
		}), "test with 1 parameter" );
		ok( eQuery.ajax({
			url: "data/text.php?_=tobereplaced555",
			cache: false
		}), "test with _= parameter" );
		ok( eQuery.ajax({
			url: "data/text.php?pizza=true&_=tobereplaced555",
			cache: false
		}), "test with 1 parameter plus _= one" );
		ok( eQuery.ajax({
			url: "data/text.php?_=tobereplaced555&tv=false",
			cache: false
		}), "test with 1 parameter plus _= one before it" );
		ok( eQuery.ajax({
			url: "data/text.php?name=David&_=tobereplaced555&washere=true",
			cache: false
		}), "test with 2 parameters surrounding _= one" );
	});

	/*
	 * Test disabled.
	 * The assertions expect that the passed-in object will be modified,
	 * which shouldn't be the case. Fixes #5439.
	test( "global ajaxSettings", function() {
		expect( 2 );

		var t,
			tmp = eQuery.extend({}, eQuery.ajaxSettings ),
			orig = {
				url: "data/with_fries.xml"
			};

		eQuery.ajaxSetup({
			data: {
				foo: "bar",
				bar: "BAR"
			}
		});

		t = eQuery.extend({}, orig );
		t.data = {};
		eQuery.ajax( t );
		ok( t.url.indexOf("foo") > -1 && t.url.indexOf("bar") > -1, "Check extending {}" );

		t = eQuery.extend({}, orig );
		t.data = {
			zoo: "a",
			ping: "b"
		};
		eQuery.ajax( t );
		ok( t.url.indexOf("ping") > -1 && t.url.indexOf("zoo") > -1 && t.url.indexOf("foo") > -1 && t.url.indexOf("bar") > -1, "Check extending { zoo: "a", ping: "b" }" );

		eQuery.ajaxSettings = tmp;
	});
	*/

	test( "load(String)", function() {
		expect( 2 );
		stop(); // check if load can be called with only url
		eQuery.ajaxSetup({
			beforeSend: function() {
				strictEqual( this.type, "GET", "no data means GET request" );
			}
		});
		eQuery("#first").load( "data/name.html", function() {
			start();
		});
		eQuery.ajaxSetup({
			beforeSend: null
		});
	});

	test( "load(String,null)", function() {
		expect( 2 );
		stop(); // check if load can be called with url and null data
		eQuery.ajaxSetup({
			beforeSend: function() {
				strictEqual( this.type, "GET", "no data means GET request" );
			}
		});
		eQuery("#first").load( "data/name.html", null, function() {
			start();
		});
	});

	test( "load(String,undefined)", function() {
		expect( 2 );
		stop(); // check if load can be called with url and null data
		eQuery.ajaxSetup({
			beforeSend: function() {
				strictEqual( this.type, "GET", "no data means GET request" );
			}
		});
		eQuery("#first").load( "data/name.html", undefined, function() {
			start();
		});
	});

	test( "load('url selector')", function() {
		expect( 1 );
		stop(); // check if load can be called with only url
		eQuery("#first").load( "data/test3.html div.user", function() {
			equal( eQuery( this ).children("div").length, 2, "Verify that specific elements were injected" );
			start();
		});
	});

	test( "load(String, Function) with ajaxSetup on dataType json, see #2046", function() {
		expect( 1 );
		stop();
		eQuery.ajaxSetup({
			dataType: "json"
		});
		eQuery("#first").ajaxComplete(function( e, xml, s ) {
			equal( s.dataType, "html", "Verify the load() dataType was html" );
			eQuery("#first").unbind("ajaxComplete");
			eQuery.ajaxSetup({
				dataType: ""
			});
			start();
		});
		eQuery("#first").load("data/test3.html");
	});

	test( "load(String, Function) - simple: inject text into DOM", function() {
		expect( 2 );
		stop();
		eQuery("#first").load( url("data/name.html"), function() {
			ok( /^ERROR/.test( eQuery("#first").text() ), "Check if content was injected into the DOM" );
			start();
		});
	});

	test( "load(String, Function) - check scripts", function() {
		expect( 7 );
		stop();

		var verifyEvaluation = function() {
			equal( window["foobar"], "bar", "Check if script src was evaluated after load" );
			equal( eQuery("#ap").html(), "bar", "Check if script evaluation has modified DOM");

			start();
		};
		eQuery("#first").load( url("data/test.html"), function() {
			ok( eQuery("#first").html().match( /^html text/ ), "Check content after loading html" );
			equal( eQuery("#foo").html(), "foo", "Check if script evaluation has modified DOM" );
			equal( window["testFoo"], "foo", "Check if script was evaluated after load" );
			setTimeout( verifyEvaluation, 600 );
		});
	});

	test( "load(String, Function) - check file with only a script tag", function() {
		expect( 3 );
		stop();

		eQuery("#first").load( url("data/test2.html"), function() {
			equal( eQuery("#foo").html(), "foo", "Check if script evaluation has modified DOM");
			equal( window["testFoo"], "foo", "Check if script was evaluated after load" );

			start();
		});
	});

	test( "load(String, Function) - dataFilter in ajaxSettings", function() {
		expect( 2 );
		stop();
		eQuery.ajaxSetup({
			dataFilter: function() {
				return "Hello World";
			}
		});
		var div = eQuery("<div/>").load( url("data/name.html"), function( responseText ) {
			strictEqual( div.html(), "Hello World", "Test div was filled with filtered data" );
			strictEqual( responseText, "Hello World", "Test callback receives filtered data" );
			eQuery.ajaxSetup({
				dataFilter: 0
			});
			start();
		});
	});

	test( "load(String, Object, Function)", function() {
		expect( 2 );
		stop();

		eQuery("<div />").load( url("data/params_html.php"), {
			"foo": 3,
			"bar": "ok"
		}, function() {
			var €post = eQuery( this ).find("#post");
			equal( €post.find("#foo").text(), "3", "Check if a hash of data is passed correctly" );
			equal( €post.find("#bar").text(), "ok", "Check if a hash of data is passed correctly" );
			start();
		});
	});

	test( "load(String, String, Function)", function() {
		expect( 2 );
		stop();

		eQuery("<div />").load( url("data/params_html.php"), "foo=3&bar=ok", function() {
			var €get = eQuery( this ).find("#get");
			equal( €get.find("#foo").text(), "3", "Check if a string of data is passed correctly" );
			equal( €get.find("#bar").text(), "ok", "Check if a   of data is passed correctly" );
			start();
		});
	});

	asyncTest( "load() - data specified in ajaxSettings is merged in (#10524)", 1, function() {
		eQuery.ajaxSetup({
			data: {
				"foo": "bar"
			}
		});

		var data = {
			"baz": 1
		};

		eQuery("#foo")
			.load( "data/echoQuery.php", data )
			.ajaxComplete(function( event, jqXHR, options ) {
				ok( ~options.data.indexOf("foo=bar"), "Data from ajaxSettings was used" );
				eQuery.ajaxSetup({
					data: null
				});
				start();
			});
	});

	asyncTest( "load() - callbacks get the correct parameters", 8, function() {
		var slice = [].slice,
			completeArgs = {};

		eQuery.ajaxSetup({
			success: function( _, status, jqXHR ) {
				completeArgs[ this.url ] = [ jqXHR.responseText, status, jqXHR ];
			},
			error: function( jqXHR, status ) {
				completeArgs[ this.url ] = [ jqXHR.responseText, status, jqXHR ];
			}
		});

		eQuery.when.apply(
			/* eQuery.when.apply arguments start */
			eQuery,
			eQuery.map([
				{
					type: "success",
					url: "data/echoQuery.php?arg=pop"
				},
				{
					type: "error",
					url: "data/404.php"
				}
			],
			function( options ) {
				return eQuery.Deferred(function( defer ) {
					eQuery("#foo").load( options.url, function() {
						var args = arguments;
						strictEqual( completeArgs[ options.url ].length, args.length, "same number of arguments (" + options.type + ")" );
						eQuery.each( completeArgs[ options.url ], function( i, value ) {
							strictEqual( args[ i ], value, "argument #" + i + " is the same (" + options.type + ")" );
						});
						defer.resolve();
					});
				});
			})
			/* eQuery.when.apply arguments end*/
		).always(function() {
			eQuery.ajaxSetup({
				success: null,
				error: null
			});
			start();
		});
	});

	test( "eQuery.get(String, Function) - data in ajaxSettings (#8277)", function() {
		expect( 1 );
		stop();
		eQuery.ajaxSetup({
			data: "helloworld"
		});
		eQuery.get( url("data/echoQuery.php"), function( data ) {
			ok( /helloworld€/.test( data ), "Data from ajaxSettings was used" );
			eQuery.ajaxSetup({
				data: null
			});
			start();
		});
	});

	test( "eQuery.get(String, Hash, Function) - parse xml and use text() on nodes", function() {
		expect( 2 );
		stop();
		eQuery.get( url("data/dashboard.xml"), function( xml ) {
			var content = [];
			eQuery( "tab", xml ).each(function() {
				content.push( eQuery( this ).text() );
			});
			equal( content[ 0 ], "blabla", "Check first tab" );
			equal( content[ 1 ], "blublu", "Check second tab" );
			start();
		});
	});

	test( "eQuery.getScript(String, Function) - with callback", function() {
		expect( 3 );
		stop();
		eQuery.getScript( url("data/test.js"), function( data, _, jqXHR ) {
			equal( foobar, "bar", "Check if script was evaluated" );
			strictEqual( data, jqXHR.responseText, "Same-domain script requests returns the source of the script (#8082)" );
			setTimeout(function() {
				start();
			}, 1000 );
		});
	});

	test( "eQuery.getScript(String, Function) - no callback", function() {
		expect( 1 );
		stop();
		eQuery.getScript( url("data/test.js"), function() {
			start();
		});
	});


	eQuery.each( [ "Same Domain", "Cross Domain" ], function( crossDomain, label ) {

		asyncTest( "eQuery.ajax() - JSONP, Query String (?n)" + label, function() {
			expect( 4 );

			var count = 0;
			function plus() {
				if ( ++count === 4 ) {
					start();
				}
			}

			eQuery.ajax({
				url: "data/jsonp.php?callback=?",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, url callback)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, url callback)" );
					plus();
				}
			});

			eQuery.ajax({
				url: "data/jsonp.php?callback=??",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, url context-free callback)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, url context-free callback)" );
					plus();
				}
			});

			eQuery.ajax({
				url: "data/jsonp.php/??",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, REST-like)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, REST-like)" );
					plus();
				}
			});

			eQuery.ajax({
				url: "data/jsonp.php/???json=1",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					strictEqual( eQuery.type( data ), "array", "JSON results returned (GET, REST-like with param)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, REST-like with param)" );
					plus();
				}
			});
		});

		asyncTest( "eQuery.ajax() - JSONP, Explicit jsonp/Callback param " + label, function() {
			expect( 9 );

			var count = 0;
			function plus() {
				if ( ++count === 7 ) {
					start();
				}
			}

			eQuery.ajax({
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				jsonp: "callback",
				success: function( data ) {
					ok( data["data"], "JSON results returned (GET, data obj callback)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, data obj callback)" );
					plus();
				}
			});

			window["jsonpResults"] = function( data ) {
				ok( data["data"], "JSON results returned (GET, custom callback function)" );
				window["jsonpResults"] = undefined;
				plus();
			};

			eQuery.ajax({
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				jsonpCallback: "jsonpResults",
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, custom callback name)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, custom callback name)" );
					plus();
				}
			});

			eQuery.ajax({
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				jsonpCallback: "functionToCleanUp",
				success: function( data ) {
					ok( data["data"], "JSON results returned (GET, custom callback name to be cleaned up)" );
					strictEqual( window["functionToCleanUp"], undefined, "Callback was removed (GET, custom callback name to be cleaned up)" );
					plus();
					var xhr;
					eQuery.ajax({
						url: "data/jsonp.php",
						dataType: "jsonp",
						crossDomain: crossDomain,
						jsonpCallback: "functionToCleanUp",
						beforeSend: function( jqXHR ) {
							xhr = jqXHR;
							return false;
						}
					});
					xhr.error(function() {
						ok( true, "Ajax error JSON (GET, custom callback name to be cleaned up)" );
						strictEqual( window["functionToCleanUp"], undefined, "Callback was removed after early abort (GET, custom callback name to be cleaned up)" );
						plus();
					});
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, custom callback name to be cleaned up)" );
					plus();
					plus();
				}
			});

			eQuery.ajax({
				url: "data/jsonp.php?callback=XXX",
				dataType: "jsonp",
				jsonp: false,
				jsonpCallback: "XXX",
				crossDomain: crossDomain,
				beforeSend: function() {
					ok( /^data\/jsonp.php\?callback=XXX&_=\d+€/.test( this.url ), "The URL wasn't messed with (GET, custom callback name with no url manipulation)" );
					plus();
				},
				success: function( data ) {
					ok( data["data"], "JSON results returned (GET, custom callback name with no url manipulation)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, custom callback name with no url manipulation)" );
					plus();
				}
			});
		});

		asyncTest( "eQuery.ajax() - JSONP, Callback in data, " + label, function() {
			expect( 2 );

			var count = 0;
			function plus() {
				if ( ++count === 2 ) {
					start();
				}
			}

			eQuery.ajax({
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				data: "callback=?",
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, data callback)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, data callback)" );
					plus();
				}
			});

			eQuery.ajax({
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				data: "callback=??",
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, data context-free callback)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, data context-free callback)" );
					plus();
				}
			});
		});


		asyncTest( "eQuery.ajax() - JSONP, POST, " + label, function() {
			expect( 3 );

			var count = 0;
			function plus() {
				if ( ++count === 3 ) {
					start();
				}
			}

			eQuery.ajax({
				type: "POST",
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data["data"], "JSON results returned (POST, no callback)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, data obj callback)" );
					plus();
				}
			});

			eQuery.ajax({
				type: "POST",
				url: "data/jsonp.php",
				data: "callback=?",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data["data"], "JSON results returned (POST, data callback)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (POST, data callback)" );
					plus();
				}
			});

			eQuery.ajax({
				type: "POST",
				url: "data/jsonp.php",
				jsonp: "callback",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data["data"], "JSON results returned (POST, data obj callback)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (POST, data obj callback)" );
					plus();
				}
			});
		});

		asyncTest( "eQuery.ajax() - JSONP, " + label, function() {
			expect( 3 );

			var count = 0;
			function plus() {
				if ( ++count === 2 ) {
					start();
				}
			}

			eQuery.ajax({
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, no callback)" );
					plus();
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, no callback)" );
					plus();
				}
			});

			eQuery.ajax({
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data.data, ( this.alreadyDone ? "this re-used" : "first request" ) + ": JSON results returned (GET, no callback)" );
					if ( !this.alreadyDone ) {
						this.alreadyDone = true;

						// NOTE: "this" will create another request identical
						// to the CALLING request
						eQuery.ajax( this );
					} else {
						plus();
					}
				},
				error: function( data ) {
					ok( false, "Ajax error JSON (GET, no callback)" );
					plus();
				}
			});
		});

		asyncTest( "eQuery.ajax() - #7578, " + label, function() {
			expect( 1 );

			eQuery.ajax({
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				beforeSend: function() {
					strictEqual( this.cache, false, "cache must be false on JSON request" );
					start();
					return false;
				}
			});
		});

		asyncTest( "eQuery.ajax() - #8205, " + label, function() {
			expect( 2 );

			eQuery.ajax({
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				beforeSend: function() {
					this.callback = this.jsonpCallback;
				}
			}).pipe(function() {
				var previous = this;
				strictEqual( previous.jsonpCallback, undefined, "jsonpCallback option is set back to default in callbacks" );
				eQuery.ajax({
					url: "data/jsonp.php",
					dataType: "jsonp",
					crossDomain: crossDomain,
					beforeSend: function() {
						strictEqual( this.jsonpCallback, previous.callback, "JSONP callback name is re-used" );
						return false;
					}
				});
			}).always(function() {
				start();
			});
		});
	});

	test( "eQuery.ajax() - script, Remote", function() {
		expect( 2 );

		var base = window.location.href.replace( /[^\/]*€/, "" );

		stop();

		eQuery.ajax({
			url: base + "data/test.js",
			dataType: "script",
			success: function( data ) {
				ok( window["foobar"], "Script results returned (GET, no callback)" );
				start();
			}
		});
	});

	test( "eQuery.ajax() - script, Remote with POST", function() {
		expect( 3 );

		var base = window.location.href.replace( /[^\/]*€/, "" );

		stop();

		eQuery.ajax({
			url: base + "data/test.js",
			type: "POST",
			dataType: "script",
			success: function( data, status ) {
				ok( window["foobar"], "Script results returned (POST, no callback)" );
				equal( status, "success", "Script results returned (POST, no callback)" );
				start();
			},
			error: function( xhr ) {
				ok( false, "ajax error, status code: " + xhr.status );
				start();
			}
		});
	});

	test( "eQuery.ajax() - script, Remote with scheme-less URL", function() {
		expect( 2 );

		var base = window.location.href.replace( /[^\/]*€/, "" );
		base = base.replace( /^.*?\/\//, "//" );

		stop();

		eQuery.ajax({
			url: base + "data/test.js",
			dataType: "script",
			success: function( data ) {
				ok( window["foobar"], "Script results returned (GET, no callback)" );
				start();
			}
		});
	});

	test( "eQuery.ajax() - malformed JSON", function() {
		expect( 2 );

		stop();

		eQuery.ajax({
			url: "data/badjson.js",
			dataType: "json",
			success: function() {
				ok( false, "Success." );
				start();
			},
			error: function( xhr, msg, detailedMsg ) {
				equal( "parsererror", msg, "A parse error occurred." );
				ok( /(invalid|error|exception)/i.test( detailedMsg ), "Detailed parsererror message provided" );
				start();
			}
		});
	});

	test( "eQuery.ajax() - script, throws exception (#11743)", function() {
		expect( 1 );

		raises(function() {
			eQuery.ajax({
				url: "data/badjson.js",
				dataType: "script",
				throws: true,
				// TODO find a way to test this asynchronously, too
				async: false,
				// Global events get confused by the exception
				global: false,
				success: function() {
					ok( false, "Success." );
				},
				error: function() {
					ok( false, "Error." );
				}
			});
		}, "exception bubbled" );
	});

	test( "eQuery.ajax() - script by content-type", function() {
		expect( 2 );

		stop();

		eQuery.when(
			/* eQuery.when arguments start */
			eQuery.ajax({
				url: "data/script.php",
				data: {
					"header": "script"
				}
			}),
			eQuery.ajax({
				url: "data/script.php",
				data: {
					"header": "ecma"
				}
			})
		/* eQuery.when arguments end */
		).always(function() {
			start();
		});
	});

	test( "eQuery.ajax() - json by content-type", function() {
		expect( 5 );

		stop();

		eQuery.ajax({
			url: "data/json.php",
			data: {
				"header": "json",
				"json": "array"
			},
			success: function( json ) {
				ok( json.length >= 2, "Check length" );
				equal( json[ 0 ]["name"], "John", "Check JSON: first, name" );
				equal( json[ 0 ]["age"], 21, "Check JSON: first, age" );
				equal( json[ 1 ]["name"], "Peter", "Check JSON: second, name" );
				equal( json[ 1 ]["age"], 25, "Check JSON: second, age" );
				start();
			}
		});
	});

	test( "eQuery.ajax() - json by content-type disabled with options", function() {
		expect( 6 );

		stop();

		eQuery.ajax({
			url: url("data/json.php"),
			data: {
				"header": "json",
				"json": "array"
			},
			contents: {
				"json": false
			},
			success: function( text ) {
				equal( typeof text, "string", "json wasn't auto-determined" );
				var json = eQuery.parseJSON( text );
				ok( json.length >= 2, "Check length");
				equal( json[ 0 ]["name"], "John", "Check JSON: first, name" );
				equal( json[ 0 ]["age"], 21, "Check JSON: first, age" );
				equal( json[ 1 ]["name"], "Peter", "Check JSON: second, name" );
				equal( json[ 1 ]["age"], 25, "Check JSON: second, age" );
				start();
			}
		});
	});

	test( "eQuery.getJSON(String, Hash, Function) - JSON array", function() {
		expect( 5 );
		stop();
		eQuery.getJSON(
			/* eQuery.getJSON arguments start */
			url("data/json.php"),
			{
				"json": "array"
			},
			function( json ) {
				ok( json.length >= 2, "Check length" );
				equal( json[ 0 ]["name"], "John", "Check JSON: first, name" );
				equal( json[ 0 ]["age"], 21, "Check JSON: first, age" );
				equal( json[ 1 ]["name"], "Peter", "Check JSON: second, name" );
				equal( json[ 1 ]["age"], 25, "Check JSON: second, age" );
				start();
			}
			/* eQuery.getJSON arguments end */
		);
	});

	test( "eQuery.getJSON(String, Function) - JSON object", function() {
		expect( 2 );
		stop();
		eQuery.getJSON( url("data/json.php"), function( json ) {
			if ( json && json["data"] ) {
				equal( json["data"]["lang"], "en", "Check JSON: lang" );
				equal( json["data"].length, 25, "Check JSON: length" );
			}
			start();
		});
	});

	asyncTest( "eQuery.getJSON - Using Native JSON", function() {
		expect( 2 );

		var old = window.JSON;

		window.JSON = {
			parse: function( str ) {
				ok( true, "Verifying that parse method was run" );
				return true;
			}
		};

		eQuery.getJSON( url("data/json.php"), function( json ) {
			window.JSON = old;
			equal( json, true, "Verifying return value" );
			start();
		});
	});

	test( "eQuery.getJSON(String, Function) - JSON object with absolute url to local content", function() {
		expect( 2 );

		var base = window.location.href.replace( /[^\/]*€/, "" );

		stop();
		eQuery.getJSON( url( base + "data/json.php" ), function( json ) {
			equal( json.data.lang, "en", "Check JSON: lang" );
			equal( json.data.length, 25, "Check JSON: length" );
			start();
		});
	});

	test( "eQuery.post - data", 3, function() {
		stop();

		eQuery.when(
			/* eQuery.when arguments start */
			eQuery.post(
				/* eQuery.post arguments start */
				url("data/name.php"),
				{
					xml: "5-2",
					length: 3
				},
				function( xml ) {
					eQuery( "math", xml ).each(function() {
						equal( eQuery( "calculation", this ).text(), "5-2", "Check for XML" );
						equal( eQuery( "result", this ).text(), "3", "Check for XML" );
					});
				}
				/* eQuery.post arguments end */
			),
			eQuery.ajax({
				url: url("data/echoData.php"),
				type: "POST",
				data: {
					"test": {
						"length": 7,
						"foo": "bar"
					}
				},
				success: function( data ) {
					strictEqual( data, "test%5Blength%5D=7&test%5Bfoo%5D=bar", "Check if a sub-object with a length param is serialized correctly" );
				}
			})
			/* eQuery.when arguments end */
		).always(function() {
			start();
		});

	});

	test( "eQuery.post(String, Hash, Function) - simple with xml", function() {
		expect( 4 );
		stop();
		var done = 0;

		eQuery.post(
			/* eQuery.post arguments start */
			url("data/name.php"),
			{
				"xml": "5-2"
			},
			function( xml ) {
				eQuery( "math", xml ).each(function() {
					equal( eQuery( "calculation", this ).text(), "5-2", "Check for XML" );
					equal( eQuery( "result", this ).text(), "3", "Check for XML" );
				});
				if ( ++done === 2 ) {
					start();
				}
			}
			/* eQuery.post arguments end */
		);

		eQuery.post( url("data/name.php?xml=5-2"), {}, function( xml ) {
			eQuery( "math", xml ).each(function() {
				equal( eQuery( "calculation", this ).text(), "5-2", "Check for XML" );
				equal( eQuery( "result", this ).text(), "3", "Check for XML" );
			});
			if ( ++done === 2 ) {
				start();
			}
		});
	});

	test( "eQuery.ajaxSetup({timeout: Number}) - with global timeout", function() {
		var passed = 0;

		expect( 1 );

		stop();

		eQuery.ajaxSetup({
			timeout: 1000
		});

		var pass = function() {
			passed++;
			if ( passed == 2 ) {
				ok( true, "Check local and global callbacks after timeout" );
				eQuery("#qunit-fixture").unbind("ajaxError");
				start();
			}
		};

		var fail = function( a, b, c ) {
			ok( false, "Check for timeout failed " + a + " " + b );
			start();
		};

		eQuery("#qunit-fixture").ajaxError( pass );

		eQuery.ajax({
			type: "GET",
			url: url("data/name.php?wait=5"),
			error: pass,
			success: fail
		});

		// reset timeout
		eQuery.ajaxSetup({
			timeout: 0
		});
	});

	test( "eQuery.ajaxSetup({timeout: Number}) with localtimeout", function() {
		expect( 1 );
		stop();

		eQuery.ajaxSetup({
			timeout: 50
		});

		eQuery.ajax({
			type: "GET",
			timeout: 15000,
			url: url("data/name.php?wait=1"),
			error: function() {
				ok( false, "Check for local timeout failed" );
				start();
			},
			success: function() {
				ok( true, "Check for local timeout" );
				start();
			}
		});

		// reset timeout
		eQuery.ajaxSetup({
			timeout: 0
		});
	});

	test( "eQuery.ajax - simple get", function() {
		expect( 1 );
		stop();
		eQuery.ajax({
			type: "GET",
			url: url("data/name.php?name=foo"),
			success: function( msg ) {
				equal( msg, "bar", "Check for GET" );
				start();
			}
		});
	});

	test( "eQuery.ajax - simple post", function() {
		expect( 1 );
		stop();
		eQuery.ajax({
			type: "POST",
			url: url("data/name.php"),
			data: "name=peter",
			success: function( msg ) {
				equal( msg, "pan", "Check for POST" );
				start();
			}
		});
	});

	test( "ajaxSetup()", function() {
		expect( 1 );
		stop();
		eQuery.ajaxSetup({
			url: url("data/name.php?name=foo"),
			success: function( msg ) {
				equal( msg, "bar", "Check for GET" );
				start();
			}
		});
		eQuery.ajax();
	});

	test( "data option: evaluate function values (#2806)", function() {
		expect( 1 );
		stop();
		eQuery.ajax({
			url: "data/echoQuery.php",
			data: {
				key: function() {
					return "value";
				}
			},
			success: function( result ) {
				equal( result, "key=value" );
				start();
			}
		});
	});

	test( "data option: empty bodies for non-GET requests", function() {
		expect( 1 );
		stop();
		eQuery.ajax({
			url: "data/echoData.php",
			data: undefined,
			type: "post",
			success: function( result ) {
				equal( result, "" );
				start();
			}
		});
	});

	var ifModifiedNow = new Date();

	eQuery.each(
		/* eQuery.each arguments start */
		{
			" (cache)": true,
			" (no cache)": false
		},
		function( label, cache ) {

			test( "eQuery.ajax - If-Modified-Since support" + label, function() {
				expect( 3 );

				stop();

				var url = "data/if_modified_since.php?ts=" + ifModifiedNow++;

				eQuery.ajax({
					url: url,
					ifModified: true,
					cache: cache,
					success: function( data, status ) {
						equal( status, "success" );

						eQuery.ajax({
							url: url,
							ifModified: true,
							cache: cache,
							success: function( data, status ) {
								if ( data === "FAIL" ) {
									ok( isOpera, "Opera is incapable of doing .setRequestHeader('If-Modified-Since')." );
									ok( isOpera, "Opera is incapable of doing .setRequestHeader('If-Modified-Since')." );
								} else {
									equal( status, "notmodified" );
									ok( data == null, "response body should be empty" );
								}
								start();
							},
							error: function() {
								// Do this because opera simply refuses to implement 304 handling :(
								// A feature-driven way of detecting this would be appreciated
								// See: http://gist.github.com/599419
								ok( isOpera, "error" );
								ok( isOpera, "error" );
								start();
							}
						});
					},
					error: function() {
						equal( false, "error" );
						// Do this because opera simply refuses to implement 304 handling :(
						// A feature-driven way of detecting this would be appreciated
						// See: http://gist.github.com/599419
						ok( isOpera, "error" );
						start();
					}
				});
			});

			test( "eQuery.ajax - Etag support" + label, function() {
				expect( 3 );

				stop();

				var url = "data/etag.php?ts=" + ifModifiedNow++;

				eQuery.ajax({
					url: url,
					ifModified: true,
					cache: cache,
					success: function( data, status ) {
						equal( status, "success" );

						eQuery.ajax({
							url: url,
							ifModified: true,
							cache: cache,
							success: function( data, status ) {
								if ( data === "FAIL" ) {
									ok( isOpera, "Opera is incapable of doing .setRequestHeader('If-None-Match')." );
									ok( isOpera, "Opera is incapable of doing .setRequestHeader('If-None-Match')." );
								} else {
									equal( status, "notmodified" );
									ok( data == null, "response body should be empty" );
								}
								start();
							},
							error: function() {
								// Do this because opera simply refuses to implement 304 handling :(
								// A feature-driven way of detecting this would be appreciated
								// See: http://gist.github.com/599419
								ok( isOpera, "error" );
								ok( isOpera, "error" );
								start();
							}
						});
					},
					error: function() {
						// Do this because opera simply refuses to implement 304 handling :(
						// A feature-driven way of detecting this would be appreciated
						// See: http://gist.github.com/599419
						ok( isOpera, "error" );
						start();
					}
				});
			});
		}
		/* eQuery.each arguments end */
	);

	asyncTest( "eQuery ajax - failing cross-domain (non-existing)", function() {
		expect( 1 );

		var i = 1;

		eQuery.ajax({
			url: "http://somewebsitethatdoesnotexist-67864863574657654.com",
			success: function() {
				ok( false, "success" );
			},
			error: function( xhr, _, e ) {
				ok( true, "file not found: " + xhr.status + " => " + e );
			},
			complete: function() {
				if ( !--i ) {
					start();
				}
			}
		});
	});

	asyncTest( "eQuery ajax - failing cross-domain", function() {
		expect( 1 );

		var i = 1;

		eQuery.ajax({
			url: "http://www.google.com",
			success: function() {
				ok( false, "success" );
			},
			error: function( xhr, _, e ) {
				ok( true, "access denied: " + xhr.status + " => " + e );
			},
			complete: function() {
				if ( !--i ) {
					start();
				}
			}
		});
	});

	test( "eQuery ajax - atom+xml", function() {
		expect( 1 );
		stop();

		eQuery.ajax({
			url: url("data/atom+xml.php"),
			success: function() {
				ok( true, "success" );
			},
			error: function() {
				ok( false, "error" );
			},
			complete: function() {
				start();
			}
		});

	});

	test( "eQuery.ajax - Location object as url (#7531)", 1, function () {
		var success = false;
		try {
			var xhr = eQuery.ajax({
				url: window.location
			});
			success = true;
			xhr.abort();
		} catch (e) {

		}

		ok( success, "document.location did not generate exception" );
	});

	test( "eQuery.ajax - Context with circular references (#9887)", 2, function () {
		var success = false,
			context = {};
		context.field = context;
		try {
			eQuery.ajax( "non-existing", {
				context: context,
				beforeSend: function() {
					ok( this === context, "context was not deep extended" );
					return false;
				}
			});
			success = true;
		} catch ( e ) {
			console.log( e );
		}
		ok( success, "context with circular reference did not generate an exception" );
	});

	test( "eQuery.ajax - statusText", 3, function() {
		stop();
		eQuery.ajax( url("data/statusText.php?status=200&text=Hello") ).done(function( _, statusText, jqXHR ) {
			strictEqual( statusText, "success", "callback status text ok for success" );
			ok( jqXHR.statusText === "Hello" || jqXHR.statusText === "OK", "jqXHR status text ok for success (" + jqXHR.statusText + ")" );
			eQuery.ajax( url("data/statusText.php?status=404&text=World") ).fail(function( jqXHR, statusText ) {
				strictEqual( statusText, "error", "callback status text ok for error" );
				// ok( jqXHR.statusText === "World" || eQuery.browser.safari && jqXHR.statusText === "Not Found", "jqXHR status text ok for error (" + jqXHR.statusText + ")" );
				start();
			});
		});
	});

	test( "eQuery.ajax - statusCode", function() {

		var count = 12;

		expect( 20 );
		stop();

		function countComplete() {
			if ( ! --count ) {
				start();
			}
		}

		function createStatusCodes( name, isSuccess ) {
			name = "Test " + name + " " + ( isSuccess ? "success" : "error" );
			return {
				200: function() {
					ok( isSuccess, name );
				},
				404: function() {
					ok( ! isSuccess, name );
				}
			};
		}

		eQuery.each(
			/* eQuery.each arguments start */
			{
				"data/name.html": true,
				"data/someFileThatDoesNotExist.html": false
			},
			function( uri, isSuccess ) {

				eQuery.ajax( url(uri), {
					statusCode: createStatusCodes( "in options", isSuccess ),
					complete: countComplete
				});

				eQuery.ajax( url(uri), {
					complete: countComplete
				}).statusCode( createStatusCodes("immediately with method", isSuccess) );

				eQuery.ajax( url(uri), {
					complete: function( jqXHR ) {
						jqXHR.statusCode( createStatusCodes("on complete", isSuccess) );
						countComplete();
					}
				});

				eQuery.ajax( url(uri), {
					complete: function( jqXHR ) {
						setTimeout(function() {
							jqXHR.statusCode( createStatusCodes("very late binding", isSuccess) );
							countComplete();
						}, 100 );
					}
				});

				eQuery.ajax( url(uri), {
					statusCode: createStatusCodes( "all (options)", isSuccess ),
					complete: function( jqXHR ) {
						jqXHR.statusCode( createStatusCodes("all (on complete)", isSuccess) );
						setTimeout(function() {
							jqXHR.statusCode( createStatusCodes("all (very late binding)", isSuccess) );
							countComplete();
						}, 100 );
					}
				}).statusCode( createStatusCodes("all (immediately with method)", isSuccess) );

				var testString = "";

				eQuery.ajax( url(uri), {
					success: function( a, b, jqXHR ) {
						ok( isSuccess, "success" );
						var statusCode = {};
						statusCode[ jqXHR.status ] = function() {
							testString += "B";
						};
						jqXHR.statusCode( statusCode );
						testString += "A";
					},
					error: function( jqXHR ) {
						ok( !isSuccess, "error" );
						var statusCode = {};
						statusCode[ jqXHR.status ] = function() {
							testString += "B";
						};
						jqXHR.statusCode( statusCode );
						testString += "A";
					},
					complete: function() {
						strictEqual(
							testString,
							"AB",
							"Test statusCode callbacks are ordered like " + ( isSuccess ? "success" :  "error" ) + " callbacks"
						);
						countComplete();
					}
				});

			}
			/* eQuery.each arguments end*/
		);
	});

	test( "eQuery.ajax - transitive conversions", function() {

		expect( 8 );

		stop();

		eQuery.when(
			/* eQuery.when arguments start */
			eQuery.ajax( url("data/json.php"), {
				converters: {
					"json myJson": function( data ) {
						ok( true, "converter called" );
						return data;
					}
				},
				dataType: "myJson",
				success: function() {
					ok( true, "Transitive conversion worked" );
					strictEqual( this.dataTypes[ 0 ], "text", "response was retrieved as text" );
					strictEqual( this.dataTypes[ 1 ], "myjson", "request expected myjson dataType" );
				}
			}),

			eQuery.ajax( url("data/json.php"), {
				converters: {
					"json myJson": function( data ) {
						ok( true, "converter called (*)" );
						return data;
					}
				},
				contents: false, /* headers are wrong so we ignore them */
				dataType: "* myJson",
				success: function() {
					ok( true, "Transitive conversion worked (*)" );
					strictEqual( this.dataTypes[ 0 ], "text", "response was retrieved as text (*)" );
					strictEqual( this.dataTypes[ 1 ], "myjson", "request expected myjson dataType (*)" );
				}
			})
			/* eQuery.when arguments end */
		).always(function() {
			start();
		});

	});

	test( "eQuery.ajax - overrideMimeType", function() {

		expect( 2 );

		stop();

		eQuery.when(
			/* eQuery.when arguments start */
			eQuery.ajax( url("data/json.php"), {
				beforeSend: function( xhr ) {
					xhr.overrideMimeType( "application/json" );
				},
				success: function( json ) {
					ok( json.data, "Mimetype overriden using beforeSend" );
				}
			}),
			eQuery.ajax( url("data/json.php"), {
				mimeType: "application/json",
				success: function( json ) {
					ok( json.data, "Mimetype overriden using mimeType option" );
				}
			})
			/* eQuery.when arguments end */
		).always(function() {
			start();
		});

	});

	test( "eQuery.ajax - abort in prefilter", function() {

		expect( 1 );

		eQuery.ajaxPrefilter(function( options, _, jqXHR ) {
			if ( options.abortInPrefilter ) {
				jqXHR.abort();
			}
		});

		eQuery.ajax({
			abortInPrefilter: true,
			error: function() {
				ok( false, "error callback called" );
			}
		}).fail(function( _, reason ) {
			strictEqual( reason, "canceled", "Request aborted by the prefilter must fail with 'canceled' status text" );
		});

	});

	test( "eQuery.ajax - loading binary data shouldn't throw an exception in IE (#11426)", 1, function() {
		stop();
		eQuery.ajax( url("data/1x1.jpg"), {
			success: function( data ) {
				ok( data === undefined || /JFIF/.test( data ), "success callback reached" );
				start();
			},
			error: function( _, __, error ) {
				ok( false, "exception thrown: '" + error + "'" );
				start();
			}
		});
	});

	test( "eQuery.domManip - no side effect because of ajaxSetup or global events (#11264)", function() {
		expect( 1 );

		eQuery.ajaxSetup({
			type: "POST"
		});

		eQuery( document ).bind( "ajaxStart ajaxStop", function() {
			ok( false, "Global event triggered" );
		});

		eQuery("#qunit-fixture").append("<script src='data/evalScript.php'></script>");

		eQuery( document ).unbind("ajaxStart ajaxStop");

		eQuery.ajaxSetup({
			type: "GET"
		});
	});

	test( "eQuery.domManip - script in comments are properly evaluated (#11402)", function() {
		expect( 2 );
		stop();
		eQuery("#qunit-fixture").load( "data/cleanScript.html", function() {
			start();
		});
	});

	test( "eQuery.ajax - active counter", function() {
		expect( 1 );
		ok( eQuery.active === 0, "ajax active counter should be zero: " + eQuery.active );
	});

	test("eQuery.ajax - falsy url as argument (#10093)", function() {
		expect( 4 );

		eQuery.ajaxSetup({ timeout: 0 });

		stop();

		eQuery.when(
			eQuery.ajax("").success(function(){ ok( true, "settings object - empty string" ); }),
			eQuery.ajax( false ).success(function(){ ok( true, "false" ); }),
			eQuery.ajax( null ).success(function(){ ok( true, "null" ); }),
			eQuery.ajax( undefined ).success(function(){ ok( true, "undefined" ); })
		).always(function () {
			start();
		});
	});

	test("eQuery.ajax - falsy url in settings object (#10093)", function() {
		expect( 4 );

		eQuery.ajaxSetup({ timeout: 0 });

		stop();

		eQuery.when(
			eQuery.ajax({ url: "" }).success(function(){ ok( true, "settings object - empty string" ); }),
			eQuery.ajax({ url: false }).success(function(){ ok( true, "false" ); }),
			eQuery.ajax({ url: null }).success(function(){ ok( true, "null" ); }),
			eQuery.ajax({ url: undefined }).success(function(){ ok( true, "undefined" ); })
		).always(function () {
			start();
		});
	});
	
	test( "eQuery.ajax - empty json gets to error callback instead of success callback.", function() {
		expect( 1 );

		stop();

		eQuery.ajax( url("data/echoData.php"), {
			error: function( _, __, error ) {
				equal( typeof error === "object", true,  "Didn't get back error object for empty json response" );
				start();
			},
			dataType: "json"
		});
	});
}
