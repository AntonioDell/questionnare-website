import express from "express";
import fs from "fs-extra";
import v4 from 'uuid/v4';

let app = express();

app.use(express.static("public"));
app.use(express.json());

app.listen(80, function () {
    console.log("Example app listening on port 3000!");
});

app.get("/api/gallery", function (req, res) {
    fs.readJson("data/gallery.json").then(json => res.json(json));
});

app.get("/api/blog", function (req, res) {
    fs.readJSON("data/blog.json").then(json => res.json(json));
});

app.get('/api/question/:number', (req, res) => {
    const questionNumber = req.params.number;
    fs.readJSON('data/questions.json')
        .then(questionArray => {
            if (questionNumber < questionArray.length) {
                const selectedQuestion = questionArray[questionNumber];
                if (!selectedQuestion) {
                    throw 'Question number ' + questionNumber + ' does not exist!';
                }
                res.status(200);
                res.json(selectedQuestion);
            } else {
                res.status(304);
                res.send();
            }
        })
        .catch(error => {
            res.status(403);
            logError(error).then(() => {
                res.send();
            })
        })
});

app.post("/api/uuid", (req, res) => {
    const infos = req.body;
    const newTest = new Test(v4(), infos.groupType, infos.germanLevel);
    const newFile = 'data/test_' + newTest.testId + '.json';

    fs.ensureFile(newFile)
        .then(() => {
            fs.writeJSON(newFile, newTest);
        })
        .then(() => {
            res.json({testId: newTest.testId})
        });
});

app.post('/api/result', (req, res) => {
    let newResultData = req.body;
    const testFile = 'data/test_' + newResultData.testId + '.json';
    fs.readJSON(testFile)
        .then(test => {
            test.results.push(newResultData.data);
            return fs.writeJSON(testFile, test)
        })
        .then(() => {
            res.status(200);
        })
        /*.catch(error => {
            res.status(403);
            return logError(error);
        })*/
        .then(() => {
            res.send();
        })
});


app.post("/api/newsletter", function (req, res) {
    let formDataObject = req.body;
    if (!formDataObject.agb) {
        res.status(451);
        res.send("AGBs not accepted!");
    } else {
        console.log("AGB accepted.");
        fs.readJSON("data/newsletter.json")
            .then(jsonArray => {
                for (let registered of jsonArray) {
                    if (registered.email === formDataObject.email) {
                        throw "Email already registered!";
                    }
                }
                console.log("No duplicate email found.");
                delete formDataObject.agb;
                jsonArray.push(formDataObject);
                return fs.writeJSON("data/newsletter.json", jsonArray);
            })
            .then(_ => {
                console.log("Set OK.");
                res.status(200);
            })
            .catch(err => {
                console.log(err);
                console.log("Set NOT MODIFIED.");
                res.status(304);
            })
            .then(() => {
                console.log("Send Response.");
                res.send();
            });
    }
});

async function logError(error) {
    console.log('Log error:', error);
    fs.readJSON('data/log.json')
        .then(logArray => {
            logArray.push({date: new Date(), error: error});
            return fs.writeJSON('data/log.json', logArray);
        })
}

class Test {
    constructor(testId, groupType, germanLevel) {
        this.testId = testId;
        this.groupType = groupType;
        this.germanLevel = germanLevel;
        this.results = [];
    }
}

class Result {
    constructor(questionNumber, answer, duration, correctAnswer) {
        this.questionNumber = questionNumber;
        this.answer = answer;
        this.duration = duration;
        this.correctAnswer = correctAnswer;
    }
}