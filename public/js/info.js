const onlyGermanSpeakersSection = document.getElementById("onlyGermanSpeakers");
const germanInputs = onlyGermanSpeakersSection.getElementsByTagName("select");
const groupTypeInput = document.getElementById("groupType");

const form = document.getElementById("infoForm");
form.onsubmit = onFormSubmit;

groupTypeInput.onchange = onGroupTypeChanged;

function onGroupTypeChanged() {
  onlyGermanSpeakersSection.disabled = groupTypeInput.value !== "test";
  for (let input of germanInputs) {
    input.value = "";
    input.required = !onlyGermanSpeakersSection.disabled;
  }
}

function onFormSubmit(e) {
  e.preventDefault();

  if (localStorage["test-id"]) {
    alert(
      "You already completed the survey once. If this is an error and you'd like to participate again, please contact me."
    );
    window.location.href = "/";
    return;
  }

  fetch("/questionnaire/api/uuid", {
    method: "POST",
    body: new FormData(form),
  })
    .then((response) => {
      return response.json();
    })
    .then((respJson) => {
      localStorage["test-id"] = respJson.testId;
      localStorage["currentQuestion"] = "0";
      window.location.href = "./question.html";
    });
}
