var http = require('http');
var url = require('url');

const hostname = '127.0.0.1';
const port = 9000;

const server = http.createServer((req, res) => {
	var parsedUrl = url.parse(req.url, true);
	var query = parsedUrl.query;
	var filename = query.filename;
	var filepath = "/home/othai/Downloads/JS_files/" + filename;
	var child_process = require("child_process");
	var child = child_process.spawnSync('python3', ["/home/othai/Downloads/REA820/JaSt-master/js/is_js.py", "--f", filepath], { encoding: 'utf8'});
	console.log(child.stdout);
	var result = child.stdout;
	res.writeHead(200, { 'Content-Type': 'application/json'});
	var json = JSON.stringify({
		"result": result
	});
	res.end(json);
})


server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
})