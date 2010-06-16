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
function Taco_OptOut()
{
  // Temporarily remove our cookie-changed observer, so we don't
  // chase our tail
  var os =
    Components.classes['@mozilla.org/observer-service;1'].
      getService(Components.interfaces.nsIObserverService);
  os.removeObserver(Taco_CookieListener, 'cookie-changed');

  var cm = Components.classes['@mozilla.org/cookiemanager;1'].
    getService(Components.interfaces.nsICookieManager2);

  const expires = (new Date("Jan 1, 3000")).getTime() / 1000;

  for (var host in taco_opt_out_cookies)
  {
    var tacoCookies = taco_opt_out_cookies[host];
    for each (tacoCookie in tacoCookies) {
      cm.add(host,         // host
        tacoCookie.path,   // path
        tacoCookie.name,   // name
        tacoCookie.value,  // value
        false,  // isSecure
        false,  // isHttpOnly
        false,  // isSession
        expires);
    }
  }

  os.addObserver(Taco_CookieListener, 'cookie-changed', false);
}


/** 
 * Set a single opt-out cookie
*/
function Taco_SetCookie(host, tacoCookie)
{
   var cm = Components.classes['@mozilla.org/cookiemanager;1'].
      getService(Components.interfaces.nsICookieManager2);

   const expires = (new Date("Jan 1, 3000")).getTime() / 1000;
   
   cm.add(host,          // host
      tacoCookie.path,   // path
      tacoCookie.name,   // name
      tacoCookie.value,  // value
      false,  // isSecure
      false,  // isHttpOnly
      false,  // isSession
      expires);
}

/**
 * Listener variable for cookie deleted.
 */
var Taco_CookieListener =
{
  observe: function(subject, topic, data) {
    if (topic == 'cookie-changed') {
      if (data == 'cleared') {
        // entire cookie database cleared - reset everything
        Taco_OptOut();
      } else if (data == 'deleted' || data == 'changed') {
        // single cookie deleted or changed - reset just what we need to
        var cookie = subject.QueryInterface(Components.interfaces.nsICookie2);
        var host = cookie.host;
        var tacoCookies = taco_opt_out_cookies[host];
        for each (tacoCookie in tacoCookies) {
          if (tacoCookie.name == cookie.name) {
            Taco_SetCookie(host, tacoCookie);
          }
        }
      }
    }
  }
};

/**
 * Load the extension.
 */
function Taco_Load() {

  // Make sure we only register a single listener
  var hiddenWindow =
    Components.classes["@mozilla.org/appshell/appShellService;1"].
       getService(Components.interfaces.nsIAppShellService).hiddenDOMWindow;
  if (hiddenWindow.tacoInitialized) {
    hiddenWindow.tacoInitialized++;
    return;
  }
  hiddenWindow.tacoInitialized = 1;

  var os =
    Components.classes['@mozilla.org/observer-service;1'].
      getService(Components.interfaces.nsIObserverService);
  os.addObserver(Taco_CookieListener, 'cookie-changed', false);
 
  Taco_OptOut();
}

/**
 * Unload the extension.
 */
function Taco_Unload() {
  var hiddenWindow =
    Components.classes["@mozilla.org/appshell/appShellService;1"].
       getService(Components.interfaces.nsIAppShellService).hiddenDOMWindow;
  hiddenWindow.tacoInitialized--;
  if (hiddenWindow.tacoInitialized > 0) return;

  var os =
    Components.classes['@mozilla.org/observer-service;1'].
      getService(Components.interfaces.nsIObserverService);
  os.removeObserver(Taco_CookieListener, 'cookie-changed');
}

