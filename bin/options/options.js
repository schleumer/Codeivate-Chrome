$(document).ready(function(){

	$('#reset').click(function(){
		localStorage.clear();
	});

	$('#submit').click(function(){

		var username = $("#username").val();
		$('#submit').button('loading');
		if (username !== "") {
			var codeivate = new Codeivate.Extension(username, document);
			codeivate.authenticate( function(response){

				var data = JSON.parse(request.responseText);

				    if ( typeof data.error == "undefined") {
						localStorage['user'] = username;
						document.getElementById("submit").disabled = true;
						document.getElementById("username").disabled = true;
						$('#submit').removeClass('btn-primary btn-success btn-warning');
						$('#submit').addClass('btn-success');
						
						$('#submit').button('reset');
	                           
	                } else {
						$('#submit').removeClass('btn-primary btn-success btn-warning');
						$('#submit').addClass('btn-warning');

						$('#submit').button('reset');
	                    console.error("status code: " + response.status);
	                }                
	            });
		} else {
			alert('please enter username');
			$('#submit').removeClass('btn-primary btn-success btn-warning');
			$('#submit').addClass('btn-warning');
			$('#submit').button('reset');
			
		}
	});


	if (localStorage['user']) {
		document.getElementById("submit").disabled = true;
		document.getElementById("username").value = localStorage['user'];
		document.getElementById("username").disabled = true;
		document.getElementById("submit").innerText = "Authenticated!";
	}

});