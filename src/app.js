const form = document.getElementById("contact-form");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const doggoName = document.getElementById("doggo-name");
const doggoBreed = document.getElementById("doggo-breed");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
//added these two
const email = document.getElementById("email");
const confirmEmail = document.getElementById("confirm-email");

const successModal = document.getElementById("modal-success");

initFormListeners(form);
initModals(successModal);
initCookieBanner();
populateDoggoBreedSelect();

function initFormListeners(formToInit) {
  formToInit.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateAllInputs()) {
      displaySuccessModal();
    }
  });
}

function initModals(successModalToInit) {
  let closeButtons = document.getElementsByClassName("modal__close");
  for (let el of closeButtons) {
    el.onclick = function () {
      successModalToInit.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (event.target == successModalToInit) {
      successModalToInit.style.display = "none";
    }
  };
}

function initCookieBanner() {
  //target
  let acceptCookiesButton = document.querySelector(
    "#cookie-banner .button__primary"
  );
  //function
  acceptCookiesButton.onclick = function () {
    let cookieBanner = document.getElementById("cookie-banner");
    cookieBanner.style.display = "none";
  };

  let rejectCookiesButton = document.querySelector(
    "#cookie-banner .button__secondary"
  );
  rejectCookiesButton.onclick = function () {
    let cookieBanner = document.getElementById("cookie-banner");
    let submitButton = document.querySelector("form button");

    submitButton.disabled = true;
    cookieBanner.style.display = "none";
  };
}

function populateDoggoBreedSelect() {
  fetch("https://api.devnovatize.com/frontend-challenge")
    //promise
    .then(function (response) {
      if (!response.ok) {
        console.log(
          "Error calling external API. Status Code: " + response.status
        );
        return;
      }

      response.json().then(function (data) {
        var selectElem = document.getElementById("doggo-breed");
        fillSelectElem(selectElem, data);
      });
    })
    //catch if error
    .catch(function (err) {
      console.log("Fetch Error : ", err);
    });
}

//called in function above
//var is accessed globally
//the parameters to this function are the selecElem box, data to fill loop(where and what)
function fillSelectElem(selectElem, dataToFill) {
  dataToFill.forEach((element) => {
    //looping through the data and appending an option(breed) to the select doggobreed by id
    var optionElem = document.createElement("option");
    optionElem.innerHTML = element;

    if (element.toLowerCase() === "labernese") {
      optionElem.setAttribute("selected", "selected");
    }
    selectElem.appendChild(optionElem);
  });
}

function validateAllInputs() {
  let allInputValids =
    validateInput(firstName) &&
    validateInput(lastName) &&
    validateInput(doggoName) &&
    validateInput(doggoBreed) &&
    //checking password and use of Validate Password function
    validateInput(password, validatePassword) &&
    validateInput(confirmPassword, function (value) {
      //make sure password and confirm password same
      return value === password.value.trim();
    }) &&
    //these two added
    validateInput(email, validateEmail) &&
    validateInput(confirmEmail, function (value) {
      return value === password.value.trim();
    });

  return allInputValids;
}

//this function sets or unsets the success of input validation(withsetSuccessInput)
function validateInput(element, validationFunction) {
  let inputValid = isInputValid(element, validationFunction);

  inputValid ? setSuccessInput(element) : setErrorInput(element);

  return inputValid;
}

//checking valid input
function isInputValid(element, validationFunction) {
  let value = element.value.trim();

  return !(value === "" || (validationFunction && !validationFunction(value)));
}
//checking valid password
function validatePassword(password) {
  let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/; // 8 chars, lower, upper and digits
  //use of regex to test the string password
  return re.test(String(password));
}

//on grandparent of input depending on each of these conditions a new classlist is added
function setErrorInput(input) {
  const formControl = input.parentElement.parentElement;
  formControl.classList.add("error");
}

function setSuccessInput(input) {
  const formControl = input.parentElement.parentElement;
  formControl.classList.add("success");
  formControl.classList.remove("error");
}

//modal behavior
function displaySuccessModal() {
  var modal = document.getElementById("modal-success");
  modal.style.display = "block";
}

//added this
function validateEmail(password) {
  let re = /^\S+@\S+$/; // 8 chars, lower, upper and digits
  return re.test(String(password));
}
