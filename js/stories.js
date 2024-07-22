"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/*2b.4) Write a function in stories.js that is called when users submit the form. 
Pick a good name for it. This function should get the data from the form, call the
 .addStory method you wrote, and then put that new story on the page.*/
function postStory(e) {
  e.preventDefault();
  const author = document.querySelector("#author").value;
  const title = document.querySelector("#title").value;
  const url = document.querySelector("#storyURL").value;
  const newStory = storyList.addStory(currentUser, { author, title, url });
  const authorrest = (document.querySelector("#author").value = "");
  const titlereset = (document.querySelector("#title").value = "");
  const urlreset = (document.querySelector("#storyURL").value = "");
  alert("Story posted successfully");
}

const submitForm = document.querySelector("#submit-form");
submitForm.addEventListener("submit", postStory);

//MY STORIES SECTION: CLICK ON MY STORIES AND DISPLAY ONLY STORIES THE LOGGED IN USER POSTED
// <!-- This is what needs to be done:
//  When clicking nav-my-stories, need to show the my-stories-secion(this is an ol)
//  Needs to also load a delete button next to the story
//  needs to also hide the all-stories-list...hopefully just by adding the hidden class
//  or maybe a .hide() somewhere
//  -->

const myStoriesURL = "https://hack-or-snooze-v3.herokuapp.com/users/";

async function showMyStories() {
  const { username, loginToken: token } = currentUser;
  const res = await axios.get(`${myStoriesURL}${username}`, {
    params: {
      token: token,
    },
  });
  console.log(res.data.user);
  const storiesToHide = document.querySelector("#all-stories-list");
  storiesToHide.classList.add("hidden");
  submitForm.classList.add("hidden");

  const ownStories = document.querySelector("#my-stories-list");
  if (currentUser.ownStories.length === 0) {
    ownStories.innerHTML = `<h5>No Stories Added By User Yet!</h5>`;
  } else {
    ownStories.innerHTML = "";
    res.data.user.stories.forEach((story) => {
      const newList = document.createElement("li");
      const displayStoryName = document.createElement("span");
      const displayStoryURL = document.createElement("a");
      const favoriteBtn = document.createElement("i");
      const deleteBtn = document.createElement("i");
      displayStoryName.textContent = story.title;
      deleteBtn.setAttribute("data-story-id", story.storyId);
      displayStoryName.classList.add("stories-list");
      displayStoryURL.setAttribute("href", story.url);
      displayStoryURL.innerText = `      ${story.url}`;
      displayStoryURL.classList.add("small");
      favoriteBtn.classList.add(`fa`);
      favoriteBtn.classList.add(`fa-heart`);
      favoriteBtn.classList.add(`heart`);
      deleteBtn.classList.add(`fa`);
      deleteBtn.classList.add(`fa-trash`);
      deleteBtn.classList.add(`trash`);
      ownStories.appendChild(newList);
      newList.appendChild(favoriteBtn);
      newList.appendChild(deleteBtn);
      newList.appendChild(displayStoryName);
      displayStoryName.appendChild(displayStoryURL);
    });
  }
  const hearts = document.querySelectorAll(".heart");
  hearts.forEach((heart) => {
    heart.addEventListener("click", function () {
      heart.classList.toggle("favorite");
    });
  });
  const deleteThis = document.querySelectorAll(".trash");
  deleteThis.forEach((trashcan) => {
    trashcan.addEventListener("click", function () {
      trashcan.classList.add("deleteThis");
    });
  });
}
const myStoriesList = document.querySelector("#nav-my-stories");
myStoriesList.addEventListener("click", showMyStories);

//Deleting a story:
const deleteStoryURL = "https://hack-or-snooze-v3.herokuapp.com/stories/";

async function deleteStory(token, storyId) {
  // let token = userToken;
  try {
    const res = await axios.delete(`${deleteStoryURL}${storyId}`, {
      params: {
        token: userToken,
      },
    });
    alert("Story has been deleted");
  } catch (error) {
    console.error("Error deleting story:", error);
    alert("Error deleting story");
  }
}

// Event delegation to handle clicks on trash can icons
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("trash")) {
    const storyIdToDelete = e.target.getAttribute("data-story-id");
    if (userToken && storyIdToDelete) {
      deleteStory(userToken, storyIdToDelete);
    } else {
      alert("Cannot delete story - either not logged in or story ID not found");
    }
  }
});
