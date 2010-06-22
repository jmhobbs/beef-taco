com.github.jmhobbs.beef_taco.onFirefoxLoad = function ( event ) {
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

window.addEventListener( "load", com.github.jmhobbs.beef_taco.onFirefoxLoad, false );
