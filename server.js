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

// from Dr. Marrinan:
var poster = require('./imdb_poster.js');

var app = express();
var port = 8013;
var public_dir = path.join(__dirname, 'public');


var server = http.createServer(app);
//serve all files in public directory
app.use(express.static(public_dir));

app.get('/index.html', (req, res) => {
	fs.readFile('public/index.html', (err, data) => {
		if (err) {
			console.log(err);
			res.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			res.write('Uh oh - could not find file. here');
			res.end();
		} else {
			res.writeHead(200, {
				'Content': 'text/html'
			});
			var html_code = data.toString('utf8');
			res.write(html_code);
			res.end();
			console.log('sent');
		}
	})
});

//GET method with /search users should not do it this way give error
app.get('/search', (req, res) => {
	var req_url = url.parse(req.url);
	var query = querystring.parse(req_url.query);


	var sql = "SELECT * FROM Names WHERE nconst=\'nm1727304\'";
	var db = new sqlite3.Database('../imdb.sqlite3');

	db.all(sql, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			console.log(rows)
		}

	});

	db.close();


	res.writeHead(404, {
		'Content-Type': 'text/html'
	});
	var resStr = 'Wrong action, please go back to home page.';
	resStr += '<br/><a href=\"/index.html\">home page</a>';
	res.write(resStr);
	res.end();
	console.log('sent');
});

app.post('/updateMovie', (req, res) => {
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
			//console.log(fields);

			var title_tconst = fields.tconst[0];
			var title_type = fields.type[0];
			var title_genres = fields.genres.toString();

			var update_sql = "UPDATE Titles Set title_type=\'" + title_type + "\', genres=\'" + title_genres + "\' WHERE tconst=\'" + title_tconst + "\'";

			var db = new sqlite3.Database('../imdb.sqlite3');

			db.all(update_sql, (err, rows) => {
				if (err) {
					console.log(err);
				} else {
					res.writeHead(200, {
						'Content': 'text/html'
					});
					res.write("<p>Successfully Updated. <a href=\'http://cisc-dean.stthomas.edu:" + port + "/individual?tconst=" + title_tconst + "\'>Go Back to the title page</a></p>");
					res.end();
				}
			});

			db.close();
		}
	})
});

app.post('/updatePerson', (req, res) => {
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
			//console.log(fields);
			var person_nconst = fields.nconst
			var birth_year = parseInt(fields.birth_year);
			var death_year = fields.death_year;
			var profession = fields.profession.toString();

			var update_sql = "UPDATE Names Set birth_year=" + birth_year + ", death_year=\'" + death_year + "\', primary_profession=\'" + profession + "\' WHERE nconst=\'" + person_nconst + "\'";

			//console.log(update_sql);

			var db = new sqlite3.Database('../imdb.sqlite3');

			db.all(update_sql, (err, rows) => {
				if (err) {
					console.log(err);
				} else {
					res.writeHead(200, {
						'Content': 'text/html'
					});
					res.write("<p>Successfully Updated. <a href=\'http://cisc-dean.stthomas.edu:" + port + "/individual?nconst=" + person_nconst + "\'>Go Back to the person page</a></p>");
					res.end();
				}
			});

			db.close();
		}
	})
});

app.post('/updatePerson', (req, res) => {

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
			var sql = "";

			if (fields.type[0] === "Title") {
				//sql = "SELECT * FROM Titles WHERE primary_title LIKE '%" + fields.content[0] +"%'";
				sql = "SELECT * FROM Titles WHERE primary_title LIKE $searchTerm";
			} else {
				//sql = "SELECT * FROM Names WHERE primary_name LIKE '%" + fields.content[0] + "%'";
				sql = "SELECT * FROM Names WHERE primary_name LIKE $searchTerm";
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

					// Removes all instances of '(', ')', and ';' characters:
					var searchTerm = fields.content[0].replace(/(\(|\)|\;)/g, '');
					// Relaces all instances of '*' with '%' so that it will act as a wildcard character:
					searchTerm = '%' + searchTerm.replace(/\*/g, '%') + '%';
					db.all(sql, {
						$searchTerm: searchTerm
					}, function(err, rows) {
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
			});
		}
	});


});

