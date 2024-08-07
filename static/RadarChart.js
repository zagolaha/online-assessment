let radarChart;
function initializeChart(){
    const id = localStorage.getItem('user_id')
    fetch('/Test_Results',{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({id:id})
    })
    .then(response => response.json())
    .then(dataRadar => {
        const data1 = {
            labels: ['Pünktlich', 'Durchsetzungsfähig', 'Aufgabenorientiert', 'Ruhig', 'Direkt', 'Freundlich', 'Spontan', 'Impulsiv'],
            datasets: [{
                data: dataRadar.personality
            }]
        };
        const options1 = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Persönlichkeit'
                },
                legend: {
                    display: false,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        color: '#4A5568',
                        boxWidth: 15
                    }
                }
            }
        };
        radarChart = new Chart(document.getElementById('radarChart'), {
            type: 'radar',
            data: data1,
            options: options1
        });
    })

    .catch(error => console.error('Error fetching data:', error));

};
function updateChart(){
    const data = document.getElementById('user_id').value;
    fetch('/Test_Results',{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({id:data})
    })
    .then(response => response.json())
    .then(dataRadar => {
        radarChart.data.datasets[0].data = dataRadar.personality;
        radarChart.update();
    })
};
document.addEventListener("DOMContentLoaded", function () {
    initializeChart();
});

document.addEventListener("change", function(){
    updateChart();
});
