
$(document).ready(function(){
    
    checkLoginStatus();
    loadPopularMoviesToday();
    
    //for testing purposes
    //localStorage.clear();

});

//this function loads the main carousel on the page
function loadCarousel(popularMovies) {
    const caro = $("#mainCarousel");
    caro.empty();

    let shorterMovies = popularMovies.slice(0, 3); // Ensures that only the first 3 movies are used

    shorterMovies.forEach((movie, index) => {
        const activeWordForCaro = index === 0 ? "active" : "";
        const iframeID = `trailorPlayer-${index}`; // Unique ID for each iframe

        const card = $(`
            <!-- slide ${index + 1} -->
            <div class="carousel-item ${activeWordForCaro} ">
              <div class="videoContainer">
                <iframe class="responsive-iframe" id="${iframeID}" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <div class="card-info">
              <div class="col-lg-9 col-md-8 col-sm-11">
                <div class="card ">
                  <div class="card-body" >
                    <h2 class="card-title" id="title">${movie.title}</h2>
                    <p class="card-text card-info-hover" id="desc">${movie.description}</p>
                    <a href="#" class="btn btn-primary card-info-hover" id="infoBtn">Info</a>
                    <a href="#" class="btn btn-primary card-info-hover" id="watchBtn">Add to watchlist <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                    </svg></a>
                  </div>
                 
                </div> <!-- end card -->
              </div> <!-- end col -->
            </div> <!-- end card info -->
              </div> <!-- end videoContainer -->
            </div> <!-- end slide ${index + 1} -->
        `);

        caro.append(card);

        // Fetch and update the trailer link
        getMovieTrailer(movie.movieID) // Make sure movie has a property movieID
            .then(function(ytLink) {
                $(`#${iframeID}`).attr('src', `https://www.youtube.com/embed/${ytLink}?&controls=0`);
            })
            .catch(function(error) {
                console.error("Error:", error);
                // Here the movie's image is set as a background in case of an error.
                const movieImagePath = `https://image.tmdb.org/t/p/original/${movie.backdrop}`;
                $(`#${iframeID}`).replaceWith(`<div class="video-placeholder" style="background-image: url('${movieImagePath}');"></div>`);
            });
    });
}

//gets the movie trailer as api does not include it in the all movies call.
function getMovieTrailer(movieID) {
    //because asynchronous-ness, a promise has to be made to ensure that the YT link loads otherwise it won't "load in time" and nothing would display.
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
                console.log("getMovieTrailer method failed");
                reject(error);
            }
        });
    });
}


//loads the popular movies for the day by fetching the data from the API
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
                description: (movie.overview).substring(0, 250),
                poster: movie.poster_path,
                genres: movie.genre_ids,
                backdrop: movie.backdrop_path
            }));

            //Here, the carousel is loaded using only the first three movies from all the popular movies.
            loadCarousel(popularMovies.slice(0,3));

            //here, the movie cards are actually loaded onto the page
            displayPopularMovies(popularMovies);

            // Hide all card-info-hover elements initially
            $(".card-info-hover").hide();
            $(".userStuff").hide();
            
            // Hover for movie cards
            cardHover();

            //checks if the user has been logged in
            checkLoginStatus();

        }, //here the error is caught
        error: function(error) {
            console.log("loadPopularMoviesToday failed to load");
        }

    });
}


// display popular movies on home page
function displayPopularMovies(popularMovies) {

    //defines container and empties it 
    const movieContainer = $("#trending-movie-cards-container");
    movieContainer.empty();
    movieContainer.append(`<h2>Trending movies today: </h2>`);

    //loads card
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
                <a href="#" class="btn btn-primary card-info-hover infoBtn">Info</a>
                <!-- heart button -->
                <a href="#" class="btn btn-primary card-info-hover " id="watchBtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                </svg></a>
                <!-- end div card body -->
            </div>
            <!-- end div card -->
          </div>
          <!-- end card div col -->
        </div>
        `)

        //adds card to container
        movieContainer.append(card);

        // Attach the click event handler to the info button 
        card.find('.infoBtn').on('click', function(event){
            event.preventDefault();
            window.location.href = `pages/details.html?id=${movie.movieID}`;
        });
    });
 
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
        //updates HTML if user is logged in
        $(".userStuff").show();
        $("#insertUser").text("Hello, " + localStorage.getItem("username") + "!");
        $(".logBtn").hide();
    }
};
  


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

        // Notify the user 
        alert("Movie has been added to your watchlist");

    } else {
        // Notify the user that the movie is already in the watchlist or perform another action
        alert(`Movie with ID ${movieID} is already in your watchlist.`);
    }
});


//checks to see if user is logged in before they can do anything
$(document).on('click', function(){
    let logged = localStorage.getItem("userLogged");

    if(logged === "false" || logged === null){
        window.location.href = `pages/signin.html`;
    }
});

