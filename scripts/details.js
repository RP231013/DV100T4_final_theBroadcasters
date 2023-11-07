$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieid = urlParams.get('id');

    if(movieid){
        getMovieDetails(movieid)

    }else{
        alert("No such movie found!");
        window.location.href = `../index.html`;
    }

    checkLoginStatus();

});


function getMovieDetails(movieID){

    const apiURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=2ac1e5ad6ec723f6618988e193d2939a`;

    $.ajax({
        url: apiURL,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const mov = data;

            

            if(mov){

                
                $('#movDeatsPoster').attr('src', ("https://image.tmdb.org/t/p/original/" + mov.poster_path));
                $('#movTitle').text(mov.original_title);
                $("#movieGenre").text(mov.genres[0].name);
                $('#movDesc').text(mov.overview);
                $('#resDate').text("Release Date: " + mov.release_date);
                $('#runTime').text("Run time: " + mov.runtime + "min");
                $('#rating').text("Rating: " + mov.vote_average);


                
                getMovieTrailer(mov.id)
                    .then(function(ytLink) {
                        
                        $("#trailorPlayer").attr('src', "https://www.youtube.com/embed/" + ytLink);

                    })
                    .catch(function(error) {
                        $(".videoContainer").append(`<p>This movie does not have a trailer.</p>`);
                    });
                


                
            }

        }, 
        error: function(error){
            console.log("getMovieDetails failed");
        }
    })

}


function getMovieTrailer(movieID) {
    return new Promise(function(resolve, reject) {
        const apiURL = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=2ac1e5ad6ec723f6618988e193d2939a`;

        $.ajax({
            url: apiURL,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const ytLink = data.results[0].key;
                resolve(ytLink);
            }, 
            error: function(error) {
                console.log("getMovievideo failed");
                reject(error);
            }
        });
    });
}


// function for checking the login status and updating user info
function checkLoginStatus() {
    let logged = localStorage.getItem("userLogged");


    if(logged === "false" || logged === null){
        $(".userStuff").hide();
    }else{
        $(".userStuff").show();
        $("#insertUser").text("Hello, " + localStorage.getItem("username") + "!");
        $(".logBtn").hide();
    }
};