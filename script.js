// let fetchUrl =  ;
// let emptyUrl = ;

let allEpisodes = getAllEpisodes();
let allShows = getAllShows();
const rootElem = document.getElementById('root');

// Make free search
let inputField = (function () { 
  return `
    <div id='freeSearchCont' class='free-search-cont row align-items-center'>
      <div class="col-auto">
        <label class="col-form-label" >Search</label>
      </div>
      <div class="col-auto">
        <input id='freeSearchInput' type="text" class="form-control">
      </div>
    </div>
    <div id='episodesFormSection' class="form row g-3 align-items-center" style='display:none'>
      <div class="col-md-5">
        <select id='selectShow' name="" id="" class="form-select">
          <option value="">Pick Show</option>
        </select>
      </div>
      <div class="col-md-5">
        <select id='selectEpisode' name="" id="" class="form-select">
          <option value="">All Episodes</option>
        </select>
      </div>
      <div class="col-md-3">
        <input id='input' type="text" class="input form-control">
      </div>
      <p id='epAmount'></p>
    </div>
    <div id="row-cont" class="row show-content">
    </div>
  `;
})();

(makeFreeSearchInput = function () {
  return rootElem.innerHTML = inputField;
})();

let freeSearchInput = document.getElementById('freeSearchInput');
const freeSearchCont = document.getElementById('freeSearchCont');
const episodesFormSection =document.getElementById('episodesFormSection');
let rowCont = document.getElementById('row-cont');

freeSearchInput.addEventListener('keyup', (e) => {
    let freeSearchValue = e.target.value.toLowerCase();
    console.log(e.target.value);

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
  }
  freeSearchCont.style.display = 'flex';
  episodesFormSection.style.display = 'none';
};

// Make Main Screen
const onLoadScreen = (showsListing) => {
  const htmlShowStr = showsListing.map((show) => {
    const img = show && show.image ? show.image.medium : null;
    const showGenres = show.genres.join(' ');
    const showName = `<h2 id="${show.id}" class=" card-header-text-main-page show-name">${show.name} <span class="show-rating">${show.rating.average} </span></h2>`;
    return `
      <div class="row h-100">
        <div class="col-md-3">
        <img class="card-img-top" src="${img}">
        </div>
        <div class="col-md-9"> 
            <div class="card-header">
            ${showName} <span class="header-show-details"><strong>Genres:</strong> ${showGenres}</span> <span class="header-show-details"><strong>Status:</strong>${show.status}</span> <span class="header-show-details"><strong>Runtime:</strong>${show.runtime}</span>
            </div>
            <div class="card-body">
            ${show.summary}
            </div>
        </div>
      </div>
        `;
  }).join('');
  rowCont.innerHTML = htmlShowStr;

  loadShow();
};

function loadShow() {
  const showName = document.getElementsByClassName('show-name');

  for (let i = 0; i < showName.length; i++) {
    const clickedShow = showName[i];
    clickedShow.addEventListener('click', (e) => {
      const showClickedOn= e.target;
      const showId = showClickedOn.id;
      const showsUrl = 'https://api.tvmaze.com/shows/SHOW_ID/episodes';
      const showUrl = showsUrl.replace('SHOW_ID', showId);

    freeSearchCont.style.display = 'none';
    episodesFormSection.style.display = 'flex';
    rowCont.className = "card-group row row-cols-1 row-cols-md-3 g-4";
    episodeSetup(showUrl);
    });
  }
};

// setup fetch to get episodes
function episodeSetup(url) {
  let allShows = getAllShows();
  fetch(url)
    .then((res) => {
      if (!res.ok){
        throw error(`Error Status: ` + res.status);
      }
      return res.json();
    })
    .then((data) => {
      let allEpisodes = data;
      const epAmount = document.createElement('p');
      epAmount.classList.add('col-md-4', 'episode-count')
      let input = document.getElementById('input');
      let selectEpisode = document.getElementById('selectEpisode');

      makePageForEpisodes(allEpisodes);
      selectSh(allShows);
      selectEp(allEpisodes);
      const logo = document.getElementById('logo');

      logo.addEventListener('click', (e) => {
        changeFormSection();
        rowCont.className = "row show-content"
        onLoadScreen(allShows);
      });

      input.addEventListener('keyup', (e) => {
        const inputStr = e.target.value.toLowerCase();
        console.log(`im input` + inputStr)
      
        const searchEp = allEpisodes.filter((ep) => {
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
});

// make episodes page
const makePageForEpisodes = (episodeLi) => {
  console.log(episodeLi);
  epAmount.innerText = `Displaying ${episodeLi.length} episode(s)`;

  let htmlStr = episodeLi.map((ep) => {
    const img = ep && ep.image ? ep.image.medium : null;
    let epNum = ep.number;
    let epSeason = ep.season;
    if (epNum <9) {
      epNum = `0${epNum}`;
    }
    if (epSeason < 9) {
      epSeason = `0${epSeason}`;
    }

    return `
    <div class="col">
      <div class="card text-center h-100">
        <div class="card-header">
          <h2 class="card-header-text">${ep.name} - S${epSeason}E${epNum} </h2>
        </div>
        <img class="card-img-top" src="${img}">
        <div class="card-body col-10 offset-1">
          ${ep.summary}
        </div>
      </div>
    </div>
    `;
  }).join('');
  rowCont.innerHTML = htmlStr;
};

// Make shows select option
const selectSh = (showList) => {
  let showAlphabeticalOrder = showList.sort((a,b) => a.name.localeCompare(b.name));

  let showOrder = showAlphabeticalOrder.map((ep) => `<option>${ep.name}</option>`).join('');
  showOrder = `<option> Pick Show </option>` + showOrder;
  selectShow.innerHTML = showOrder;

  selectShow.addEventListener('change', (e) => {
    const showName = e.target.value;
    const showSelected = showList.filter((ep) => ep.name === showName);

    console.log(showSelected);

    const showId = showSelected[0].id.toString();
    const showUrl = 'https://api.tvmaze.com/shows/SHOW_ID/episodes';
    const newShowUrl = showUrl.replace('SHOW_ID', showId);

    console.log(newShowUrl);

    episodeSetup(newShowUrl);
  });
};

// make episode select option
function selectEp(epList) {
  let selectHtml = epList.map((ep) => {
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
  selectEpisode.innerHTML = selectHtml;
  // select event listener
  selectEpisode.addEventListener('change', (e) => {
    let selectedEpVal = e.target.value;
    console.log(selectedEpVal);

    if (selectedEpVal === 'All Episodes') {
      makePageForEpisodes(epList);
    } else {
      selectedEpVal = selectedEpVal.split('- ', selectedEpVal.length)[1];
      console.log(selectedEpVal);
      const selectedEp = epList.filter(ep => {
        return ep.name.includes(selectedEpVal);
      });
      console.log(selectedEp);
      makePageForEpisodes(selectedEp);
    }
  });
}
}

window.onload = onLoadScreen(allShows);
