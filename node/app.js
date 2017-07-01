var express = require('express'),
app = express(),
port = 8000;

app.use(express.static(process.env['HOME']));
app.listen(port);
