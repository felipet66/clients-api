var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

//start mysql connection
var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'root', //mysql database user name
  password : '', //mysql database password
  database : 'test' //mysql database name
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//create app server
var server = app.listen(3000,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

//rest api to get all clients
app.get('/clients', function (req, res) {
   connection.query('select * from client', function (error, results, fields) {
	  if (error) throw error;
	  res.setHeader('Content-Type', 'application/json');
	  res.end(JSON.stringify(results));
	});
});
//rest api to get a single client data
app.get('/client/:id', function (req, res) {
   connection.query('select * from client where Id=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.setHeader('Content-Type', 'application/json');
	  res.end(JSON.stringify(results));
	});
});

//rest api to create a new client record into mysql database
app.post('/client', function (req, res) {
   var params  = req.body;
   console.log(params);

   connection.query('INSERT INTO client SET ?', params, function (error, results, fields) {
	  if (error) {
	  	console.info(">" + error);
	  	res.setHeader('Content-Type', 'application/json');
	  	//res.end(JSON.stringify(error), 500);
	  	//res.sendStatus(500);
	  	res.sendStatus(202).send(JSON.stringify(error));
	  }else{
		  res.setHeader('Content-Type', 'application/json');
		  res.end(JSON.stringify(results));
	  }
	});
});

//rest api to update record into mysql database
app.put('/client', function (req, res) {
   connection.query('UPDATE `client` SET `Name`=?,`Address`=?,`Country`=?,`Phone`=? where `Id`=?', [req.body.Name,req.body.Address, req.body.Country, req.body.Phone, req.body.Id], function (error, results, fields) {
	  if (error) throw error;
	  res.setHeader('Content-Type', 'application/json');
	  res.end(JSON.stringify(results));
	});
});

//rest api to delete record from mysql database
app.delete('/client', function (req, res) {
   console.log(req.body);
   connection.query('DELETE FROM `client` WHERE `Id`=?', [req.body.Id], function (error, results, fields) {
	  if (error) throw error;
	  res.setHeader('Content-Type', 'application/json');
	  res.end('Record has been deleted!');
	});
});