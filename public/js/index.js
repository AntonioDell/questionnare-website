document.querySelector('#btnStart').addEventListener('click', startTest);

function startTest() {
    if (localStorage['test-id']) {
        alert('You already completed the survey once.\nIf this is an error and you\'d like to participate again, please contact me, providing the following ID:\n'+localStorage['test-id']);
        return;
    }

    window.location.href = '/info.html';
}