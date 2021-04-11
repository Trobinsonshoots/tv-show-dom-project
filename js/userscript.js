let logo = document.getElementById('logo');

// localStorage.clear()

logo.addEventListener('click', () => {
    window.location.assign("../index.html");
  });


var forms = document.querySelectorAll('.needs-validation')

Array.prototype.slice.call(forms)
    .forEach(function (form) {
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()){
        event.preventDefault()
        event.stopPropagation()
        } else if (form.checkValidity()) {
          saveUser()  
        }
        // event.preventDefault()
        form.classList.add('was-validated')
        
    } )
}, false);


function saveUser() {
  let userEmailInput = document.getElementById('userEmailInput').value;
  let userEmailInputStyle = document.getElementById('userEmailInput').classList;
  let userEmailPassword = document.getElementById('userPasswordInput').value;

  console.log(userEmailInputStyle);
  const user = {
    userName: userEmailInput,
    userPassword: userEmailPassword,
    signedIn: true,
  };
  localStorage.setItem("user", JSON.stringify(user));
  userPage();
}

function userPage() {
    let userDetails = JSON.parse(localStorage.getItem('user'));

    if (!userDetails.signedIn === true) {
       console.log(`user is signed in`);
    }
    
}

