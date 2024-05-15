const entryForm = document.getElementById('search-entry');
const fetchButton = document.getElementById('fetch-button');
const genreInputEl = document.getElementById('genre');
const yearInputEl = document.getElementById('year');
const actorInputEl = document.getElementById('actor');
const directorInputEl = document.getElementById('director');
const scoreInputEl = document.getElementById('score');
const comparatorInputEl = document.getElementById('above-below');

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
    genreID:genreInputEl.value.split(':')[0],
    genreName: genreInputEl.value.split(':')[1],
    year:yearInputEl.value,
    actor:actorInputEl.value,
    director:directorInputEl.value,
    score:scoreInputEl.value,
    comparator:comparatorInputEl.value
  }

  $('#genre').val('');
  $('#year').val('');
  $('#actor').val('');
  $('#director').val('');
  $('#score').val('');
  $('#above-below').val('');

  const recentSearches = loadRecentSearches();
  recentSearches.push(searchInput);
  saveRecentSearches(recentSearches);
  displayRecentSearches();

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
    const requestUrl = `https://api.themoviedb.org/3/discover/movie?certification_country=United%20States&include_adult=false&include_video=false&language=en-US&page=1&sort_by=original_title.desc&with_genres=${searchInput.genreID}&primary_release_year=${searchInput.year}&with_cast=${searchInput.actor}&with_crew=${searchInput.director}`;
    const response = await fetch(requestUrl,options);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();

    if (data.total_results) {
      displayResults(data.results);
    }
    else {
      throw new Error(`No Results Found: ${response.status}`); 
    }
  }
  catch (error) {
    console.error(error);
    const dialog = document.querySelector("dialog");
    const closeButton = document.querySelector("dialog button");
 
    dialog.showModal();

    closeButton.addEventListener("click", () => {
      dialog.close();
      });
  }
}

// Takes the results from getAPI and displays a card for each result with the title, release date, and poster
async function displayResults(results) {
  const resultsContainer = $('#results-container');
  resultsContainer.empty();

  for (result of results) {
    const displayCard = $('<div>').addClass('rounded border-2 border-black shadow-lg mx-3 my-2 flex');
    const cardHeader = $('<div>').addClass('font-bold text-xl text-center text-wrap');
    const title = $('<h3>').text(result.title);
    const releaseDate = $('<h4>').text(result.release_date);
    const cardBody = $('<div>').addClass('px-2');
    const cardMain = $('<div>').addClass('w-3/4 flex flex-col justify-around');
    const poster = $('<img>').addClass('w-1/4 poster').attr('src', `https://image.tmdb.org/t/p/w500${result.poster_path}`);
    
    try {
      const requestOmdbUrl = `https://www.omdbapi.com/?apikey=79711389&t=${result.title}`;
      const response = await fetch(requestOmdbUrl);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      const imdbRating = data.imdbRating;
      const recentSearches = loadRecentSearches();
      const searchScore = recentSearches[(recentSearches.length - 1)].score;
      const searchComparator = recentSearches[(recentSearches.length - 1)].comparator;
      const displayScore = $('<div>').text(`IMDB Rating: ${imdbRating}`);
      let awards = data.Awards;
      if (awards === 'N/A') {
        awards = 'No award wins or nominations';
      }
      const displayAwards = $('<div>').text(awards);
      if (searchScore) {
        if (searchComparator === 'Above') {
          if (Number(imdbRating) >= Number(searchScore)) {
            cardHeader.append(title, releaseDate);
            cardBody.append(displayScore, displayAwards);
            cardMain.append(cardHeader, cardBody);
            displayCard.append(poster, cardMain);
            resultsContainer.append(displayCard);
          }
        } else if (searchComparator === 'Below') {
          if (Number(imdbRating) <= Number(searchScore)) {
            cardHeader.append(title, releaseDate);
            cardBody.append(displayScore, displayAwards);
            cardMain.append(cardHeader, cardBody);
            displayCard.append(poster, cardMain);
            resultsContainer.append(displayCard);
        }
      }
    } else if (data.Response === 'True') {
      cardHeader.append(title, releaseDate);
      cardBody.append(displayScore, displayAwards);
      cardMain.append(cardHeader, cardBody);
      displayCard.append(poster, cardMain);
      resultsContainer.append(displayCard);
      }
    }
    catch (error) {
      console.error(error);
    }
  }
}

function loadRecentSearches() {
  let recentSearches = JSON.parse(localStorage.getItem('recentSearches'));
  if (!recentSearches) {
    recentSearches = []
  }
  return recentSearches;
}

function saveRecentSearches(recentSearches) {
  if (recentSearches.length > 5) {
    recentSearches.splice(0, (recentSearches.length - 5));
  }
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

function displayRecentSearches() {
  const recentSearchesContainer = $('#recent-searches-container');
  recentSearchesContainer.empty();
  const recentSearches = loadRecentSearches();
  for (search of recentSearches) {
    const searchCard = $('<div>').addClass('my-3 flex flex-col w-1/5');
    const searchGenre = $('<p>').text(`Genre: ${search.genreName}`);
    const searchYear = $('<p>').text(`Release Year: ${search.year}`);
    const searchActor = $('<p>').text(`Actor: ${search.actor}`);
    const searchDirector = $('<p>').text(`Director: ${search.director}`);
    const searchScore = $('<p>').text(`Score: ${search.comparator + ' ' + search.score}`);

    if (search.genreName){
      searchCard.append(searchGenre);
    }
    if (search.year){
      searchCard.append(searchYear);
    }
    if (search.actor){
      searchCard.append(searchActor);
    }
    if (search.director){
      searchCard.append(searchDirector);
    }
    if (search.score){
      searchCard.append(searchScore);
    }

    recentSearchesContainer.append(searchCard);
  }
}

displayRecentSearches();

document.getElementById('mode-toggle').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  const header = document.querySelector('header');
  header.classList.toggle('dark:bg-gray-900');
});

entryForm.addEventListener('submit', getApi);