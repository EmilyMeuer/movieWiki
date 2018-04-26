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


var server = http.createServer(app);
//serve all files in public directory
app.use(express.static(public_dir));

//GET method with /search users should not do it this way give error
app.get('/search', (req, res) => {
    var req_url = url.parse(req.url);
    var query = querystring.parse(req_url.query);

    console.log(query);

    res.writeHead(404, {'Content-Type' : 'text/html'});
    var resStr = 'Wrong action, please go back to home page.';
    resStr += '<br/><a href=\"/index.html\">home page</a>';
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
            var sql = "";

            if(fields.type[0] === "Title"){
                //sql = "SELECT * FROM Titles WHERE primary_title LIKE '%" + fields.content[0] +"%'";
                sql = "SELECT * FROM Titles WHERE primary_title LIKE $searchTerm";
            }else{
                //sql = "SELECT * FROM Names WHERE primary_name LIKE '%" + fields.content[0] + "%'";
                sql = "SELECT * FROM Names WHERE primary_name LIKE $searchTerm";
            }

            console.log(sql);

            fs.readFile('public/results-template.html', (err, data) => {
                if(err){
                    console.log(err);
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.write('Uh oh - could not find file. here');
                    res.end();
                }else{
                    var db = new sqlite3.Database('../imdb.sqlite3');

		// Removes all instances of '(', ')', and ';' characters:
		    var searchTerm	= fields.content[0].replace(/(\(|\)|\;)/g, '');
		// Relaces all instances of '*' with '%' so that it will act as a wildcard character:
		    searchTerm		= '%' + searchTerm.replace(/\*/g, '%') + '%';
                    db.all(sql, {
			$searchTerm: searchTerm
			}, function (err, rows) {
                        if(err){
                            console.log(err);
                        }else{
                            var table_html_code = "";

                            if(fields.type[0] === "Title"){
                                table_html_code = title_table_html(rows);
                            }else{
                                table_html_code = people_table_html(rows);
                            }

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

app.get('/individual', (req, res) => {
    var url_query = {};
    if(req.query.tconst){
        url_query.type = 'Titles';
        url_query.const = req.query.tconst;
    }else{
        url_query.type = 'Names';
        url_query.const = req.query.nconst;
    }

    var html_table_code = "";

    var sql = "";
    if(url_query.type === 'Titles') {
        sql = "SELECT DISTINCT Titles.tconst, Titles.primary_title, Titles.title_type, Titles.start_year, " +
            "Titles.end_year, Titles.runtime_minutes, Titles.genres, Principals.ordering, Principals.nconst, " +
            "Ratings.average_rating, Ratings.num_votes, Names.primary_name, Crew.directors, Crew.writers " +
            "FROM Titles, Principals, Ratings, Names, Crew " +
            "WHERE Titles.tconst = Principals.tconst AND Principals.tconst = Ratings.tconst AND Titles.tconst = Crew.tconst " +
            "AND Titles.tconst = \"" + url_query.const + "\"" +
            "AND Principals.nconst = Names.nconst " +
            "ORDER BY Principals.ordering;";

        fs.readFile('public/results-template.html', (err, data) =>{
            if(err){
                console.log(err);
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Uh oh - could not find file. here');
                res.end();
            }else{
                var html_code = data.toString('utf8');

                var db = new sqlite3.Database('../imdb.sqlite3');

                db.all(sql, function(err,rows){
                    if(err){
                        console.log(err);
                    }else{
                        var first_query_obj = format_individual_movie(rows);

                        html_table_code = first_query_obj.html_code;

                        html_code = html_code.replace('***TABLE***', html_table_code);

                        db.all(first_query_obj.directors_sql, function (err, rows) {
                            if(err){
                                console.log(err);
                            }else{
                                var directors_list = populate_people_list(rows);
                                html_code = html_code.replace('***directors***', directors_list);

                                db.all(first_query_obj.writers_sql, function (err, rows) {
                                    var writers_list = populate_people_list(rows);
                                    html_code = html_code.replace('***writers***', writers_list);

                                    res.writeHead(200, {'Content' : 'text/html'});
                                    res.write(html_code);
                                    res.end();
                                    console.log("sent");
                                });

                            }
                        });






                    }
                });

                db.close();
            }
        });
    }else{
        sql = "SELECT Names.* FROM Names, Principals, "
    }

});

function populate_people_list(sql_result_arr) {
    var html_code = "<ul style='list-style-type: none'>";

    for(var i=0;i<sql_result_arr.length;i++){
        html_code += "<li><a href=\"http://cisc-dean.stthomas.edu:8011/individual?nconst=" +
            sql_result_arr[i].nconst + "\" >"
            + sql_result_arr[i].primary_name + "</a></li>";
    }

    html_code += "</ul>";

    return html_code;
}

function format_individual_movie(sql_result){
    var returnObj = {};

    var db = new sqlite3.Database('../imdb.sqlite3');

    var html_code =  '<h2>'+ sql_result[0].primary_title +'</h2>' ;

    var end_year;
    if(sql_result.end_year === null){
        end_year = '-';
    }else{
        end_year = sql_result.end_year;
    }

    var directors_arr = sql_result[0].directors.split(',');
    var directors_sql = "SELECT primary_name, nconst FROM Names WHERE ";
    for(var i=0; i<directors_arr.length; i++){
        directors_sql += "nconst = \"" + directors_arr[i] + "\" ";

        if(i<directors_arr.length-1){
            directors_sql += "OR ";
        }
    }

    var writers_arr = sql_result[0].writers.split(',');
    var writers_sql = "SELECT primary_name, nconst FROM Names WHERE ";
    for(var i=0; i<writers_arr.length; i++){
        writers_sql += "nconst = \"" + writers_arr[i] + "\" ";

        if(i<writers_arr.length-1){
            writers_sql += "OR ";
        }
    }

    html_code += '<div class="row">' +
                    '<div class="col-3">' +
                        //movie info here
                        '<p>Movie type: ' + sql_result[0].title_type +'</p>' +
                        '<p>Start year: ' + sql_result[0].start_year +'</p>' +
                        '<p>End year: ' + sql_result[0].end_year +'</p>' +
                        '<p>Movie type: ' + sql_result[0].title_type +'</p>' +
                        '<p>Length: ' + sql_result[0].runtime_minutes +' minutes</p>' +
                        '<p>Genres: ' + sql_result[0].genres +'</p>' +
                        '<p>Average rating: ' + sql_result[0].average_rating +'</p>' +
                        '<p>Number of votes: ' + sql_result[0].num_votes +'</p>';

    html_code += "<h5>Casting: </h5><ol>";

    for(var i=0; i<sql_result.length;i++){
        html_code += "<li><a href=\"http://cisc-dean.stthomas.edu:8011/individual?nconst= " + sql_result[i].nconst +
            "\">" + sql_result[i].primary_name + "</a></li>";
    }

    html_code += "</ol></div>";


    html_code += "<div class=\"col-3\"><h5>Directors: ***directors***</h5></div>";

    html_code += "<div class=\"col-3\"><h5>Writers: ***writers***</h5></div>";

    html_code += '<div class="col-3">' +
        //movie picture here
        '***picture***' + '</div>'+

        '</div>';

    returnObj.html_code = html_code;
    returnObj.directors_sql = directors_sql;
    returnObj.writers_sql = writers_sql;
    return returnObj;
}

function individual_person_html(sql_result){
    var html_code = "person here";

    html_code += '<div class="row">' +
                    '<div class="col-8">' +
                        // info here
                        '' +
                    '</div>' +
                    '<div class="col-4">' +
                        //movie picture here
                        'pic here' +
                    '</div>' +
                '</div>';

    return html_code;
}

function title_table_html(sql_result) {
    var table_html_code =
        '<h2>Your Results: </h2>' +
        '<table class="table">' +
        '<thead class="thead-dark">' +
        '<tr>' +
        '<th scope="col">Number</th>' +
        '<th scope="col">Title</th>' +
        '<th scope="col">Type</th>' +
        '<th scope="col">Started Year</th>' +
        '<th scope="col">Ended Year</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

    for(var i=0; i<sql_result.length; i++){
        var end_year;
        if(sql_result[i].end_year === null){
            end_year = '-';
        }else{
            end_year = sql_result[i].end_year;
        }

        table_html_code += '<tr>' +
            '<th scope="row">' + (i+1) + '</th>' +
            '<td>' +
            '<a href=\"http://cisc-dean.stthomas.edu:8011/individual?tconst=' + sql_result[i].tconst + '\" class=\"list-group-item-action \">' +
            sql_result[i].primary_title + '</a>' + '</td>' +
            '<td>' + sql_result[i].title_type +'</td>' +
            '<td>' + sql_result[i].start_year +'</td>' +
            '<td>' + end_year +'</td>' +
            '</tr>';
    }

    table_html_code += "</tbody></table>";

    return table_html_code;
}

function people_table_html(sql_result){

    var table_html_code =
        '<h2>Your Results: </h2>' +
        '<table class="table">' +
        '<thead class="thead-dark">' +
        '<tr>' +
        '<th scope="col">Number</th>' +
        '<th scope="col">Name</th>' +
        '<th scope="col">Birth Year</th>' +
        '<th scope="col">Death Year</th>' +
        '<th scope="col">Profession</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

    for(var i=0; i<sql_result.length; i++){
        var death_year;
        if(sql_result[i].death_year === null){
            death_year = 'present';
        }else{
            death_year = sql_result[i].death_year;
        }

        table_html_code += '<tr>' +
            '<th scope="row">' + (i+1) + '</th>' +
            '<td>' +
            '<a href=\"http://cisc-dean.stthomas.edu:8011/individual?nconst='+ sql_result[i].nconst +'\" class=\"list-group-item-action \">' +
            sql_result[i].primary_name + '</a>' + '</td>' +
            '<td>' + sql_result[i].birth_year +'</td>' +
            '<td>' + death_year +'</td>' +
            '<td>' + sql_result[i].primary_profession +'</td>' +
            '</tr>';
    }

    table_html_code += "</tbody></table>";

    return table_html_code;


}

console.log("now listening at port: " + port);

server.listen(port, '0.0.0.0');
