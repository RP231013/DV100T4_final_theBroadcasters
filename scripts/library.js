$(document).ready(function(){
    
    checkLoginStatus();
    loadGenreFilterDropDown();

    //general api call for first loading data
    const apiURL = "https://api.themoviedb.org/3/trending/movie/week?api_key=2ac1e5ad6ec723f6618988e193d2939a";
    //loads data using loadMovies method
    loadAllMovies(apiURL);

    //calls filter onClick method
    performGenreFilteringUponClick();

});


// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
//loads by fetching the data from the API based on the API call it receives as a parameter
function loadAllMovies(specificAPIcall) {

    $.ajax({
        url: specificAPIcall,
        method: 'GET',
        dataType: 'json',
        success: function(data) {

            // mapping of data
            const allMovies = data.results.map(movie => ({
                movieID: movie.id,
                title: movie.title,
                description: (movie.overview).substring(0, 250),
                poster: movie.poster_path,
                genres: movie.genre_ids,
                backdrop: movie.backdrop_path
            }));



            //here, the movie cards are actually loaded onto the page
            displayMovies(allMovies);

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


// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// actually displays movies on home page
// used as a general method for displaying
function displayMovies(movieArr) {

    //defines container and empties it 
    const movieContainer = $("#trending-movie-cards-container");
    movieContainer.empty();

    //loads card
    movieArr.forEach(movie => {
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
                <a class="btn btn-primary card-info-hover " id="watchBtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
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
            window.location.href = `../pages/details.html?id=${movie.movieID}`;
        });
    });
 
}


// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// Click function for the add to watchlist button
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




// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// This function loads the genre filter dropdown with all the available genres from the api
function loadGenreFilterDropDown() {
    const apiURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=2ac1e5ad6ec723f6618988e193d2939a";

    $.ajax({
        url: apiURL,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const genreDropdown = $('#genreDropdownMenu');
            genreDropdown.empty(); // Clears container

            // add new list items for each genre
            data.genres.forEach(genre => {
                const dropdownItem = $(`<li><a class="dropdown-item btn btn-primary" href="#" data-gen-id="${genre.id}" data-gen-name="${genre.name}">${genre.name}</a></li>`);
                genreDropdown.append(dropdownItem);
            });

        },
        error: function(error) {
            console.log("loadGenreFilter failed to load", error);
        }
    });
};




// --------------------------------------------------------------------------------------------------------------

//                  all on click events

// --------------------------------------------------------------------------------------------------------------
//upon click of genre, this function wil retrieve the movies from that genre's data and 
// load page using the displayMovies method
function performGenreFilteringUponClick() {
    // click event listener to each dropdown item
    $('#genreDropdownMenu').on('click', '.dropdown-item', function(event) {
        event.preventDefault(); // Prevent default anchor click behavior
        const selectedGenreId = $(this).data('gen-id');
        const selectedGenreName = $(this).data('gen-name');
        const addToContainer = $("#addHeadingHere");
        addToContainer.empty();
        addToContainer.append(`<h2>${selectedGenreName}</h2>`);
        // defines API call for genre's
        const apiURL = `https://api.themoviedb.org/3/discover/movie?api_key=2ac1e5ad6ec723f6618988e193d2939a&with_genres=${selectedGenreId}`;

        //loads genre's on page
        loadAllMovies(apiURL);
    });
}


// allFilter button event
$(document).on('click', '#allFilter', function() {
    let apiurl = "https://api.themoviedb.org/3/trending/movie/week?api_key=2ac1e5ad6ec723f6618988e193d2939a";
    //loads data using loadMovies method
    loadAllMovies(apiurl);
    const addToContainer = $("#addHeadingHere");
    addToContainer.empty();
    addToContainer.append(`<h2>All Movies</h2>`);
});

//Highly rated filter
$(document).on('click', '#HighlyRatedFilter', function() {
    let apiurl = "https://api.themoviedb.org/3/discover/movie?api_key=2ac1e5ad6ec723f6618988e193d2939a&vote_average.gte=8";
    //loads data using loadMovies method
    loadAllMovies(apiurl);
    const addToContainer = $("#addHeadingHere");
    addToContainer.empty();
    addToContainer.append(`<h2>Highly Rated</h2>`);
});


// year filters
$(document).on('click', '.dropdown-item', function() {
    const yearValue = $(this).attr('value');

    let apiurl = `https://api.themoviedb.org/3/discover/movie?api_key=2ac1e5ad6ec723f6618988e193d2939a&${yearValue}`;
    //loads data using loadMovies method
    loadAllMovies(apiurl);
    const addToContainer = $("#addHeadingHere");
    addToContainer.empty();
    let yearText = $(this).text();
    addToContainer.append(`<h2>${yearText}</h2>`);
    
});
//          end all click events
// --------------------------------------------------------------------------------------------------------------



// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
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
  

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
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