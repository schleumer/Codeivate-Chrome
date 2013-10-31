if (!localStorage['user']) {
	chrome.browserAction.setBadgeText({
		text: "!"
	});
	chrome.browserAction.setBadgeBackgroundColor({
		color: [255,95,95,255]
	});
}
var extension;
var popupDocument = document;
chrome.runtime.onMessage.addListener(function(msg, sender, res) {
	if (msg === "start") {
		alert(msg);
		extension = new Codeivate.Extension(localStorage['user'], popupDocument);
		extension.update();
		extension.start();
		// res()
	}
});