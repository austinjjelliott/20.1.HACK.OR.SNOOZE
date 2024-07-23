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
  const hostName = story.getHostName();
  if (currentUser) {
    const isFavorite = currentUser.favorites.some(
      (fav) => fav.storyId === story.storyId
    );
    const heartClass = isFavorite ? "fa-heart favorite" : "fa-heart";
    return $(`
      <li id="${story.storyId}">
        <i class="fa ${heartClass} heart"></i>
        <i class="fa fa-trash trash"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  } else {
    return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>`);
  }
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

/*2b.4) Submit a user generated story form, reset the form after submission */
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
///////
//Deleting a story:
const deleteStoryURL = "https://hack-or-snooze-v3.herokuapp.com/stories/";

async function deleteStory(token, storyId) {
  try {
    const res = await axios.delete(`${deleteStoryURL}${storyId}`, {
      params: {
        token: userToken,
      },
    });
    alert("Story has been deleted");
  } catch (error) {
    console.error("Error deleting story:", error);
    alert("You can only delete your own stories!");
  }
}

// Event delegation to handle clicks on trash can icons
document.addEventListener("click", function (e) {
  const target = e.target;
  const storyId = target.closest("li").id;
  if (target.classList.contains("trash")) {
    console.log(storyId);

    if (userToken && storyId) {
      deleteStory(userToken, storyId);
    } else {
      alert("Cannot delete story - either not logged in or story ID not found");
    }
  }
});

//Event Delegation to handle clicks on heart icons to add to favorite list
async function favoritesClick(e) {
  const target = e.target;
  const storyId = target.closest("li").id;
  if (target.classList.contains("favorite")) {
    await currentUser.removeFavorites(storyId);
    target.classList.remove("favorite");
  } else {
    await currentUser.addFavorites(storyId);
    target.classList.add("favorite");
  }
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("heart")) {
    favoritesClick(e);
  }
});

async function showMyFavorites() {
  const favorites = await currentUser.getFavorites();
  const favoriteList = document.getElementById("favorites-list");
  const storiesToHide = document.querySelector("#all-stories-list");
  const myStoriesToHide = document.querySelector("#my-stories-list");
  const userProfileToHide = document.getElementById("user-profile");
  userProfileToHide.classList.add("hidden");
  storiesToHide.classList.add("hidden");
  myStoriesToHide.classList.add("hidden");
  submitForm.classList.add("hidden");

  favoriteList.classList.remove("hidden");

  favoriteList.innerHTML = "";
  if (favorites.length === 0) {
    favoriteList.innerHTML = `<h5>No Favorites Added By User Yet!</h5>`;
  } else {
    favorites.forEach((story) => {
      const storyMarkup = generateStoryMarkup(story);
      favoriteList.appendChild(storyMarkup[0]); // note to self: d/t generatestorymarkup using jquery
    });
  }
}

const favoritesNav = document.querySelector("#nav-favorites");
favoritesNav.addEventListener("click", showMyFavorites);

async function showMyStories() {
  const myStories = await currentUser.showMyStories();
  const ownStoriesList = document.getElementById("my-stories-list");
  const storiesToHide = document.querySelector("#all-stories-list");
  const favoritesToHide = document.getElementById("favorites-list");
  const userProfileToHide = document.getElementById("user-profile");
  submitForm.classList.add("hidden");
  storiesToHide.classList.add("hidden");
  favoritesToHide.classList.add("hidden");
  userProfileToHide.classList.add("hidden");
  ownStoriesList.classList.remove("hidden");

  ownStoriesList.innerHTML = "";
  if (myStories.length === 0) {
    ownStoriesList.innerHTML = `<h5>No Stories Added By User Yet!</h5>`;
  } else {
    myStories.forEach((story) => {
      const storyMarkup = generateStoryMarkup(story);
      ownStoriesList.appendChild(storyMarkup[0]);
    });
  }
}
const myStoriesNav = document.querySelector("#nav-my-stories");
myStoriesNav.addEventListener("click", showMyStories);
