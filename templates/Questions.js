const questions = [
    //Pünktlich
    "Ich komme immer mindestens 5 Minuten vor dem vereinbarten Termin an.",
    "Ich plane bei meiner Anreise immer einen zeitlichen Puffer ein.",
    "Ich habe im letzten Jahr nicht einen Termin verpasst.",
    "Wenn ich merke ich schaffe es nicht pünktlich zu sein, informiere ich meinen Gegenüber rechtzeitig.",
    //Durchsetzungsfähigkeit
    "Ich habe in der Schule immer meine Abgabetermine eingehalten.",
    "Ich bin in der Lage andere von meiner Meinung zu überzeugen.",
    "Ich stehe zu meinen Überzeugungen, auch wenn sie von anderen kritisiert werden.",
    "Ich knicke unter Druck nicht ein.",
    "Ich laufe nicht vor Herausforderungen weg.",
    "Ich finde es leicht, Nein zu sagen, wenn ich etwas nicht tun möchte oder nicht für richtig halte.",
    //Aufgabenorientiert
    "Frage 11:",
    "Frage 12:",
    "Frage 13:",
    "Frage 14:",
    "Frage 15:",
    "Frage 16:",
    "Frage 17:",
    "Frage 18:",
    "Frage 19:",
    "Frage 20:",
    "Frage 21:",
    "Frage 22:",
    "Frage 23:",
    "Frage 24:",
    "Frage 25:",
    "Frage 26:",
    "Frage 27:",
    "Frage 28:",
    "Frage 29:",
    "Frage 30:",
    "Frage 31:",
    "Frage 32:",
    "Frage 33:",
    "Frage 34:",
    "Frage 35:",
    "Frage 36:",
    "Frage 37:",
    "Frage 38:",
    "Frage 39:",
    "Frage 40:"
];
let questionsIndex = 0;

const questionsText = document.getElementById('questions-place');
const questionsForm = document.getElementById('question-form');
const nextButton = document.getElementById('next');
const backButton = document.getElementById('back');

function saveAnswer(index, answer){
    localStorage.setItem(`${index}_question`, answer);
}

function loadAnswer(index){
    return localStorage.getItem(`${index}_question`);
}

function loadQuestion(index) {
    questionsText.innerText = questions[index];
    const savedAnswer = loadAnswer(index);
    const options = questionsForm.elements['options'];
    for (let option of options){
        option.checked = option.value === savedAnswer;
    }
}

//Aktuell nicht benötigt aber in meiner Idee brauche ich die bald noch
function resetRadioButtons() {
    const radioButtons = document.querySelectorAll('input[name="options"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
}

function showNextQuestions() {
    const selected = document.querySelector('input[name="options"]:checked')
    if(selected){
        saveAnswer(questionsIndex, selected.value);
        if (questionsIndex < questions.length - 1) {
            questionsIndex++;
            loadQuestion(questionsIndex);
        }
    }
    
}

function showLastQuestions(){
    if(questionsIndex > 0){
        questionsIndex--;
        loadQuestion(questionsIndex);
    }
}


loadQuestion(questionsIndex);
nextButton.addEventListener('click', (event) => {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    showNextQuestions();
});

backButton.addEventListener('click',(event) =>{
    event.preventDefault();
    showLastQuestions();
} )
