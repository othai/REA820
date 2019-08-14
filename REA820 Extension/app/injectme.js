var windowObject = window;
var canvasObject = document.getElementsByTagName('canvas')[0];
var navigatorObject = window.navigator;

console.log(windowObject);

var assignPropertyBindings = function() {

    var cookieEnabled = window.navigator.cookieEnabled;
    var userAgent = window.navigator.userAgent.toLowerCase();
    var screen = window.screen;
    var javaEnabled = window.navigator.javaEnabled;
    var language = window.navigator.language;
    var platform = window.navigator.platform.toLowerCase();

    // Bind to canvas property
    Object.defineProperty(canvasObject, "getContext('2d')", {
        get: function s() {
            console.log("Canvas object inserted into page.");
            return getContext("2d");
        }.bind(this)
    });

    // Bind to screen property
    Object.defineProperty(windowObject, 'screen', {
        get: function s() {
            console.log("window.screen property accessed.");
            console.log(window.location.hostname);
            //console.log(screen);
            return screen;
        }.bind(this)
    });

    // Bind to cookieEnabled property
    Object.defineProperty(navigatorObject, 'cookieEnabled', {
        get: function() {
            console.log("navigator.cookieEnabled property accessed.");
            return cookieEnabled;
        }.bind(this)
    });

    // Bind to userAgent property
    Object.defineProperty(navigatorObject, 'userAgent', {
        get: function() {
            console.log("navigator.userAgent property accessed.");
            return userAgent;
        }.bind(this)
    });

    // Bind to javaEnabled property
    Object.defineProperty(navigatorObject, 'javaEnabled', {
        get: function() {
            console.log("navigator.javaEnabled property accessed.");
            return javaEnabled;
        }.bind(this)
    });

    Object.defineProperty(navigatorObject, 'language', {
        get: function() {
            console.log("navigator.language property accessed.");
            return language;
        }.bind(this)
    });

    Object.defineProperty(navigatorObject, 'platform', {
        get: function() {
            console.log("navigator.platform property accessed.");
            return platform;
        }.bind(this)
    });
    
}

assignPropertyBindings();