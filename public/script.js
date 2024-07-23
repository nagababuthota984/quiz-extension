document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz-container");
  const submitBtn = document.getElementById("submit-btn");
  const resultContainer = document.getElementById("result-container");
  let baseURL = "https://readquest-nb-lnx-ewdjhehedkdnd3fr.eastus-01.azurewebsites.net/prompt";

  //Get Heading
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getH1Element,
      },
      (results) => {
        if (results[0].result) {
          buildFetchRequest(results[0].result);
          document.getElementById("title").innerText = results[0].result;
        } else {
          document.getElementById("title").innerText = "No MCQ Found";
        }
      }
    );
  });

  // Populate Quiz
  async function buildFetchRequest(heading) {
    let encodedQuery = encodeURIComponent(heading);
    url = `${baseURL}?query=${encodedQuery}`;

    try {
      const response = await fetch(url);
      let data = await response.text();
      data = data
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const quizData = JSON.parse(data);
      renderQuiz(quizData);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  }

  function renderQuiz(quizData) {
    quizContainer.innerHTML = "";
    quizData.questions.forEach((question, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("question");

      const questionTitle = document.createElement("h2");
      questionTitle.textContent = question.question;
      questionDiv.appendChild(questionTitle);

      for (let i = 1; i <= 4; i++) {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("option");

        const optionInput = document.createElement("input");
        optionInput.type = "radio";
        optionInput.name = `question${index}`;
        optionInput.value = question[`option${i}`];
        optionInput.id = `question${index}-option${i}`;

        const optionLabel = document.createElement("label");
        optionLabel.htmlFor = `question${index}-option${i}`;
        optionLabel.textContent = question[`option${i}`];

        optionDiv.appendChild(optionInput);
        optionDiv.appendChild(optionLabel);
        questionDiv.appendChild(optionDiv);
        submitBtn.innerHTML = 'Submit'
      }

      quizContainer.appendChild(questionDiv);
    });
  }

  submitBtn.addEventListener("click", () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      const selectedOption = document.querySelector(
        `input[name="question${index}"]:checked`
      );
      if (selectedOption && question.ans.includes(selectedOption.value)) {
        score++;
      }
    });
    resultContainer.textContent = `Your score: ${score}/${quizData.questions.length}`;
  });
});

function getH1Element() {
  const h1 = document.querySelector("h1");
  return h1 ? h1.innerText : "No H1 element found";
}
