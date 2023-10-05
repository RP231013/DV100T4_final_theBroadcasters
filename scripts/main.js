/*HEAD


//This variable has the list of tt codes we will need when calling the API to tell the API what movies we want
//They are sourced from IMDB
 616eae0379b3813cf7f93ebb40e44a1c355e00db*/

var moviesListed = ["tt0107290", "tt0816692", "tt0245429", "tt0068646", "tt0424774", "tt0076759", "tt0114709", "tt1877830", "tt0800369", "tt0117060", "tt0974015", "tt1490017", "tt2953050", "tt1375670", "tt1517451", "tt6751668", "tt0499549", "tt0325980", "tt0241527", "tt2488496", "tt0077651", "tt4154796", "tt1745960", "tt4633694", "tt2865120"];
//This users array stores the list of watchlist movies as well as login info
var users = [
  {
    username: "Antonio",
    password: "1234",
    watchlist: []
  },
  {
    username: "Erik",
    password: "1234",
    watchlist: [15, 3, 6]
  },
  {
    username: "Enrique",
    password: "1234",
    watchlist: []
  },
  {
    username: "Skyler",
    password: "1234",
    watchlist: []
  },
  {
    username: "Emily",
    password: "1234",
    watchlist: []
  }
]
//This array will store all 25 movies when the API calls them
var moviesArray = [];
var localWatchlist = [];
var count = 0;

function loadMovieContent() {
  //This function is called in order to retrieve the  25 movies then save them using JSON into the Local Storage
  var moviesArray = [];



  //The for loop loops through the tt codes and substitutes them in the API to retrieve the info
  for (let i = 0; i < moviesListed.length; i++) {

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://moviesdb5.p.rapidapi.com/om?i=" + moviesListed[i],
      "method": "GET",
      "headers": {
        "X-RapidAPI-Key": "ccd27e8962msh7debb0e3492d593p1961a8jsn90e63bb1c339",
        "X-RapidAPI-Host": "moviesdb5.p.rapidapi.com"
      }

    };


    $.ajax(settings).done(function (response) {
      //These Temporary variables store the movie information
     // console.log(response);
      var dir = response.Director;

      var name = response.Title;
      var act = response.Actors;
      var img = response.Poster;
      var year = response.Year;
      var rate = response.imdbRating;
      var tim = response.Runtime;
      var plo = response.Plot;
      var gen = response.Genre;
      //After getting th movie info it is then stored in a temporary obj to then be sent to the array of objects called mArray in Local Storage

      var tempObj = {
        movieName: name,
        director: dir,
        listOfActors: act,
        poster: img,
        year: year,
        time: tim,
        rating: rate,
        plot: plo,
        genre: gen
      }
      //Here the temporary onj is sent to be added to the movie array
     // console.log(tempObj);
      moviesArray.push(tempObj);

      //console.log(moviesArray[i]);

    })

  }

  //This peace of code was added because the API we use lags a bit and that causes the code to not read it before 
  //saving the info, so this time function waits 5 seconds before loading the info into the array to make sure
  //the info is there and that the API has had enough time to call it before we try and save it.
  jsonArr = [] ;
  setTimeout(function () { var jsonArr = JSON.stringify(moviesArray); localStorage.setItem("mArray", jsonArr); }, 5000);

  //console.log(moviesArray);
  // var str = localStorage.getItem("mArray");
  //var parsedArr = JSON.parse(str);





}

