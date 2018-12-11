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

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();

});


app.get('/userName', function (req, res) {
  var ip = req.ip.substr(7)
  ip = getLocalIp();
  console.log(ip);

  var sql = 'select count(*),max(car.num) as cNum from car,equipt where car.equipt_num=equipt.num and equipt.ip=\''+ip+'\'';
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;

    console.log('sql', sql);
    console.log('The solution is: ', results[0].cNum);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ carNum: results[0].cNum }));
  });
})

function getLocalIp() {
  const os = require('os');
  for(let addresses of Object.values(os.networkInterfaces())) {
    for(let add of addresses) {
      if(add.address.startsWith('192.168.')) {
        return add.address;
      }
    }
  }
}

app.listen(port);
