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
        const test_requirements = document.getElementById('tests');
        const testStatusHTML = `
            <ul>
                <li>Persönlichkeitstest: ${dataRadar.test_status.persoenlichkeitstest}</li>
                <li>Musteraufgabe: ${dataRadar.test_status.musteraufgabe}</li>
                <li>Schlüsselaufgabe: ${dataRadar.test_status.schluesselaufgabe}</li>
            </ul>
        `;

        test_requirements.innerHTML = testStatusHTML;
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
        const test_requirements = document.getElementById('tests');
        const testStatusHTML = `
            <ul>
                <li>Persönlichkeitstest: ${dataRadar.test_status.persoenlichkeitstest}</li>
                <li>Musteraufgabe: ${dataRadar.test_status.musteraufgabe}</li>
                <li>Schlüsselaufgabe: ${dataRadar.test_status.schluesselaufgabe}</li>
            </ul>
        `;

        test_requirements.innerHTML = testStatusHTML;

    })
});
