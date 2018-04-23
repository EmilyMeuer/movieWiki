//This is built-in module
var express = require('express');
var fs = require('fs');
var querystring = require('querystring');
var path = require('path');
var http = require('http');
var url = require('url');

//from npm download
var multiparty = require('multiparty');
var mime = require('mime');
var sqlite3 = require('sqlite3').verbose();

var app = express();
var port = 8011;
var public_dir = path.join(__dirname, 'public');

/*
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
                res.writeHead(200, {'Content-Type' : 'text/plain'});
                res.write('Wait for html template');
                res.end();
            });
        }
    }
});
*/

//serve all files in public directory
app.use(express.static(public_dir));

//GET method with /search
//users should not do it this way
//give error
app.get('/search', (req, res) => {
    var req_url = url.parse(req.url);
    var query = querystring.parse(req_url.query);

    console.log(query);

    res.writeHead(404, {'Content-Type' : 'text/plain'});
    var resStr = 'Wrong action, please go back to home page.';
    resStr += '<br/><a href="/index.html">home page</a>';
    res.write(resStr);
    res.end();
});

//testing the POST method with /search
app.post('/search', (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {

        if(err){
            res.writeHead(404, {'Content-Type' : 'text/plain'});
            var resStr = 'something wrong here, please go back to home page.';
            resStr += '<br/><a href="/index.html">home page</a>';
            res.write(resStr);
            res.end();
        }else{

            var fieldsStr = "Type: ";
            fieldsStr += fields.type[0];
            fieldsStr += "<br/>" + "Content: ";
            fieldsStr += fields.content[0];

            var sql = "SELECT * FROM Titles WHERE primary_title LIKE '%" + fields.content[0] +"%'";
            console.log(sql);

            fs.readFile('public/results-template.html', (err, data) => {
                if(err){
                    console.log(err);
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.write('Uh oh - could not find file. here');
                    res.end();
                }else{
                    var db = new sqlite3.Database('../imdb.sqlite3');

                    db.all(sql, function (err, rows) {
                        if(err){
                            console.log(err);
                        }else{
                            var table_html_code = "<div class='list-group'>";

                            for(var i=0; i<rows.length; i++){
                                table_html_code += "<a href=\"#\" class=\"list-group-item list-group-item-action \">";
                                table_html_code += rows[i].primary_title;
                                table_html_code += "</a>";
                            }

                            table_html_code += "</div>";
                            //console.log(table_html_code);

                            res.writeHead(200, {'Content' : 'text/html'});
                            var html_code = data.toString('utf8');
                            html_code = html_code.replace('***TABLE***', table_html_code);
                            res.write(html_code);
                            res.end();

                            db.close();
                        }
                    });



                }
            });
        }
    });


});


//var sql = "SELECT * FROM Titles WHERE primary_title LIKE '%spiderman%'; ";

var hello = function(err, rows){
    if(err){
        console.log(err);
    }else{
        console.log(rows);
    }

};

//console.log(db.all(sql,hello));

console.log("now listening at port: " + port);

app.listen(port, '0.0.0.0');
