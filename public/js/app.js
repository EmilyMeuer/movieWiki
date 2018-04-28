"use strict"

var port = 8013;
// Instead:
// - make a "get" in my server for /poster/:id
// - call this get from the js (I can find the id info from the URL - window.location)
// - the server will make the call to poster.get____();
// - my get request in angular will bind that data that it receives

(function() {
var app = angular.module("app", []);

function editing_movie() {
    
    var movie_type = $('#movie_type')[0].innerHTML;
    var movie_genres = $('#movie_genres')[0].innerHTML;
    var movie_tconst = $('#tconst_hidden')[0].innerHTML;
    //var cast_list = $('#cast_list')[0].innerHTML;


    var genres_arr = movie_genres.split(',');

    var replace_element = "" +
        "<form class='row' action=\"/updateMovie\" enctype=\"multipart/form-data\" method=\"POST\">" +
            "<input hidden name='tconst' value=\'"+ movie_tconst +"\'>" +
            "<div class='col-4' >"+
                "<h3>Movie Type</h3>" +
                "<input type=\"radio\" name=\"type\" value=\"short\" "+ default_type('short', movie_type) +"> short<br>\n" +
                "<input type=\"radio\" name=\"type\" value=\"movie\" "+ default_type('movie', movie_type) +"> movie<br>\n" +
                "<input type=\"radio\" name=\"type\" value=\"tvMovie\" "+ default_type('tvMovie', movie_type) +"> tvMovie<br>\n" +
                "<input type=\"radio\" name=\"type\" value=\"tvSeries\" "+ default_type('tvSeries', movie_type) +"> tvSeries<br>\n" +
                "<input type=\"radio\" name=\"type\" value=\"tvShort\" "+ default_type('tvShort', movie_type) +"> tvShort<br>\n" +
                "<input type=\"radio\" name=\"type\" value=\"tvMiniSeries\" "+ default_type('tvMiniSeries', movie_type) +"> tvMiniSeries<br>\n" +
                "<input type=\"radio\" name=\"type\" value=\"tvSpecial\" "+ default_type('tvSpecial', movie_type) +"> tvSpecial<br>\n" +
                "<input type=\"radio\" name=\"type\" value=\"videoGame\" "+ default_type('videoGame', movie_type) +"> videoGame<br>\n" +
            "</div>" +

            "<div class='col-4'>" +
                "<h3>Movie Genres</h3>" +
                "<h6>(max = 3)</h6>" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Action\"  "+ default_genres('Action', genres_arr) +">Action<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Adventure\"  "+ default_genres('Adventure', genres_arr) +">Adventure<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Animation\"  "+ default_genres('Animation', genres_arr) +">Animation<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Biography\"  "+ default_genres('Biography', genres_arr) +">Biography<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Comedy\"  "+ default_genres('Comedy', genres_arr) +">Comedy<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Crime\"  "+ default_genres('Crime', genres_arr) +">Crime<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Documentary\"  "+ default_genres('Documentary', genres_arr) +">Documentary<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Drama\"  "+ default_genres('Drama', genres_arr) +">Drama<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Family\"  "+ default_genres('Family', genres_arr) +">Family<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Fantasy\"  "+ default_genres('Fantasy', genres_arr) +">Fantasy<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Film Noir\"  "+ default_genres('Film Noir', genres_arr) +">Film Noir<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Game-Show\"  "+ default_genres('Game-Show', genres_arr) +">Game-Show<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"History\"  "+ default_genres('History', genres_arr) +">History<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Horror\"  "+ default_genres('Horror', genres_arr) +">Horror<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Musical\"  "+ default_genres('Musical', genres_arr) +">Musical<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Music\"  "+ default_genres('Music', genres_arr) +">Music<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Mystery\"  "+ default_genres('Mystery', genres_arr) +">Mystery<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"News\"  "+ default_genres('News', genres_arr) +">News<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Reality-TV\"  "+ default_genres('Reality-TV', genres_arr) +">Reality-TV<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Romance\"  "+ default_genres('Romance', genres_arr) +">Romance<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Sci-Fi\"  "+ default_genres('Sci-Fi', genres_arr) +">Sci-Fi<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Short\"  "+ default_genres('Short', genres_arr) +">Short<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Sport\"  "+ default_genres('Sport', genres_arr) +">Sport<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Talk-Show\"  "+ default_genres('Talk-Show', genres_arr) +">Talk-Show<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Thriller\"  "+ default_genres('Thriller', genres_arr) +">Thriller<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"War\"  "+ default_genres('War', genres_arr) +">War<br/>\n" +
                "<input class=\"genres_checkbox\" type=\"checkbox\" name=\"genres\" value=\"Western\"  "+ default_genres('Western', genres_arr) +">Western<br/>\n" +

            "</div>" +


            "<div class='col-3'>" +
                "<h3>Reorder top billed cast</h3>" +

            "</div> " +

            "<div class='col-1'>" +
                "<input type='submit' class=\"btn btn-primary col-12\" value='update'><br/>" +
                "<input type='reset' class=\"btn btn-danger col-12\" value='reset'><br/>" +
                "<a href=\"http://cisc-dean.stthomas.edu:"+ port +"/individual?tconst=" + movie_tconst + "\" class=\"btn btn-dark col-12\">back</a>  " +
            "</div> " +

        "</form>" +
        "<script>" +
        "var limit = 3;\n" +
        "$('input.genres_checkbox').on('click', function(event) {\n" +
        "    if($('.genres_checkbox:checked').length > limit){\n" +
        "        this.checked = false;\n" +
        "    }\n" +
        "});" +
        "</script>";

    $(document).ready(function () {
        $('#table').replaceWith(replace_element);
    });

}

function editing_person(){
    var person_nconst = $('#nconst_hidden')[0].innerHTML;
    var person_birth_year = $('#person_birth_year')[0].innerHTML;
    var person_death_year = $('#person_death_year')[0].innerHTML;
    var person_profession = $('#person_profession')[0].innerHTML;

    var profession_arr = person_profession.split(',');

    console.log(person_nconst);
    console.log(person_birth_year);
    console.log(person_death_year);


    var replace_element = "" +
        "<form action=\"/updatePerson\" enctype=\"multipart/form-data\" method=\"POST\">" +
            "<input hidden name='nconst' value=\'"+ person_nconst +"\'>" +
            "<h4>Birth Year: (please enter number for years or \"present\")</h4>" +
            "<input type='text' name='birth_year' value='"+ person_birth_year +"'>" +
            "<h4>Death Year: (please enter number for years or \"present\")</h4>" +
            "<input type='text' name='death_year' value='"+ person_death_year +"'>" +
            "<h4>Primary Perfession:</h4>" +
            "<h6>(max is 3)</h6>" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"actor\"  "+ default_profession('actor', profession_arr) +">actor<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"actress\"  "+ default_profession('actress', profession_arr) +">actress<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"animation_department\"  "+ default_profession('animation_department', profession_arr) +">animation_department<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"art_department\"  "+ default_profession('art_department', profession_arr) +">art_department<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"art_director\"  "+ default_profession('art_director', profession_arr) +">art_director<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"assistant\"  "+ default_profession('assistant', profession_arr) +">assistant<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"assistant_director\"  "+ default_profession('assistant_director', profession_arr) +">assistant_director<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"camera_department\"  "+ default_profession('camera_department', profession_arr) +">camera_department<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"casting_department\"  "+ default_profession('casting_department', profession_arr) +">casting_department<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"casting_director\"  "+ default_profession('casting_director', profession_arr) +">casting_director<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"cinematographer\"  "+ default_profession('cinematographer', profession_arr) +">cinematographer<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"composer\"  "+ default_profession('composer', profession_arr) +">composer<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"costume_department\"  "+ default_profession('costume_department', profession_arr) +">costume_department<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"costum_designer\"  "+ default_profession('costum_designer', profession_arr) +">costum_designer<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"director\"  "+ default_profession('director', profession_arr) +">director<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"editor\"  "+ default_profession('editor', profession_arr) +">editor<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"editorial_department\"  "+ default_profession('editorial_department', profession_arr) +">editorial_department<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"executive\"  "+ default_profession('executive', profession_arr) +">executive<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"legal\"  "+ default_profession('legal', profession_arr) +">legal<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"location_management\"  "+ default_profession('location_management', profession_arr) +">location_management<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"make_up_department\"  "+ default_profession('make_up_department', profession_arr) +">make_up_department<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"manager\"  "+ default_profession('manager', profession_arr) +">manager<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"miscellaneous\"  "+ default_profession('miscellaneous', profession_arr) +">miscellaneous<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"music_department\"  "+ default_profession('music_department', profession_arr) +">music_department<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"producer\"  "+ default_profession('producer', profession_arr) +">producer<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"production_designer\"  "+ default_profession('production_designer', profession_arr) +">production_designer<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"production_manager\"  "+ default_profession('production_manager', profession_arr) +">production_manager<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"publicist\"  "+ default_profession('publicist', profession_arr) +">publicist<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"set_decorator\"  "+ default_profession('set_decorator', profession_arr) +">set_decorator<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"sound_department\"  "+ default_profession('sound_department', profession_arr) +">sound_department<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"soundtrack\"  "+ default_profession('soundtrack', profession_arr) +">soundtrack<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"special_effects\"  "+ default_profession('special_effects', profession_arr) +">special_effects<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"stunts\"  "+ default_profession('stunts', profession_arr) +">stunts<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"talent_agent\"  "+ default_profession('talent_agent', profession_arr) +">talent_agent<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"transportation_deparment\"  "+ default_profession('transportation_deparment', profession_arr) +">transportation_deparment<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"visual_effects\"  "+ default_profession('visual_effects', profession_arr) +">visual_effects<br/>\n" +
            "<input class=\"profession_checkbox\" type=\"checkbox\" name=\"profession\" value=\"writer\"  "+ default_profession('writer', profession_arr) +">writer<br/>\n" +

            "<input type='submit' class=\"btn btn-primary col-2\" value='update'>" +
            "<input type='reset' class=\"btn btn-danger col-2\" value='reset'>" +
            "<a href=\'http://cisc-dean.stthomas.edu:"+ port +"/individual?nconst=" + person_nconst + "\'" + " class=\"btn btn-dark col-2\">back</a>  " +
        "</form>" +
        "<script>" +
        "var limit = 3;\n" +
        "$('input.profession_checkbox').on('click', function(event) {\n" +
        "    if($('.profession_checkbox:checked').length > limit){\n" +
        "        this.checked = false;\n" +
        "    }\n" +
        "});" +
        "</script>";

    $(document).ready(function () {
        $('#table').replaceWith(replace_element);
    });
}

function default_type(type, default_type){
    if(type === default_type){
        return "checked";
    }else{
        return "";
    }
}

function default_genres(new_genre, default_genres){
    for(var i=0;i<default_genres.length;i++){
        if(new_genre === default_genres[i]){
            return 'checked';
        }
    }
    return '';
}

app.controller("PosterController", function($scope, $http) {
	var nconst = $("#nconst_hidden")[0];
	var tconst = $("#tconst_hidden")[0];

	var param;
	if(nconst) {
		param = "nconst=" + nconst.innerHTML;
	} else if(tconst) {
		param = "tconst=" + tconst.innerHTML;
	} else {
		throw "app.js: no nconst_hidden or tconst_hidden element.";
	}

	console.log(window.location.protocol);

	$http.get(("/poster?" + param))
	.then((response) => {
		console.log(response.data);
		$scope.imageSrc = window.location.protocol + "//" + response.data;
	}, (err) => {
		console.log(err);
	});	
		//	$scope.imageSrc	= src;

}); // Poster Controller

})();
