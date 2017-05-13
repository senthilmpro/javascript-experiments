var express = require('express'),
	app = express();

app.use(express.static(__dirname));

var PORT_NUMBER = 3322;
app.listen(PORT_NUMBER);

console.log("Application running on port : "+ PORT_NUMBER);
