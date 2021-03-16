// const getData = 


const rowCont = document.getElementById('row-cont');
const epAmount = document.createElement('p');
epAmount.classList.add('col-md-4', 'episode-count');
const input = document.getElementById('input');
const selectShow = document.getElementById('selectShow');
const selectEpisode = document.getElementById('selectEpisode');
input.parentElement.insertAdjacentElement('afterend', epAmount);

// const onLoadScreen = (showsListing) => {

//   let htmlShowStr = showsListing.map((show) => {
//     // console.log(typeof show);
//     let img = show  && show.image ? show.image.medium : null;

//     return `
//       <div class="col">
//         <div class="card text-center h-100">
//           <div class="card-header">
//             <h2 class="card-header-text">${show.name}</h2>
//           </div>
//           <img class="card-img-top" src="${img}">
//           <div class="card-body col-10 offset-1">
//             ${show.summary}
//           </div>
//         </div>
//       </div>
//       `;
//   }).join('');

//   rowCont.innerHTML = htmlShowStr;
  
// };

// const makePageForEpisodes = (episodeLi) => {
//   epAmount.innerText = `Displaying ${episodeLi.length} episode(s)`;
//   const htmlStr = episodeLi.map((ep) => {
//     let epNum = ep.number;
//     let epSeason = ep.season;
//     if (epNum <9) {
//       epNum = `0${epNum}`;
//     }
//     if (epSeason < 9) {
//       epSeason = `0${epSeason}`;
//     }
//     return `
//     <div class="col">
//       <div class="card text-center h-100">
//         <div class="card-header">
//           <h2 class="card-header-text">${ep.name} - S${epSeason}E${epNum} </h2>
//         </div>
//         <img class="card-img-top" src="${ep.image.medium}">
//         <div class="card-body col-10 offset-1">
//           ${ep.summary}
//         </div>
//       </div>
//     </div>
//     `;
//   }).join('');
//   rowCont.innerHTML = htmlStr;
// };

// const selectSh = (showList) => {
//   let showAlphabeticalOrder = showList.sort((a,b) => a.name.localeCompare(b.name));

//   let showOrder = showAlphabeticalOrder.map((ep) => `<option>${ep.name}</option>`).join('');
//   showOrder = `<option> Pick Show </option>` + showOrder;
//   selectShow.innerHTML = showOrder;

//   selectShow.addEventListener('change', (e) => {
//     const showName = e.target.value;
//     const showSelected = showList.filter((ep) => ep.name === showName);

//     console.log(showSelected);

//     const showId = showSelected[0].id.toString();
//     fetchUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

//     console.log(fetchUrl);

//     makePageForEpisodes(showSelected);
//   });
// };

// function selectEp(epList) {
//   let selectHtml = epList.map((ep) => {
//     let epNum = ep.number;
//     let epSeason = ep.season;
//     if (epNum < 9) {
//       epNum = `0${epNum}`;
//     }
//     if (epSeason < 9) {
//       epSeason = `0${epSeason}`;
//     }
//     const epSE = `S${epSeason}E${epNum}`;
//     return `<option>${epSE} - ${ep.name}</option>`;
//   }).join('');
//   selectHtml = `<option> All Episodes </option>` + selectHtml;
//   selectEpisode.innerHTML = selectHtml;

//   selectEpisode.addEventListener('change', (e) => {
//     let selectedEpVal = e.target.value;

//     if (selectedEpVal === 'All Episodes') {
//       makePageForEpisodes(epList);
//     } else {
//       selectedEpVal = selectedEpVal.split('- ', selectedEpVal.length)[1];
//       const selectedEp = epList.filter(ep => {
//         return ep.name.includes(selectedEpVal);
//       });
//       makePageForEpisodes(selectedEp);
//     };
//   });
// }

// input.addEventListener('keyup', (e) => {
//   const inputStr = e.target.value.toLowerCase();

//   const searchEpisodes = allEpisodes.filter( ep => {
//     const nameLower = ep.name.toLowerCase();
//     const summaryLower = ep.summary.toLowerCase();

//     if (nameLower.includes(inputStr) || summaryLower.includes(inputStr)) {
//       return ep;
//     }
//   });
//   makePageForEpisodes(searchEpisodes);
// });

