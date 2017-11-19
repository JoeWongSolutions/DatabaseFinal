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

// We declare what tools can be used with our app
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public'))); 

// We need to connect to Mysqldb

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "web",
  password: "web",
  database: "School"
});

var con;

// This is where we define our CRUD listeners

app.get('/students', (req, res) => {
    pool.getConnection(function(err,connection) {
      if (err) throw err;
      else {
        console.log("Connected! from get " + connection);
        let sql = "SELECT * FROM students";
        connection.query(sql,(err, result) => {
            if(err) return console.log(err);
            res.send(result);
        });
        connection.release();
      }
    });
    
//    con.release();
});

app.post('/students', (req, res) => {
    pool.getConnection(function(err,connection) {
      if (err) throw err;
      con = connection;
      console.log("Connected!");
    });
    let student = req.body;
    let sql = "INSERT INTO students (stuID, fname, lname, gpa, phone, addr, major, level, status) values(?,?,?,?,?,?,?,?,?)"; 
	con.query(
        sql, [student.stuID,student.fname,student.lname,student.gpa,student.phone,student.addr,student.major,student.level,student.status],
        (err, result) => {
            if(err) return console.log(err);
            console.log("Saved to database");
            res.send({message: req.body.fname + " was successfully added to the database"});
        }
    );
    con.release();
});

app.put('/students', (req, res) => {
    pool.getConnection(function(err,connection) {
      if (err) throw err;
      con = connection;
      console.log("Connected!");
    });
    let student = req.body;
    let sql = "UPDATE students SET stuID=?, fname=?, lname=?, gpa=?, phone=?, addr=?, major=?, level=?, status=? WHERE stuID=?";
    con.query(
        sql,
        [student.stuID,
        student.fname,
        student.lname,
        student.gpa,
        student.phone,
        student.addr,
        student.major,
        student.level,
        student.status,
        student.stuID
        ],
        (err, result) => {
            if(err) return res.send(err);
            res.send(result);
        }
    );
    con.release();
});

app.delete('/students*', (req, res) => {
    pool.getConnection(function(err,connection) {
      if (err) throw err;
      con = connection;
      console.log("Connected!");
    });
    let sql = "DELETE FROM students WHERE stuID=?";
    if(req.query.stuID == "all"){
        con.query(
            "DELETE FROM students",
            (err, result) => {
                if(err) return res.send(err);
                res.send({message: result + " was deleted successfully"});
            }
        );
    }
    else {
        con.query(
            sql,
            [req.query.stuID],
            (err, result) => {
                if(err) return res.send(err);
                res.send({message: result + " was deleted successfully"});
            }    
        );
    }
    con.release();
});

app.listen(3000, function () {
    console.log('Listening on Port 3000');
});
