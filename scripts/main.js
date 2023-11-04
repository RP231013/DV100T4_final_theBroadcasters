$(document).ready(function() {


    $('#signupForm').submit(function(event) {

        event.preventDefault();
        
        if (this.checkValidity() === false) {
            event.stopPropagation();
        } else {
            
            window.location.href = 'index.html';
        }
        $(this).addClass('was-validated');
    });
});

$(document).ready(function(){
    
    loadPopularMoviesToday();
    //for testing purposes
    //localStorage.clear();

    checkLoginStatus();

    

});


function loadPopularMoviesToday() {
    const apiURL = "https://api.themoviedb.org/3/trending/movie/day?api_key=2ac1e5ad6ec723f6618988e193d2939a";

    $.ajax({
        url: apiURL,
        method: 'GET',
        dataType: 'json',
        success: function(data) {

            // mapping of data
            const popularMovies = data.results.map(movie => ({
                movieID: movie.id,
                title: movie.title,
                description: (movie.overview).substring(0, 300),
                poster: movie.poster_path,
                genres: movie.genre_ids
            }));

            console.log(popularMovies);

            displayPopularMovies(popularMovies);
                // Hide all card-info-hover elements initially
            $(".card-info-hover").hide();
            $(".userStuff").hide();
            
            // Hover for movie cards
            cardHover();

            // user logged in check
            checkLoginStatus();

        },
        error: function(error) {
            console.log("loadPopularMoviesToday failed to load");
        }

    });
}


// display popular movies on home page
function displayPopularMovies(popularMovies) {
    const movieContainer = $("#trending-movie-cards-container");
    movieContainer.empty();
    movieContainer.append(`<h2>Trending movies today: </h2>`);

    popularMovies.forEach(movie => {
        const img_path = "https://image.tmdb.org/t/p/original/" + movie.poster;
        const card = $(`
        <!-- cards div col -->
        <div class="col-lg-3 col-md-4 col-sm-6">

            <!-- div card -->
            <div class="card" data-movie-id="${movie.movieID}">

              <!-- poster img -->
              <img src="${img_path}" class="card-img-top" alt="${movie.title}">
              
              <!-- div card body -->
              <div class="card-img-overlay card-info-hover">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text card-info-hover">${movie.description}</p>
                <a href="#" class="btn btn-primary card-info-hover">Info</a>
                <!-- heart button -->
                <a href="#" class="btn btn-primary card-info-hover" id="watchBtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                </svg></a>
                <!-- end div card body -->
            </div>
            <!-- end div card -->
          </div>
          <!-- end card div col -->
        </div>
        `)

        card.click(function(){
            window.location.href = `pages/details.html?id=${movie.movieID}`;
        });


        movieContainer.append(card);
    });
 
}

function loadCarousel(popularMovies){
    const caro = $("#mainCarousel");
    caro.empty();

    popularMovies.splice(3);


}




// function for card hovers
function cardHover() {
    $(".card").hover(
      function() {
        $(this).find(".card-info-hover").slideDown(300);
        $(this).find(".card-img-top").toggleClass("blur");
      },
      function() {
        $(this).find(".card-info-hover").slideUp(300);
        $(this).find(".card-img-top").toggleClass("blur");
      }
    );
  };


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
  


let watchlist = [];

// Click function for the watch button
$(document).on('click', '#watchBtn', function() {
    // Get the movie ID from the card
    const movieID = $(this).closest('.card').data('movie-id');

    // Retrieve the existing watchlist from local storage or initialize it as an empty array
    const existingWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    // Check if the movie ID is not already in the watchlist
    if (!existingWatchlist.includes(movieID)) {
        // Add the movie ID to the watchlist
        existingWatchlist.push(movieID);

        // Store the updated watchlist in local storage
        localStorage.setItem('watchlist', JSON.stringify(existingWatchlist));

        // Notify the user or update the UI as needed
        alert(`Added movie with ID ${movieID} to your watchlist.`);
    } else {
        // Notify the user that the movie is already in the watchlist or perform another action
        alert(`Movie with ID ${movieID} is already in your watchlist.`);
    }
});

