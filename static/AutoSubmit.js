document.addEventListener('DOMContentLoaded', function(){
    const selectElement = document.getElementById('user_id');
    selectElement.addEventListener('change',function(){
        const data = document.getElementById('user_id').value
        console.log(data)
        fetch('/get_id',{
            method: "POST",
            headers:{"Content-Type" : "application/json"},
            body: 
                JSON.stringify({id:data}),
        })
    });
});