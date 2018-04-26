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

	res.writeHead(404, {
		'Content-Type': 'text/html'
	});
	var resStr = 'Wrong action, please go back to home page.';
	resStr += '<br/><a href=\"/index.html\">home page</a>';
	res.write(resStr);
	res.end();
});

//testing the POST method with /search
app.post('/search', (req, res) => {
	var form = new multiparty.Form();
	form.parse(req, (err, fields, files) => {

		if (err) {
			res.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			var resStr = 'something wrong here, please go back to home page.';
			resStr += '<br/><a href="/index.html">home page</a>';
			res.write(resStr);
			res.end();
		} else {
			var sql = db.prepare("SELECT * FROM " + fields.type[0] + " WHERE primary_" + fields.type[0].toLowerCase().substring(0, fields.type[0].length - 1) + " LIKE (?)");

			console.log(sql);
			// fields.content[0]

			fs.readFile('public/results-template.html', (err, data) => {
				if (err) {
					console.log(err);
					res.writeHead(404, {
						'Content-Type': 'text/plain'
					});
					res.write('Uh oh - could not find file. here');
					res.end();
				} else {
					var db = new sqlite3.Database('../imdb.sqlite3');

					sql.run(function(err, row) {
						if (err) {
							console.log(err);
							res.writeHead(404, {
								'Content-Type': 'text/plain'
							});
							res.write('Uh oh - could not find file. here');
							res.end();
						} else {
							var db = new sqlite3.Database('../imdb.sqlite3');

							db.all(sql, function(err, rows) {
								if (err) {
									console.log(err);
								} else {
									var table_html_code = "";

									if (fields.type[0] === "Title") {
										table_html_code = title_table_html(rows);
									} else {
										table_html_code = people_table_html(rows);
									}

									res.writeHead(200, {
										'Content': 'text/html'
									});
									var html_code = data.toString('utf8');
									html_code = html_code.replace('***TABLE***', table_html_code);
									res.write(html_code);
									res.end();

									db.close();
								}
							});

						}
					}); // sql.run
				}
			}); // readFile
		} // else

	}); // parse form
}); // post.search

app.get('/individual', (req, res) => {
	var url_query = {};
	if (req.query.tconst) {
		url_query.type = 'Titles';
		url_query.const = req.query.tconst;
	} else {
		url_query.type = 'Names';
		url_query.const = req.query.nconst;
	}
	/*
	    var sql = "SELECT " + url_query.select +" FROM " + url_query.type + " WHERE Titles.tconst = Principals.tc Titles." +
	        url_query.param + " = \"" + url_query.const + "\"";
	*/
	var sql = "";
	if (url_query.type === 'Titles') {
		sql = "SELECT DISTINCT Titles.tconst, Titles.primary_title, Titles.title_type, Titles.start_year, " +
			"Titles.end_year, Titles.runtime_minutes, Titles.genres, Principals.ordering, Principals.nconst, " +
			"Ratings.average_rating, Ratings.num_votes, Names.primary_name, Crew.directors, Crew.writers " +
			"FROM Titles, Principals, Ratings, Names, Crew " +
			"WHERE Titles.tconst = Principals.tconst AND Principals.tconst = Ratings.tconst AND Titles.tconst = Crew.tconst " +
			"AND Titles.tconst = \"" + url_query.const+"\"" +
			"AND Principals.nconst = Names.nconst " +
			"ORDER BY Principals.ordering;";
	} else {
		sql = "SELECT Names.* FROM Names, Principals, "
	}

	console.log(sql);

	fs.readFile('public/results-template.html', (err, data) => {
		if (err) {
			console.log(err);
			res.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			res.write('Uh oh - could not find file. here');
			res.end();
		} else {
			var db = new sqlite3.Database('../imdb.sqlite3');

			db.all(sql, function(err, rows) {
				if (err) {
					console.log(err);
				} else {

					console.log(rows);

					var table_html_code = "";

					if (url_query.type === "Titles") {
						//need function
						table_html_code = individual_movie_html(rows);
					} else {
						//need function
						table_html_code = individual_person_html(rows);
					}

					res.writeHead(200, {
						'Content': 'text/html'
					});
					var html_code = data.toString('utf8');
					html_code = html_code.replace('***TABLE***', table_html_code);
					res.write(html_code);
					res.end();

					db.close();
				}
			});

		}
	});

});

