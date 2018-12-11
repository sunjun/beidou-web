var express = require('express'),
app = express(),
port = 8000;

var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'x5',
	database : 'SNCS'
});

connection.connect(
	function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}

		console.log('connected as id ' + connection.threadId);
	});


app.use(express.static(process.env['HOME']));

app.get('/userName', function (req, res) {
    var ip = req.ip.substr(7)

    var sql = 'select count(*),max(car.num) as cNum from car,equipt where car.equipt_num=equipt.num and equipt.ip=\''+ip+'\'';
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;

      console.log('sql', sql);
      console.log('The solution is: ', results[0].cNum);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ carNum: results[0].cNum }));
  });
})

app.listen(port);
