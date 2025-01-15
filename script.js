// Switching between sections
document.querySelectorAll("nav button").forEach((button) => {
    button.addEventListener("click", () => {
        const sections = document.querySelectorAll("section");
        sections.forEach((section) => section.classList.add("hidden"));

        const targetId = button.id.replace("-btn", "");
        document.getElementById(targetId).classList.remove("hidden");
    });
});
// Flashcard item element
const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editBool = false;

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || []; // Load saved flashcards

//Add question when user clicks 'Add Flashcard' button
addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

//Hide Create flashcard Card
closeBtn.addEventListener(
  "click",
  (hideQuestion = () => {
    container.classList.remove("hide");
    addQuestionCard.classList.add("hide");
    if (editBool) {
      editBool = false;
      submitQuestion();
    }
  })
);

//Submit Question
cardButton.addEventListener(
  "click",
  (submitQuestion = () => {
    editBool = false;
    tempQuestion = question.value.trim();
    tempAnswer = answer.value.trim();
    if (!tempQuestion || !tempAnswer) {
      errorMessage.classList.remove("hide");
    } else {
      container.classList.remove("hide");
      errorMessage.classList.add("hide");
      flashcards.push({ question: tempQuestion, answer: tempAnswer }); // Add to flashcards array
      saveFlashcards(); // Save to localStorage
      viewlist();
      question.value = "";
      answer.value = "";
    }
  })
);

//Card Generate
function viewlist() {
  const listCard = document.getElementsByClassName("card-list-container")[0];
  listCard.innerHTML = ""; // Clear existing cards before re-rendering

  flashcards.forEach((card, index) => {
    const div = document.createElement("div");
    div.classList.add("card");
    //Question
    div.innerHTML += `
    <p class="question-div">${card.question}</p>`;
    //Answer
    const displayAnswer = document.createElement("p");
    displayAnswer.classList.add("answer-div", "hide");
    displayAnswer.innerText = card.answer;

    //Link to show/hide answer
    const link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("class", "show-hide-btn");
    link.innerHTML = "Show/Hide Answer";
    link.addEventListener("click", () => {
      displayAnswer.classList.toggle("hide");
    });

    div.appendChild(link);
    div.appendChild(displayAnswer);

    //Edit button
    const buttonsCon = document.createElement("div");
    buttonsCon.classList.add("buttons-con");
    const editButton = document.createElement("button");
    editButton.setAttribute("class", "edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.addEventListener("click", () => {
      editBool = true;
      modifyElement(index, true);
      addQuestionCard.classList.remove("hide");
    });
    buttonsCon.appendChild(editButton);
    disableButtons(false);

    //Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
      modifyElement(index);
    });
    buttonsCon.appendChild(deleteButton);

    div.appendChild(buttonsCon);
    listCard.appendChild(div);
  });
  hideQuestion();
}

//Modify Elements
const modifyElement = (index, edit = false) => {
  const card = flashcards[index];
  if (edit) {
    question.value = card.question;
    answer.value = card.answer;
    flashcards.splice(index, 1); // Remove the card to allow updating
    disableButtons(true);
  } else {
    flashcards.splice(index, 1); // Remove the card
  }
  saveFlashcards(); // Save changes to localStorage
  viewlist();
};

//Disable edit and delete buttons
const disableButtons = (value) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = value;
  });
};

//Save flashcards to localStorage
function saveFlashcards() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

//Load flashcards on page load
function loadFlashcards() {
  if (flashcards.length > 0) {
    viewlist();
  }
}

//Load flashcards when the page loads
document.addEventListener("DOMContentLoaded", loadFlashcards);