app.get('/individual', (req, res) => {
	var url_query = {};
	if (req.query.tconst) {
		url_query.type = 'Titles';
		url_query.const = req.query.tconst;
	} else {
		url_query.type = 'Names';
		url_query.const = req.query.nconst;
	}

	var html_table_code = "";

	var sql = "";
	if (url_query.type === 'Titles') {
		sql = "SELECT DISTINCT Titles.tconst, Titles.primary_title, Titles.title_type, Titles.start_year, " +
			"Titles.end_year, Titles.runtime_minutes, Titles.genres, Principals.ordering, Principals.nconst, " +
			"Ratings.average_rating, Ratings.num_votes, Names.primary_name, Crew.directors, Crew.writers " +
			"FROM Titles, Principals, Ratings, Names, Crew " +
			"WHERE Titles.tconst = Principals.tconst AND Principals.tconst = Ratings.tconst AND Titles.tconst = Crew.tconst " +
			" AND Titles.tconst = \"" + url_query.const+"\"" +
			" AND Principals.nconst = Names.nconst " +
			" ORDER BY Principals.ordering;";

		fs.readFile('public/results-template.html', (err, data) => {
			if (err) {
				console.log(err);
				res.writeHead(404, {
					'Content-Type': 'text/plain'
				});
				res.write('Uh oh - could not find file. here');
				res.end();
			} else {
				var html_code = data.toString('utf8');

				var db = new sqlite3.Database('../imdb.sqlite3');

				/*		picturePromise.then( (data) => {
							console.log(data);
						}, (err) => {
							console.log(err);
						});
				*/
				db.all(sql, function(err, rows) {
					if (err) {
						console.log(err);
					} else {
						var first_query_obj = format_individual_movie(rows);
						/*
			var picturePromise      = new Promise((resolve, reject) => {
        	                poster.GetPosterFromTitleId(rows[0].tconst, (err, data) => {
					if(err) {
						console.log("Promise error");
						reject(err);
					} else {
						resolve(data);
					}
				});
                	});

			picturePromise.then((data) => {
				console.log(data);
				var src	= path.join(data.host, data.path);
				console.log("path = " + src);

				html_code	= html_code.replace('***picture***', '<img src=' + src + '>');
				res.writeHead(200, {'Content': 'text/html'});
                                res.write(html_code);
                                res.end();
			}, (err) => {
				console.log(err);
			});
                        */
						html_table_code = first_query_obj.html_code;

						html_code = html_code.replace('***TABLE***', html_table_code);

						db.all(first_query_obj.directors_sql, function(err, rows) {
							if (err) {
								console.log(err);
							} else {
								var directors_list = populate_people_list(rows);
								html_code = html_code.replace('***directors***', directors_list);

								if (first_query_obj.writers_sql !== "") {

									db.all(first_query_obj.writers_sql, function(err, rows) {
										var writers_list = populate_people_list(rows);
										html_code = html_code.replace('***writers***', writers_list);

										res.writeHead(200, {
											'Content': 'text/html'
										});
										res.write(html_code);
										res.end();
										console.log("sent");
									});
								} else {
									var writers_list = populate_people_list(rows);
									html_code = html_code.replace('***writers***', "");

									res.writeHead(200, {
										'Content': 'text/html'
									});
									res.write(html_code);
									res.end();
									console.log("sent");
								}

							}
						});






					}
				});

				db.close();
			}
		});
	} else {
		sql = "SELECT * FROM Names WHERE nconst = \"" + url_query.const+"\"";

		fs.readFile("public/results-template.html", (err, data) => {
			if (err) {
				console.log(err);
				res.writeHead(404, {
					'Content-Type': 'text/plain'
				});
				res.write('Uh oh - could not find file. here');
				res.end();
			} else {

				var html_code = data.toString('utf8');
				var db = new sqlite3.Database('../imdb.sqlite3');

				db.all(sql, (err, rows) => {
					if (err) {
						console.log(err);
					} else {

						var first_query_obj = format_individual_person(rows[0]);

						html_table_code = first_query_obj.html_code;

						html_code = html_code.replace('***TABLE***', html_table_code);

						db.all(first_query_obj.titles_name_sql, (err, rows) => {
							if (err) {
								console.log(err);
							} else {
								var title_list = populate_known_titles(rows);
								html_code = html_code.replace('***known_titles***', title_list);

								res.writeHead(200, {
									'Content': 'text/html'
								});
								res.write(html_code);
								res.end();
								console.log("sent");
							}
						});

					}
				});

				db.close();
			}
		});
	}

});

app.get('/poster', (req, res) => {
	//console.log(req);
	//console.log(req.query);

	// app.js will send either nconst or tconst as id:
	if (req.query.nconst) {
		poster.GetPosterFromNameId(req.query.nconst, (err, data) => {
			if (err) {
				console.log(err);
			} else {
				res.writeHead(200, {
					'Content': 'text/plain'
				});
				res.write(path.join(data.host, data.path));
				res.end();
			}
		});
	} else if (req.query.tconst) {
		poster.GetPosterFromTitleId(req.query.tconst, (err, data) => {
			if (err) {
				console.log(err);
			} else {
				res.writeHead(200, {
					'Content': 'text/plain'
				});
				res.write(path.join(data.host, data.path));
				res.end();
			}
		});
	}
}); // get - poster

