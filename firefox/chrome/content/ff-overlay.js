com.github.jmhobbs.beef_taco.onStartup = function ( event ) {
	this.initialized = true;
	this.strings = document.getElementById( "beef-taco-strings" );
	
	this.preferences = Components.classes["@mozilla.org/preferences-service;1"]
			.getService( Components.interfaces.nsIPrefService )
			.getBranch( "extensions.beef-taco." );
	this.preferences.QueryInterface( Components.interfaces.nsIPrefBranch2 );
	
	document.getElementById( "beef-taco-cookies" ).hidden = ! this.preferences.getBoolPref( "showtoolbarpref" );
	
	this.preferences.addObserver( "", com.github.jmhobbs.beef_taco.PreferencesObserver, false );
};

com.github.jmhobbs.beef_taco.onShutdown = function() {
	this.preferences.removeObserver( "", com.github.jmhobbs.beef_taco.PreferencesObserver );
};

com.github.jmhobbs.beef_taco.PreferencesObserver = {
	observe: function( subject, topic, data ) {
		if( topic != "nsPref:changed" ) { return; }
		switch ( data ) {
			case "showtoolbarpref":
				// This isn't the best way in the world, but hey, it's a boolean, it should work, right?
				document.getElementById( "beef-taco-cookies" ).hidden = ! document.getElementById( "beef-taco-cookies" ).hidden;
				break;
		}
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