{

	$(document).ready(function () {
		$('.parallax').parallax();
	});

	$(document).ready(function () {
		$('.modal').modal({
			dismissible: false,
			opacity: 0.8
		});
	});
	
	var loginSuccess = function() {
		var currentLocation = window.location.href;
		window.location = currentLocation + "contacts.html";
	};

}