// function setup() {
//   allEpisodes = getAllEpisodes();
//   allShows = getAllShows();
//   onLoadScreen(allShows);
//   makePageForEpisodes(allEpisodes);
//   selectEp(allEpisodes);
//   selectSh(allShows);
// }

// window.onload = setup();


// API Version
let fetchUrl = 'https://api.tvmaze.com/shows/82/episodes';

const onLoadScreen = (showsListing) => {

  let htmlShowStr = showsListing.map((show) => {
    // console.log(typeof show);
    let img = show  && show.image ? show.image.medium : null;

    return `
      <div class="col">
        <div class="card text-center h-100">
          <div class="card-header">
            <h2 class="card-header-text">${show.name}</h2>
          </div>
          <img class="card-img-top" src="${img}">
          <div class="card-body col-10 offset-1">
            ${show.summary}
          </div>
        </div>
      </div>
      `;
  }).join('');

  rowCont.innerHTML = htmlShowStr;
  
};

const makePageForEpisodes = (episodeLi) => {
  console.log(episodeLi);
  epAmount.innerText = `Displaying ${episodeLi.length} episode(s)`;
  const htmlStr = episodeLi.map((ep) => {
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
        <img class="card-img-top" src="${ep.image.medium}">
        <div class="card-body col-10 offset-1">
          ${ep.summary}
        </div>
      </div>
    </div>
    `;
  }).join('');
  rowCont.innerHTML = htmlStr;
};

// select show
const selectSh = (showList) => {
  let showAlphabetical = showList.sort((a,b) => {
    return a.name.localeCompare(b.name);
  });

  let showOrder = showAlphabetical.map((ep) => {
    const showName = ep.name;
    return `<option>${showName}</option>`;
  }).join('');
  showOrder = `<option> Pick Show </option>` + showOrder;
  selectShow.innerHTML = showOrder;

  selectShow.addEventListener('change', (e) => {
    let showName = e.target.value;

    let showSelected = showList.filter((ep) => {
      if (ep.name === showName){
        return ep;
      }
    });

    let showId = showSelected[0].id.toString();
    fetchUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

    console.log(fetchUrl)

    setup(fetchUrl);

  });

  console.log(showAlphabetical);
  let showUrl = 'https://api.tvmaze.com/shows/SHOW_ID/episodes';
  let newShow = showUrl.replace('SHOW_ID', 82);
  console.log(newShow);
};

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
    const epSE = `S${epSeason}E${epNum}`;
    return `<option>${epSE} - ${ep.name}</option>`;
  }).join('');
  selectHtml = `<option> All Episodes </option>` + selectHtml;
  selectEpisode.innerHTML = selectHtml;

  selectEpisode.addEventListener('change', (e) => {
    let selectedEpVal = e.target.value;

    if (selectedEpVal === 'All Episodes') {
      makePageForEpisodes(epList);
    } else {
      selectedEpVal = selectedEpVal.split('- ', selectedEpVal.length)[1];
      const selectedEp = epList.filter(ep => {
        return ep.name.includes(selectedEpVal);
      });
      makePageForEpisodes(selectedEp);
    };
  });
}

function setup(url) {
  fetch(fetchUrl)
    .then((res) => res.json())
    .then((data) => {
      let allEpisodes = data;
      const allShows = getAllShows();
      makePageForEpisodes(allEpisodes);
      selectEp(allEpisodes);
      selectSh(allShows);

      input.addEventListener('keyup', (e) => {
        const inputStr = e.target.value.toLowerCase();

        const searchEpisodes = allEpisodes.filter( ep => {
          const nameLower = ep.name.toLowerCase();
          const summaryLower = ep.summary.toLowerCase();

          if (nameLower.includes(inputStr) || summaryLower.includes(inputStr)) {
            return ep;
          }
        });
        makePageForEpisodes(searchEpisodes);
      });
    });
}

window.onload = setup();



// old stuff don't use
// input.addEventListener('keyup', (e) => {
//   const inputStr = e.target.value.toLowerCase();

//   const searchEpisodes = allEpisodes.filter( ep => {
//     const nameLower = ep.name.toLowerCase();
//     const summaryLower = ep.summary.toLowerCase();

//     if (nameLower.includes(inputStr) || summaryLower.includes(inputStr)) {
//       return ep;
//     }
//   });
//   makePageForEpisodes(searchEpisodes);
// });
