var http = require('http');
var https = require('https');
var fs      = require("fs");        // file system core module

var privateKey  = fs.readFileSync(__dirname + "/ssl/domain.key");
var certificate = fs.readFileSync(__dirname + "/ssl/domain.cert");

var credentials = {key: privateKey, cert: certificate};
var express = require('express'),
app = express(),
port = 8000;

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '20170501',
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

app.get('/isServer', function (req, res) {

  var ip = getLocalIp();
  console.log(ip);

  var isServer = false;
  var sql = 'select rank from car where num = (select num  FROM equipt where ip="' + ip + '")';
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;

    console.log('sql', sql);
    console.log('The solution is: ', results[0].rank);
    res.setHeader('Content-Type', 'application/json');
    if (results[0].rank == "0") {
      isServer = true;
    }
    res.send(JSON.stringify({ isServerCar: isServer }));
  });
})

app.get('/getServer', function (req, res) {

  var sql = 'select ip from equipt where num = (select num  FROM car where rank="0")';
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;

    console.log('sql', sql);
    console.log('The solution is: ', results[0].ip);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ serverIp: results[0].ip }));
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

//app.listen(port);
httpServer.listen(8000);
httpsServer.listen(8003);
