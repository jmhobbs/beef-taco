com.github.jmhobbs.beef_taco.onStartup = function ( event ) {
	this.initialized = true;
	this.strings = document.getElementById( "beef-taco-strings" );
	
	this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService( Components.interfaces.nsIPrefService )
			.getBranch( "extensions.beef-taco." );
	this.prefs.QueryInterface( Components.interfaces.nsIPrefBranch2 );
	
	this.cookie_toolbar = document.getElementById( "beef-taco-cookies" );
	this.cookie_toolbar.hidden = ! this.prefs.getBoolPref( "showtoolbarpref" );
	
	this.prefs.addObserver( "", com.github.jmhobbs.beef_taco, false );
};

com.github.jmhobbs.beef_taco.onShutdown = function() {
	this.prefs.removeObserver( "", this );
};

com.github.jmhobbs.beef_taco.observe = function ( subject, topic, data ) {
	if( topic != "nsPref:changed" ) { return; }
	switch ( data ) {
		case "showtoolbarpref":
// 			alert( 'In!' );
// 			alert( com.github.jmhobbs.beef_taco.prefs );
			//this.cookie_toolbar.hidden = ! this.prefs.getBoolPref( "showtoolbarpref" );
			break;
	}
};

com.github.jmhobbs.beef_taco.showAllCookies = function( event ) {
	window.openDialog(
		"chrome://browser/content/preferences/cookies.xul",
		"_blank",
		"chrome,resizable=yes"
	);
};

window.addEventListener( "load", com.github.jmhobbs.beef_taco.onStartup, false );
window.addEventListener( "unload", com.github.jmhobbs.beef_taco.onShutdown, false );