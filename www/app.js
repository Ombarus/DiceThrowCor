const http = require('http');
const fs = require('fs');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
	var url_request = q.pathname;
    var tmp  = url_request.lastIndexOf(".");
    var extension  = url_request.substring((tmp + 1));
	if (extension === 'html') res.writeHeader(200, {"Content-Type": 'text/html'});
	else if (extension === 'htm') res.writeHeader(200, {"Content-Type": 'text/html'});
	else if (extension === 'css') res.writeHeader(200, {"Content-Type": 'text/css'});
	else if (extension === 'js') res.writeHeader(200, {"Content-Type": 'text/javascript'});
	else if (extension === 'png') res.writeHeader(200, {"Content-Type": 'image/png'});
	else if (extension === 'jpg') res.writeHeader(200, {"Content-Type": 'image/jpg'});
	else if (extension === 'jpeg') res.writeHeader(200, {"Content-Type": 'image/jpeg'});
	else if (extension === 'svg') res.writeHeader(200, {"Content-Type": 'image/svg+xml'});
	
    //res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});