// Expose eQuery to the global object
window.eQuery = window.€ = eQuery;

// Expose eQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of eQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple eQuery versions by
// specifying define.amd.eQuery = true. Register as a named module,
// since eQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase equery is used because AMD module names are derived from
// file names, and eQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of eQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.eQuery ) {
	define( "equery", [], function () { return eQuery; } );
}
