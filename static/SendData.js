function send(){
    let personalitycategories = ["Pünktlich","Durchsetzungsfähig","Aufgabenorientiert"," Ruhig", "Direkt","Freundlich", "Spontan", "Impulsiv"];
    let personalitycategoriesValues = [];
    for(let i = 0; i < personalitycategories.length; i++){
        let value = localStorage.getItem(`${personalitycategories[i]}`);
        if(value!= null){
            personalitycategoriesValues[i] = value;
        }
        else{
            personalitycategoriesValues[i] = ("");
        }
    }
    let musteraufgabecategories = ["Richtig", "Falsch", "Unbearbeitet"];
    let musteraufgabecategoriesValues = [];
    for(let i = 0; i < musteraufgabecategories.length; i++){
        let value = localStorage.getItem(`${musteraufgabecategories[i]}`)
        if(value != null){
            musteraufgabecategoriesValues[i] = value;
        }
        else{
            musteraufgabecategoriesValues[i] = ("");
        }
    }
    let keycategories = ["Richtig", "Falsch", "Unbearbeitet"];
    let keyCategoriesValues = [];
    for(let i = 0; i < keycategories.length; i++){
        let value = localStorage.getItem(`${keycategories[i]}`)
        if(value != null){
            keyCategoriesValues[i] = value;
        }
        else{
            keyCategoriesValues[i] = ("");
        }
    }
    fetch('/LandingPage',{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({points:personalitycategoriesValues, values:musteraufgabecategoriesValues, keyValues: keyCategoriesValues})
    });
};
document.addEventListener("DOMContentLoaded", function(){
send();
});
document.getElementById('Send').addEventListener('click', function(){
    window.location.href = "/";
});