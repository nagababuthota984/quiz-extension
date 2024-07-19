document.addEventListener("DOMContentLoaded", () => {
  //Get Heading
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getH1Element,
      },
      (results) => {
        if (results[0].result) {
          document.getElementById("title").innerText = results[0].result;
        } else {
          document.getElementById("title").innerText = "No H1 element found";
        }
      }
    );
  });
  
  //Populate Quiz
  const quizContainer = document.getElementById("quiz-container");
  const submitBtn = document.getElementById("submit-btn");
  const resultContainer = document.getElementById("result-container");
  let quizData;

  fetch("../data/data.json")
    .then((response) => response.json())
    .then((data) => {
      quizData = data;
      renderQuiz(quizData);
    })
    .catch((error) => console.error("Error fetching quiz data:", error));

  function renderQuiz(data) {
    quizContainer.innerHTML = "";
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const questionData = data[key];
        const questionElement = document.createElement("div");
        questionElement.classList.add("question-block");

        const questionTitle = document.createElement("div");
        questionTitle.classList.add("question");
        questionTitle.textContent = questionData.ques;
        questionElement.appendChild(questionTitle);

        const optionsList = document.createElement("ul");
        optionsList.classList.add("options");
        questionData.options.forEach((option, index) => {
          const optionItem = document.createElement("li");
          const optionLabel = document.createElement("label");
          const optionInput = document.createElement("input");
          optionInput.type = "radio";
          optionInput.name = `question${key}`;
          optionInput.value = option;
          optionLabel.appendChild(optionInput);
          optionLabel.appendChild(document.createTextNode(option));
          optionItem.appendChild(optionLabel);
          optionsList.appendChild(optionItem);
        });

        questionElement.appendChild(optionsList);
        quizContainer.appendChild(questionElement);
      }
    }
  }

  submitBtn.addEventListener("click", () => {
    let score = 0;
    for (let key in quizData) {
      if (quizData.hasOwnProperty(key)) {
        const selectedOption = document.querySelector(
          `input[name="question${key}"]:checked`
        );
        if (
          selectedOption &&
          quizData[key].ans.includes(selectedOption.value)
        ) {
          score++;
        }
      }
    }
    resultContainer.textContent = `Your score: ${score}/${
      Object.keys(quizData).length
    }`;
  });
});

function getH1Element() {
  const h1 = document.querySelector("h1");
  return h1 ? h1.innerText : "No H1 element found";
}