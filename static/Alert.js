document.addEventListener("DOMContentLoaded", function(){
    const id = document.getElementById('user_id').value;
    fetch('/Test_Results',{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({id:id})
    })
    .then(response => response.json())
    .then(dataRadar => {
        const status = document.getElementById('status');
        status.innerText = dataRadar.label;
    })
});
document.addEventListener("change", function(){
    const id = document.getElementById('user_id').value;
    fetch('/Test_Results',{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({id:id})
    })
    .then(response => response.json())
    .then(dataRadar => {
        const status = document.getElementById('status');
        status.innerText = dataRadar.label;
    })
});
