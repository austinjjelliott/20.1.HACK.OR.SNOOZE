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

/*Subpart 2b.3) Write a function in nav.js that is called when users
 click that navbar link. Look at the other function names in that file that do 
 similar things and pick something descriptive and similar.*/

function showSubmitForm() {
  const submitForm = document.querySelector("#submit-form");
  submitForm.classList.toggle("hidden");
}
const navSubmit = document.querySelector("#nav-submit");
navSubmit.addEventListener("click", showSubmitForm);
