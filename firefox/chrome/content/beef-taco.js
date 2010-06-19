/*
* Beef Taco - Additions based on "Targeted Advertising Cookie Opt-Out" by Christopher Soghoian
*
* Copyright 2010, John Hobbs
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


/**
* Install all of the opt-out cookies
*/
com.github.jmhobbs.beef_taco.OptOut = function () {
	// Temporarily remove our cookie-changed observer, so we don't chase our tail
	var os = Components.classes['@mozilla.org/observer-service;1'].getService( Components.interfaces.nsIObserverService );

	os.removeObserver( com.github.jmhobbs.beef_taco.CookieListener, 'cookie-changed' );

	var cm = Components.classes['@mozilla.org/cookiemanager;1'].getService( Components.interfaces.nsICookieManager2 );

	const expires = ( new Date( "Jan 1, 3000" ) ).getTime() / 1000;

	for( var host in com.github.jmhobbs.beef_taco.cookies ) {
		var hostCookies = com.github.jmhobbs.beef_taco.cookies[host];
		for each ( hostCookie in hostCookies ) {
			cm.add( host,         // host
				hostCookie.path,   // path
				hostCookie.name,   // name
				hostCookie.value,  // value
				false,  // isSecure
				false,  // isHttpOnly
				false,  // isSession
				expires );
		}
	}

	os.addObserver( com.github.jmhobbs.beef_taco.CookieListener, 'cookie-changed', false );
},


/**
* Set a single opt-out cookie
*/
com.github.jmhobbs.beef_taco.SetCookie = function ( host, hostCookie ) {
	var cm = Components.classes['@mozilla.org/cookiemanager;1'].getService( Components.interfaces.nsICookieManager2 );

	const expires = ( new Date( "Jan 1, 3000" ) ).getTime() / 1000;

	cm.add( host,          // host
			hostCookie.path,   // path
			hostCookie.name,   // name
			hostCookie.value,  // value
			false,  // isSecure
			false,  // isHttpOnly
			false,  // isSession
			expires );
},

/**
* Listener variable for cookie deleted.
*/
com.github.jmhobbs.beef_taco.CookieListener = {
	observe: function( subject, topic, data ) {
		if( topic == 'cookie-changed' ) {
			if( data == 'cleared' ) {
				// entire cookie database cleared - reset everything
				com.github.jmhobbs.beef_taco.OptOut();
			}
			else if( data == 'deleted' || data == 'changed' ) {
				// single cookie deleted or changed - reset just what we need to
				var cookie = subject.QueryInterface( Components.interfaces.nsICookie2 );
				var host = cookie.host;
				var hostCookies = com.github.jmhobbs.beef_taco.cookies[host];
				for each ( hostCookie in hostCookies ) {
					if( hostCookie.name == cookie.name ) {
						com.github.jmhobbs.beef_taco.SetCookie( host, hostCookie );
					}
				}
			}
		}
	}
},

com.github.jmhobbs.beef_taco.Load = function () {

	// Make sure we only register a single listener
	var hiddenWindow = Components.classes["@mozilla.org/appshell/appShellService;1"].getService( Components.interfaces.nsIAppShellService ).hiddenDOMWindow;
	if( hiddenWindow.tacoInitialized ) {
		hiddenWindow.tacoInitialized++;
		return;
	}
	hiddenWindow.tacoInitialized = 1;

	var os = Components.classes['@mozilla.org/observer-service;1'].getService( Components.interfaces.nsIObserverService );
	os.addObserver( com.github.jmhobbs.beef_taco.CookieListener, 'cookie-changed', false );

	com.github.jmhobbs.beef_taco.OptOut();
},

/**
* Unload the extension.
*/
com.github.jmhobbs.beef_taco.Unload = function () {
	var hiddenWindow = Components.classes["@mozilla.org/appshell/appShellService;1"].getService( Components.interfaces.nsIAppShellService ).hiddenDOMWindow;
	hiddenWindow.tacoInitialized--;
	if( hiddenWindow.tacoInitialized > 0 ) return;

	var os = Components.classes['@mozilla.org/observer-service;1'].getService( Components.interfaces.nsIObserverService );
	os.removeObserver( com.github.jmhobbs.beef_taco.CookieListener, 'cookie-changed' );
}