function populate_people_list(sql_result_arr) {
	var html_code = "<ul style='list-style-type: none'>";

	for (var i = 0; i < sql_result_arr.length; i++) {
		html_code += "<li><a href=\"http://cisc-dean.stthomas.edu:" + port + "/individual?nconst=" +
			sql_result_arr[i].nconst + "\" >" +
			sql_result_arr[i].primary_name + "</a></li>";
	}

	html_code += "</ul>";

	return html_code;
}

function format_individual_movie(sql_result) {
	var returnObj = {};

	console.log("format_individual_movie");
	console.log(sql_result);

	var html_code = '<h2>' + sql_result[0].primary_title + '' +
		'<span onclick="editing_movie()">&nbsp;&nbsp;&nbsp;&nbsp;edit</span></h2>';

	var end_year;
	if (sql_result[0].end_year === null) {
		end_year = '-';
	} else {
		end_year = sql_result[0].end_year;
	}

	var directors_arr = sql_result[0].directors.split(',');
	var directors_sql = "SELECT primary_name, nconst FROM Names WHERE ";
	for (var i = 0; i < directors_arr.length; i++) {
		directors_sql += "nconst = \"" + directors_arr[i] + "\" ";

		if (i < directors_arr.length - 1) {
			directors_sql += "OR ";
		}
	}

	if (sql_result[0].writers !== null) {

		var writers_arr = sql_result[0].writers.split(',');
		var writers_sql = "SELECT primary_name, nconst FROM Names WHERE ";
		for (var i = 0; i < writers_arr.length; i++) {
			writers_sql += "nconst = \"" + writers_arr[i] + "\" ";

			if (i < writers_arr.length - 1) {
				writers_sql += "OR ";
			}
		}
	} else {
		var writers_sql = "";
	}

	html_code += '<div class="row">' +
		'<div class="col-3">' +
		'<p id="tconst_hidden" hidden>' + sql_result[0].tconst + '</p>' +
		//movie info here
		'<p>Movie type: <span id="movie_type">' + sql_result[0].title_type + '</p>' +
		'<p>Start year: ' + sql_result[0].start_year + '</p>' +
		'<p>End year: ' + end_year + '</p>' +
		'<p>Length: ' + sql_result[0].runtime_minutes + ' minutes</p>' +
		'<p>Genres: <span id="movie_genres">' + sql_result[0].genres + '</span></p>' +
		'<p>Average rating: ' + sql_result[0].average_rating + '</p>' +
		'<p>Number of votes: ' + sql_result[0].num_votes + '</p>';

	html_code += "<h5>Casting (order by top billed cast): </h5><ol id='cast_list'>";

	for (var i = 0; i < sql_result.length; i++) {
		html_code += "<li><a href=\"http://cisc-dean.stthomas.edu:" + port + "/individual?nconst=" + sql_result[i].nconst +
			"\">" + sql_result[i].primary_name + "</a></li>";
	}

	html_code += "</ol></div>";


	html_code += "<div class=\"col-3\"><h5>Directors: ***directors***</h5></div>";

	html_code += "<div class=\"col-3\"><h5>Writers: ***writers***</h5></div>";

	html_code += '<div class=\"col-3\" ng-controller=\"PosterController\">' +
		//movie picture here
		'<img ng-src=\"{{imageSrc}}\" ng-init=\"imageSrc = \'./img/poster-placeholder.jpg\'\">' + '</div>' +
		'</div>';

	returnObj.html_code = html_code;
	returnObj.directors_sql = directors_sql;
	returnObj.writers_sql = writers_sql;


	return returnObj;
}

function populate_known_titles(sql_result_arr) {
	var html_code = "<ul style='list-style-type: none'>";

	for (var i = 0; i < sql_result_arr.length; i++) {
		html_code += "<li><a href=\"http://cisc-dean.stthomas.edu:" + port + "/individual?tconst=" +
			sql_result_arr[i].tconst + "\" >" +
			sql_result_arr[i].primary_title + "</a></li>";
	}

	html_code += "</ul>";

	return html_code;
}

