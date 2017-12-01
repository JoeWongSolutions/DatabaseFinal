/* 
 * Joe Wong
 * CS3380 Final Project
 * 11/10/2017
 */

// We are importing the libraries we need for our server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

// We declare what tools can be used with our app
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	next();
});

// We need to connect to Mysqldb

const pool = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "web",
	password: "web",
	database: "contactlist"
});

var con;
var cookies;

//This is where authentication takes place
app.post('/login', (req, res) => {
	console.log("Reached login function.");
	//connect to the database
	pool.getConnection(function (err, connection) {
		if (err) res.send(err);
		else {
			//          con = connection;
			console.log("Connected! from post-login");

			let username = req.body.username;
			let pass = req.body.password;
			
			let sql = "SELECT id, password FROM users WHERE username=?";
			connection.query(
				sql, [username],
				(err, result) => {
					if (err) {
						console.log("There was a MYSQL error: " + err);
						res.send(err);
					} else {
						if(result.length == 0) {
							res.send({message: "Login failed.", status: 401});
						} else {
							var serverPass = result[0].password;
							var salt = serverPass.substring(0, 64);
							var hashedPass = crypto.createHash('sha256').update(pass + salt).digest('hex');
							if(salt+hashedPass == serverPass) {
								res.send({message: "Login succeeded.", status: 200, userID: result[0].id});
							} else {
								res.send({message: "Login failed.", status: 401});
							}
						}
					}
				}
			);
			connection.release();
		}
	});
});

// This is where we define CRUD for users

app.get('/contactsAll', (req, res) => {
	//connect to the database
	pool.getConnection(function (err, connection) {
		if (err) throw err;
		else {
			console.log("Connected! from get-user");

			//query the db
			if (true) {
				let sql = "SELECT * FROM contacts";
				connection.query(sql, (err, result) => {
					if (err) return console.log(err);
					else res.send(result);
				});
			} else {
				//redirect to the login
			}
			connection.release();
		}
	});
});

app.get('/userDesc', (req, res) => {
	//connect to the database
	pool.getConnection(function (err, connection) {
		if (err) throw err;
		else {
			console.log("Connected! from get-user");

			//query the db
			if (true) {
				let sql = "DESCRIBE users";
				connection.query(sql, (err, result) => {
					if (err) return console.log(err);
					else res.send(result);
				});
			} else {
				//redirect to the login
			}
			connection.release();
		}
	});
});

app.get('/user', (req, res) => {
	if (req.query.username == null && req.query.userID == null) {
		res.send("No userID or username");
		return;
	}
	pool.getConnection(function (err, connection) {
		if (err) throw err;
		else {
			console.log("Connected! from get-user");

			if (req.query.username != null) {
				let username = req.query.username;
				let sql = "SELECT COUNT(id) FROM users WHERE username=?";
				connection.query(sql, [username],
				(err, result) => {
					if (err) res.send(err);
					else res.send(result);
				});
				connection.release();
			} else {
				let userID = req.query.userID;
				let sql = "SELECT * FROM users WHERE id=?";
				connection.query(sql, [userID],
				(err, result) => {
					if (err) res.send(err);
					else res.send(result);
				});
				connection.release();
			}
		}
	});
});

app.post('/user', (req, res) => {
	pool.getConnection(function (err, connection) {
		if (err) res.send("Error: " + err);
		else {
			console.log("Connected!");
			let user = req.body;
			var salt = crypto.randomBytes(Math.ceil(32)).toString('hex').slice(0, 64);
			var hashedPass = crypto.createHash('sha256').update(user.password + salt).digest('hex');

			let sql = "INSERT INTO users (username, password, fname, lname, email, joined) values(?,?,?,?,?,?)";
			connection.query(
				sql, [
                user.username,
                salt+hashedPass,
                user.fname,
                user.lname,
                user.email,
                new Date().toISOString().slice(0, 19).replace('T', ' '),
            ],
				(err, result) => {
					if (err) res.send(err);
					else {
						console.log("Saved to database");
						res.send({message: "User added successfully.", status: 201, userID: result.insertId});
					}
				}
			);
		}
		connection.release();
	});
});

