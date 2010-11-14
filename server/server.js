
var util  = require("util"),
		http  = require("http"),
		redis = require("./lib/node_redis"),

rc = redis.createClient();

server = http.createServer(function(req, res) {
	if (req.method == "POST") {
		
	/* TODO: should use Buffer */
		var post_data = "";

		/* Callback to read in the POST'ed message body */
    req.addListener('data', function (data) {
			post_data += data;
    }).addListener('end', function () {
			var obj = null;
			try {
				var obj = JSON.parse(post_data);
				switch(obj.action) {
					case "remove":
						rc.del("user:1:tabs:" + obj.tabId.toString()+ ":uri");
					break;
					case "update":
						rc.set("user:1:tabs:" + obj.tabId + ":uri", obj.uri);
					break;
				}
			}
			catch(e) {
				console.log("Shit... Something broke: " + e.toString());
			}
			str = "OK";
			res.writeHead(200, {"Content-Type": "text/html", "Content-Length": str.length});
			res.write(str);
			res.end();
		});
	}
});
server.listen(8124, "0.0.0.0");
console.log("Server running at http://127.0.0.1:8124/");
