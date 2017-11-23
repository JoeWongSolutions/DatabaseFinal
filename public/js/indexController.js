{
	
	var deleteTemp;

	$(document).ready(function () {
		$('.parallax').parallax();
		$('.modal').modal({
			dismissible: false,
			opacity: 0.8
		});
		$('.editButton').on('click', function() {
			//TODO - edit function
		});
		$('.deleteButton').on('click', function() {
			deleteTemp = $(this).closest('tr');
			$('#confirmDeleteModal').modal('open');
		});
	});
	
	var loginSuccess = function() {
		var currentLocation = window.location.href;
		window.location = currentLocation + "contacts.html";
	};
	
	var deleteContact = function(data) {
		console.log(data);
	};
	
	var deleteContact = function() {
		//TODO - remove contact from DB
		deleteTemp.remove();
	};
	
	var testDBPull = function() {
		console.log("Attempting to pull data from DB");
		document.cookie = "id=1";
		
		$.ajax({
			type: "GET",
			url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			success: function(data) {
				console.log("Success! The data is: " + data);
			}
		});
	};
	
	testDBPull();

}