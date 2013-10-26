if (localStorage['user']) {
	var ex = new Codeivate.Extension(localStorage['user'], document);
	ex.update();
	ex.start();
} else {
	chrome.browserAction.setBadgeText({
		text: "!"
	});
	chrome.browserAction.setBadgeBackgroundColor({
		color: [255,95,95,255]
	});
}