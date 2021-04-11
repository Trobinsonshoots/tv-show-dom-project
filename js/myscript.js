// let fetchUrl = ;
// let emptyUrl = ;

const seasonsUrl = 'http://api.tvmaze.com/shows/SHOW_ID/seasons';
const episodesUrl = 'http://api.tvmaze.com/shows/1/episodes';

let allEpisodes = getAllEpisodes();
let allShows = getAllShows();
let allSeasons = getAllSeasons();
let allCast = getAllCast();
let getShow = getShowInfo();

const rootElem = document.getElementById('root');
const headerElem = document.getElementById('header');

(function pageSetup(){
  let searchFieldsHtml = `
  <div id='freeSearchCont' class='free-search-cont col-3 align-items-center'>
  <div class="col-auto">
    <label class="col-form-label" >Search</label>
  </div>
  <div class="col-auto">
    <input id='freeSearchInput' type="text" class="form-control">
  </div>
</div>

<div id='episodesFormSection' class="form row g-3 align-items-center" style='display:none'>
  <div class="col-md-5">
    <select id='selectShow' name="" class="form-select">
      <option value="">Pick Show</option>
    </select>
  </div>
  <div class="col-md-3">
    <input id='input' type="text" class="input form-control">
  </div>
  
  <p id='epAmount'></p>
</div>
<div id="pageHeader" class="row">
  <h1 id="pageHeaderTitle"></h1>
</div>
  `;

  headerElem.innerHTML += searchFieldsHtml ;

  let pageSetupHtml = `
    <div id="allShowsContainer" class="container-fluid show-content">
      <h2>Top Rated Shows</h2>
      <div id="topRatedShows" class="card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2>Drama Shows</h2>
      <div id="dramaShows" class="card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2>Comedy Shows</h2>
      <div id="comedyShows" class="card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2>Crime Shows</h2>
      <div id="crimeShows" class="card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2>Action Shows</h2>
      <div id="actionShows" class="card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2>Adventure Shows</h2>
      <div id="adventureShows" class="card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
      <h2>Sci-Fi Shows</h2>
      <div id="scifiShows" class="card-group row flex-nowrap row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      </div>
    </div>
    <div id="showContainer" class="container">
      <div id="seasonHeader" class="row">
      </div>
      <div id="castList" class="card-group flex-nowrap" style='display:none'>
      </div>
      <div id="seasonInputContainer" class="row" style="display:none">
        <div class="col-md-5">
          <select class="form-select" id="seasonSelect">
          </select>
        </div>
        <div class="col-md-5">
          <select id='selectEpisode' name="" class="form-select">
            <option value="">All Episodes</option>
          </select>
        </div>
      </div>
      <div id="seasonEpisodes" class="row show-content">
      </div>
    </div>
  `;
  rootElem.innerHTML = pageSetupHtml;
})();


function makeCastList(castList){
  // let rootElem = document.getElementById('root');
  let castListDiv = document.getElementById('castList');
  let castListDisplay = castList.map((cast) => {
        let characterName = cast.character.name;
        let personName = cast.person.name;
        let personImg = cast.person.image.medium;
        return `
        <div class="card cast-card" style="min-width: 13rem;">
          <div class="col-6">
            <img src="${personImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body">
            <h5 class="card-title">${personName}</h5>
            <p class="card-text">${characterName}</p>
          </div>
        </div>
        `
  }).join('');

  castListDiv.innerHTML = castListDisplay;
};

let freeSearchInput = document.getElementById('freeSearchInput');
const freeSearchCont = document.getElementById('freeSearchCont');
const episodesFormSection = document.getElementById('episodesFormSection');
const castListSection = document.getElementById('castList');
let allShowsContainer = document.getElementById('allShowsContainer');
let showContainer = document.getElementById('showContainer');
let seasonInputContainer = document.getElementById('seasonInputContainer');
let showPopUpDiv = document.getElementById('showPopUp');

freeSearchInput.addEventListener('keyup', (e) => {
    let freeSearchValue = e.target.value.toLowerCase();

    const filteredShows = allShows.filter(show => { 
      let showName = show.name.toLowerCase();
      let showGenres = show.genres.join(" ").toLowerCase();
      let showSummary = show.summary.toLowerCase();
  
      if (showName.includes(freeSearchValue) || showGenres.includes(freeSearchValue) || showSummary.includes(freeSearchValue)) {
        return show;
      };
    });
    onLoadScreen(filteredShows);
  return freeSearchValue;
});

