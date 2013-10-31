var callb = function() {
	if (localStorage['user']) {
		var extension = new Codeivate.Extension(localStorage['user']);
		extension.update();
		extension.start();
	} else {
		chrome.browserAction.setBadgeText({
			text: "!"
		});
		chrome.browserAction.setBadgeBackgroundColor({
			color: [255,95,95,255]
		});
	}
};
chrome.runtime.onStartup.addListener(callb);

chrome.runtime.onInstalled.addListener(function() {
	chrome.tabs.create({ url: "options/index.html" });
});
callb();