/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var messages = {};
var apiUrl = "classes";

var handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;
  var headers = defaultCorsHeaders;
  var roomname;

  console.log(request.url);

  var urlHandler = function() {
    var roomArray = request.url.split('/');
    var baseUrl = roomArray[1];
    if (baseUrl === "") {

    }
    if (baseUrl === apiUrl) {
      roomname = roomArray[2];
      router[request.method]();
    } else {
      fileNotFoundResponse();
    }
  }

  var handleGet = function() {
    statusCode = 200;
    var data = { results: [] };
    response.writeHead(statusCode, headers);
    if (messages[roomname]){
      data.results = messages[roomname]
    }
    response.end(JSON.stringify(data));
  };

  var handleOptions = function() {
    headers['Allow'] = 'GET,POST';
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  };

  var handlePost = function() {
    statusCode = 201;
    response.writeHead(statusCode, headers);
    request.on('data', function(data) {
      data = JSON.parse(data);
      if (!messages[roomname]) {
        messages[roomname] = [];
      };
      messages[roomname].push(data)
      response.end("Success. Message received.");
    });
  };

  var fileNotFoundResponse = function() {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  };

  var router = {
    'GET': handleGet,
    'OPTIONS': handleOptions,
    'POST': handlePost
  };

  urlHandler();

};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handler = handler;
