//You can edit ALL of the code here

let allEpisodes = [];
let rowCont = document.getElementById('row-cont');
const rootElem = document.getElementById("root");

const epAmount = document.createElement('p');
epAmount.classList.add('col-md-4', 'episode-count')
let input = document.getElementById('input');
let select = document.getElementById('select');
input.parentElement.insertAdjacentElement("afterend", epAmount);

function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  selectEp(allEpisodes)
}

const selectEp = (epList) => {
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
    return `<option>${epSE} - ${ep.name}</option>`
  }).join('');
  selectHtml = `<option> All Episodes </option>` + selectHtml;
  select.innerHTML = selectHtml;

  select.addEventListener('change', (e) => {
    let selectedEpVal = e.target.value;

    if (selectedEpVal == 'All Episodes') {
      makePageForEpisodes(allEpisodes)
    } else {
      selectedEpVal = selectedEpVal.split('- ',selectedEpVal.length)[1];
      
      const selectedEp = allEpisodes.filter(ep => {
        return ep.name.includes(selectedEpVal);
      })
      makePageForEpisodes(selectedEp);
    };
    
  })
};


input.addEventListener('keyup', (e) => {
  const inputStr = e.target.value.toLowerCase();
  console.log(`im input` + inputStr)

  const searchEp = allEpisodes.filter( ep => {
    let nameLower = ep.name.toLowerCase();
    let summaryLower = ep.summary.toLowerCase();

    if (nameLower.includes(inputStr) || summaryLower.includes(inputStr)) {
      return ep;
    }
  });
  makePageForEpisodes(searchEp);
});

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


  
// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");
//   const epAmount = document.createElement('p');
//   let rowCont = document.getElementById('row-cont');
//   let input = document.createElement('input');

//   epAmount.classList.add('d-inline');
//   epAmount.innerText = `Displaying ${episodeList.length} episode(s)`;
//   input.classList.add('inputField', 'col-2');
  
//   rootElem.prepend(epAmount);
//   rootElem.prepend(input);

//   input.addEventListener('keyup', (e) => {
//     let inputString = e.target.value;
//   });

//   // loop to create cards
//   for (let i=0; i < episodeList.length; i++){
//     let epName = episodeList[i].name;
//     let epNum = episodeList[i].number;
//     let epSeason = episodeList[i].season;
//     let epImg = episodeList[i].image.medium;
//     let epSummary = episodeList[i].summary;

//     if (epNum < 10  ) {
//       epNum = "0" + epNum.toString();
//     }
//     if (epSeason < 10  ) {
//       epSeason = "0" + epSeason.toString();
//     }

//     // Created Elements
//     let cardCont = document.createElement('div')
//     let card = document.createElement('div');
//     let cardHeader = document.createElement('div');
//     let cardHeaderText = document.createElement('h2');
//     let cardImg = document.createElement('img');
//     let cardBody = document.createElement('div');


//     // Created Elements Classes
//     cardCont.classList.add('col');
//     card.classList.add('card', 'text-center', 'h-100');
//     cardHeader.classList.add('card-header', );
//     cardHeaderText.classList.add('card-header-text')
//     cardImg.classList.add('card-img-top')
//     cardBody.classList.add('card-body', 'col-10', 'offset-1');

//     // Append created Elements
//     rowCont.append(cardCont);
//     cardCont.append(card);
//     cardHeader.append(cardHeaderText);
//     card.append(cardHeader, cardImg, cardBody);

//     cardHeaderText.innerText = `${epName} - S${epSeason}E${epNum}`;
//     cardImg.src = epImg;
//     cardBody.innerHTML = epSummary;

//   };
//   console.log(rootElem);
// }

window.onload = setup;