function loadOnHome() {
  loadMovieContent();
  $('.carousel').carousel({
    interval: 2000
  })


  $(".signIn-welcomeText").append("<h4 id='signIn-welcomeTextStyle'> Welcome back, " + sessionStorage.getItem("sName") + "! We hope you are having an awesome day!</h4>");


  //console.log(moviesArray[4].year);
  var str = localStorage.getItem("mArray");

  var parsedArr = JSON.parse(str);
  //console.log(parsedArr);
  moviesArray = parsedArr;
  console.log(moviesArray);
  for (let x = 0; x < 4; x++) {
    var addFeature = "<div onmouseenter=\"addMoviesToLibraryS(" + x + ")\" class=\"col-sm-3\"> <div class=\"movie-card\">  <div id=\"library-image1\"> <img src=" + moviesArray[x].poster + " class='card-img-top' alt'...'></div>     <div class=\"card-body\"> <div id=\"library-title1\"><h5 class='card-title'> <a href='Detailed_Page.html'>" + moviesArray[x].movieName + " </a></h5></div> <div  id=\"library-btnPlay1\"><a href='Detailed_Page.html' class='btn btn-primary'>Play</a></div><div onclick  = 'addToWatchlist()' id=\"library-btnAdd1\"> <a href='#' class='btn btn-primary'>Add</a></div>  </div>     </div> </div>";
    $("#featured_movies_add").append(addFeature);
    //top rated movies
  }

  for (let x = 4; x < 8; x++) {

    var addTopRated = "<div onmouseenter=\"addMoviesToLibraryS(" + x + ")\" class=\"col-sm-3\"> <div class=\"movie-card\">  <div id=\"library-image1\"> <img src=" + moviesArray[x].poster + " class='card-img-top' alt'...'></div>     <div class=\"card-body\"> <div id=\"library-title1\"><h5 class='card-title'> <a href='Detailed_Page.html'>" + moviesArray[x].movieName + " </a></h5></div> <div  id=\"library-btnPlay1\"><a href='Detailed_Page.html' class='btn btn-primary'>Play</a></div><div onclick  = 'addToWatchlist()' id=\"library-btnAdd1\"> <a href='#' class='btn btn-primary'>Add</a></div>  </div>     </div> </div>";
    $("#top_rated_movies_add").append(addTopRated);
  }
  //var addDiv = "<div onclick=\"addMoviesToLibrary(x)\" class=\"col\"> <div class=\"movie-card\">  <div id=\"library-image1\"> <img src=" + moviesArray[x].poster + " class='card-img-top' alt'...'></div>     <div class=\"card-body\"> <div id=\"library-title1\"><h5 class='card-title'> <a href='Detailed_Page.html'>" + moviesArray[x].movieName + " </a></h5></div> <div id=\"library-btnPlay1\"><a href='#' class='btn btn-primary'>Play</a></div><div id=\"library-btnAdd1\"> <a href='#' class='btn btn-primary'>Add</a></div>  </div>     </div> </div>";


}

function cycle() {
  $('.carousel').carousel('cycle')
}

function prev_slide() {
  $('.carousel').carousel('next')
}

function next_slide() {
  $('.carousel').carousel('next')
}





//sign in page 

