//global watchlist array with movie IDs
let watchlistArray = JSON.parse(localStorage.getItem('watchlist')) || [];

$(document).ready(function() {


    if (watchlistArray.length === 0) {
        // Display a message when the watchlist is empty
        $('#watchListMovies').html('<p>Your watchlist is empty.</p>');
        return;
    }
    //load the watchlist
    loadMovieCards(watchlistArray);
});


//function for appending movie cards to page
function loadMovieCards(watchlistArray){
    // clears container
    $('#watchListMovies').empty();

    // add each element
    watchlistArray.forEach(idElem => {

        //gets movie data from api using ID stored in local storage
        const apiURL = `https://api.themoviedb.org/3/movie/${idElem}?api_key=2ac1e5ad6ec723f6618988e193d2939a`;
        
        $.ajax({
            url: apiURL,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const movie = data;

                const movieCard = `
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="card mb-3" style="max-width: 90%;">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" class="img-fluid rounded-start p-3" alt="${movie.title}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h3 class="card-title" id="movTitle">${movie.title}</h3>
                                    <div class="card-pill">
                                        <h5 class="badge badge-primary" id="movieGenre">${movie.genres[0].name}</h5>
                                    </div>
                                    <p class="card-text mt-4" id="overview">${movie.overview}</p>
                                    <div class="card-button mt-5">
                                        <a href="#" class="btn btn-primary">Watch</a>
                                        <a href="#" class="btn btn-primary remove-btn" data-movie-id="${idElem}"> 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append card to the watchlist container
            $('#watchListMovies').append(movieCard);
    
            }, 
            error: function(error){
                console.log("getMovieDetails failed");
            }
        })

    });
}


//method for removing movie from local storage 
$(document).on('click', '.remove-btn', function() {
    // Retrieve the movie ID stored in the data attribute of the clicked button
    const movieIdToRemove = $(this).data('movie-id');

    // Find the index of this movie ID in the watchlist array
    const indexToRemove = watchlistArray.indexOf(movieIdToRemove);

    // If the movie is found in the watchlist array
    if (indexToRemove !== -1) {
        // Remove the movie from the array
        watchlistArray.splice(indexToRemove, 1);

        // Update the local storage with the new watchlist array
        localStorage.setItem('watchlist', JSON.stringify(watchlistArray));

        // Reload the movie cards to show changes
        loadMovieCards(watchlistArray);
    }
});