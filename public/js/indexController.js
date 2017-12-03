{

	var deleteTemp;
	var editTemp;
	var editID;

	$(document).ready(function () {
		if (window.location.pathname == '/') {
			if (getCookie("userID") != null) {
				loginSuccess();
			}
		}
		if (window.location.pathname == '/contacts.html') {
			if (getCookie("userID") == null) {
				redirectToLogin();
			}
			getUserContacts();
		}

		$('.modal').modal({
			dismissible: false,
			opacity: 0.8
		});
	});

	var loginSuccess = function () {
		window.location.pathname = "/contacts.html";
	};

	var redirectToLogin = function () {
		window.location.pathname = "/";
	};

	var logout = function () {
		document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
		window.location.pathname = "/";
	};

	var deleteContact = function () {
		var idToDelete = parseInt(deleteTemp[0].cells[0].innerHTML);
		$.ajax({
			type: "DELETE",
			url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000/contacts",
			data: {
				id: idToDelete
			},
			success: function (result) {
				if (result.status == 200) {
					Materialize.toast("Contact deleted.", 4000, 'green');
					getUserContacts();
				} else {
					Materialize.toast("Error deleting contact.", 4000, 'red darken-2');
					getUserContacts();
				}
			}
		});
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

		if ($('#firstName').val().length < 1) {
			Materialize.toast("Please enter a first name.", 4000, 'red darken-2');
		} else if ($('#firstName').val().length > 30) {
			Materialize.toast("First name cannot be more than 30 characters.", 4000, 'red darken-2');
		} else if ($('#lastName').val().length < 1) {
			Materialize.toast("Please enter a last name.", 4000, 'red darken-2');
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
							if (result.status == 201) {
								var date = new Date();
								date.setTime(date.getTime() + 24 * 3600 * 1000);
								document.cookie = "userID=" + result.userID + "; expires=" + date.toUTCString() + ";";
								loginSuccess();
							} else {
								Materialize.toast("Error creating user.", 4000, 'red darken-2');
							}
						}
					});
				}
			});
		}
	};

	var attemptLogin = function () {
		if ($('#username').val().length < 1) {
			Materialize.toast("Please enter a username.", 4000, 'red darken-2')
		} else if ($('#password').val().length < 1) {
			Materialize.toast("Please enter a password.", 4000, 'red darken-2');
		} else {
			$.ajax({
				type: "POST",
				url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000/login",
				data: {
					username: $('#username').val(),
					password: $('#password').val()
				},
				success: function (result) {
					if (result.status == 200) {
						var date = new Date();
						date.setTime(date.getTime() + 24 * 3600 * 1000);
						document.cookie = "userID=" + result.userID + "; expires=" + date.toUTCString() + ";";
						loginSuccess();
					} else {
						Materialize.toast("Incorrect username or password.", 4000, "red darken-2");
					}
				}
			});
		}
	};

	var addContact = function () {
		if ($('#contactFirstName').val().length < 1) {
			Materialize.toast("Please enter a first name.", 4000, 'red darken-2');
		} else if ($('#contactFirstName').val().length > 62) {
			Materialize.toast("First name can not be longer than 62 characters.", 4000, 'red darken-2');
		} else if ($('#contactLastName').val().length < 1) {
			Materialize.toast("Please enter a last name.", 4000, 'red darken-2');
		} else if ($('#contactLastName').val().length > 62) {
			Materialize.toast("Last name can not be longer than 62 characters.", 4000, 'red darken-2');
		} else if ($('#company').val().length > 62) {
			Materialize.toast("Company name can not be longer than 62 characters.", 4000, 'red darken-2');
		} else if ($('#contactPhoneNumber').val().length > 13) {
			Materialize.toast("Phone number can not be longer than 13 digits.", 4000, 'red darken-2');
		} else if ($('#streetAddress').val().length > 254) {
			Materialize.toast("Street address can not be longer than 254 characters.", 4000, 'red darken-2');
		} else if ($('#zipCode').val().length > 10) {
			Materialize.toast("Zip code can not be more than 10 digits.", 4000, 'red darken-2');
		} else if ($('#contactEmail').val().length > 254) {
			Materialize.toast("Email can not be more than 254 characters.", 4000, 'red darken-2');
		} else {
			$.ajax({
				type: "POST",
				url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000/contacts",
				data: {
					userID: getCookie("userID"),
					fname: $('#contactFirstName').val(),
					lname: $('#contactLastName').val(),
					company: $('#company').val() == "" ? null : $('#company').val(),
					phone: $('#contactPhoneNumber').val() == "" ? null : $('#contactPhoneNumber').val(),
					street: $('#streetAddress').val() == "" ? null : $('#streetAddress').val(),
					zip: $('#zipCode').val() == "" ? null : $('#zipCode').val(),
					email: $('#contactEmail').val() == "" ? null : $('#contactEmail').val()
				},
				success: function (result) {
					if (result.status == 201) {
						$('#addContactModal').modal('close');
						Materialize.toast("Contact added successfully.", 4000, 'green');
						getUserContacts();
						resetForm();
					} else {
						Materialize.toast("Error adding contact.", 4000, 'red darken-2');
					}
				}
			});
		}
	};

	var resetForm = function () {
		$('#contactFirstName').val("");
		$('#contactLastName').val("");
		$('#company').val("");
		$('#contactPhoneNumber').val("");
		$('#streetAddress').val("");
		$('#zipCode').val("");
		$('#contactEmail').val("");
	};

	var editContact = function () {
		if ($('#editFirstName').val().length < 1) {
			Materialize.toast("Please enter a first name.", 4000, 'red darken-2');
		} else if ($('#editFirstName').val().length > 62) {
			Materialize.toast("First name can not be longer than 62 characters.", 4000, 'red darken-2');
		} else if ($('#editLastName').val().length < 1) {
			Materialize.toast("Please enter a last name.", 4000, 'red darken-2');
		} else if ($('#editLastName').val().length > 62) {
			Materialize.toast("Last name can not be longer than 62 characters.", 4000, 'red darken-2');
		} else if ($('#editCompany').val().length > 62) {
			Materialize.toast("Company name can not be longer than 62 characters.", 4000, 'red darken-2');
		} else if ($('#editPhoneNumber').val().length > 13) {
			Materialize.toast("Phone number can not be longer than 13 digits.", 4000, 'red darken-2');
		} else if ($('#editStreetAddress').val().length > 254) {
			Materialize.toast("Street address can not be longer than 254 characters.", 4000, 'red darken-2');
		} else if ($('#editZipCode').val().length > 10) {
			Materialize.toast("Zip code can not be more than 10 digits.", 4000, 'red darken-2');
		} else if ($('#editEmail').val().length > 254) {
			Materialize.toast("Email can not be more than 254 characters.", 4000, 'red darken-2');
		} else {
			$.ajax({
				type: "PUT",
				url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000/contacts",
				data: {
					fname: $('#editFirstName').val(),
					lname: $('#editLastName').val(),
					company: $('#editCompany').val() == "" ? null : $('#editCompany').val(),
					phone: $('#editPhoneNumber').val() == "" ? null : $('#editPhoneNumber').val(),
					street: $('#editStreetAddress').val() == "" ? null : $('#editStreetAddress').val(),
					zip: $('#editZipCode').val() == "" ? null : $('#editZipCode').val(),
					email: $('#editEmail').val() == "" ? null : $('#editEmail').val(),
					id: editID
				},
				success: function (result) {
					if (result.status == 200) {
						$('#editContactModal').modal('close');
						Materialize.toast("Contact edited successfully.", 4000, 'green');
						getUserContacts();
					} else {
						Materialize.toast("Error editing contact.", 4000, 'red darken-2');
					}
				}
			});
		}
	};

	var getCookie = function (name) {
		var begin = document.cookie.indexOf("; " + name + "=");
		if (begin == -1) {
			begin = document.cookie.indexOf(name + "=");
			if (begin != 0) return null;
		} else {
			begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1) {
				end = document.cookie.length;
			}
		}
		var prefix = name + "=";
		return decodeURI(document.cookie.substring(begin + prefix.length, end));
	};

	var getUserContacts = function () {
		var currentUser = getCookie("userID");
		if (currentUser == null) {
			redirectToLogin();
			return;
		}

		$.ajax({
			type: "GET",
			url: "http://ec2-52-72-121-61.compute-1.amazonaws.com:3000/contacts",
			data: {
				userID: currentUser
			},
			success: function (result) {
				if (result.length == 0) {
					$('#hasContacts').addClass("hide");
					$('#noContacts').removeClass("hide");
				} else {
					$('#noContacts').addClass("hide");
					$('#hasContacts').removeClass("hide");
					var body = $('#hasContacts');
					body.empty();
					var editHtml = '<td><a class="btn-floating waves-effect waves-light yellow editButton"><i class="material-icons">edit</i></a></td>';
					var deleteHtml = '<td><a class="btn-floating waves-effect waves-light red deleteButton"><i class="material-icons">delete</i></a></td>';
					for (var i = 0; i < result.length; i++) {
						var fName = result[i].fname == null ? "" : result[i].fname;
						var lName = result[i].lname == null ? "" : result[i].lname;
						var company = result[i].company == null ? "" : result[i].company;
						var phoneNumber = result[i].phone == null ? "" : result[i].phone;
						var streetAddress = result[i].street == null ? "" : result[i].street;
						var zipCode = result[i].zip == null ? "" : result[i].zip;
						var email = result[i].email == null ? "" : result[i].email;
						body.append("<tr><td class='hide'>" + result[i].id + "</td>" +
							"<td>" + fName + "</td>" +
							"<td>" + lName + "</td>" +
							"<td>" + company + "</td>" +
							"<td>" + phoneNumber + "</td>" +
							"<td>" + streetAddress + "</td>" +
							"<td>" + zipCode + "</td>" +
							"<td>" + email + "</td>" +
							editHtml + deleteHtml + "</tr>");
					}
					$('.editButton').on('click', function () {
						editTemp = $(this).closest('tr');
						$('#editContactModal').modal('open');
						editID = parseInt(editTemp[0].cells[0].innerHTML);
						var fName = editTemp[0].cells[1].innerHTML;
						var lName = editTemp[0].cells[2].innerHTML;
						var company = editTemp[0].cells[3].innerHTML == null ? "" : editTemp[0].cells[3].innerHTML;
						var phone = editTemp[0].cells[4].innerHTML == null ? "" : editTemp[0].cells[4].innerHTML;
						var address = editTemp[0].cells[5].innerHTML == null ? "" : editTemp[0].cells[5].innerHTML;
						var zip = editTemp[0].cells[6].innerHTML == null ? "" : parseInt(editTemp[0].cells[6].innerHTML);
						var email = editTemp[0].cells[7].innerHTML == null ? "" : editTemp[0].cells[7].innerHTML;

						$('#editFirstName').val(fName);
						$('#editLastName').val(lName);
						$('#editCompany').val(company);
						$('#editEmail').val(email);
						$('#editPhoneNumber').val(phone);
						$('#editStreetAddress').val(address);
						$('#editZipCode').val(zip);
						Materialize.updateTextFields();
					});
					$('.deleteButton').on('click', function () {
						deleteTemp = $(this).closest('tr');
						$('#confirmDeleteModal').modal('open');
					});
				}
				$('#preloader').addClass("hide");
			}
		});
	};

	var sortTable = function (column) {
		var table = $('#mainTable')
		var switching = true;
		var direction = "asc";
		var rows, first, second, i, rowTemp;
		var numberSwitches = 0;
		var needsSwitch = false;
		while (switching) {
			switching = false;
			rows = $('#hasContacts').get()[0].childNodes;
			for (i = 0; i < (rows.length - 1); i++) {
				shouldSwitch = false;
				first = rows[i].childNodes[column];
				second = rows[i + 1].childNodes[column];
				if (direction == "asc") {
					if (first.innerHTML.toLowerCase() > second.innerHTML.toLowerCase()) {
						needsSwitch = true;
						break;
					}
				} else if (direction == "desc") {
					if (first.innerHTML.toLowerCase() < second.innerHTML.toLowerCase()) {
						needsSwitch = true;
						break;
					}
				}
			}
			if (needsSwitch && i < rows.length-1) {
				numberSwitches++;
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
			} else {
				if (numberSwitches == 0 && direction == "asc") {
					direction = "desc";
					switching = true;
				}
			}
		}
	};

}