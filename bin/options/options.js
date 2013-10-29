$(document).ready(function(){

	$('#reset').click(function(){
		console.log('resetting');
		localStorage.clear();

		$('#submit').prop('disabled',false).removeClass('disabled').button('reset');
		$('#username').prop('disabled', false);
		$('#submit').removeClass('btn-primary btn-success btn-warning');
		 $('.form-group').removeClass('has-success');
		$('#submit').addClass('btn-primary');
	});

	$('#submit').click(function(){

		var username = $("#username").val();
		$('#submit').button('loading');
		if (username !== "") {
			var codeivate = new Codeivate.Extension(username, document);
			codeivate.authenticate( function(response){

				var data = JSON.parse(response.responseText);

				    if ( typeof data.error == "undefined") {
						localStorage['user'] = username;
						$("submit").prop('disabled', true);
						$("username").prop('disabled', true);
						$('#submit').removeClass('btn-primary btn-success btn-warning');
						$('#submit').addClass('btn-success');
						
						$('#submit').button('reset');
	                    $('.form-group').removeClass('has-error');
	                    $('.form-group').addClass('has-success');
	                    $('.username_error').empty();       
	                } else {
						$('#submit').removeClass('btn-primary btn-success btn-warning');
						$('#submit').addClass('btn-primary');
						$('.form-group').addClass('has-error');
						$('.username_error').html($('<strong>').html('enter a valid username'));
						$('#submit').button('reset');
	                    console.error("status code: " + response.status);
	                }                
	            });
		} else {
			alert('please enter a username');
			$('#submit').removeClass('btn-primary btn-success btn-warning');
			$('#submit').addClass('btn-warning');
			$('#submit').button('reset');
			
		}
	});


	if (localStorage['user']) {
		$("submit").prop('disabled', true);
		$("username").val(localStorage['user']);
		$("username").prop('disabled',true);
		$("submit").html("Authenticated!");

		$('#links').append($('<li>').html(
			$("<a>").attr('href','http://www.codeivate.com/users/' + localStorage['user'])
			.html('http://www.codeivate.com/users/'+localStorage['user'])
			)
		);			
	}

});