com.github.jmhobbs.beef_taco.onLoad = function () {
	this.initialized = true;
	this.strings = document.getElementById( "beef-taco-strings" );
};

com.github.jmhobbs.beef_taco.onMenuItemCommand = function ( e ) {
	var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService( Components.interfaces.nsIPromptService );
	promptService.alert( window, this.strings.getString( "helloMessageTitle" ), this.strings.getString( "helloMessage" ) );
};

com.github.jmhobbs.beef_taco.onToolbarButtonCommand = function ( e ) {
	com.github.jmhobbs.beef_taco.onMenuItemCommand( e );
};

window.addEventListener( "load", com.github.jmhobbs.beef_taco.onLoad, false );