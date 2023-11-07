//sets the movieID for global use across page
let globalMovieID;

$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieid = urlParams.get('id');
    globalMovieID = movieid;

    if(movieid){
        getMovieDetails(movieid)

    }else{
        alert("No such movie found!");
        window.location.href = `../index.html`;
    }

    checkLoginStatus();

});



//gets movie details from api using movie id in query parameter
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

//gets movie trailer 
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

// Click function for the add to watchlist button
$(document).on('click', '#watchBtn', function() {
    
    // Get the movie ID from the card
    const movieID = +(globalMovieID);

    // Retrieve the existing watchlist from local storage or initialize it as an empty array
    const existingWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    // Check if the movie ID is not already in the watchlist
    if (!existingWatchlist.includes(movieID)) {
        // Add the movie ID to the watchlist
        existingWatchlist.push(movieID);

        // Store the updated watchlist in local storage
        localStorage.setItem('watchlist', JSON.stringify(existingWatchlist));

        // Notify the user 
        alert("Movie has been added to your watchlist");

    } else {
        // Notify the user that the movie is already in the watchlist or perform another action
        alert(`Movie with ID ${movieID} is already in your watchlist.`);
    }
});
