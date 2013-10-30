chrome.runtime.onStartup.addListener(function() {
	var extension = new Codeivate.Extension(localStorage['user'], document);
	extension.update();
	chrome.runtime.sendMessage("start");
});