app.put('/user', (req, res) => {
	if (!req.cookies.userID) {
		return;
	}
	pool.getConnection(function (err, connection) {
		if (err) throw err;
		console.log("Connected!");
		let user = req.body;
		let sql = "UPDATE users SET username=?, password=?, fname=?, lname=?, email=? WHERE id=?";
		connection.query(
			sql, [
                user.username,
                user.password,
                user.fname,
                user.lname,
                user.email,
                req.cookies.userID
            ],
			(err, result) => {
				if (err) return res.send(err);
				res.send(result);
			}
		);
		connection.release();
	});
});

app.delete('/user*', (req, res) => {
	if (!req.query.userID) {
		res.send("No userID");
		return;
	}
	pool.getConnection(function (err, connection) {
		if (err) throw err;
		console.log("Connected!");
		let sql = "DELETE FROM users WHERE id=?";
		//        if(req.query.id == "all"){
		//            connection.query(
		//                "DELETE FROM users",
		//                (err, result) => {
		//                    if(err) return res.send(err);
		//                    res.send({message: result + " was deleted successfully"});
		//                }
		//            );
		//        }
		//        else {
		connection.query(
			sql, [req.query.userID],
			(err, result) => {
				if (err) return res.send(err);
				else {
					res.send({
						message: result + " was deleted successfully"
					});
				}
			}
		);
		//        }
		connection.release();
	});
});


// This is where we define our CRUD listeners for contacts

app.get('/contacts', (req, res) => {
	if (!req.query.userID) {
		res.send("No userID");
		return;
	}
	//connect to the database
	pool.getConnection(function (err, connection) {
		if (err) throw err;
		else {
			console.log("Connected! from get-contacts");

			//get any cookies from the request 
			let userID = req.query.userID;

			//query the db
			if (userID) {
				let sql = "SELECT * FROM contacts WHERE userID=?";
				connection.query(sql, [userID],
					(err, result) => {
					if (err) return res.send(err);
					else res.send(result);
				});
			} else {
				res.send("User not found.");
			}
			connection.release();
		}
	});
});

app.post('/contacts', (req, res) => {
	if (!req.body.userID) {
		res.send("No userID");
	}
	pool.getConnection(function (err, connection) {
		if (err) res.send(err);
		else {
			console.log("Connected!");
			let contact = req.body;
			let sql = "INSERT INTO contacts (userID, fname, lname, company, phone, street, zip, email) values(?,?,?,?,?,?,?,?)";
			connection.query(
				sql, [
                contact.userID,
                contact.fname,
                contact.lname,
                contact.company,
                contact.phone,
                contact.street,
                contact.zip,
                contact.email
            ],
				(err, result) => {
					if (err) return console.log(err);
					else {
						console.log("Saved to database");
						res.send({
							message: req.body.fname + " was successfully added to the database",
							status: 201
						});
					}
				}
			);
		}
		connection.release();
	});
});

app.put('/contacts', (req, res) => {
	if (!req.cookies.userID) {
		return;
	}
	pool.getConnection(function (err, connection) {
		if (err) throw err;
		console.log("Connected!");
		let contact = req.body;
		let sql = "UPDATE contacts SET fname=?, lname=?, company=?, phone=?, street=?, zip=?, email=? WHERE id=?";
		connection.query(
			sql, [
                contact.fname,
                contact.lname,
                contact.company,
                contact.phone,
                contact.street,
                contact.zip,
                contact.email,
                contact.id
            ],
			(err, result) => {
				if (err) return res.send(err);
				res.send(result);
			}
		);
		connection.release();
	});
});

app.delete('/contacts*', (req, res) => {
	pool.getConnection(function (err, connection) {
		if (err) throw err;
		console.log("Connected!");
		let sql = "DELETE FROM contacts WHERE id=?";
//		if (req.query.id == "all") {
//			connection.query(
//				"DELETE FROM contacts",
//				(err, result) => {
//					if (err) return res.send(err);
//					res.send({
//						message: result + " was deleted successfully"
//					});
//				}
//			);
//		} else {
			connection.query(
				sql, [req.body.id],
				(err, result) => {
					if (err) return res.send(err);
					res.send({
						message: result + " was deleted successfully", status: 200
					});
				}
			);
//		}
		connection.release();
	});
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function () {
	console.log('Listening on Port 3000');
});