function signInPageLoad() {
  hideSignUp();
}
function hideSignIn() {
  //This code just shows and hides the relevant divs depending on what the user wants to do.
  $(".signIn-Indiv").hide();
  $(".signIn-Updiv").show();

}
function hideSignUp() {
  //This code just shows and hides the relevant divs depending on what the user wants to do.
  $(".signIn-Updiv").hide();
  $(".signIn-Indiv").show();
}
function signUp() {
  //Here we save the sign up information to local storage so that it can be sent to the Home Page
  var localName = document.getElementById("signIn-nameL").value;
  var localPass = document.getElementById("signIn-passL").value;

  localStorage.setItem("lName", localName);
  localStorage.setItem("lPass", localPass);
  var newUser = [
    {
      username: localName,
      password: localPass
    }
  ]
  //Here we save the new user to the array of users
  users.push(newUser);
  for (let v = 0; v < users.length; v++) {
    console.log(users[v]);
  }
  alert("Sign up successful! Welcome to Cinemo!")
  //Here the information is also sent to session storage so that the Home Page can display the person's name
  sessionStorage.setItem("sName", localName);
  sessionStorage.setItem("sPass", localPass);

  //Here we hide the sign in page and show the Home Page
  $(this).display = "none";
  window.location = "Home_Page.html";
}
function signOut() {
  //Once the relevant button is clicked the code wipes the current logged in user
  //from the session storage and then returns them to the sign in screen
  sessionStorage.setItem("sName", "");
  sessionStorage.setItem("sPass", "");

}
function authenticate() {
  //This code makes sure that the user trying to sign in is a valid user 

  //After getting the info from the sign in page the code stores it to test it
  var testName = document.getElementById("signIn-userG").value;
  var testPassword = document.getElementById("signIn-passG").value;


  var loginState = true;
  //This for loop, loops throught the array of users testing to see if the info entered matches one of the saved users

  for (let i = 0; i < users.length; i++) {
    if (users[i].username == testName) {
      if (users[i].password == testPassword) {
        sessionStorage.setItem("sName", testName);
        sessionStorage.setItem("sPass", testPassword);
        loginState == true;
        alert("Welcome back, " + sessionStorage.getItem("sName") + "!");
        //Log in is successful and the page displays an alert with their name

        $(this).display = "none";
        //Redirect to the Home page
        window.location = "Home_Page.html";

      } else {
        loginState = false;

      }
    } else if (users[i].password != testPassword) {
      loginState = false;
    }
  }
  if (!loginState) {
    alert("Incorrect info.");

  }

}
function addMoviesToLibraryS(x) {
  sessionStorage.setItem("selectedMovie", x);
  console.log(x);
  //var t = sessionStorage.getItem("selectedMovie");
  //console.log("t ="+t);
}
function addMoviesToLibrary(t) {
  //when a user clicks on a movie it adds the movie info to the detailed page

  //First calling the saved data
  var str = localStorage.getItem("mArray");

  var parsedArr = JSON.parse(str);

  moviesArray = parsedArr;

  //Displaying the data
  //console.log(moviesArray[t].movieName);
  var strPoster = "<img src=" + moviesArray[t].poster + " width=\"150px\" height=\"225px\"></img>";

  $("#detailed-posterJ").append(strPoster);
  $("#detailed-movieNameJ").append(moviesArray[t].movieName);
  $("#detailed-YearJ").append(moviesArray[t].year);
  $("#detailed-directorJ").append(moviesArray[t].director);
  $("#detailed-actorsJ").append(moviesArray[t].listOfActors);
  $("#detailed-runtimeJ").append(moviesArray[t].time);
  $("#detailed-plotJ").append(moviesArray[t].plot);
  $("#detailed-ratingJ").append(moviesArray[t].rating);
  $("#detailed-genreJ").append(moviesArray[t].genre);


}

function addToWatchlist() {

  //This function adds the movie selected to a watchlist stored on the loacl storage for the user


  var str = localStorage.getItem("wArray");

  var parsedArr = JSON.parse(str);
  localWatchlist = parsedArr;
  console.log(localWatchlist);
  var selec = sessionStorage.getItem("selectedMovie")
  let isInWatch = false;
  for (let l = 0; l < localWatchlist.length; l++) {
    if (selec == localWatchlist[l]) {
      alert("Movie already added!");
      isInWatch = true;
    }
  }
  if (isInWatch == false) {
    localWatchlist.push(sessionStorage.getItem("selectedMovie"));
    var jsonWatchlistArr = JSON.stringify(localWatchlist);
    localStorage.setItem("wArray", jsonWatchlistArr);
    alert("Movie added to watchlist!");
  }




  console.log(localWatchlist);

  /*
    var tempName = sessionStorage.getItem("sName");
    var movieToAdd = sessionStorage.getItem("selectedMovie");
    localWatchlist.push(movieToAdd);
    localStorage.setItem("watching", localWatchlist);
    var tempW = localStorage.getItem("watching")
    var pos;
    console.log(tempName);
  
    for (let u = 0; u < users.length; u++) {
      if (users[u].username == tempName) {
        pos = u;
      } console.log(pos);
    }
  
    //users[pos].watchlist.push(movieToAdd);
  
    const addmovie = [movieToAdd];
  
    addmovie.push()
  
    users[pos].watchlist.push(...addmovie);
  
  
  
  
    console.log(users);
    */
  
}

