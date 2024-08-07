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
            resultContainer.textContent = 'Richtig!';
        } else {
            const falsch = parseInt(localStorage.getItem('musteraufgabe_falsch'));
            localStorage.setItem('musteraufgabe_falsch', (falsch + 1).toString());
            resultContainer.textContent = 'Falsch!';
        }

        currentQuestionIndex++;
        displayNextQuestion();
    }

    function sendResults() {
        const data = {
            richtig: localStorage.getItem('musteraufgabe_richtig'),
            falsch: localStorage.getItem('musteraufgabe_falsch'),
            unbearbeitet: localStorage.getItem('musteraufgabe_unbearbeitet')
        };

        fetch('/save_results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = 'https://www.google.com';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    displayNextQuestion();
});
console.log("logicver.js loaded and running");
