let radarChart;
function initializeChart(){
    fetch('/get_data')
    .then(response => response.json())
    .then(dataRadar => {
        const data1 = {
            labels: ['Pünktlich', 'Durchsetzungsfähig', 'Aufgabenorientiert', 'Ruhig', 'Direkt', 'Freundlich', 'Spontan', 'Impulsiv'],
            datasets: [{
                data: dataRadar.values
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
    fetch('/get_data')
    .then(response => response.json())
    .then(dataRadar => {
        console.log(dataRadar)
        radarChart.data.datasets[0].data = dataRadar.values;
        radarChart.update();
    })
};
document.addEventListener("DOMContentLoaded", function () {
    initializeChart();
});

document.addEventListener("change", function(){
    updateChart();
});
