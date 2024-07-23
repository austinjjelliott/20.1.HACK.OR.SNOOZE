"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/*Subpart 2b.3) Submit form nav bar link */

function showSubmitForm() {
  hidePageComponents();
  const userProfileToHide = document.getElementById("user-profile");
  userProfileToHide.classList.add("hidden");
  const submitForm = document.querySelector("#submit-form");
  submitForm.classList.toggle("hidden");
}
const navSubmit = document.querySelector("#nav-submit");
navSubmit.addEventListener("click", showSubmitForm);

// I want it so that when you click the top left hack or snooze it reloads the page...
const hackOrSnoozeLogo = document.querySelector("#nav-all");
hackOrSnoozeLogo.addEventListener("click", function (e) {
  location.reload();
});

//showing user profile
function showUserProfile() {
  hidePageComponents();
  const ownStoriesList = document.getElementById("my-stories-list");
  const storiesToHide = document.querySelector("#all-stories-list");
  const favoritesToHide = document.getElementById("favorites-list");
  submitForm.classList.add("hidden");
  storiesToHide.classList.add("hidden");
  favoritesToHide.classList.add("hidden");
  ownStoriesList.classList.add("hidden");
  currentUser.showMyProfile();
}
$navUserProfile.on("click", showUserProfile);
