let logo = document.getElementById('logo');

// localStorage.clear()
logo.addEventListener('click', () => {
  window.location.assign("../index.html");
});

// SIGN IN AND NAV
function signUpSignIn() {
  let signUpDiv = document.getElementById('signUpDiv');
  signUpDiv.style.display = 'block';
  let signUpFormTab = document.getElementById('signUpForm-tab');
  let signInFormTab = document.getElementById('signInForm-tab');
  let signUpForm = document.getElementById('signUpForm');
  let signInForm = document.getElementById('signInForm');
  let signInInvalid = document.getElementById('signInInvalid');
  signInInvalid.style.display = 'none';

  signUpFormTab.addEventListener('click', (e) => {
    // signInForm.style.display = 'none';
    signUpForm.style.display = 'block';
  });

  signInFormTab.addEventListener('click', (e) => {
    signUpForm.style.display = 'none';
    // signInForm.style.display = 'block';
  });
  
  signUpForm.addEventListener('submit', (event) => {
    if (!signUpForm.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else if (signUpForm.checkValidity()) {
      console.log(signUpForm);
      saveUser();
    }
    signUpForm.classList.add('was-validated');
  }), false;

  signInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    checkUser();
  });
}

// SAVE USER CREATED
function saveUser() {
  let signInForm = document.getElementById('signInForm');
  // signUpForm.style.display = 'block';

  let users = [];
  if (localStorage.getItem('users')) {
    let localStorageUsers = JSON.parse(localStorage.getItem('users'));
    users = localStorageUsers.map((user) => user);
    console.log(users);
  }
  let userNameInput = document.getElementById('signUpUserName').value;
  let userEmailInput = document.getElementById('signUpUserEmailInput').value;
  let userEmailInputStyle = document.getElementById('signUpUserEmailInput').classList;
  let userEmailPassword = document.getElementById('signUpUserPasswordInput').value;

  const user = {
    userName: userNameInput,
    userEmail: userEmailInput,
    userPassword: userEmailPassword,
    signedIn: false,
    favShows: [],
    episodeTracker: [],
  };

  users.push(user);
  console.log(users);
  localStorage.setItem("users", JSON.stringify(users));
  
  // userPage();
}

