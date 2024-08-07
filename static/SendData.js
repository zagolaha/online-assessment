function send(){
    let userID = localStorage.getItem('user_id');
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
    let musteraufgabecategories = ["musteraufgabe_richtig", "musteraufgabe_falsch", "musteraufgabe_unbearbietet"];
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
    let schlüsselaufgabeValues = [];
    let value = localStorage.getItem('Timed_KeySelects');
    if(value != null){
        schlüsselaufgabeValues[0] = value * 100;
        schlüsselaufgabeValues[1] = 100 - value;
    }
    else{
        keyValue = ("");
    }
    
    fetch('/ClosingPage',{ //NOTE(Hagen): is this the right endpoint??
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({id:userID, points:personalitycategoriesValues, values:musteraufgabecategoriesValues, keyValues: schlüsselaufgabeValues})
    });
};

function clearLocalStorage(){
    let user_id = localStorage.getItem('user_id');
    localStorage.clear();
    localStorage.setItem('user_id', user_id)
}
document.addEventListener("DOMContentLoaded", function(){
send();
});
document.getElementById('Send').addEventListener('click', function(){
    clearLocalStorage();
    window.location.href = "/Dashboard";
});