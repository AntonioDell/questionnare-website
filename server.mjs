import express from "express";
import fs from "fs-extra";
import { v4 } from "uuid";
import multer from "multer";

const questionJsonFiles = [
  "data/questions_ab-x.json",
  "data/questions_rl.json",
];
const questionFiles = [];

Promise.all(questionJsonFiles.map((fileName) => fs.readJSON(fileName)))
  .then((questionFileJson) => {
    questionFileJson.forEach((questionFile) => {
      questionFiles.push(questionFile);
    });
    if (areDuplicateQuestionIdsAssigned()) {
      throw "Server setup failed. There are duplicate question ids in one or multiple question files present.";
    } else {
      console.log("Questions OK");
    }
  })
  .then(() => {
    setupRoutes();
  })
  .catch((error) => {
    logError(error);
  });

function areDuplicateQuestionIdsAssigned() {
  const uniqueQuestionIdSet = new Set();
  return [].concat(...questionFiles).some((question) => {
    const alreadyPresent = uniqueQuestionIdSet.has(question.id);
    uniqueQuestionIdSet.add(question.id);
    return alreadyPresent;
  });
}

function setupRoutes() {
<<<<<<< Updated upstream
  const app = express();
  const upload = multer();

  app.use(express.static("public"));
  app.use(express.json());

  app.listen(process.env.PORT || 3000, function () {
    console.log(
      `Questionnaire app listening on port ${process.env.PORT || 3000}!`
    );
  });

  //TODO remove debug code
  app.get("/api/results", (req, res) => {
    fs.readdir("data", (err, files) => {
      if (err) {
        res.status(500);
        res.send();
      } else {
        let testResultFiles = files.filter((file) => file.startsWith("test"));
        Promise.all(
          testResultFiles.map((file) => fs.readJSON("data/" + file))
        ).then((testFiles) => {
          res.status(200);
          res.json(testFiles);
=======
    let app = express();

    app.use("/questionnaire", express.static("public"));
    app.use(express.json());

    app.listen(3000, function () {
        //console.log("Example app listening on port 3000!");
    });

    //TODO remove debug code
    app.get('/questionnaire/api/results', (req, res) => {
        fs.readdir('data', (err, files) => {
            if (err) {
                res.status(500);
                res.send();
            } else {
                let testResultFiles = files.filter(file => file.startsWith("test"));
                Promise.all(testResultFiles.map(file => fs.readJSON('data/' + file)))
                    .then(testFiles => {
                        res.status(200);
                        res.json(testFiles);
                    });
            }
>>>>>>> Stashed changes
        });
      }
    });
<<<<<<< Updated upstream
  });

  app.get("/api/question", (req, res) => {
    const testId = req.query.testId;

    fs.readJSON("data/test_" + testId + ".json").then((test) => {
      const answeredQuestionIds = test.results.map(
        (result) => result.questionId
      );

      let questionCountDown = answeredQuestionIds.length;
      let selectedQuestionFile;
      for (const questionFile of questionFiles) {
        questionCountDown -= questionFile.length;
        if (questionCountDown < 0) {
          selectedQuestionFile = questionFile;
          break;
        }
      }

      const missingQuestions = selectedQuestionFile
        ? selectedQuestionFile.filter(
            (question) =>
              !answeredQuestionIds.some(
                (answeredQuestionId) => answeredQuestionId === question.id
              )
          )
        : null;

      if (missingQuestions) {
        let index;
        if(missingQuestions.length == selectedQuestionFile.length){
          // Get first question of file
          index = 0;
        } else {
          // Get random question from missing questions
          index = new Date().getTime() % missingQuestions.length;
        }
        res.status(200);
        res.json(missingQuestions[index]);
      } else {
        // User answered all questions
        res.redirect(303, "/end.html");
      }
=======

    app.get('/questionnaire/api/question', (req, res) => {
        const testId = req.query.testId;

        fs.readJSON('data/test_' + testId + '.json')
            .then(test => {
                const answeredQuestionIds = test.results.map(result => result.questionId);

                console.log('Questions answered ', answeredQuestionIds.length);
                let questionCountDown = answeredQuestionIds.length;
                let selectedQuestionFile;
                for (const questionFile of questionFiles) {
                    questionCountDown -= questionFile.length;
                    if (questionCountDown < 0) {
                        selectedQuestionFile = questionFile;
                        break;
                    }
                }

                const missingQuestions = selectedQuestionFile ?
                    selectedQuestionFile.filter(question => !answeredQuestionIds
                        .some(answeredQuestionId => answeredQuestionId === question.id)) :
                    null;

                if (missingQuestions) {
                    console.log('Json sent');
                    // Get random question from missing questions
                    const randomIndex = new Date().getTime() % missingQuestions.length;
                    res.status(200);
                    res.json(missingQuestions[randomIndex]);
                } else {
                    // User answered all questions
                    res.redirect(303, '/questionnaire/end.html');
                }
            });
    });


    app.post("/questionnaire/api/uuid", (req, res) => {
        const infos = req.body;
        const newTest = new Test(v4(), infos.groupType, infos.germanLevel, infos.germanSinceWhen);
        const newFile = 'data/test_' + newTest.testId + '.json';

        fs.ensureFile(newFile)
            .then(() => {
                fs.writeJSON(newFile, newTest);
            })
            .then(() => {
                res.json({testId: newTest.testId})
            });
    });

    app.post('/questionnaire/api/result', (req, res) => {
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
            .then(() => {
                res.send();
            })
>>>>>>> Stashed changes
    });
  });

  app.post("/api/uuid", upload.none(), (req, res) => {
    const infos = req.body;
    const newTest = { testId: v4(), ...infos, results: [] };
    const newFile = "data/test_" + newTest.testId + ".json";

    fs.ensureFile(newFile)
      .then(() => {
        fs.writeJSON(newFile, newTest);
      })
      .then(() => {
        res.json({ testId: newTest.testId });
      });
  });

  app.post("/api/result", (req, res) => {
    let newResultData = req.body;
    const testFile = "data/test_" + newResultData.testId + ".json";
    fs.readJSON(testFile)
      .then((test) => {
        test.results.push(newResultData.data);
        return fs.writeJSON(testFile, test);
      })
      .then(() => {
        res.status(200);
      })
      .then(() => {
        res.send();
      });
  });
}

async function logError(error) {
  console.log("Log error:", error);
  fs.readJSON("data/log.json").then((logArray) => {
    logArray.push({ date: new Date(), error: error });
    return fs.writeJSON("data/log.json", logArray);
  });
}