
var uri_by_tab_id = [];

/*
 * Do not need this as onUpdated will take care of this for us.
 *
 * chrome.tabs.onCreated.addListener(function onCreated(tab) {
 *   console.log("onCreated" + tab.url);
 * });
 */

chrome.tabs.onUpdated.addListener(function onUpdated(tabId, changeInfo, tab) {
	uri_by_tab_id[tabId] = tab.url;
	replicate("update", tabId, uri_by_tab_id[tabId]);
});

chrome.tabs.onRemoved.addListener(function onUpdated(tabId, changeInfo, tab) {
	replicate("remove", tabId, uri_by_tab_id[tabId]);
	delete uri_by_tab_id[tabId];
});

function replicate(action, tabId, uri) {

	/* TODO: Exception Handling */

	console.log("Posting " + uri);

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8124/", true);
	xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
				var resp = JSON.parse(xhr.responseText);
			}
	}

	xhr.send(JSON.stringify({
		"action": action,
		"tabId": tabId,
		"uri": uri
	}));

}
