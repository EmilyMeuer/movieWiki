//This is built-in module
var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');

//from npm download
var multiparty = require('multiparty');
var mime = require('mime');
var sqlite3 = require('sqlite3').verbose();


var db = new sqlite3.Database('../imdb.sqlite3');

var port = 8011;
var public_dir = path.join(__dirname, 'public');

var server = http.createServer((req,res) => {
    var req_url = url.parse(req.url);
    var filename = req_url.pathname.substring(1);

    if(filename === '') filename = 'index.html';

    if(req.method === 'GET'){
        fs.readFile(path.join(public_dir, filename), (err, data) => {
            if(err){
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Oh, no! Counld\'t find that page' );
                res.end();
            }
            else{
                var ext = path.extname(filename).substring(1);
                console.log('serving file' + filename + ' (type = ' + mime.getType(ext) + ')');
                res.writeHead(200, {'Content-Type' : mime.getType(ext) || 'text/plain'});
                res.write(data);
                res.end();
            }
        });
    }

    else if (req.method === "POST"){
        if(filename === 'search'){
            var form = new multiparty.Form();
            form.parse(req, (err, fields, files) => {
               console.log(fields);

                res.writeHead(200, {'Content-Type' : 'text/plain'});
                res.write('Successfully subscribe');
                res.end();
            });
        }
    }
});

var sql = "SELECT * FROM Titles WHERE primary_title LIKE '%spiderman%'; ";

var hello = function(err, rows){
    if(err){
        console.log(err);
    }else{
        console.log(rows);
    }

};

//console.log(db.all(sql,hello));

console.log("now listening at port: " + port);

server.listen(port, '0.0.0.0');

db.close();