function detailedPage() {
  //This function runs when the deatailed page loads and gets the stored selected movie
  var t = sessionStorage.getItem("selectedMovie");
  console.log("t =" + t);
  addMoviesToLibrary(t);
}
function showMovies() {

  //This code displays the movies on the library page by adding info to a default div 25 times
  var str = localStorage.getItem("mArray");

  var parsedArr = JSON.parse(str);
  //console.log(parsedArr);
  moviesArray = parsedArr;
  console.log("showMoviesRuns");
  console.log(moviesArray);

  //var addDiv = "<div onclick=\"addMoviesToLibrary(x)\" class=\"col\"> <div class=\"movie-card\">  <div id=\"library-image1\"> <img src=" + moviesArray[x].poster + " class='card-img-top' alt'...'></div>     <div class=\"card-body\"> <div id=\"library-title1\"><h5 class='card-title'> <a href='Detailed_Page.html'>" + moviesArray[x].movieName + " </a></h5></div> <div id=\"library-btnPlay1\"><a href='#' class='btn btn-primary'>Play</a></div><div id=\"library-btnAdd1\"> <a href='#' class='btn btn-primary'>Add</a></div>  </div>     </div> </div>";

  for (let x = 0; x < moviesArray.length; x++) {
    var addDiv = "<div onmouseenter=\"addMoviesToLibraryS(" + x + ")\" class=\"col\"> <div class=\"movie-card\">  <div id=\"library-image1\"> <img src=" + moviesArray[x].poster + " class='card-img-top' alt'...'></div>     <div class=\"card-body\"> <div id=\"library-title1\"><h5 class='card-title'> <a href='Detailed_Page.html'>" + moviesArray[x].movieName + " </a></h5></div> <div  id=\"library-btnPlay1\"><a href='Detailed_Page.html' class='btn btn-primary'>Play</a></div><div onclick  = 'addToWatchlist()' id=\"library-btnAdd1\"> <a href='#' class='btn btn-primary'>Add</a></div>  </div>     </div> </div>";
    $("#movies").append(addDiv);
  }
}
function loadWatchlist() {
  var str = localStorage.getItem("wArray");

  var parsedArr = JSON.parse(str);

  localWatchlist = parsedArr;
  console.log(localWatchlist);
  var str = localStorage.getItem("mArray");

  var parsedArr = JSON.parse(str);
  //console.log(parsedArr);
  moviesArray = parsedArr;
  for (let x = 0; x < localWatchlist.length; x++) {
    var mviePos = localWatchlist[x];



    var addDiv = "<div onmouseenter=\"addMoviesToLibraryS(" + x + ")\" class=\"col\"> <div class=\"movie-card\">  <div id=\"library-image1\"> <img src=" + moviesArray[x].poster + " class='card-img-top' alt'...'></div>     <div class=\"card-body\"> <div id=\"library-title1\"><h5 class='card-title'> <a href='Detailed_Page.html'>" + moviesArray[x].movieName + " </a></h5></div> <div  id=\"library-btnPlay1\"><a href='Detailed_Page.html' class='btn btn-primary'>Play</a></div><div onclick  = 'addToWatchlist()' id=\"library-btnAdd1\"> <a href='#' class='btn btn-primary'>Add</a></div>  </div>     </div> </div>";
    $("#watchlist-content").append(addDiv);
  }
  /*
    var tempName = sessionStorage.getItem("sName");
    for (let u = 0; u < users.length; u++) {
      if (users[u].username == tempName) {
        pos = u;
      } console.log("watchlist for user at: " + pos);
    }
    */
}

