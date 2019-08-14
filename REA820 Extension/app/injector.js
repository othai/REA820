var filePath = 'app/injectme.js';

var script = document.createElement('script');
script.src = chrome.extension.getURL(filePath);
script.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);