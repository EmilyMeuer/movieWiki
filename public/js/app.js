function editing_movie() {
    
    var movie_type = $('#movie_type')[0].innerHTML;
    var movie_genres = $('#movie_genres')[0].innerHTML;
    //var cast_list = $('#cast_list')[0].innerHTML;

    var genres_arr = movie_genres.split(',');

    var replace_element = "" +
        "<form class='row'>" +
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


