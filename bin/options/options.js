document.getElementById("submit").onclick = function() {
	var t = document.getElementById("username").value;
	if (t !== "") {
		localStorage['user'] = t;
		document.getElementById("submit").disabled = true;
		document.getElementById("username").disabled = true;
		document.getElementById("submit").innerText = "Authenticated!";
	}
};

window.onload = function() {
	if (localStorage['user']) {
		document.getElementById("submit").disabled = true;
		document.getElementById("username").value = localStorage['user'];
		document.getElementById("username").disabled = true;
		document.getElementById("submit").innerText = "Authenticated!";
	}
}