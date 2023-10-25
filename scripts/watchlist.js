$(document).ready(function() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (watchlist.length === 0) {
        // Display a message or perform any action when the watchlist is empty
        $('#watchListMovies').html('<p>Your watchlist is empty.</p>');
        return;
    }

    loadMovieCards(watchlist);


});



function loadMovieCards(watchlist){
    $('#watchListMovies').empty();

    

    watchlist.forEach(idElem => {

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
                                        <a href="#" class="btn btn-primary">
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

            // Append the new card to the watchlist container
            $('#watchListMovies').append(movieCard);

    
            }, 
            error: function(error){
                console.log("getMovieDetails failed");
            }
        })

    });

    

    
}