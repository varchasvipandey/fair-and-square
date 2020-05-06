$(document).ready(function() {
  fetchUpdates();
  fetchScores();
  if (localStorage.getItem("token") === null) {
    $("#logged-in-as").addClass("disabled");
    $("#lets-play").html("Free Play");
    return;
  }
  setupPage();
});

//set username at top
const setupPage = () => {
  const loginButton = $("#login-if-not");
  loginButton.addClass("disabled");
  let userName = localStorage.getItem("name");
  let score = localStorage.getItem("currentHighScore");
  let createdAt = localStorage.getItem("createdAt").split("T")[0];
  $("a#logged-in-as").text(userName);

  let data = $("div#player-info").html();
  let userInfo = data.replace("{{NAME}}", userName);
  userInfo = userInfo.replace("{{SCORE}}", score);
  userInfo = userInfo.replace("{{CREATEDAT}}", createdAt);
  $("div#player-info").html(userInfo);

  $("#delete-account-modalTitle").text(`Wait ${userName}!!`);
};

//download application
$("#download-button").click(() => {
  console.log("download app fired");
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.useChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === "dismissed") {
        console.log("User cancelled installation");
      } else {
        console.log("User added to homescreen");
      }
    });
    deferredPrompt = null;
  }
  return;
});

//logout
const logout = () => {
  localStorage.clear();
  window.location.replace("/");
};

//redirect to login page
const guestLogin = () => {
  if (localStorage.getItem("token") === null) {
    window.location.replace("/");
    return;
  }
};

//delete account
const deleteAccount = () => {
  const data = {
    token: localStorage.getItem("token")
  };
  $.ajax({
    url: "/users/delete",
    method: "DELETE",
    data,
    success: function(userData) {
      localStorage.clear();
      window.location.replace("/");
    },
    error: function(error) {
      alert(error);
      window.location.replace("/home");
    }
  });
};

//fetch scores
const fetchScores = () => {
  $.ajax({
    url: "/scores",
    method: "POST",
    success: function(userJSON) {
      createLeaderBoard(userJSON);
    },
    error: function(error) {
      alert(error);
    }
  });
};

//create leader board
const createLeaderBoard = userJSON => {
  let slotTemplate,
    finalDataHTML = "";

  for (let i = 0; i < userJSON.length; i++) {
    slotTemplate = `<tr><td>${i + 1}</td><td>${userJSON[i].name}</td><td>${
      userJSON[i].score
    }</td></tr>`;
    finalDataHTML += slotTemplate;
  }

  //place scores as HTML inside table
  const leaderboard = document.querySelector("table#leader-board tbody");
  leaderboard.insertAdjacentHTML("beforeend", finalDataHTML);
};

//fetch updates
const fetchUpdates = () => {
  $.ajax({
    url: "/getupdates",
    method: "POST",
    success: function(updatesJSON) {
      createUpdatesList(updatesJSON);
    },
    error: function(error) {
      alert(error);
    }
  });
};

//create updates list
const createUpdatesList = updatesJSON => {
  let colors,
    itemTemplate,
    finalList = "";

  colors = ["success", "warning"];

  for (let i = 0; i < updatesJSON.length; i++) {
    itemTemplate = `<li class="list-group-item list-group-item-${
      updatesJSON[i].released ? colors[0] : colors[1]
    }">${updatesJSON[i].description}</li>`;
    finalList += itemTemplate;
  }

  const updatesList = document.querySelector("#updates-list");
  updatesList.insertAdjacentHTML("beforeend", finalList);
};
