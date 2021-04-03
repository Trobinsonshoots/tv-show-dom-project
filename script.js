let allShows = getAllShows();
const allShowInfoUrl = 'https://api.tvmaze.com/shows/SHOW_ID?embed[]=episodes&embed[]=cast';
const rootElem = document.getElementById('root');
const headerElem = document.getElementById('header');

(function pageSetup(){
  let searchFieldsHtml = `
  <div id='freeSearchCont' class='free-search-cont col-8 align-items-center'>
      <input id='freeSearchInput' type="text" class="form-control" placeholder="search">
      <select id='selectShow' name="" class="form-select">
        <option value="">Pick Show</option>
      </select>
  </div>
  <div id="pageHeader" class="row">
    <h1 id="pageHeaderTitle" class="col-10 offset-1"></h1>
    <div id="seasonHeader" class="col-10 offset-1">
      </div>
  </div>
  `;
  headerElem.innerHTML += searchFieldsHtml ;

  let pageSetupHtml = `
    <div id="allShowsContainer" class="container-fluid show-content">
      <div id="freeSearchResult" class="row" style="display: none">
        <h2 class="row shows-genre-headers">Search Result</h2>
        <div id="freeSearchResultShows" class="card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        </div>
      </div>
      <h2 class="row shows-genre-headers">Top Rated Shows</h2>
      <div id="topRatedShows" class="shows-genre-card-group card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2 class="row shows-genre-headers">Drama Shows</h2>
      <div id="dramaShows" class="shows-genre-card-group card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2 class="row shows-genre-headers">Comedy Shows</h2>
      <div id="comedyShows" class="shows-genre-card-group card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2 class="row shows-genre-headers">Crime Shows</h2>
      <div id="crimeShows" class="shows-genre-card-group card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2 class="row shows-genre-headers">Action Shows</h2>
      <div id="actionShows" class="shows-genre-card-group card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2 class="row shows-genre-headers">Sci-Fi Shows</h2>
      <div id="scifiShows" class="shows-genre-card-group card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
    </div>
    <div id="showContainer" class="container">
      <div id="castListSection">
        <h2 class="row cast-list-header">Cast</h2>
        <div id="castList" class="card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" style='display:none'>
        </div>
      </div>
      <h2 class="row episodes-header">Episodes</h2>
      
      <div id="seasonInputContainer" class="row" style="display:none">
        <div class="col-md-4 offset-md-1">
          <input id='input' type="text" class="input form-control">
        </div>
        
        <div class="col-md-3">
          <select class="form-select" id="seasonSelect">
          </select>
        </div>
        <div class="col-md-3">
          <select id='selectEpisode' name="" class="form-select">
            <option value="">All Episodes</option>
          </select>
        </div>
        <p id="epAmount" class="col-10 offset-md-1"></p>
      </div>
      <div id="seasonEpisodes" class="row show-content">
      </div>
    </div>
  `;
  rootElem.innerHTML = pageSetupHtml;

})();

function makeCastList(castList){
  
  console.log(castList);
  let castListDiv = document.getElementById('castList');
  castListDiv.style.display = 'flex';
  let castListDisplay = castList.map((cast) => {
        let characterName = cast && cast.character ? cast.character.name : null;
        let personName = cast.person ? cast.person.name : null;
        let personImg = cast.person && cast.person.image ? cast.person.image.medium : null;

        if (personImg === null) {
          personImg = "/images/no-picture-available.jpg";
        }
        return `
        <div class="card cast-card mb-3">
          <div class="row">
            <div class="col-md-4 cast-img-div">
              <img src="${personImg}" class="card-img-top " alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body p-0">
                <p class="character-name">${characterName}</p>
                <p class="person-name">${personName}</p>
              </div>
            </div>
          </div>
        </div>
        `
  }).join('');

  castListDiv.innerHTML = castListDisplay;
};

let freeSearchInput = document.getElementById('freeSearchInput');
const freeSearchCont = document.getElementById('freeSearchCont');
const allShowsContainer = document.getElementById('allShowsContainer');
let showContainer = document.getElementById('showContainer');
const castListSection = document.getElementById('castListSection');
let seasonInputContainer = document.getElementById('seasonInputContainer');

freeSearchInput.addEventListener('keyup', (e) => {
  const freeSearchResult = document.getElementById('freeSearchResult');
  const freeSearchResultShowsElem = document.getElementById('freeSearchResultShows');
  let freeSearchValue = e.target.value.toLowerCase();
  const filteredShows = allShows.filter(show => { 
    let showName = show.name.toLowerCase();
    let showGenres = show.genres.join(" ").toLowerCase();
    let showSummary = show.summary.toLowerCase();

    if (showName.includes(freeSearchValue) || showGenres.includes(freeSearchValue) || showSummary.includes(freeSearchValue)) {
      return show;
    };
  });

  console.log(filteredShows);
  if (freeSearchValue == ""){
    freeSearchResult.style.display = 'none';
  } else if (filteredShows == "") {
    freeSearchResult.style.display = 'flex';
    freeSearchResultShowsElem.innerHTML = `<p>No shows found </br></p>`;
  } else {
    freeSearchResultShows(filteredShows);
  }
  
  return freeSearchValue;
});

