let formStatus = 0;

$(() => {
  toggleForms(formStatus);
});

$(".bring-login").click(() => {
  toggleForms(1);
});

$(".bring-signup").click(() => {
  toggleForms(0);
});

const toggleForms = (formStatus) => {
  if (formStatus) {
    $("#login-form").show();
    $("#signup-form").hide();
    $(".bring-login").toggleClass("active");
    $(".bring-signup").toggleClass("active");
  } else {
    $("#login-form").hide();
    $("#signup-form").show();
    $(".bring-login").removeClass("active");
    $(".bring-signup").addClass("active");
  }
};

const login = () => {
  const data = {
    email: $("#email-field").val(),
    password: $("#password-field").val(),
  };
  $.ajax({
    url: "/users/login",
    method: "POST",
    data,
    success(userData) {
      localStorage.setItem("name", userData.user.name);
      localStorage.setItem("currentHighScore", userData.user.score);
      localStorage.setItem("createdAt", userData.user.createdAt);
      localStorage.setItem("token", userData.token);
      window.location.replace("/home");
    },
    error(jqXHR) {
      alert(jqXHR.responseText);
      window.location.replace("/");
    },
  });
};

const signup = () => {
  const data = {
    name: $("#new-name-field").val(),
    email: $("#new-email-field").val(),
    password: $("#new-password-field").val(),
  };
  $.ajax({
    url: "/users",
    method: "POST",
    data,
    success(userData) {
      localStorage.setItem("name", userData.user.name);
      localStorage.setItem("currentHighScore", userData.user.score);
      localStorage.setItem("createdAt", userData.user.createdAt);
      localStorage.setItem("token", userData.token);
      alert("Signup successful, please login now");
      window.location.replace("/");
    },
    error(jqXHR) {
      signupError(jqXHR.responseText);
      $("#signup-error").text("This is an error");
      window.location.replace("/");
    },
  });
};

const signupError = (message) => {
  let messageArray;
  messageArray = message.split(" ");

  console.log(messageArray);
  if (messageArray[1] === "duplicate")
    return alert(
      `${messageArray[11].substring(0, messageArray[11].length - 1)} ${
      messageArray[12]
      } is already registered.`
    );

  messageArray = message.split(":");
  if (messageArray[0] === "User validation failed")
    return alert(`${messageArray[2]}`);
};
