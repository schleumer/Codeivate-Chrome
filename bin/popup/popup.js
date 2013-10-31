
document.addEventListener('DOMContentLoaded', function () {
	if (!localStorage['lastProfile']) return;
	var profile = JSON.parse(localStorage['lastProfile']);
	var fields = [
		"name",
		"level",
		"currentLanguage",
		"timeSpent"
	];
	fields.forEach(function(field) {
		if (profile[field] === false) profile[field] = "None";
		document.getElementById(field).innerText = profile[field].toString();
	});
	console.log("Just updated "+new Date().toString());
});