function freeSearchResultShows(shows){
  const freeSearchResult = document.getElementById('freeSearchResult');
  freeSearchResult.style.display = 'flex';
  const freeSearchResultShows = document.getElementById('freeSearchResultShows');

  let freeSearchResultShowsHtml = shows.map((show) => { 
    let showImg = show && show.image ? show.image.medium : `/images/no-picture-available.jpg`;
    return `
        <div class="card shows-genre-card">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 id="${show.id}" class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  freeSearchResultShows.innerHTML = freeSearchResultShowsHtml;

}

const changeFormSection = () => {
  if (freeSearchCont.style.display === 'flex' && seasonInputContainer.style.display === 'none') {
    freeSearchCont.style.display = 'none';
    allShowsContainer.style.display = 'none';
    castListSection.style.display = 'flex';
    seasonInputContainer.style.display = 'flex';
  }
  freeSearchCont.style.display = 'flex';
  castListSection.style.display = 'none';
  allShowsContainer.style.display = 'block';
  seasonInputContainer.style.display = 'none';
};

const getGenreListing = () => {
  let genresList = [];
  let allGenres = [];
  let showGenresObject = {};

  for (let i = 0; i < allShows.length; i++){
    let showGenres = allShows[i].genres;
    for (let j = 0; j < showGenres.length; j++){
      if (!genresList.includes(showGenres[j])){
        let currentGenre = showGenres[j];
        
        genresList.push(showGenres[j])
        showGenresObject[`${currentGenre}`] = allShows.filter((show) => {
          if(show.genres.includes(currentGenre)){
            return show
          }
        });
      }
    }
  }
  allGenres.push(showGenresObject);
  return allGenres.sort();
};

function onLoadScreen(shows) {
  freeSearchCont.style.display = 'flex';
  showContainer.style.display = 'none';
  seasonHeader.style.display = 'none';
  let pageHeaderTitle = document.getElementById('pageHeaderTitle')
  pageHeaderTitle.innerText = 'Shows';
  let topRatedShows = document.getElementById('topRatedShows');
  let dramaShows = document.getElementById('dramaShows');
  let comedyShows = document.getElementById('comedyShows');
  let crimeShows = document.getElementById('crimeShows');
  let actionShows = document.getElementById('actionShows');
  let scifiShows = document.getElementById('scifiShows');

  let topRatedShowsHtml = shows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `/images/no-picture-available.jpg`;
    return `
        <div class="card shows-genre-card">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 id="${show.id}" class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  topRatedShows.innerHTML = topRatedShowsHtml;
  
  const allShowGenres = getGenreListing();
  const allDramaShows = allShowGenres[0].Drama;
  const allComedyShows = allShowGenres[0].Comedy;
  const allCrimeShows = allShowGenres[0].Crime;
  const allActionShows = allShowGenres[0].Action;
  const allScifiShows = allShowGenres[0]['Science-Fiction'];

  let dramaShowsHtml = allDramaShows.slice([10],[20]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `/images/no-picture-available.jpg`;
    return `
        <div class="card shows-genre-card">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 id="${show.id}" class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  dramaShows.innerHTML = dramaShowsHtml;
  let comedyShowsHtml = allComedyShows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `/images/no-picture-available.jpg`;
    return `
        <div class="card shows-genre-card">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 id="${show.id}" class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  comedyShows.innerHTML = comedyShowsHtml;
  let crimeShowsHtml = allCrimeShows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `/images/no-picture-available.jpg`;
    return `
        <div class="card shows-genre-card">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 id="${show.id}" class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  crimeShows.innerHTML = crimeShowsHtml;
  let actionShowsHtml = allActionShows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `/images/no-picture-available.jpg`;
    return `
        <div class="card shows-genre-card">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 id="${show.id}" class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  actionShows.innerHTML = actionShowsHtml;
  let scifiShowsHtml = allScifiShows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `/images/no-picture-available.jpg`;
    return `
        <div class="card shows-genre-card">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 id="${show.id}" class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  scifiShows.innerHTML = scifiShowsHtml;

  selectShow(allShows);

  const logo = document.getElementById('logo');

  logo.addEventListener('click', () => {
    changeFormSection();
    showContainer.className = "row show-content"
    onLoadScreen(allShows);
  });

  loadShow();
}

function loadShow() {
  const showName = document.getElementsByClassName('show-name');

  for (let i = 0; i < showName.length; i++) {
    const clickedShow = showName[i];
    clickedShow.addEventListener('click', (e) => {
      const showClickedOn= e.target;
      const showId = showClickedOn.id;
    freeSearchCont.style.display = 'none';
    seasonInputContainer.style.display = 'flex';
    showSetup(showId);
    });
  }
};

// setup fetch to get episodes
function showSetup(id) {
  allShowsContainer.style.display = 'none';
  showContainer.style.display = 'block';
  let seasonEpisodes = document.getElementById('seasonEpisodes');
  seasonEpisodes.className = "card-group row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4";
  let allShows = getAllShows();
  let showUrl = allShowInfoUrl.replace('SHOW_ID', id);

  fetch(showUrl)
    .then((res) => {
      if (!res.ok){
        throw error (`Error Status: ` + res.status)
      }
      return res.json();
    })
    .then((data) => {
      let showInfo = data;
      let episodes = data['_embedded'].episodes;
      let cast = data['_embedded'].cast;

      seasonInfoHeader(showInfo);
      makeCastList(cast);
      seasonEpisodesSelect(episodes);
      selectEpisode(episodes);
      selectShow(allShows);
      makePageForEpisodes(episodes);
    })
    .catch((error) => console.log(error));
}

function seasonInfoHeader(show) {
  let seasonHeader = document.getElementById('seasonHeader');
  seasonHeader.style.display = 'flex';
  const pageHeader = document.getElementById('pageHeader');
  let pageHeaderTitle = document.getElementById('pageHeaderTitle');
  const showGenres = show.genres.join(' ');
  let pageHeaderHtml = `
  ${show.name} <span class="show-rating ">${show.rating.average}</span>
  </br><span class="header-show-details"><strong>Genres:</strong> ${showGenres}</span> <span class="header-show-details"><strong>Status:</strong>${show.status}</span> <span class="header-show-details"><strong>Runtime:</strong>${show.runtime}</span>
  `;
  pageHeaderTitle.innerHTML = pageHeaderHtml;
  let showImg = show.image.medium;
  const epAmount = document.createElement('p');
  epAmount.classList.add('col-md-4', 'episode-count');
  

  let showHtml = `
    <div class="row">
      <div class="col-6 offset-3 col-md-2 offset-md-0">
        <img src="${showImg}" class="card-img-top">
      </div>
      <div class="col-12 col-md-10">
        ${show.summary}
      </div>
    </div>
  `;
  seasonHeader.innerHTML = showHtml;
}

const makePageForEpisodes = (episodeLi) => {
  seasonInputContainer.style.display ="flex";
  let seasonEpisodes = document.getElementById('seasonEpisodes');
  epAmount.innerText = `Displaying ${episodeLi.length} episode(s)`;

  let htmlStr = episodeLi.map((ep, index) => {
    let summaryId = `collapse${index}`;
    let epSummary = ep.summary ? ep.summary : `<p>No summary</p>`;
    epSummary = epSummary.replaceAll('<p>', "");
    epSummary = epSummary.replaceAll('</p>', " ");
    let epSummaryHtml = `<p id="${summaryId}" class="episode-summary-text">${epSummary}</p>`;
    let img = ep && ep.image ? ep.image.medium : "/images/no-picture-available.jpg";
    let epNum = ep.number;
    let epSeason = ep.season;
    if (epNum <9) {
      epNum = `0${epNum}`;
    }
    if (epSeason < 9) {
      epSeason = `0${epSeason}`;
    }
    let dataTargetValue = `#collapse${index}`;
    
    
    

    return `
    <div class="col">
      <div class="episode-card card text-center h-100">
        <div class="card-header">
          <h2 class="card-header-text">${ep.name} - S${epSeason}E${epNum} </h2>
        </div>
        <img class="card-img-top card-img-padding" src="${img}">
        <div class="card-body col-10 offset-1 episode-summary">
          ${epSummaryHtml}
        </div>
        <button class="btn btn-danger col-12 read-more-btn" type="button" data-toggle="collapse" data-target="${dataTargetValue}" aria-expanded="false" aria-controls="collapse1">read more</button>
      </div>
    </div>
    `;
  }).join('');
  seasonEpisodes.innerHTML = htmlStr;

  addTruncateSummary();
  logo.addEventListener('click', () => {
    changeFormSection();
    showContainer.className = "row show-content"
    onLoadScreen(allShows);
  });

  let input = document.getElementById('input');

  input.addEventListener('keyup', (e) => {
    const inputStr = e.target.value.toLowerCase();
    console.log(`im input` + inputStr)

    const searchEp = episodeLi.filter((ep) => {
      console.log(ep);
      // const name = ep ? ep.name : null;
      let summary = ep ? ep.summary : null;
      if (ep.summary == null){
        summary = " "
      }

      console.log(summary);
      let nameLower = ep.name.toLowerCase();
      let summaryLower = summary.toLowerCase();

      if (nameLower.includes(inputStr) || summaryLower.includes(inputStr)) {
        return ep;
      }
    });
    makePageForEpisodes(searchEp);
  });

};

const addTruncateSummary = () => {
  let readMoreBtns = document.getElementsByClassName('read-more-btn');
  let card = document.getElementsByClassName('episode-card');
    for (let i=0; i < readMoreBtns.length; i++) {
      let currentCard = card[i];
      let nextCard = card[i+1];
      let previousCard = card[i-1];
      
    let readMore = readMoreBtns[i];

    readMore.addEventListener('click', (e) => {
      let targetAttributeId = e.target.attributes[3].value.slice(1);
      let summaryWithId = document.getElementById(targetAttributeId);
      if (summaryWithId.style.display != 'flex'){
        summaryWithId.style.display = 'flex';
        currentCard.classList.remove('h-100');
        if (i %2 == 0) {
          nextCard.classList.remove('h-100');
        } else if (i %2 !== 0) {
          previousCard.classList.remove('h-100');
        }
      } else {
        summaryWithId.style.display = '-webkit-box';
        currentCard.classList.add("h-100");
        if (i %2 == 0) {
          nextCard.classList.add('h-100');
        } else if (i %2 !== 0) {
          previousCard.classList.add('h-100');
        }
      }
    })
  };
};

const selectShow = (showList) => {
  let selectShowInput = document.getElementById('selectShow');
  let showAlphabeticalOrder = showList.map((show) => show).sort((a,b) => a.name.localeCompare(b.name));

  let showOrder = showAlphabeticalOrder.map((ep) => `<option>${ep.name}</option>`).join('');
  showOrder = `<option> Pick Show </option>` + showOrder;
  selectShowInput.innerHTML = showOrder;

  selectShowInput.addEventListener('change', (e) => {
    const showName = e.target.value;
    const showSelected = showList.filter((ep) => ep.name === showName);
    const showId = showSelected[0].id.toString();
    showSetup(showId);
  });
};

function selectEpisode(episodeList) {
  let selectEpisodeInput = document.getElementById('selectEpisode');
  let selectHtml = episodeList.map((ep) => {
    let epNum = ep.number;
    let epSeason = ep.season;
    if (epNum < 9) {
      epNum = `0${epNum}`;
    }
    if (epSeason < 9) {
      epSeason = `0${epSeason}`;
    }
    let epSE = `S${epSeason}E${epNum}`;
    return `<option>${epSE} - ${ep.name}</option>`;
  }).join('');
  selectHtml = `<option>All Episodes</option>` + selectHtml;
  selectEpisodeInput.innerHTML = selectHtml;
  // select event listener
  selectEpisodeInput.addEventListener('change', (e) => {
    let selectedEpVal = e.target.value;

    if (selectedEpVal === 'All Episodes') {
      makePageForEpisodes(episodeList);
    } else {
      selectedEpVal = selectedEpVal.split('- ', selectedEpVal.length)[1];
      const selectedEp = episodeList.filter(ep => {
        return ep.name.includes(selectedEpVal);
      });
      makePageForEpisodes(selectedEp);
    }
  });
}

function seasonEpisodesSelect(episodeList) {
  let seasonSelect = document.getElementById('seasonSelect');

  let seasonNumbers = [];
  let selectStarterOptions = `
    <option disabled="true" selected="true">Select season</option>
    <option>Show All</option>
  `;
  let showSeasonsHtml = episodeList.map((episode) => {
    let seasonNum = episode.season;

    if (!seasonNumbers.includes(`Season ${seasonNum}`)){
      console.log(seasonNum);
      seasonNumbers.push(`Season ${seasonNum}`);
      return `
      <option class="season-select-number">Season ${seasonNum}</option>
      `;
    }
  }).join('');
  seasonSelect.innerHTML = selectStarterOptions + showSeasonsHtml;
  seasonSelect.addEventListener('change', (e) => {
    let seasonSelected = e.target.value;
    seasonSelectedNumber = seasonSelected.slice(seasonSelected.length -1, seasonSelected.length);
    const seasonEpisodesList = episodeList.filter((episode) => {
      if (seasonSelected === 'Show All'){
        return episode
      }
      seasonSelectedNumber = parseInt(seasonSelectedNumber);
      if (seasonSelectedNumber === episode.season){
        return episode;
      }
    });
    makePageForEpisodes(seasonEpisodesList);
  });
}

window.onload = onLoadScreen(allShows);
