// const getData = 
const rowCont = document.getElementById('row-cont');

const epAmount = document.createElement('p');
epAmount.classList.add('col-md-4', 'episode-count');
const input = document.getElementById('input');
const select = document.getElementById('select');
input.parentElement.insertAdjacentElement('afterend', epAmount);

function setup() {
  fetch('https://api.tvmaze.com/shows/82/episodes')
    .then((res) => res.json())
    .then((data) => {
      let allEpisodes = data;
      makePageForEpisodes(allEpisodes);
      selectEp(allEpisodes);

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

const makePageForEpisodes = (episodeLi) => {
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

const selectEp = (epList) => {
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
    return `<option>${epSE} - ${ep.name}</option>`
  }).join('');
  selectHtml = `<option> All Episodes </option>` + selectHtml;
  select.innerHTML = selectHtml;

  select.addEventListener('change', (e) => {
    let selectedEpVal = e.target.value;

    if (selectedEpVal === 'All Episodes') {
      makePageForEpisodes(epList);
    } else {
      selectedEpVal = selectedEpVal.split('- ',selectedEpVal.length)[1];
      const selectedEp = epList.filter(ep => {
        return ep.name.includes(selectedEpVal)
      });
      makePageForEpisodes(selectedEp);
    };
  })
};

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
//   makePageForEpisodes(allEpisodes);
//   selectEp(allEpisodes);
// }

window.onload = setup;