const entryForm = document.getElementById('search-entry');
const fetchButton = document.getElementById('fetch-button');
const genreInputEl = document.getElementById('genre');
const yearInputEl = document.getElementById('year');
const actorInputEl = document.getElementById('actor');
const directorInputEl = document.getElementById('director');
const scoreInputEl = document.getElementById('score');

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZWYxN2NkNWYxZjMxNjc2YTBmNzk2NDZiMDlhZDNmYyIsInN1YiI6IjY2Mzk5MGQ5MzU4ZGE3MDEyNzU3Mjc0ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8foFk9e5pco45zFAvPpjjD0zvKuDxT8VH6iGPv72W3s'
    }
  };

  
  // The getActorid function allows the entry of an Actor name, returns the actor's IMDB ID#, and passes the ID# to the getAPI fun

  function getActorid (actorName) {
       
//     fetch(requestUrl,options)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
      
//       console.log(data);
// })
}

function getApi(event) {
    event.preventDefault();
  
    getActorid();

  const searchInput = {
    genre:genreInputEl.value,
    year:yearInputEl.value,
    actor:actorInputEl.value,
    director:directorInputEl.value,
    score:scoreInputEl.value
  }
  const requestActorUrl = `https://api.themoviedb.org/3/search/person?query=${searchInput.actor}&api_key=7ef17cd5f1f31676a0f79646b09ad3fc`
 
  fetch(requestActorUrl,options)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
      
      console.log(data.results[0].id);
      const actorId = data.results[0].id;
      
      const requestUrl = `https://api.themoviedb.org/3/discover/movie?certification_country=United%20States&include_adult=false&include_video=false&language=en-US&page=1&sort_by=original_title.desc&with_genres=${searchInput.genre}&primary_release_year=${searchInput.year}&with_cast=${actorId}://api.themoviedb.org/3/discover/movie?`;
      
      fetch(requestUrl,options)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          
          console.log(data);
          displayResults(data.results);
})

      


    //   for (element of data) {
    //     const searchGenre = document.createElement('h3');
    //     const searchYear = document.createElement('p');
    //     const searchActor = document.createElement('p');
    //     const searchDirector = document.createElement('p');
    //     const searchRTScore = document.createElement('p');

    //     searchGenre.textContent = element.genre;
    //     searchYear.textContent = element.year;
    //     searchActor.textContent = element.actor;
    //     searchDirector.textContent = element.director;
    //     searchRTScore.textContent = element.rt_score;

    //     entryForm.append(searchGenre);
    //     entryForm.append(searchYear);
    //     entryForm.append(searchDirector);
    //     entryForm.append(searchActor);
    //     entryForm.append(searchRTScore);
    //   }
    });
// Need .catch for errors?
//    .catch(err=>console.log(err));
}

// Takes the results from getAPI and displays a card for each result with the title, release date, and poster
function displayResults(results) {
  const resultsContainer = $('#results-container');
  resultsContainer.empty();

  for (result of results) {
    console.log(result.title);
    const displayCard = $('<div>').addClass('rounded overflow-hidden shadow-lg mx-3');
    const cardHeader = $('<div>').addClass('font-bold text-xl text-center text-wrap');
    const title = $('<h3>').text(result.title);
    const releaseDate = $('<h4>').text(result.release_date);
    const cardBody = $('<div>');
    const poster = $('<img>').addClass('poster').attr('src', `https://image.tmdb.org/t/p/w500${result.poster_path}`);

    cardHeader.append(title, releaseDate);
    cardBody.append(poster);
    displayCard.append(cardHeader, cardBody);
    resultsContainer.append(displayCard);
  }
}

document.getElementById('mode-toggle').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  const header = document.querySelector('header');
  header.classList.toggle('dark:bg-gray-900');
});
entryForm.addEventListener('submit', getApi);


