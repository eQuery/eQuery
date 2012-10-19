module("exports", { teardown: moduleTeardown });

test("amdModule", function() {
	expect(1);

	equal( eQuery, amdDefined, "Make sure defined module matches eQuery" );
});
