document.querySelector("#btnUuid").addEventListener("click", apiUuid);
document
  .querySelector("#btnShowUuid")
  .addEventListener("click", showStoredUuid);
document.querySelector("#btnResult").addEventListener("click", apiResult);
document.querySelector("#btnQuestion1").addEventListener("click", apiQuestion);

function apiUuid() {
<<<<<<< Updated upstream
  fetch("/api/uuid", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      return response.json();
=======
    fetch('/questionnaire/api/uuid', {
        method: 'GET',
        headers: {"Content-Type": "application/json"}
    }).then(response => {
        return response.json();
    }).then(respJson => {
        localStorage['test-id'] = respJson.testId;
        console.log(respJson);
>>>>>>> Stashed changes
    })
    .then((respJson) => {
      localStorage["test-id"] = respJson.testId;
      console.log(respJson);
    });
}

function showStoredUuid() {
  console.log("Saved test id:", localStorage["test-id"]);
}

function apiResult() {
<<<<<<< Updated upstream
  if (localStorage["test-id"]) {
    const testData = {
      testId: localStorage["test-id"],
      data: {
        questionNumber: 1,
        answer: 2,
        duration: 500,
      },
    };
    fetch("/api/result", {
      method: "POST",
      body: JSON.stringify(testData),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      console.log(response);
      return response.json();
    });
  }
}

function apiQuestion() {
  debugger;
  fetch("/api/question/1", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      return response.json();
=======
    if (localStorage['test-id']) {
        const testData = {
            testId: localStorage['test-id'],
            data: {
                questionNumber: 1,
                answer: 2,
                duration: 500
            }
        };
        fetch('/questionnaire/api/result', {
            method: 'POST',
            body: JSON.stringify(testData),
            headers: {"Content-Type": "application/json"}
        }).then(response => {
            console.log(response);
            return response.json();
        })
    }
}

function apiQuestion() {
    debugger;
    fetch('/questionnaire/api/question/1', {
        method: 'GET',
        headers: {"Content-Type": "application/json"}
    }).then(response => {
        return response.json();
    }).then(json => {
        console.log(json);
>>>>>>> Stashed changes
    })
    .then((json) => {
      console.log(json);
    });
}
