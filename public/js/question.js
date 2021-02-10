const audioElement = document.getElementById("audio");
const leftButton = document.getElementById("btnAnswer1");
const rightButton = document.getElementById("btnAnswer2");
const inaudibleButton = document.getElementById("btnInaudible");
const headerElement = document.getElementById("header");

const defaultText = document.getElementById("default_text");
const changedText = document.getElementById("changed_text");

const trainingText = document.getElementById("training_text");

const questionNumber = localStorage["currentQuestion"];
const testId = localStorage["test-id"];

let receivedQuestionData;
let duration = null;
let audioEnded = false;
let addtionalPlays = 0;

audioElement.disabled = true;
headerElement.innerText += " " + (+questionNumber + 1);

const url = "/questionnaire/api/question?testId=" + testId;
fetch(url, {
  method: "GET",
  headers: { "Content-Type": "application/json" },
}).then((response) => {
  if (!response.redirected && response.status === 200) {
    response.json().then((questionData) => {
      if (questionData.trainingQuestion) {
        trainingText.hidden = false;
      } else {
        trainingText.hidden = true;
      }

      receivedQuestionData = questionData;
      audioElement.src = "." + questionData.audioFile;
      audioElement.onplay = onPlay;
      audioElement.onended = onAudioEnded;

      // TODO: Adapt to first id of rl questions
      if (questionData.id < 25) {
        defaultText.hidden = false;
        changedText.hidden = true;
      } else {
        defaultText.hidden = true;
        changedText.hidden = false;
      }
      audioElement.disabled = false;
    });
  } else {
    window.location.href = response.url;
  }
});

function onAudioEnded() {
  audioEnded = true;
  if (addtionalPlays == 1) {
    audioElement.src = "";
  }
}

function onPlay() {
  if (!duration) {
    duration = new Date();

    const [firstAnswer, secondAnswer] = receivedQuestionData.answers;
    leftButton.innerText = firstAnswer.text;
    rightButton.innerText = secondAnswer.text;
    
    if (firstAnswer.rightAnswer) {
      leftButton.onclick = onRightAnswerClicked;
      rightButton.onclick = onWrongAnswerClicked;
    } else {
      leftButton.onclick = onWrongAnswerClicked;
      rightButton.onclick = onRightAnswerClicked;
    }

    inaudibleButton.onclick = onInaudibleClicked;

    inaudibleButton.disabled = false;
    leftButton.disabled = false;
    rightButton.disabled = false;
  } else if (audioEnded) {
    addtionalPlays++;
    audioEnded = false;
  }
}

function onRightAnswerClicked() {
  onAnswerClicked(true);
}

function onWrongAnswerClicked() {
  onAnswerClicked(false);
}

function onInaudibleClicked() {
  onAnswerClicked(false, true);
}

function onAnswerClicked(correctAnswerClicked, isAnswerInaudible = false) {
  duration = new Date().getTime() - duration.getTime();
  console.log("Measured duration: ", duration);
  leftButton.disabled = true;
  rightButton.disabled = true;
  inaudibleButton.disabled = true;

  const resultData = {
    testId: testId,
    data: {
      questionId: receivedQuestionData.id,
      answer: correctAnswerClicked,
      duration,
      addtionalPlays,
    },
  };
  if (isAnswerInaudible) {
    resultData.data.inaudible = true;
  }
  fetch("/questionnaire/api/result", {
    method: "POST",
    body: JSON.stringify(resultData),
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (response.status === 200) {
      localStorage["currentQuestion"] = +questionNumber + 1;
      window.location.href = "./question.html";
    }
  });
}
