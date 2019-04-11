const submitButton = document.getElementById('submitBtn');
const germanLevelInput = document.getElementById('german_level');
const germanSinceWhenInput = document.getElementById('german_since_when');
const groupTypeInput = document.getElementById('group_type');

groupTypeInput.onchange = onGroupTypeChanged;
submitButton.onclick = onSubmitClicked;


function onGroupTypeChanged() {
    germanLevelInput.disabled = groupTypeInput.value === 'test';
    if (germanLevelInput.disabled) {
        germanLevelInput.value = '';
    }
    germanSinceWhenInput.disabled = groupTypeInput.value === 'test';
    if (germanSinceWhenInput.disabled) {
        germanSinceWhenInput.value = '';
    }
}

function onSubmitClicked() {

    if (localStorage['test-id']) {
        alert('You already completed the survey once. If this is an error and you\'d like to participate again, please contact me.');
        window.location.href = '/';
        return;
    }

    if (!groupTypeInput.value) {
        alert('Please specify a group type!');
        return;
    }
    if (groupTypeInput.value === 'comparison') {
        if (!germanLevelInput.value) {
            alert('Please specify your german knowledge!');
            return;
        } else if (!germanSinceWhenInput.value) {
            alert('Please specify how long you already spoke german!')
            return;
        }
    }

    const testInfoData = {
        groupType: groupTypeInput.value,
        germanLevel: germanLevelInput.value,
        germanSinceWhen: germanSinceWhenInput.value
    };

    fetch('/api/uuid', {
        method: 'POST',
        body: JSON.stringify(testInfoData),
        headers: {"Content-Type": "application/json"}
    }).then(response => {

        return response.json();
    }).then(respJson => {
        localStorage['test-id'] = respJson.testId;
        localStorage['currentQuestion'] = '0';
        window.location.href = '/question.html';
    });

}
