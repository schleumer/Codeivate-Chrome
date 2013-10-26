document.getElementById("submit").onclick = function() {
	var t = document.getElementById("username").value;
	if (t !== "") {
		localStorage['user'] = t;
		var ex = new Codeivate.Extension(localStorage['user'], document);
		ex.update();
		ex.start();
		document.getElementById("submit").disabled = true;
		document.getElementById("username").disabled = true;
		document.getElementById("submit").innerText = "Authenticated!";
	}
};