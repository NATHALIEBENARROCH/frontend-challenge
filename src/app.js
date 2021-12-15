const form = document.getElementById("contact-form");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const doggoName = document.getElementById("doggo-name");
const doggoBreed = document.getElementById("doggo-breed");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const email = document.getElementById("email");
const confirmEmail = document.getElementById("confirm-email");

const successModal = document.getElementById("modal-success");

const cookieBanner = document.getElementById("cookie-banner");

initFormListeners(form);
//ici argument de la fonction est du HTML
initModals(successModal);
initCookieBanner();
populateDoggoBreedSelect();

//added an event listener on form submit
function initFormListeners(formToInit) {
  formToInit.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateAllInputs()) {
      displaySuccessModal();
      let values = {
        "first-name": firstName.value,
        "last-name": lastName.value,
        "doggo-name": doggoName.value,
        "doggo-breed": doggoBreed.value,
        email: email.value,
        password: password.value,
        "confirm-email": confirmEmail.value,
        "confirm-password": confirmPassword.value,
      };
      console.log("values:", values);
      postToApi(values);
    }
  });
}

let postToApi = async (values) => {
  let response = await fetch("https://api.devnovatize.com/frontend-challenge", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  let body = await response.json();
  console.log("body:", body);
  // if (body.success) {
  //   setOutfits(body.outfits);
  //   Alert.alert("Congratulations!", body.message);
  //   setIsSaveModalOpen(false);
  // }
};

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
  const retrieveLocalStorage = localStorage.getItem("cookies");
  if (retrieveLocalStorage === "accepted") {
    cookieBanner.style.display = "none";
  }
  let acceptCookiesButton = document.querySelector(
    "#cookie-banner .button__accept"
  );

  acceptCookiesButton.onclick = function () {
    cookieBanner.style.display = "none";
    localStorage.setItem("cookies", "accepted");
  };

  let rejectCookiesButton = document.querySelector(
    "#cookie-banner .button__reject"
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
        data.sort();
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
    validateInput(email, validateEmail) &&
    validateInput(confirmEmail, function (value) {
      return value === email.value.trim();
    }) &&
    validateInput(password, validatePassword) &&
    validateInput(confirmPassword, function (value) {
      return value === password.value.trim();
    });

  return allInputValids;
}

//this function sets or unsets the success of input validation(withs etSuccessInput)
function validateInput(element, validationFunction) {
  console.log("element is", element);
  console.log("vf", validationFunction);
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
  let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(String(password));
}

//on grandparent of input depending on each of these conditions a new classlist is added
function setErrorInput(input) {
  console.log("input is", input);
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
function validateEmail(email) {
  let re = /^\S+@\S+$/; // 8 chars, lower, upper and digits
  return re.test(String(email));
}
