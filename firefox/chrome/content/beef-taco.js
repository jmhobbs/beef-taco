/*
* Beef Taco - Additions based on "Targeted Advertising Cookie Opt-Out" by Christopher Soghoian
*
* Copyright 2010-2011, John Hobbs
* http://www.velvetcache.org/
*
* Targeted Advertising Cookie Opt-Out
* Copyright 2009, Christopher Soghoian
* www.dubfire.net
*
*
* Based very loosely on the Advertising Cookie Opt-out Plugin.
* which was written by vali@google.com (Valentin Gheorghita)
* Available here: http://www.google.com/ads/preferences/plugin/
* That code is copyright 2009 Google Inc.
*
* Code since completely rewritten by Daniel Witte @ Mozilla
*
* Many thanks also to Sid Stamm @ Mozilla, for debugging assistance.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

com.github.jmhobbs.beef_taco.removeCookieObserver = function () {
	try {
		var os = Components.classes['@mozilla.org/observer-service;1'].getService( Components.interfaces.nsIObserverService );
		os.removeObserver( com.github.jmhobbs.beef_taco.CookieListener, 'cookie-changed' );
	}
	catch( error ){}
}

com.github.jmhobbs.beef_taco.addCookieObserver = function () {
	try {
		var os = Components.classes['@mozilla.org/observer-service;1'].getService( Components.interfaces.nsIObserverService );
		os.addObserver( com.github.jmhobbs.beef_taco.CookieListener, 'cookie-changed', false );
	}
	catch( error ){}
}

com.github.jmhobbs.beef_taco.addQuitObserver = function () {
	try {
		var os = Components.classes['@mozilla.org/observer-service;1'].getService( Components.interfaces.nsIObserverService );
		os.addObserver( com.github.jmhobbs.beef_taco.QuitListener, 'quit-application-granted', false );
	}
	catch( error ){}
}

com.github.jmhobbs.beef_taco.removeQuitObserver = function () {
	try {
		var os = Components.classes['@mozilla.org/observer-service;1'].getService( Components.interfaces.nsIObserverService );
		os.removeObserver( com.github.jmhobbs.beef_taco.QuitListener, 'quit-application-granted' );
	}
	catch( error ){}
}

/**
* Install all of the opt-out cookies
*/
com.github.jmhobbs.beef_taco.OptOut = function () {
	// This method is also called to reload all cookies, so the observer might not exist.
	// But if it does, we need to unregister it.
	com.github.jmhobbs.beef_taco.removeCookieObserver();

	var cm = Components.classes['@mozilla.org/cookiemanager;1'].getService( Components.interfaces.nsICookieManager2 );

	const expires = ( new Date( "Jan 1, 3000" ) ).getTime() / 1000;

	for( var host in com.github.jmhobbs.beef_taco.cookies ) {
		var hostCookies = com.github.jmhobbs.beef_taco.cookies[host];
		var hostCookie = null;
		for each ( hostCookie in hostCookies ) {
			cm.add(
				host,             // host
				hostCookie.path,  // path
				hostCookie.name,  // name
				hostCookie.value, // value
				false,            // isSecure
				false,            // isHttpOnly
				false,            // isSession
				expires
			);
		}
	}

	// Give other cookie managers time to load before we start touching the cookies
	var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
	timer.initWithCallback(
		com.github.jmhobbs.beef_taco.addCookieObserver,
		1500,
		Components.interfaces.nsITimer.TYPE_ONE_SHOT
	);

},


/**
* Set a single opt-out cookie
*/
com.github.jmhobbs.beef_taco.SetCookie = function ( host, hostCookie ) {

	var cm = Components.classes['@mozilla.org/cookiemanager;1'].getService( Components.interfaces.nsICookieManager2 );

	const expires = ( new Date( "Jan 1, 3000" ) ).getTime() / 1000;

	cm.add(
		host,             // host
		hostCookie.path,  // path
		hostCookie.name,  // name
		hostCookie.value, // value
		false,            // isSecure
		false,            // isHttpOnly
		false,            // isSession
		expires
	);

},

/**
* Listener object for cookie deleted.
*/
com.github.jmhobbs.beef_taco.CookieListener = {
	observe: function( subject, topic, data ) {
		if( topic == 'cookie-changed' ) {
			if( data == 'cleared' ) {
				// entire cookie database cleared - reset everything
				com.github.jmhobbs.beef_taco.OptOut();
			}
			else if( data == 'deleted' /*|| data == 'changed' */) {
				// single cookie deleted or changed - reset just what we need to
				var cookie = subject.QueryInterface( Components.interfaces.nsICookie2 );
				var host = cookie.host;
				var hostCookies = com.github.jmhobbs.beef_taco.cookies[host];
				var hostCookie = null;
				for each ( hostCookie in hostCookies ) {
					if( hostCookie.name == cookie.name ) {
						com.github.jmhobbs.beef_taco.SetCookie( host, hostCookie );
					}
				}
			}
		}
	}
},

/**
* Listener object for quit so we can remove our cookie observer.
*/
com.github.jmhobbs.beef_taco.QuitListener = {
	observe: function( subject, topic, data ) {
		if( topic == 'quit-application-granted' ) {
			com.github.jmhobbs.beef_taco.removeCookieObserver();
		}
	}
},

/**
* Load the extension
*/
com.github.jmhobbs.beef_taco.Load = function () {

	// Make sure we only register a single listener
	var hiddenWindow = Components.classes["@mozilla.org/appshell/appShellService;1"].getService( Components.interfaces.nsIAppShellService ).hiddenDOMWindow;
	if( hiddenWindow.tacoInitialized ) {
		hiddenWindow.tacoInitialized++;
		return;
	}
	hiddenWindow.tacoInitialized = 1;

	com.github.jmhobbs.beef_taco.addQuitObserver();

	com.github.jmhobbs.beef_taco.OptOut();
},

/**
* Unload the extension.
*/
com.github.jmhobbs.beef_taco.Unload = function () {
	var hiddenWindow = Components.classes["@mozilla.org/appshell/appShellService;1"].getService( Components.interfaces.nsIAppShellService ).hiddenDOMWindow;
	hiddenWindow.tacoInitialized--;
	if( hiddenWindow.tacoInitialized > 0 ) return;

	com.github.jmhobbs.beef_taco.removeQuitObserver();
}
