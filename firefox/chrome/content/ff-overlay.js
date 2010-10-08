/**
* When we load the overlay.xul, set up the preferences observer.
*/
com.github.jmhobbs.beef_taco.onStartup = function ( event ) {

	var strings = document.getElementById( "beef-taco-strings" );

	com.github.jmhobbs.beef_taco.prefService = Components.classes["@mozilla.org/preferences-service;1"].getService( Components.interfaces.nsIPrefService );

	com.github.jmhobbs.beef_taco.prefBranch = com.github.jmhobbs.beef_taco.prefService.getBranch( "extensions.beef-taco." );

	com.github.jmhobbs.beef_taco.prefBranch.QueryInterface( Components.interfaces.nsIPrefBranch2 );

	document.getElementById( "beef-taco-cookies" ).hidden = ! com.github.jmhobbs.beef_taco.prefBranch.getBoolPref( "showtoolbarpref" );

	com.github.jmhobbs.beef_taco.prefBranch.addObserver( "", com.github.jmhobbs.beef_taco.PreferencesObserver, false );
};

/**
* On shutdown, drop the preference observer.
*/
com.github.jmhobbs.beef_taco.onShutdown = function() {
	if( com.github.jmhobbs.beef_taco.PreferencesObserver ) {
		com.github.jmhobbs.beef_taco.prefBranch.removeObserver( "", com.github.jmhobbs.beef_taco.PreferencesObserver );
	}
};

/**
* This is the object which watches and acts on preference changes.
*/
com.github.jmhobbs.beef_taco.PreferencesObserver = {
	observe: function( subject, topic, data ) {
		if( topic != "nsPref:changed" ) { return; }
		if( data == "showtoolbarpref" ) {
			document.getElementById( "beef-taco-cookies" ).hidden = ! com.github.jmhobbs.beef_taco.prefBranch.getBoolPref( "showtoolbarpref" );
		}
	}
};

/**
* This is the function called to show the cookies dialog when the menu item is clicked in overlay.xul
*/
com.github.jmhobbs.beef_taco.showAllCookies = function( event ) {
	window.openDialog(
		"chrome://browser/content/preferences/cookies.xul",
		"_blank",
		"chrome,resizable=yes"
	);
};

window.addEventListener( "load", com.github.jmhobbs.beef_taco.onStartup, false );
window.addEventListener( "unload", com.github.jmhobbs.beef_taco.onShutdown, false );