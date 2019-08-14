var tabDataObject = {};

var getCurrentTabID = function () {
    chrome.tabs.query(
        { currentWindow: true, active: true
    },
        function (tabArray) {
            initializeRenderers(tabArray[0].id);
        }
    )
}

var initializeRenderers = function (tabID) {
    renderNumOfScripts(tabID);
    renderNumOfCookiesRequested(tabID);
    //renderNumOfCookiesRemoved(tabID);
}

var renderNumOfScripts = function (tabID) {
    var numOfScripts = tabDataObject[tabID].scripts;
    document.getElementById("scriptsCounter").innerHTML = numOfScripts;
}

var renderNumOfCookiesRequested = function (tabID) {
    var numOfCookiesRequested = tabDataObject[tabID].cookiesRequested;
    document.getElementById("cookiesRequestedCounter").innerHTML = numOfCookiesRequested;
}
/*
var renderNumOfCookiesRemoved = function (tabID) {
    var numOfCookiesRemoved = tabDataObject[tabID].cookiesRemoved;
    document.getElementById("cookiesRemovedCounter").innerHTML = numOfCookiesRemoved;
}
*/
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.msg === "tabData") {
            tabDataObject = request.data;
            getCurrentTabID();
        }
    }
);

document.addEventListener("DOMContentLoaded", function () {
    //alert(tabDataObject);
    //getCurrentTabID();
});
