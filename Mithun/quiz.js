let Questions = [];
const ques = document.getElementById("ques");

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) {
            throw new Error('Something went wrong!! Unable to fetch the data');
        }
        const data = await response.json();
        Questions = data.results;
        startQuiz();
    } catch (error) {
        console.log(error);
        ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
    }
}

function startQuiz() {
    currQuestion = 0;
    score = 0;
    document.getElementById("start-panel").style.display = "none";
    document.getElementById("btn").textContent = "SUBMIT";
    document.getElementById("btn").style.display = "block";
    document.getElementById("score").innerHTML = '';
    document.getElementById("ques").style.display = "block";
    document.getElementById("opt").style.display = "block";
    loadQues();
}

let currQuestion = 0;
let score = 0;

function loadQues() {
    if (Questions.length === 0) return;

    const opt = document.getElementById("opt");
    let currentQuestion = Questions[currQuestion].question;

    currentQuestion = currentQuestion.replace(/&quot;/g, '\"').replace(/&#039;/g, '\'');

    ques.innerText = currentQuestion;
    opt.innerHTML = "";

    const correctAnswer = Questions[currQuestion].correct_answer;
    const incorrectAnswers = Questions[currQuestion].incorrect_answers;
    const options = [correctAnswer, ...incorrectAnswers];
    options.sort(() => Math.random() - 0.5);

    options.forEach((option) => {
        option = option.replace(/&quot;/g, '\"').replace(/&#039;/g, '\'');

        const choicesdiv = document.createElement("div");
        const choice = document.createElement("input");
        const choiceLabel = document.createElement("label");

        choice.type = "radio";
        choice.name = "answer";
        choice.value = option;
        choiceLabel.textContent = option;

        choicesdiv.appendChild(choice);
        choicesdiv.appendChild(choiceLabel);
        opt.appendChild(choicesdiv);
    });

    const btn = document.getElementById("btn");
    if (currQuestion < Questions.length - 1) {
        btn.textContent = "NEXT";
    } else {
        btn.textContent = "SUBMIT";
    }
}

function loadScore() {
    const totalScore = document.getElementById("score");
    totalScore.textContent = `You scored ${score} out of ${Questions.length}`;
    totalScore.innerHTML += "<h3>All Answers</h3>";
    Questions.forEach((el, index) => {
        totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
    });

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "RESTART";
    restartBtn.onclick = restartQuiz;
    restartBtn.style.fontSize = "20px";
    restartBtn.style.padding = "10px 20px";
    restartBtn.style.backgroundColor = "#4f98c2";
    restartBtn.style.color = "white";
    restartBtn.style.border = "none";
    restartBtn.style.cursor = "pointer";
    restartBtn.style.marginTop = "20px";
    restartBtn.onmouseover = function() {
        restartBtn.style.color = "#4f98c2";
        restartBtn.style.backgroundColor = "white";
        restartBtn.style.border = "1px solid #4f98c2";
    };
    restartBtn.onmouseout = function() {
        restartBtn.style.color = "white";
        restartBtn.style.backgroundColor = "#4f98c2";
        restartBtn.style.border = "none";
    };

    totalScore.appendChild(restartBtn);
}

function nextQuestion() {
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").style.display = "none";
        document.getElementById("ques").style.display = "none";
        document.getElementById("btn").style.display = "none";
        loadScore();
    }
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (selectedAns) {
        if (selectedAns.value === Questions[currQuestion].correct_answer) {
            score++;
        }
        nextQuestion();
    } else {
        alert('Please select an answer');
    }
}

function restartQuiz() {
    fetchQuestions();
}

