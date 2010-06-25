com.github.jmhobbs.beef_taco.onFirefoxLoad = function ( event ) {
	this.initialized = true;
	this.strings = document.getElementById( "beef-taco-strings" );
	
	document.getElementById( "contentAreaContextMenu" ).addEventListener(
		"popupshowing",
		function ( e ) {
			com.github.jmhobbs.beef_taco.showFirefoxContextMenu( e );
		},
		false
	);
};

com.github.jmhobbs.beef_taco.showFirefoxContextMenu = function ( event ) {
	document.getElementById( "context-beef-taco" ).hidden = gContextMenu.onImage;
};

com.github.jmhobbs.beef_taco.showAllCookies = function( event ) {
	window.openDialog(
		"chrome://browser/content/preferences/cookies.xul",
		"_blank",
		"chrome,resizable=yes"
	);
};

window.addEventListener( "load", com.github.jmhobbs.beef_taco.onFirefoxLoad, false );