function format_individual_person(sql_result) {
	var return_obj = {};

	var html_code = "<h2>" + sql_result.primary_name + '' +
		'<span onclick="editing_person()">&nbsp;&nbsp;&nbsp;&nbsp;edit</span></h2>';

	var death_year;
	if (sql_result.death_year === null) {
		death_year = 'present';
	} else {
		death_year = sql_result.death_year;
	}

	var known_titles_arr = sql_result.known_for_titles.split(',');
	var titles_name_sql = "SELECT Titles.primary_title, Titles.tconst From Titles WHERE ";
	for (var i = 0; i < known_titles_arr.length; i++) {
		titles_name_sql += "tconst = \"" + known_titles_arr[i] + "\" ";

		if (i < known_titles_arr.length - 1) {
			titles_name_sql += "OR ";
		}
	}

	html_code += '<div class="row">' +
		'<div class="col-4">' +
		// info here
		'<p id="nconst_hidden" hidden>' + sql_result.nconst + '</p>' +
		'<p>Birth Year: ' + '<span id="person_birth_year">' + sql_result.birth_year + '</span></p>' +
		'<p>Death Year: ' + '<span id="person_death_year">' + death_year + '</span></p>' +
		'<p>Professions: ' + '<span id="person_profession">' + sql_result.primary_profession + '</span></p>' +
		'</div><div class="col-4"><h5>Known For Titles</h5>' +
		'***known_titles***' +
		'</div> ' +
		'<div class="col-4" ng-controller=\"PosterController\">' +
		//movie picture here
		'<img ng-src=\"{{imageSrc}}\" ng-init=\"imageSrc = \'./img/poster-placeholder.jpg\'\">' +
		'</div>' +
		'</div>';

	return_obj.html_code = html_code;
	return_obj.titles_name_sql = titles_name_sql;

	return return_obj;
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
		'</thead>' + '<select id="select_type">' +
		'<option value="all" selected>all</option>' +
		'<option value="short">short</option>' +
		'<option value="movie">movie</option>' +
		'<option value="tvMovie">tvMovie</option>' +
		'<option value="tvSeries">tvSeries</option>' +
		'<option value="tvShort">tvShort</option>' +
		'<option value="tvMiniSeries">tvMiniSeries</option>' +
		'<option value="tvSpecial">tvSpecial</option>' +
		'<option value="videoGame">videoGame</option>' +
		'</select>' +
		"<button onclick=\"title_filter();\">show</button>" +
		'<tbody>';

	for (var i = 0; i < sql_result.length; i++) {
		var end_year;
		if (sql_result[i].end_year === null) {
			end_year = '-';
		} else {
			end_year = sql_result[i].end_year;
		}

		table_html_code += '<tr>' +
			'<th >' + (i + 1) + '</th>' +
			'<td>' +
			'<a href=\"http://cisc-dean.stthomas.edu:' + port + '/individual?tconst=' + sql_result[i].tconst + '\" class=\"list-group-item-action \">' +
			sql_result[i].primary_title + '</a>' + '</td>' +
			'<td class="title_type">' + sql_result[i].title_type + '</td>' +
			'<td>' + sql_result[i].start_year + '</td>' +
			'<td>' + end_year + '</td>' +
			'</tr>';
	}

	table_html_code += "</tbody></table>";

	return table_html_code;
}

function people_table_html(sql_result) {
	var pro_list = ['actor',
		'actress',
		'animation_department',
		'art_department',
		'art_director',
		'assistant',
		'assistant_director',
		'camera_department',
		'casting_department',
		'casting_director',
		'cinematographer',
		'composer',
		'costume_department',
		'costume_designer',
		'director',
		'editor',
		'editorial_department',
		'executive',
		'legal',
		'location_management',
		'make_up_department',
		'manager',
		'miscellaneous',
		'music_department',
		'producer',
		'production_designer',
		'production_manager',
		'publicist',
		'set_decorator',
		'sound_department',
		'soundtrack',
		'special_effects',
		'stunts',
		'talent_agent',
		'transportation_department',
		'visual_effects',
		'writer'
	];

	var option_list = "";
	for (var i = 0; i < pro_list.length; i++) {
		option_list += '<option value=\"' + pro_list[i] + '\">' + pro_list[i] + '</option>';
	}

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
		'</thead>' + '<select id="select_pro">' +
		'<option value="all">all</option>' +
		'<option value="">(no profession)</option>' +
		option_list +
		'</select>' +
		"<button onclick=\"name_filter();\">show</button>" +
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
			'<a href=\"http://cisc-dean.stthomas.edu:' + port + '/individual?nconst=' + sql_result[i].nconst + '\" class=\"list-group-item-action \">' +
			sql_result[i].primary_name + '</a>' + '</td>' +
			'<td>' + sql_result[i].birth_year + '</td>' +
			'<td>' + death_year + '</td>' +
			'<td class="person_pro">' + sql_result[i].primary_profession + '</td>' +
			'</tr>';
	}

	table_html_code += "</tbody></table>";

	return table_html_code;


}

console.log("now listening at port: " + port);

server.listen(port, '0.0.0.0');
