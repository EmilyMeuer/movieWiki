//This is built-in module
var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');

//from npm download
var multiparty = require('multiparty');
var sqlite3 = require('sqlite3').verbose();


var db = new sqlite3.Database('imdb.sqlite3');

