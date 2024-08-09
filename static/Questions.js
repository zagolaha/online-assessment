const questions = [
    //Pünktlich
    "Ich komme immer mindestens 5 Minuten vor dem vereinbarten Termin an.",
    "Ich plane bei meiner Anreise immer einen zeitlichen Puffer ein.",
    "Ich habe im letzten Jahr nicht einen Termin verpasst.",
    "Wenn ich merke ich schaffe es nicht pünktlich zu sein, informiere ich meinen Gegenüber rechtzeitig.",
    "Ich habe in der Schule immer meine Abgabetermine eingehalten.",
    //Durchsetzungsfähigkeit
    "Ich bin in der Lage andere von meiner Meinung zu überzeugen.",
    "Ich stehe zu meinen Überzeugungen, auch wenn sie von anderen kritisiert werden.",
    "Ich knicke unter Druck nicht ein.",
    "Ich laufe nicht vor Herausforderungen weg.",
    "Ich finde es leicht, Nein zu sagen, wenn ich etwas nicht tun möchte oder nicht für richtig halte.",
    //Aufgabenorientiert
    "Ich priorisiere meine Aufgaben.",
    "Ich beginne Aufgaben sofort und schiebe sie nicht vor mich hin.",
    "Ich halte mich an meine Deadlines.",
    "Ich hole mir Unterstützung oder zusätzliche Ressourcen, wenn ich sie brauche.",
    "Ich bereite mich entsprechend auf meine Aufgaben vor.",
    //Ruhig
    "Ich lasse mich nicht leicht von anderen aus der Ruhe bringen.",
    "Ich kann meine Emotionen gut kontrollieren, auch wenn ich verärgert bin.",
    "Ich bleibe in stressigen Situationen ruhig und gelassen.",
    "Ich gehe ruhig und systematisch an Probleme heran.",
    "Ich kann ruhig bleiben, auch wenn mich jemand provoziert.",
    //Direkt
    "Ich sage klar und deutlich, was ich denke.",
    "Ich vermeide es, um den heißen Brei herumzureden.",
    "Ich kommuniziere offen über meine Bedürfnisse und Wünsche.",
    "Ich konfrontiere andere direkt, wenn ich ein Problem mit ihrem Verhalten habe.",
    "Ich finde es wichtig, offen und ehrlich zu kommunizieren, auch wenn es schwierig ist.",
    //Freundlich
    "Ich biete meine Hilfe an, wenn ich sehe, dass jemand sie benötigt.",
    "Ich bedanke mich regelmäßig für kleine Gefälligkeiten.",
    "Ich bin höflich und respektvoll, auch wenn ich anderer Meinung bin.",
    "Ich biete oft meine Unterstützung an, ohne dass man mich darum bittet.",
    "Ich bin höflich und zuvorkommend, selbst in stressigen Situationen.",
    //Spontan
    "Ich entscheide mich oft spontan für Aktivitäten oder Ausflüge.",
    "Ich kann leicht auf unerwartete Ereignisse reagieren und mich anpassen.",
    "Ich bin bereit, Pläne aufzugeben, wenn sich eine interessantere Gelegenheit bietet.",
    "Ich nehme oft spontane Herausforderungen an, um meine Komfortzone zu erweitern.",
    "Ich bin oft derjenige, der spontane Pläne für den Abend vorschlägt.",
    //Impulsiv
    "Ich handle oft, ohne vorher über die Konsequenzen nachzudenken.",
    "Ich unterbreche andere häufig in Gesprächen, weil ich meine Gedanken sofort teilen möchte.",
    "Ich habe Schwierigkeiten, meine Emotionen zu kontrollieren, wenn ich aufgeregt bin.",
    "Ich gerate schnell in Streitigkeiten, weil ich impulsiv reagiere.",
    "Ich fühle mich oft gezwungen, sofort zu handeln, wenn mir etwas in den Sinn kommt."
];
let questionsIndex = 0;

const questionsText = document.getElementById('questions-place');
const questionsForm = document.getElementById('question-form');
const nextButton = document.getElementById('next');
const backButton = document.getElementById('back');
const endButton = document.getElementById('stop');

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
        else{
            nextButton.classList.toggle('hidden');
            endButton.classList.toggle('hidden');

        }
    }
    
}

function showLastQuestions(){
    if(questionsIndex > 0){
        questionsIndex--;
        loadQuestion(questionsIndex);
        nextButton.classList.remove('hidden');
        endButton.classList.add('hidden');
    }
}
let categories = ["Pünktlich","Durchsetzungsfähig","Aufgabenorientiert"," Ruhig", "Direkt","Freundlich", "Spontan", "Impulsiv"];
let categoriesValues = [];
let c = 0;
function end(){
    for(let i = 0; i< questions.length; i += 5){
        let x = 0;
        for (let j = 0; j <5; j++){
            let value = localStorage.getItem(`${i+j}_question`);
            x += parseFloat(value)/5;
        }
        if(c < categories.length){
            localStorage.setItem(`${categories[c]}`,Math.round(x));
        }
        c++;
    }
    window.location.href = "/Home"; 
};


loadQuestion(questionsIndex);
nextButton.addEventListener('click', (event) => {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    showNextQuestions();
});

backButton.addEventListener('click',(event) =>{
    event.preventDefault();
    showLastQuestions();
} );

endButton.addEventListener('click', (event) =>{
    event.preventDefault();
    end();
});