function checkUser() {
  let signInInvalid = document.getElementById('signInInvalid');
  let userNameEmailInput = document.getElementById('signInUserNameEmail').value;
  let userPassword = document.getElementById('signInUserPasswordInput').value;
  let userPasswordInput = document.getElementById('signInUserPasswordInput');

  let signedInUserTrue = [];
  if (localStorage.getItem('users')) {
    let localStorageUsers = JSON.parse(localStorage.getItem('users'));
    users = localStorageUsers.map((user) => {
      if (user.userName === userNameEmailInput || user.userEmail === userNameEmailInput) {
        if (user.userPassword === userPassword) {
          signedInUserTrue = true;
          user.signedIn = true;
        }
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(users));
  }

  if (signedInUserTrue === true) {
    userPasswordInput.value = '';
    userPageSetup();
  } else {
    userPasswordInput.value = '';
    signInInvalid.style.display = 'block';
    signInForm.classList.add('active', 'show');
  }
}

function userPageSetup() {
  let signUpDiv = document.getElementById('signUpDiv');

  if (!localStorage.getItem("users")) {
    signUpDiv.style.display = 'block';
    signUpSignIn();
  }
  if (JSON.parse(localStorage.getItem('users'))) {
    userDetails = JSON.parse(localStorage.getItem('users'));
    let signedInUser = userDetails.filter((user) => user.signedIn === true);
    console.log(signedInUser)

    if (signedInUser.length !== 0) {
      signUpDiv.style.display = 'none';
        userName = signedInUser[0].userName;
        heading.innerText = `Welcome, ${userName}`;
        document.getElementById('logOutIcon').addEventListener('click', () => {
          console.log('im clicked');
          signOut();
        });
        userPage();
    } else {
      signUpSignIn();
      }
    } 
  }


function signOut() {
  let userDetails = JSON.parse(localStorage.getItem('users'));
  let usersPageContainer = document.getElementById('usersPageContainer');
  let heading = document.getElementById('heading');
  let headingInnerText = document.getElementById('heading').innerText;
  let userNameInHeading = headingInnerText.replace(`Welcome, `, "");
  let users = userDetails.map((user) => {
    if (user.userName === userNameInHeading){
      console.log(userNameInHeading)
      user.signedIn = false;
    }
    return user;
  });
  console.log(users)
  localStorage.setItem('users', JSON.stringify(users));
  heading.innerText = `Welcome`;
  usersPageContainer.style.display = 'none';
  userPageSetup();
}

// userPage();
function userPage() {  
  let usersPageContainer = document.getElementById('usersPageContainer');
  usersPageContainer.style.display = 'block';
  let usersPage = document.getElementById('usersPage');
  let headingInfo = document.getElementById('headingInfo');
  headingInfo.style.display = 'none';
  let favShowsHeading = document.getElementById('favShowsHeading');
  favShowsHeading.innerText = 'Favourite Shows';
  let userDetails = JSON.parse(localStorage.getItem('users'));

  let signedInUser = userDetails.filter((user) => user.signedIn === true);
  console.log(signedInUser);


  if (!signedInUser[0].favShows) {
    let noFavShowText = `<h4>Click the TV icon to search for and add your favourite shows</h4>`;
    return usersPage.innerHTML = noFavShowText;
  }
  let favShows = signedInUser[0].favShows;
  let shows = getAllShows();
  let favShowsList = shows.filter((show) => {
    for (let i = 0; i < favShows.length; i++) {
      if (show.id == favShows[i]) {
        return show;
      }
    }
  });
  let favShowsHtml = favShowsList.map((show) => {
    let showImg = show.image?.medium ?? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU`;
    return `
        <div class="episode-card card text-center col-2 col-md-3">
          <div class="card-header">
            <h2 class="card-header-text ">${show.name} <span class="user-fav-star-rating"><i class="user-fav-star-rating star-rating fas fa-star"></i>${show.rating.average}</span></h2>
            <p class="card-text"></p> 
          </div>
            <img class="fav-shows-img card-img-top card-img-padding col-3" src="${showImg}">
          
        </div>
        `
    }).join('');
    // let episodeTrackerList = signedInUser[0].episodeTracker;
    // let episodeTracker = episodeTrackerList.map((episode) => {
    //   let episodeImg = show.image?.medium ?? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU`;
    //   return `
    //       <div class="episode-card card text-center col-2">
    //         <img class="fav-shows-img card-img-top card-img-padding col-3" src="${showImg}">
    //         <div class="card-header">
    //           <h2 class="card-header-text">${show.name}</h2>
    //           <p class="card-text"><i class="star-rating fas fa-star"></i>${show.rating.average}</p>
    //         </div>
    //       </div>
    //       `
    // })
    usersPage.innerHTML = favShowsHtml;
    similarShows(favShows);
}

// similar shows
function similarShows(showsList) {
  console.log(showsList);
  let shows = getAllShows();
  let getShows = shows.filter((show) => {
    for (let i = 0; i < showsList.length; i++) {
      if (show.id == showsList[i]) {
        return show
      }
    }
  });
  console.log(getShows)
  for (let i = 0; i < getShows.length; i++) {
    let showGenres = getShows[i].genres;
    // let showGenresCheck = showGenres.map((genre) => {

    // });
    let allSimilarShows = shows.filter((show) => {
      for (let i = 0; i < showGenres.length; i++) {
        let genreOne = showGenres[0];
        let genreTwo = showGenres[1];
        let genreThree = showGenres[2];

        if (show.id == showsList[i]) {
          break;
        } else if (show.genres.includes(genreOne) || show.genres.includes(genreTwo) || show.genres.includes(genreThree) ) {
            return show;
        }
        }
    });
    console.log(allSimilarShows);
  }
}

function displaySimilarShows() {

}
window.onload = userPageSetup();
// window.onload = signUpSignIn();