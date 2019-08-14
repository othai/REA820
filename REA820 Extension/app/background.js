
tabDataObject = {};
objectUpdated = false;
var adblockChecked = true;
var obscriptChecked = true;

class TabData {
    // var tabId;
    // var scripts;
    // var cookiesRequested;

    constructor(tabId, scripts, cookiesRequested) {
        this.tabId = tabId;
        this.scripts = scripts;
        this.cookiesRequested = cookiesRequested;
    }
}

/*
var getCookieType = function(requestHeaderArray) {
    
    for (var i = 0; i < requestHeaderArray.length; i++) {
        if (requestHeaderArray[i].name.toLowerCase() === "cookie" && requestHeaderArray[i].value.toLowerCase() === "session-id") {

        }
    }
}
*/

var onBeforeRequestListener = function(details) {
    //console.log("BeforeRequest");
    //console.log(details);
    console.log("blocking:", details.url)
    //return{cancel: true}
}

var doesCookieExist = function(details) {

    for (var i = 0; i < details.requestHeaders.length; i++) {

        // Check if it is a session cookie, ignore if true
        if (details.requestHeaders[i].name.toLowerCase() === "cookie" && (details.requestHeaders[i].value.toLowerCase().includes("session")) || details.requestHeaders[i].value.toLowerCase().includes("sid")) {
            return false;
        }

        // Check if cookie is being set/queried through img src
        // Typically means it is a third-party tracking cookie
        if (details.requestHeaders[i].name.toLowerCase() === "cookie" && details.type.toLowerCase() === "image") {
            //console.log("third-party cookie")
            //console.log(details.requestHeaders[i].value);
            //console.log(details);
            return true;
        } 
        // Does not work as a catch-all for first-party cookies...Amazon tracking cookies include the word "ad"
        else if (details.requestHeaders[i].name.toLowerCase() === "cookie") {
            //console.log("first-party cookie");
            //console.log(details.requestHeaders[i].value);
            //console.log(details);
            return true;
        }
    }
    return false;

}

var doesScriptExist = function(url) {
    
    if (url.toLowerCase().endsWith(".js")) {
        if (obscriptChecked == true) {
            var filenameArray = url.split("/");
            var filename = filenameArray[filenameArray.length-1];

            chrome.downloads.download({
                url: url,
                filename: "JS_files/" + filename,
                conflictAction: "overwrite"
            });

            fetch('http://127.0.0.1:9000?filename=' + filename)
            .then(function(response) {
                return response.json();
            })
            .then(function(responseAsJson) {
                console.log(responseAsJson);
            });
        }
        return true;
    }
    return false;

}

// Updating cookies' properties is a two step process where the entire cookie is first removed 
// and then replaced with the new values
/*
var onCookieRemovedListener = function(changeInfo) {
    console.log(changeInfo);
    if (changeInfo.removed) {
        tabDataObject[details.tabId].cookiesRemoved++;
        objectUpdated = true;
    }

    if (objectUpdated) {
        updateTabData();
    }

}
*/
var onNewTabCreatedListener = function(newTab) {
    //console.log(newTab);

    var tabData = new TabData(newTab.id, 0, 0);

    tabDataObject[newTab.id] = tabData;
    //console.log(tabDataObject);
}

var onBeforeSendHeadersListener = function(details) {

    // Google assigns tabId = -1 when opening new tab suggestion page
    // if tabId equals -1, request is not related to tab and ignore request.
    // else parse request and retrieve associated cookies and script urls, if any
    //console.log(details);
    var objectUpdated = false;
    if (details.tabId === -1) {
        //console.log("ignored tab");
        return;
    }

    if (doesCookieExist(details)) {
        //console.log("cookie queried");
        //console.log(details)
        tabDataObject[details.tabId].cookiesRequested++;
        objectUpdated = true;
    }

    if (!(doesScriptExist(details.url) == false)) {
        //console.log("script detected");
        tabDataObject[details.tabId].scripts++;
        objectUpdated = true;
    }

    // If the tabDataObject object has been modified, send the tabDataObject to popup.js
    if (objectUpdated) {
        updateTabData();
    }

}

// If the tabDataObject object has been modified, send the tabDataObject to popup.js
var updateTabData = function() {

    chrome.runtime.sendMessage({
        msg: "tabData",
        data: tabDataObject
    });

}
/*
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if (message.obscriptChecked == false) {
        this.obscriptChecked = false;
    } else {
        this.obscriptChecked = true;
    }
})
*/
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestListener, {
    urls: ["<all_urls>"]
}, ["requestBody","blocking"]);
chrome.tabs.onCreated.addListener(onNewTabCreatedListener);
//chrome.cookies.onChanged.addListener(onCookieRemovedListener);
chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeadersListener, {
    urls: ["<all_urls>"]
}, ["requestHeaders","blocking"]);