function individual_movie_html(sql_result) {

	var db = new sqlite3.Database('../imdb.sqlite3');

	var html_code = "";

	console.log(sql_result);

	var end_year;
	if (sql_result.end_year === null) {
		end_year = '-';
	} else {
		end_year = sql_result.end_year;
	}

	var directors_arr = sql_result[0].directors.split(',');

	console.log(directors_arr);

	var writers_arr = sql_result[0].writers.split(',');

	html_code += '<div class="row">' +
		'<div class="col-8">' +
		//movie info here
		'<h2>' + sql_result[0].primary_title + '</h2>' +
		'<p>Movie type: ' + sql_result[0].title_type + '</p>' +
		'<p>Start year: ' + sql_result[0].start_year + '</p>' +
		'<p>End year: ' + sql_result[0].end_year + '</p>' +
		'<p>Movie type: ' + sql_result[0].title_type + '</p>' +
		'<p>Length: ' + sql_result[0].runtime_minutes + ' minutes</p>' +
		'<p>Genres: ' + sql_result[0].genres + '</p>' +
		'<p>Average rating: ' + sql_result[0].average_rating + '</p>' +
		'<p>Number of votes: ' + sql_result[0].num_votes + '</p>';

	html_code += "<h5>Casting: </h5><ol>";

	for (var i = 0; i < sql_result.length; i++) {
		html_code += "<li><a href=\"http://cisc-dean.stthomas.edu:8011/individual?nconst= " + sql_result[i].nconst +
			"\">" + sql_result[i].primary_name + "</a></li>";
	}

	html_code += "</ol>";

	html_code += "<h5>Directors: </h5><ol>";

	for (var i = 0; i < directors_arr.length; i++) {
		db.get("SELECT * FROM Names WHERE nconst = " + "\"" + directors_arr[i] + "\"", (err, rows) => {
			if (err) {
				console.log(err);
			} else {
				console.log(rows.primary_name);
				html_code += '<li>' + rows.primary_name + '</li>'
			}
		});
	}

	html_code += "</ol>";

	html_code += '</div>' +
		'<div class="col-4">' +
		//movie picture here
		'***picture***' +
		'</div>' +
		'</div>';

	return html_code;
}

function individual_person_html(sql_result) {
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

	for (var i = 0; i < sql_result.length; i++) {
		var end_year;
		if (sql_result[i].end_year === null) {
			end_year = '-';
		} else {
			end_year = sql_result[i].end_year;
		}

		table_html_code += '<tr>' +
			'<th scope="row">' + (i + 1) + '</th>' +
			'<td>' +
			'<a href=\"http://cisc-dean.stthomas.edu:8011/individual?tconst=' + sql_result[i].tconst + '\" class=\"list-group-item-action \">' +
			sql_result[i].primary_title + '</a>' + '</td>' +
			'<td>' + sql_result[i].title_type + '</td>' +
			'<td>' + sql_result[i].start_year + '</td>' +
			'<td>' + end_year + '</td>' +
			'</tr>';
	}

	table_html_code += "</tbody></table>";

	return table_html_code;
}

function people_table_html(sql_result) {

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

	for (var i = 0; i < sql_result.length; i++) {
		var death_year;
		if (sql_result[i].death_year === null) {
			death_year = 'present';
		} else {
			death_year = sql_result[i].death_year;
		}

		table_html_code += '<tr>' +
			'<th scope="row">' + (i + 1) + '</th>' +
			'<td>' +
			'<a href=\"http://cisc-dean.stthomas.edu:8011/individual?nconst=' + sql_result[i].nconst + '\" class=\"list-group-item-action \">' +
			sql_result[i].primary_name + '</a>' + '</td>' +
			'<td>' + sql_result[i].birth_year + '</td>' +
			'<td>' + death_year + '</td>' +
			'<td>' + sql_result[i].primary_profession + '</td>' +
			'</tr>';
	}

	table_html_code += "</tbody></table>";

	return table_html_code;


}

console.log("now listening at port: " + port);

server.listen(port, '0.0.0.0');