// NOTE: this is work in progress

function startup() {
    // remove elements
    document.getElementById('startingSection').hidden = true;

    // reveal new elements
    document.getElementById('timerPanel').hidden = false;
    document.getElementById('gridPanel').hidden = false;

    start_test();
}

function start_test() {
    start_timer();
    fill_grid();

    // handle multiple rounds
}

function start_timer() {
    // not implemented
}

function fill_grid() {
    $( ' img' ).each( function( index, element ){
        // set random key image
    });
}