/* DROPDOWN JAVASCRIP ERIK BEGIN */
function LoadFilter() {

  const dropdowns = document.querySelectorAll('.fl-dropdown');

  dropdowns.forEach(dropdown => {

    const select = dropdown.querySelector('.fl-select');
    const caret = dropdown.querySelector('.fl-caret');
    const menu = dropdown.querySelector('.fl-menu');
    const options = dropdown.querySelectorAll('.fl-menu li');
    const selected = dropdown.querySelector('.fl-selected');


    select.addEventListener('click', () => {

      select.classList.toggle('fl-select-clicked');

      caret.classList.toggle('fl-caret-rotate');

      menu.classList.toggle('fl-menu-open');

    });


    options.forEach(option => {

      option.addEventListener('click', () => {

        selected.innerText = option.innerText;

        select.classList.remove('fl-select-clicked');

        caret.classList.remove('fl-caret-rotate');

        menu.classList.remove('fl-menu-open');

        options.forEach(option => {
          option.classList.remove('fl-active');
        });

        option.classList.add('fl-active');


      });
    });
  });

  $("#fl-all").click(function () {
    $("#movies").text("");
    showMovies();
    $(".fl-genre").text("Genre");
    $(".fl-year").text("Year");
    $(".fl-rating").text("Rating");
  })


  $("#FilterContent").click(function () {

    $("#movies").text("");
    //Here we get the selected values from the filter that the user wants to gets
    var genreselect = $(".fl-genre").text();
    var yearselect = $(".fl-year").text();
    var ratingselect = $(".fl-rating").text();

    switch (yearselect) {

      case "Year":
        yearstart = 0;
        yearend = 2022;
        break;
      case "2015-Now":
        yearstart = 2015;
        yearend = 2022;
        break;
      case "2010-2015":
        yearstart = 2010;
        yearend = 2015;
        break;
      case "2005-2010":
        yearstart = 2005;
        yearend = 2010;
        break;
      case "2000-2005":
        yearstart = 2000;
        yearend = 2005;
        break;
      case "Older then 1999":
        yearstart = 0;
        yearend = 1999;
        break;

    }

    switch (ratingselect) {

      case "Rating":
        ratingstart = 10;
        ratingend = 0;
        break;
      case "10-7":
        ratingstart = 10;
        ratingend = 7;
        break;
      case "6-4":
        ratingstart = 6;
        ratingend = 4;
        break;
      case "3-0":
        ratingstart = 3;
        ratingend = 0;
        break;

    }

    if (genreselect == "Genre") {
      genre = "";
    } else {
      genre = genreselect;
    }

    // console.log(genre);
    // console.log(yearstart, yearend);
    //console.log(ratingstart, ratingend);


    //This code displays the movies on the library page by adding info to a default div 25 times
    var str = localStorage.getItem("mArray");

    var parsedArr = JSON.parse(str);

    moviesArray = parsedArr;

    for (let x = 0; x < moviesArray.length; x++) {


      //Gets genres
      let filtermoviegenre = moviesArray[x].genre;
      //Is the genre that was selected in the list of genres in the moviesArray Genre field
      let includedgenre = filtermoviegenre.includes(genre);
      //Checks to see if the year in moviesArray.year falls in the range selected
      let yearresult = moviesArray[x].year <= yearend && moviesArray[x].year >= yearstart;
      //Checks to see if the year in moviesArray.year falls in the range selected
      let ratingresult = moviesArray[x].rating <= ratingstart && moviesArray[x].rating > ratingend;
      //Checks to see if the rating in moviesArray.rating falls in the range selected
      if ((includedgenre === true) && (yearresult === true) && (ratingresult === true)) {
        //if all is true then display the movie
        var FilterDiv = "<div onmouseenter=\"addMoviesToLibraryS(" + x + ")\" class=\"col\"> <div class=\"movie-card\">  <div id=\"library-image1\"> <img src=" + moviesArray[x].poster + " class='card-img-top' alt'...'></div>     <div class=\"card-body\"> <div id=\"library-title1\"><h5 class='card-title'> <a href='Detailed_Page.html'>" + moviesArray[x].movieName + " </a></h5></div> <div  id=\"library-btnPlay1\"><a href='Detailed_Page.html' class='btn btn-primary'>Play</a></div><div onclick  = 'addToWatchlist()' id=\"library-btnAdd1\"> <a href='#' class='btn btn-primary'>Add</a></div>  </div>     </div> </div>";
        $("#movies").append(FilterDiv);
      }

    }


  });


};


/* DROPDOWN JAVASCRIP ERIK END */
//Code was used from Bootstrap for the Carousel