const changeFormSection = () => {
  if (freeSearchCont.style.display === 'flex' && episodesFormSection.style.display === 'none') {
    freeSearchCont.style.display = 'none';
    episodesFormSection.style.display = 'flex';
    castListSection.style.display = 'flex';
    seasonInputContainer.style.display = 'flex';
  }
  freeSearchCont.style.display = 'flex';
  episodesFormSection.style.display = 'none';
  castListSection.style.display = 'none';
  allShowsContainer.style.display = 'flex';
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

// console.log(getGenreListing());

function startUp(shows) {
  showPopUpDiv.style.display = 'none';
  let pageHeaderTitle = document.getElementById('pageHeaderTitle')
  pageHeaderTitle.innerText = 'Shows';
  let topRatedShows = document.getElementById('topRatedShows');
  let dramaShows = document.getElementById('dramaShows');
  let comedyShows = document.getElementById('comedyShows');
  let crimeShows = document.getElementById('crimeShows');
  let actionShows = document.getElementById('actionShows');
  let adventureShows = document.getElementById('adventureShows');
  let scifiShows = document.getElementById('scifiShows');

  let topRatedShowsHtml = shows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `images/no-picture-available.jpg`;
    return `
        <div class="card top-rated-card" style="min-width: 13rem;">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 class="card-title show-name">${show.name}</h5>
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
  const allAdventureShows = allShowGenres[0].Adventure;
  const allScifiShows = allShowGenres[0]['Science-Fiction'];

  let dramaShowsHtml = allDramaShows.slice([10],[20]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `images/no-picture-available.jpg`;
    return `
        <div class="card top-rated-card" style="min-width: 13rem;">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  dramaShows.innerHTML = dramaShowsHtml;
  let comedyShowsHtml = allComedyShows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `images/no-picture-available.jpg`;
    return `
        <div class="card top-rated-card" style="min-width: 13rem;">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  comedyShows.innerHTML = comedyShowsHtml;
  let crimeShowsHtml = allCrimeShows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `images/no-picture-available.jpg`;
    return `
        <div class="card top-rated-card" style="min-width: 13rem;">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  crimeShows.innerHTML = crimeShowsHtml;
  let actionShowsHtml = allActionShows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `images/no-picture-available.jpg`;
    return `
        <div class="card top-rated-card" style="min-width: 13rem;">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  actionShows.innerHTML = actionShowsHtml;
  let adventureShowsHtml = allAdventureShows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `images/no-picture-available.jpg`;
    return `
        <div class="card top-rated-card" style="min-width: 13rem;">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  adventureShows.innerHTML = adventureShowsHtml;
  let scifiShowsHtml = allScifiShows.slice([0],[10]).map((show) => { 
    let showImg = show && show.image ? show.image.medium : `images/no-picture-available.jpg`;
    return `
        <div class="card top-rated-card" style="min-width: 13rem;">
          <div class="col-10">
            <img src="${showImg}" class="card-img-top " alt="...">
          </div>
          <div class="card-body p-0">
            <h5 class="card-title show-name">${show.name}</h5>
            <p class="card-text">${show.rating.average}</p>
          </div>
        </div>
        `
  }).join('');
  scifiShows.innerHTML = scifiShowsHtml;

  const logo = document.getElementById('logo');

logo.addEventListener('click', () => {
  changeFormSection();
  showContainer.className = "row show-content"
  startUp(allShows);
});

  loadSeries();
}

// Make Main Screen
function onLoadScreen(showsListing){
  let pageHeaderTitle = document.getElementById('pageHeaderTitle')
  pageHeaderTitle.innerText = 'Shows';

  let showAlphabeticalOrder = showsListing.sort((a,b) => a.name.localeCompare(b.name));
  let allShowsContainer = document.getElementById('allShowsContainer')
  const htmlShowStr = showAlphabeticalOrder.map((show) => {
    const img = show && show.image ? show.image.medium : 'images/no-picture-available.jpg';
    const showGenres = show.genres.join(' ');
    const showName = `<h2 id="${show.id}" class=" card-header-text-main-page show-name">${show.name} <span class="show-rating">${show.rating.average} </span></h2>`;
    return `
      <div class="col-12 show-card-container">
        <div class="row justify-content-center">
          <div class="show-card-header show-card-header-small">
          ${showName} <span class="header-show-details"><strong>Genres: </strong> ${showGenres}</span> <span class="header-show-details"><strong>Status: </strong>${show.status}</span> <span class="header-show-details"><strong>Runtime: </strong>${show.runtime}</span>
          </div>

          <div class="col-6 col-md-3">
            <img class="card-img-top card-img-padding" src="${img}">
          </div>

          <div class="col-md-9 "> 
            <div class="show-card-header show-card-header-medium">
            ${showName} <span class="header-show-details"><strong>Genres: </strong> ${showGenres}</span> <span class="header-show-details"><strong>Status: </strong>${show.status}</span> <span class="header-show-details"><strong>Runtime: </strong>${show.runtime}</span>
            </div>

            <div class="card-body show-summary">
            ${show.summary}
            </div>
          </div>
        </div>
      </div>
        `;
  }).join('');
  allShowsContainer.innerHTML = htmlShowStr;

const logo = document.getElementById('logo');

logo.addEventListener('click', () => {
  changeFormSection();
  showContainer.className = "row show-content"
  startUp(allShows);
});

  loadSeries();
};

function loadSeries() {
  const showName = document.getElementsByClassName('show-name');

  for (let i = 0; i < showName.length; i++) {
    const clickedShow = showName[i];
    clickedShow.addEventListener('click', (e) => {
      const showClickedOn = e.target;
      const showId = showClickedOn.id;
      const selectedShowSeasons = seasonsUrl.replace('SHOW_ID', showId);
      const selectedShowEpisodes = episodesUrl.replace('SHOW_ID', showId);

      freeSearchCont.style.display = 'none';
      episodesFormSection.style.display = 'flex';
      castListSection.style.display = 'flex';
      pageHeaderTitle.style.display = 'none';
      showPopUpDiv.style.display = 'block';

      // for APi replace below with seasonsSetup(selectedShowSeasons, selectedShowEpisodes);
      showPopUp(getShow);
      // showSetup(getShow, allCast, allEpisodes);
    });
  }

  // castListSection.style.display = 'flex';
  // makeCastList(allCast);
  // showSelect(allShows);
  // episodeSelect(allEpisodes);
  // seasonEpisodesSelect(allEpisodes);
};

function closeShowPopUp() {
  document.getElementById('showPopUpClose').addEventListener('click', (e) => {
    e.preventDefault
    showPopUpDiv.style.display = 'none';
  });
}

function showPopUpBtn(show) {
  document.getElementById('showPopUpBtn').addEventListener('click', (e) => {
    console.log(e);
    console.log(show);
    showPopUpDiv.style.display = 'none';
    showSetup(getShow, allCast, allEpisodes);
  })
}

function showPopUp(show) {
  let seasonHeader = document.getElementById('seasonHeader');
  let showId = show[0].id;
  let showImg = show[0].image.medium;
  let showGenres = show[0].genres.join(' ');
  let showHtml = `
    <div class="col-12 season-header-title show-pop-up-header">
    <div class="row justify-content-end">
      <i id="showPopUpClose" class="col-1 clickable far fa-times-circle"></i>
    </div>
      <div class="row">
        <div class="col-3">
          <img src="${showImg}" class="card-img-top">
        </div>
      
        <div class="col-9 col-md-9">
          <h2 class="col-md-12"> ${show[0].name}</h2>
          <div class="row">
            <span class="col-12 header-show-details"><strong>Genres: </strong> ${showGenres}</span> <span class="col-12 header-show-details"><strong>Status: </strong>${show[0].status}</span> <span class="col-12 header-show-details"><strong>Runtime: </strong>${show[0].runtime}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="show-summary-text col-10 offset-1">
        ${show[0].summary}
        <button id="showPopUpBtn" class="btn btn-danger col-8 offset-2" type"button">Go To Show</button>
      </div>
    </div>
    `;
  seasonHeader.innerHTML = showHtml;
  showPopUpBtn(showId);
  closeShowPopUp();
}



function showSetup(show, cast, episodes) {
  // makeCastList(allCast);
  // castListSection.style.display = 'flex';
  allShowsContainer.style.display = 'none';
  let showImg = show[0].image.medium;
  let showGenres = show[0].genres.join(' ');
  const epAmount = document.createElement('p');
  epAmount.classList.add('col-md-4', 'episode-count');
  let seasonHeader = document.getElementById('seasonHeader');

  let showHtml = `
    <div class="col-12 season-header-title">
      <h2> ${show[0].name}</h2>
          <span class="header-show-details"><strong>Genres: </strong> ${showGenres}</span> <span class="header-show-details"><strong>Status: </strong>${show[0].status}</span> <span class="header-show-details"><strong>Runtime: </strong>${show[0].runtime}</span>
    </div>
    <div class="row">
      <div class="col-6 offset-3 col-md-2 offset-md-0">
        <img src="${showImg}" class="card-img-top">
      </div>
      <div class="col-md-10">
        ${show[0].summary}
      </div>
    </div>
    `;
  seasonHeader.innerHTML = showHtml;
  makeCastList(cast);
  makePageForEpisodes(episodes);
}

function seasonEpisodesSelect(episodeList) {
  let seasonSelect = document.getElementById('seasonSelect');
  const showAllSeasonEpisodesOption = document.createElement("option");
  showAllSeasonEpisodesOption.innerText = 'Seasons';
  seasonSelect.append(showAllSeasonEpisodesOption);

  let seasonNumbers = [];
  for (let i = 0; i < episodeList.length; i++) {
    let seasonNum = episodeList[i].season;
    if (!seasonNumbers.includes(`Season ${seasonNum}`)){
      seasonNumbers.push(`Season ${seasonNum}`);
      let createOption = document.createElement('option');
      createOption.innerText = `Season ${seasonNum}`;
      createOption.className = "season-select-number"
      seasonSelect.append(createOption);
    }
  }

  seasonSelect.addEventListener('change', (e) => {
    let seasonSelected = e.target.value;
    seasonSelectedNumber = seasonSelected.slice(seasonSelected.length -1, seasonSelected.length);
    const seasonEpisodesList = episodeList.filter((episode) => {
      if (seasonSelected === 'Seasons'){
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

const makePageForEpisodes = (episodeLi) => {
  seasonInputContainer.style.display ="flex";
  let seasonEpisodes = document.getElementById('seasonEpisodes');
  seasonEpisodes.className = "card-group row row-cols-1 row-cols-md-2 g-4";
  epAmount.innerText = `Displaying ${episodeLi.length} episode(s)`;

  let htmlStr = episodeLi.map((ep, index) => {
    let epNum = ep.number;
    let epSeason = ep.season;
    if (epNum <9) {
      epNum = `0${epNum}`;
    }
    if (epSeason < 9) {
      epSeason = `0${epSeason}`;
    }
    let dataTargetValue = `#collapse${index}`;
    let summaryId = `collapse${index}`;

    let epSummaryHtml = ep.summary.replace('<p>', `<p id="${summaryId}" class="episode-summary-text">` )

    return `
    <div class="col">
      <div class="episode-card card text-center h-100">
        <div class="card-header">
          <h2 class="card-header-text">${ep.name} - S${epSeason}E${epNum} </h2>
        </div>
        <img class="card-img-top card-img-padding" src="${ep.image.medium}">
        <div class="card-body col-10 offset-1 episode-summary">
          ${epSummaryHtml}
        </div>
        <button class="btn btn-primary col-12 read-more-btn" type="button" data-toggle="collapse" data-target="${dataTargetValue}" aria-expanded="false" aria-controls="collapse1">read more</button>
      </div>
    </div>
    `;
  }).join('');
  seasonEpisodes.innerHTML = htmlStr;

  addTruncateSummary();
  logo.addEventListener('click', () => {
    changeFormSection();
    showContainer.className = "row show-content"
    startUp(allShows);
  });
};


const addTruncateSummary = () => {
  let readMoreBtns = document.getElementsByClassName('read-more-btn');
  let card = document.getElementsByClassName('episode-card');
    for (let i=0; i < readMoreBtns.length; i++) {
      let currentCard = card[i];
      
    let readMore = readMoreBtns[i];

    readMore.addEventListener('click', (e) => {
      let targetAttributeId = e.target.attributes[3].value.slice(1);
      let summaryWithId = document.getElementById(targetAttributeId);
      if (summaryWithId.style.display != 'flex'){
        summaryWithId.style.display = 'flex';
        currentCard.classList.remove('h-100');
        if (i %2 == 0) {
          card[i+1].classList.remove('h-100');
        } else if (i %2 !== 0) {
          card[i-1].classList.remove('h-100');
        }
      } else {
        summaryWithId.style.display = '-webkit-box';
        currentCard.classList.add("h-100");
        if (i %2 == 0) {
          card[i+1].classList.add('h-100');
        } else if (i %2 !== 0) {
          card[i-1].classList.add('h-100');
        }
      }
    })
  };
}

const showSelect = (showList) => {
  let showAlphabeticalOrder = showList.map((show)=> show).sort((a,b) => a.name.localeCompare(b.name));

  let showOrder = showAlphabeticalOrder.map((ep) => `<option>${ep.name}</option>`).join('');
  showOrder = `<option> Pick Show </option>` + showOrder;
  selectShow.innerHTML = showOrder;

  selectShow.addEventListener('change', (e) => {
    const showName = e.target.value;
    const showSelected = showList.filter((ep) => ep.name === showName);

    const showId = showSelected[0].id.toString();
    fetchUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

    makePageForEpisodes(showSelected);
  });
};

const episodeSelect = (epList) => {
  let selectHtml = epList.map((ep) => {
    let epNum = ep.number;
    let epSeason = ep.season;
    if (epNum <9) {
      epNum = `0${epNum}`;
    }
    if (epSeason < 9) {
      epSeason = `0${epSeason}`;
    }
    let epSE = `S${epSeason}E${epNum}`;
    return `<option>${epSE} - ${ep.name}</option>`;
  }).join('');
  selectHtml = `<option>All Episodes</option>` + selectHtml;
  selectEpisode.innerHTML = selectHtml;
// select event listener
  selectEpisode.addEventListener('change', (e) => {
    let selectedEpVal = e.target.value;

    if (selectedEpVal === 'All Episodes') {
      makePageForEpisodes(allEpisodes);
    } else {
      selectedEpVal = selectedEpVal.split('- ',selectedEpVal.length)[1];

      const selectedEp = allEpisodes.filter(ep => {
        return ep.name.includes(selectedEpVal);
      });
      makePageForEpisodes(selectedEp);
    }
  });
};

window.onload = startUp(allShows);

// const makePageForSeasons = (seasonsList) => {
//   epAmount.innerText = `Displaying ${seasonsList.length} episode(s)`;

//   let htmlStr = seasonsList.map((season) => {
//     let seasonSummary = season.summary;
//     if (seasonSummary === null) {
//       seasonSummary = "";
//     }
//     return `
//     <div class="col">
//       <div class="card text-center h-100">
//         <div class="card-header">
//           <h2 id='${season.id}' class="card-header-text season-number">Season ${season.number}</h2>
//         </div>
//         <img class="card-img-top" src="${season.image.medium}">
//         <div class="card-body col-10 offset-1">
//           ${seasonSummary}
//         </div>
//       </div>
//     </div>
//     `;
//   }).join('');
//   showContainer.innerHTML = htmlStr;

//   let seasonNumber = document.getElementsByClassName('season-number');

//   for (let i = 0; i < seasonNumber.length; i++) {
//     let seasonNumber = document.getElementsByClassName('season-number');
//     seasonNumber[i].addEventListener('click', (e) => {
//       seasonSelected = e.target.innerText;
//       seasonSelectedNumber = seasonSelected.slice(seasonSelected.length -1, seasonSelected.length );
      
//       const seasonEpisodes = allEpisodes.filter((episode) => {
//         let episodeCheck = episode.season;
//         seasonSelectedNumber = parseInt(seasonSelectedNumber);
//         if (seasonSelectedNumber === episode.season){
//           return episode;
//         }
//       })
//       makePageForEpisodes(seasonEpisodes);
//     })
//   }  
// };