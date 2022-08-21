"use srtict";

// UI ELEMENT
const modeEl = document.querySelector(".mode");
const modeIcon = document.querySelector(".mode-icon");
const inputEl = document.querySelector(".input-el");
const errorMsg = document.querySelector(".error-msg");
const btnSearch = document.querySelector(".btn-search");

// when page load make focus on input element
inputEl.focus();

// FUNCTIONS
////////////////////////////
// Helper Functions
const get = (className) => document.querySelector(className);

function checkingNull(prop, value, msg, opa = "1") {
  if (value === null || value === "") {
    get(prop).textContent = msg;
    get(prop).style.opacity = opa;
  } else {
    get(prop).textContent = value;
    get(prop).style.opacity = 1;

    // check if its twitter
    if (prop === ".twitter") {
      get(prop).textContent = `@${value}`;
    }
  }
}

function updateUserProfile(data) {
  const {
    avatar_url: avatar,
    bio,
    blog,
    followers,
    following,
    location,
    name,
    public_repos: repos,
    twitter_username: twitter,
    html_url: githubLink,
    login,
    company,
    created_at: joined,
  } = data;

  // setting joined date
  const date = new Date(joined);
  const dateFormate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date);
  get(".since").textContent = `Joined ${dateFormate}`;

  // setting Attribute
  get(".profile-img").setAttribute("src", avatar);
  get(".username").setAttribute("href", githubLink);
  get(".blog").setAttribute(
    "href",
    data.blog
      ? (String(data.blog).includes("https://") ? "" : "https://") + data.blog
      : ""
  );
  get(".twitter").setAttribute("href", `https://twitter.com/${twitter}`);

  // textContent
  get(".name").textContent = name;
  get(".repos").textContent = repos;
  get(".followers").textContent = followers;
  get(".following").textContent = following;
  get(".username").textContent = `@${login}`;

  // if bio is null, empty Or not
  checkingNull(".user-bio", bio, "This profile has no bio");

  // check if company is null, empty Or not
  checkingNull(".company", company, "Not Available", "0.7");

  // check if blog is null
  checkingNull(".blog", blog, "Not Available", "0.7");

  // check if twitter is null
  checkingNull(".twitter", twitter, "Not Available", "0.7");

  // check if company is null
  checkingNull(".location", location, "Not Available", "0.7");
}

// Render Error
function renderError(err) {
  errorMsg.hidden = false;
  inputEl.hidden = true;
  setTimeout(function () {
    // make input element disapear for certain time
    inputEl.hidden = false;
    // make focus when appear
    inputEl.focus();

    // make error element apear for certain time
    errorMsg.hidden = true;
    errorMsg.textContent = err;
  }, 2000);
  userDataFromGhithubApi();
}

// GETTING USER DATA FROM GITHUB API
function userDataFromGhithubApi(user = "octocat") {
  // endpoint
  const url = `https://api.github.com/users/${user}`;

  fetch(url)
    .then((res) => {
      // check if user not found
      if (res.status === 404) {
        throw new Error("No Results");
      }

      // check if status is not ok
      if (!res.ok) {
        throw new Error("Something Went Wrong!");
      }

      return res.json();
    })
    .then((data) => updateUserProfile(data))
    .catch((err) => renderError(err));
}

function searchUsers(e) {
  // preventDefault
  e.preventDefault();

  const inputValue = inputEl.value;

  // check if input value is not empty
  if (inputValue !== "") {
    userDataFromGhithubApi(inputValue);
  }

  // clear input
  inputEl.value = "";
}

// EVENTLISTNER

// LIGHT AND DARK MODE
modeEl.addEventListener("click", function () {
  const text = document.querySelector(".text");
  const icon = modeEl.querySelector(".mode-icon");

  // select body
  const bodyEL = document.body;
  bodyEL.classList.toggle("dark-mode");

  if (bodyEL.classList.contains("dark-mode")) {
    text.textContent = "Light";
    icon.src = "./images/icon-sun.svg";
  } else {
    text.textContent = "Dark";
    icon.src = "./images/icon-moon.svg";
  }
});

// SEARCH USERS
btnSearch.addEventListener("click", searchUsers);

userDataFromGhithubApi();
