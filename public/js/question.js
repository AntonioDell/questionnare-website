const audioElement = document.getElementById('audio');
const leftButton = document.getElementById('btnAnswer1');
const rightButton = document.getElementById('btnAnswer2');
const headerElement = document.getElementById('header');

const defaultText = document.getElementById('default_text');
const changedText = document.getElementById('changed_text');

const questionNumber = localStorage['currentQuestion'];
const testId = localStorage['test-id'];
let receivedQuestionData;

let duration = null;

audioElement.disabled = true;

headerElement.innerText += ' ' + (+questionNumber + 1);
const url = '/api/question?testId=' + testId;
fetch(url, {
    method: 'GET',
    headers: {"Content-Type": "application/json"}
}).then(response => {
    if (!response.redirected && response.status === 200) {
        response.json().then(questionData => {
            receivedQuestionData = questionData;
            audioElement.src = questionData.audioFile;
            audioElement.onplay = onPlay;

            // TODO: Adapt to first id of rl questions
            if (questionData.id < 33) {
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

function onPlay() {
    if (!duration) {
        duration = new Date();

        const randomIndex = new Date().getTime() % 2;
        let currentButton = ['left', 'right'][randomIndex];

        for (let answer of receivedQuestionData.answers) {
            if (currentButton === 'left') {
                if (answer.rightAnswer) {
                    leftButton.onclick = onRightAnswerClicked;
                    rightButton.onclick = onWrongAnswerClicked;
                }
                leftButton.innerText = answer.text;
                currentButton = 'right';
            } else {
                if (answer.rightAnswer) {
                    leftButton.onclick = onWrongAnswerClicked;
                    rightButton.onclick = onRightAnswerClicked;
                }
                rightButton.innerText = answer.text;
                currentButton = 'left';
            }
        }

        leftButton.disabled = false;
        rightButton.disabled = false;
    }
}

function onRightAnswerClicked() {
    onAnswerClicked(true);
}

function onWrongAnswerClicked() {
    onAnswerClicked(false);
}

function onAnswerClicked(correctAnswerClicked) {
    duration = new Date().getTime() - duration.getTime();
    console.log('Measured duration: ', duration);
    leftButton.disabled = true;
    rightButton.disabled = true;

    const resultData = {
        testId: testId,
        data: {
            questionId: receivedQuestionData.id,
            answer: correctAnswerClicked,
            duration: duration
        }
    };
    fetch('/api/result', {
        method: 'POST',
        body: JSON.stringify(resultData),
        headers: {"Content-Type": "application/json"}
    }).then(response => {
        if (response.status === 200) {
            localStorage['currentQuestion'] = +questionNumber + 1;
            window.location.href = '/question.html';
        }
    })
}
