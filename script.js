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
const flashcard_item = $(`<div class="card">
    <div class="card-container">
        <div class="card-front">
            <h4 class="card-front-title dynapuff-font">Question</h4>
            <div class="card-front-text dynapuff-font">Sample only 123</div>
            <div class="card-back-action"><button class="card-action"><span class="material-symbols-outlined">delete</span></button></div>
            </div>
        <div class="card-back">
            <h4 class="card-back-title dynapuff-font">Answer</h4>
            <div class="card-back-text dynapuff-font">Sample only 123</div>
        </div>
    </div>
    </div>`)
    
    // Flashcard Items Container
    const flashcardContainer = $(`.flashcards`)
    // Flashcard Form Modal
    const flashcardModal = $(`#form-modal`)
    // Flashcard Form
    const FCForm = $(`#flashcard-form`)
    // New Flashcard Item Button
    const newFCButton = $(`#btn-new-flashcard`)
    // Flashcard Modal Close Button
    const FCCloseButton = $(`#form-modal .form-modal-close`)
    // Stored Flashcard Data
    var FCData = localStorage.getItem('fc_data') || '[]';
    FCData = JSON.parse(FCData);
    
    // New Flashcard Button Click Event Listener
    newFCButton.click(function (e) {
        e.preventDefault();
        FCForm[0].reset();
        $('#fc_id').val("")
        flashcardModal.addClass("shown");
    })
    
    // Flashcard Modal Close Button Click Event Listener
    FCCloseButton.click(function (e) {
        e.preventDefault()
        FCForm[0].reset();
        $('#fc_id').val("")
        if (flashcardModal.hasClass("shown"))
            flashcardModal.removeClass("shown");
    })
    
    // Generate New Flashcard Item ID
    function generateNewID() {
        var id = 0;
        if (FCData.length > 0) {
            for (var i = 0; i < FCData.length; i++) {
                if (id < FCData[i].id) {
                    id = FCData[i].id;
                }
            }
        }
        id++;
        return id;
    }
    
    // New Flashcard submit event
    FCForm.submit(function (e) {
        e.preventDefault();
        var id = $('#fc_id').val()
        if (id == "") {
            id = generateNewID();
            FCData.push({ id: id, question: $(`#question`).val(), answer: $(`#answer`).val() });
        } else {
            for (var i = 0; i < FCData.length; i++) {
                if (id == FCData[i].id) {
                    FCData[i] = { id: id, question: $(`#question`).val(), answer: $(`#answer`).val() };
                }
            }
        }
    
        FCForm[0].reset();
        $('#fc_id').val("")
        localStorage.setItem("fc_data", JSON.stringify(FCData));
        load_flashcards();
        if (flashcardModal.hasClass("shown"))
            flashcardModal.removeClass("shown");
    })
    
    // Load Flashcard Items
    function load_flashcards() {
        flashcardContainer.html("")
        for (var i = 0; i < FCData.length; i++) {
            var data = FCData[i];
            var fc_item = flashcard_item.clone(true);
            fc_item.find(`.card-front-text`).text(data.question)
            fc_item.find(`.card-back-text`).text(data.answer)
            fc_item[0].dataset.id = data.id
            flashcardContainer.append(fc_item)
    
            // Flashcard item card flip event to view answer
            fc_item.click(function (e) {
                e.preventDefault()
                var buttonHtml = new RegExp(($(this).find("button.card-action")[0].outerHTML), "i");
    
                if ($.contains($(this).find("button.card-action")[0], e.target) || $(this).find("button.card-action")[0] == e.target)
                    return;
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active")
                } else {
                    $(this).addClass("active")
                }
            })
    
            // Flashcard item card delete button event
            fc_item.find("button.card-action").click(function (e) {
                e.preventDefault()
                var id = $(this).closest(".card")[0].dataset.id
                if (confirm(`Are you sure to delete this Flashcard Item`)) {
                    for (var z = 0; z < FCData.length; z++) {
                        if (id == FCData[z].id) {
                            delete FCData[z];
                            FCData = FCData.filter(elm => elm)
    
                            localStorage.setItem("fc_data", JSON.stringify(FCData));
                            load_flashcards();
                        }
                    }
                }
            })
        }
    }
    
    $(document).ready(function () {
        // Load flashcards
        load_flashcards();
    })