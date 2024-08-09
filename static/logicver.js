document.addEventListener('DOMContentLoaded', function() {
    const questions = [
        {
            correctAnswer: 1,
            image: "https://www.fibonicci.com/images/nonverbal/non-verbal-example.png",
            question: "Welche Figur kommt als nächstes in der Reihe?"
        },
        {
            correctAnswer: 3,
            image: "https://www.fibonicci.com/images/test_images_2019/non-verbal-hard-test-2.png",
            question: "Was ist die fehlende Figur?"
        },
        {
            correctAnswer: 3,
            image: "https://www.fibonicci.com/images/test_images_2019/non-verbal-hard-test-7.png",
            question: "Was kommt als nächstes in der Reihe?"
        }
    ];

    let currentQuestionIndex = 0;
    const questionImage = document.getElementById('question-image');
    const questionText = document.getElementById('question-text');
    const resultContainer = document.getElementById('result');

    localStorage.setItem('musteraufgabe_richtig', '0');
    localStorage.setItem('musteraufgabe_falsch', '0');
    localStorage.setItem('musteraufgabe_unbearbeitet', questions.length.toString());

    function displayNextQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionImage.src = question.image;
            questionText.textContent = question.question;
        } else {
            document.getElementById('question-container').innerHTML = 'Test beendet.';
            sendResults();
        }
    }

    window.selectAnswer = function(index) {
        const unbearbeitet = parseInt(localStorage.getItem('musteraufgabe_unbearbeitet'));
        localStorage.setItem('musteraufgabe_unbearbeitet', (unbearbeitet - 1).toString());

        if (index === questions[currentQuestionIndex].correctAnswer) {
            const richtig = parseInt(localStorage.getItem('musteraufgabe_richtig'));
            localStorage.setItem('musteraufgabe_richtig', (richtig + 1).toString());
        } else {
            const falsch = parseInt(localStorage.getItem('musteraufgabe_falsch'));
            localStorage.setItem('musteraufgabe_falsch', (falsch + 1).toString());
        }

        currentQuestionIndex++;
        if (currentQuestionIndex === 3) {
            showCompletionMessage();
        } else {
            displayNextQuestion();
        }
    }

    function sendResults() {
        console.log('Test completed');
        document.getElementById('question-container').innerHTML = 'Test beendet. Vielen Dank!';
        setTimeout(() => {
            window.location.href = 'https://www.google.com';
        }, 3000);
    }

    function showCompletionMessage() {
        const container = document.getElementById('question-container');
        container.innerHTML = `
            <p class="mb-4">Sie haben das Modul erfolgreich abgeschlossen. Klicken Sie unten, um zurückzusetzen.</p>
            <button onclick="returnToOverview()" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Zurück zur Übersicht</button>
        `;
    }

    window.returnToOverview = function() {
        window.location.href = '/Home';
    }

    displayNextQuestion();
});

console.log("logicver.js loaded and running");
