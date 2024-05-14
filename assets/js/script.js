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

// The getID function allows the entry of a name, returns the person's IMDB ID#, and passes the ID# to the getAPI function
async function getID (name) {
  try {
    const requestUrl = `https://api.themoviedb.org/3/search/person?query=${name}&api_key=7ef17cd5f1f31676a0f79646b09ad3fc`;
    const response = await fetch(requestUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data.results[0].id;
  }
  catch (error) {
    console.error(error);
  }
}

async function getApi(event) {
    event.preventDefault();

  const searchInput = {
    genre:genreInputEl.value,
    year:yearInputEl.value,
    actor:actorInputEl.value,
    director:directorInputEl.value,
    score:scoreInputEl.value
  }

  if (!searchInput.actor) {
    searchInput.actor = '';
  } else {
    searchInput.actor = await getID(searchInput.actor);
  }

  if (!searchInput.director) {
    searchInput.director = '';
  } else {
    searchInput.director = await getID(searchInput.director);
  }

  try {
    const requestUrl = `https://api.themoviedb.org/3/discover/movie?certification_country=United%20States&include_adult=false&include_video=false&language=en-US&page=1&sort_by=original_title.desc&with_genres=${searchInput.genre}&primary_release_year=${searchInput.year}&with_cast=${searchInput.actor}&with_crew=${searchInput.director}`;
    console.log(requestUrl);
    const response = await fetch(requestUrl,options);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    displayResults(data.results);
  }
  catch (error) {
    console.error(error);
  }
}
// Need .catch for errors?
//    .catch(err=>console.log(err));


// Takes the results from getAPI and displays a card for each result with the title, release date, and poster
async function displayResults(results) {
  const resultsContainer = $('#results-container');
  resultsContainer.empty();

  for (result of results) {
    const displayCard = $('<div>').addClass('rounded overflow-hidden shadow-lg mx-3');
    const cardHeader = $('<div>').addClass('font-bold text-xl text-center text-wrap');
    const title = $('<h3>').text(result.title);
    const releaseDate = $('<h4>').text(result.release_date);
    const cardBody = $('<div>');
    const poster = $('<img>').addClass('poster').attr('src', `https://image.tmdb.org/t/p/w500${result.poster_path}`);
    
    try {
      const requestOmdbUrl = `http://www.omdbapi.com/?apikey=79711389&t=${result.title}`;
      const response = await fetch(requestOmdbUrl);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      const awards = $('<div>').text(data.Awards);

      cardBody.append(awards);
      //console.log(data.results[0].id);
      //return data.results[0].id;
    }
    catch (error) {
      console.error(error);
    }
    


    cardHeader.append(title, releaseDate);
    cardBody.append(poster);
    displayCard.append(cardHeader, cardBody);
    resultsContainer.append(displayCard);
    

  }
}


entryForm.addEventListener('submit', getApi);
