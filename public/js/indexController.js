{

	var deleteTemp;

	$(document).ready(function () {
		$('.parallax').parallax();
		$('.modal').modal({
			dismissible: false,
			opacity: 0.8
		});
		$('.editButton').on('click', function () {
			//TODO - edit function
		});
		$('.deleteButton').on('click', function () {
			deleteTemp = $(this).closest('tr');
			$('#confirmDeleteModal').modal('open');
		});
	});

	var loginSuccess = function () {
		var currentLocation = window.location.href;
		window.location = currentLocation + "contacts.html";
	};

	var deleteContact = function () {
		//TODO - remove contact from DB
		deleteTemp.remove();
	};

	var testDupeUsername = function () {
		$.ajax({
			type: "GET",
			url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000/user",
			data: {
				userID: 3
			},
			success: function (result) {
				console.log(result);
			}
		});
	};

	var createSubmit = function () {
		var emailReg = /\S+@\S+\.\S+/;
		var numberDupeUsernames = 0;

		if ($('#firstName').val().length > 30) {
			Materialize.toast("First name cannot be more than 30 characters.", 4000, 'red darken-2');
		} else if ($('#lastName').val().length > 30) {
			Materialize.toast("Last name cannot be more than 30 characters.", 4000, 'red darken-2');
		} else if (emailReg.test($('#email').val()) == false) {
			Materialize.toast("Please enter a valid email address.", 4000, 'red darken-2');
		} else if ($('#createUsername').val().length < 6) {
			Materialize.toast("Username must be at least 6 characters.", 4000, 'red darken-2');
		} else if ($('#createUsername').val().length > 255) {
			Materialize.toast("Username cannot be more than 255 characters.", 4000, 'red darken-2');
		} else {
			$.ajax({
				type: "GET",
				url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000/user",
				data: {
					username: $('#createUsername').val()
				},
				success: function (result) {
					numberDupeUsernames = result[0]["COUNT(id)"];
				}
			}).then(function () {
				if (numberDupeUsernames != 0) {
					Materialize.toast("Username is already taken.", 4000, 'red darken-2');
				} else if ($('#createPassword').val().length < 6) {
					Materialize.toast("Password must be at least 6 characters.", 4000, 'red darken-2');
				} else if ($('#createPassword').val().length > 255) {
					Materialize.toast("Password cannot be more than 255 characters.", 4000, 'red darken-2');
				} else if ($('#confirmPassword').val() != $('#createPassword').val()) {
					Materialize.toast("Passwords do not match.", 4000, 'red darken-2');
				} else {
					$.ajax({
						type: "POST",
						url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000/user",
						data: {
							username: $('#createUsername').val(),
							password: $('#createPassword').val(),
							fname: $('#firstName').val(),
							lname: $('#lastName').val(),
							email: $('#email').val()
						},
						success: function (result) {
							
						}
					});
					Materialize.toast("User created. Welcome!", 4000, 'green');
					$('#signUpModal').modal('close');
				}
			});
		}
	};



	var testDBPull = function () {
		console.log("Attempting to pull data from DB");

		$.ajax({
			type: "GET",
			url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000/contacts",
			data: {
				userID: 1
			},
			success: function (result) {
				console.log(result);
			}
		});
	};

}