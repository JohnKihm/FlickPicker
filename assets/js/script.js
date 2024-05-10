const entryForm = document.getElementById('search-entry');
const fetchButton = document.getElementById('fetch-button');
const resultsContainer = $('#results-container');

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZWYxN2NkNWYxZjMxNjc2YTBmNzk2NDZiMDlhZDNmYyIsInN1YiI6IjY2Mzk5MGQ5MzU4ZGE3MDEyNzU3Mjc0ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8foFk9e5pco45zFAvPpjjD0zvKuDxT8VH6iGPv72W3s'
    }
  };
  
function getApi(event) {
  event.preventDefault();
  const requestUrl = 'https://api.themoviedb.org/3/discover/movie?certification_country=United%20States&with_cast=20&include_adult=false&include_video=false&language=en-US&page=1&sort_by=original_title.desc://api.themoviedb.org/3/discover/movie?';

  fetch(requestUrl,options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      console.log(data);
      
      const results = data.results;
      console.log(results);
      displayResults(results);

      // for (element of data) {
      //   const searchGenre = document.createElement('h3');
      //   const searchYear = document.createElement('p');
      //   const searchActor = document.createElement('p');
      //   const searchDirector = document.createElement('p');
      //   const searchRTScore = document.createElement('p');

      //   searchGenre.textContent = element.genre;
      //   searchYear.textContent = element.year;
      //   searchActor.textContent = element.actor;
      //   searchDirector.textContent = element.director;
      //   searchRTScore.textContent = element.rt_score;

      //   entryForm.append(searchGenre);
      //   entryForm.append(searchYear);
      //   entryForm.append(searchDirector);
      //   entryForm.append(searchActor);
      //   entryForm.append(searchRTScore);
      // }
    });
// Need .catch for errors?
//    .catch(err=>console.log(err));
}

function displayResults(results) {
  console.log(results);
  for (result of results) {
    console.log(result.title);
    const displayCard = $('<div>');
    const cardHeader = $('<div>');
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

entryForm.addEventListener('submit', getApi);
