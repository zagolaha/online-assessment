const rounds = 5;
const secondsPerRound = 10;
let totalSeconds = rounds * secondsPerRound;
let score = 0;

function start_test() {
    // hide introduction div
    document.getElementById('startingSection').hidden = true;

    // reveal new elements
    document.getElementById('timerPanel').hidden = false;
    document.getElementById('gridPanel').hidden = false;

    fill_grid();
    start_timer();
}

function start_timer() {
    const interval = setInterval(function() {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $("#timer").text(minutes + ":" + seconds);

        totalSeconds--;

        if (totalSeconds < 0) {
            clearInterval(interval);
            score /= rounds;
            score = Math.round((score + Number.EPSILON) * 100) / 100; // percentage
            localStorage.setItem("Timed_KeySelects", score);
            location.href = "/Timed_KeySelects_Closing";
        } else if (totalSeconds % secondsPerRound == 0) {
            update_score();
            fill_grid();
        }
    }, 1000);
}

function fill_grid() {
    let teeth = Math.floor(Math.random() * 3) + 1;
    document.getElementById("teeth").innerText = teeth.toString();

    $('img').each( function( index, element ){
        $(this).removeClass("bg-green-100 selected");

        let count = Math.floor(Math.random() * 3) + 1;
        $(this).attr("src", "/static/key_" + count + ".png");
        $(this).data("teeth", count);

        let flip = Math.random() <= 0.5;
        if (flip) $(this).toggleClass("-scale-x-100");

        $(this).off('click').on('click', function() {       // NOTE: event listener needs to be
                                                            // detached before re-attaching, otherwise
                                                            // the elements become non-reactive.
            $(this).toggleClass("bg-green-100 selected");
        });
    });
}

function update_score() {
    let teeth = document.getElementById("teeth").innerText;
    let roundScore = 0;
    let elements = 0;

    $('img').each(function(index, element) {
        elements++;
        let count = $(this).data("teeth");
        let selected = $(this).hasClass("selected");

        if ((count == teeth && selected) || (count != teeth && !selected)) roundScore += 1;
        else roundScore -= 1;
    })

    if (roundScore < 0) roundScore = 0;
    else roundScore = roundScore / elements;
    score += roundScore;
}
