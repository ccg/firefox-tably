var tably = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("tably-strings");
  },
  onMenuItemCommand: function(e) {
    // for development/testing:
    //var tablyURI = "http://glendenin.com/printvars.php";
    var tablyURI = "http://tab.ly";

    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                   .getService(Components.interfaces.nsIConsoleService);

    var num = gBrowser.browsers.length;
    var tabUrlList = "count=" + num;
    for (var i = 0; i < num; i++) {
      var b = gBrowser.getBrowserAtIndex(i);
      try {
        consoleService.logStringMessage(b.currentURI.spec);
        // encodeURI() doesn't actually encode troublesome chars like '&'.
        // Have to use encodeURIComponent() instead.
        consoleService.logStringMessage(encodeURIComponent(b.currentURI.spec));
        tabUrlList += "&url" + i + "=" + encodeURIComponent(b.currentURI.spec);
      } catch(e) {
        Components.utils.reportError(e);
      }
    }
    consoleService.logStringMessage(tabUrlList);
    var stringStream = Components.classes["@mozilla.org/io/string-input-stream;1"]
                                 .createInstance(Components.interfaces.nsIStringInputStream);
    if ("data" in stringStream)
        stringStream.data = tabUrlList;
    else
        stringStream.setData(dataString, dataString.length);
    var postData = Components.classes["@mozilla.org/network/mime-input-stream;1"]
                             .createInstance(Components.interfaces.nsIMIMEInputStream);
    postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
    postData.addContentLength = true;
    postData.setData(stringStream);
    // I wasn't really interested in looking up the details of the referrer
    // URI param or the charset param, so I just set them to null.
    // It seems to work OK, but it could be wrong.
    // I'm just winging it here, so please let me know if what I'm doing is
    // wrong.
    gBrowser.selectedTab = gBrowser.addTab(tablyURI, null, null, postData);
  },

};
window.addEventListener("load", function(e) { tably.onLoad(e); }, false);
