let barChart;
function initializeChart1(){
    const id = localStorage.getItem('user_id')
    fetch('/Test_Results',{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({id:id})
    })
    .then(response => response.json())
    .then(dataBar =>{
        const targetPlugin = {
            id: 'targetLine',
            beforeDraw: chart => {
                const { ctx, scales: { x, y } } = chart;
                const { targetValues } = chart.data.datasets[0];
                
                targetValues.forEach((target, index) => {
                    const xPosStart = x.getPixelForValue(index) - (x.getPixelForValue(index) - x.getPixelForValue(index - 1)) / 2;
                    const xPosEnd = x.getPixelForValue(index) + (x.getPixelForValue(index + 1) - x.getPixelForValue(index)) / 2;
                    const yPos = y.getPixelForValue(target);
                    
                    ctx.save();
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(xPosStart, yPos);
                    ctx.lineTo(xPosEnd, yPos);
                    ctx.stroke();
                    ctx.restore();
                });
            }
        };
        
        const data_barchart = {
            labels: ['Nein', 'Ja', 'Vllt'],
            datasets: [{
                label: 'Data',
                data: dataBar.pattern,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                targetValues: [10, 15, 5]
            }]
        };
        
        const options_barchart = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Placeholder'
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
            },
            scales: {
                x: {
                    grid: {
                        drawOnChartArea: false // Verhindert, dass die gestrichelte Linie hinter den Balken gezeichnet wird
                    }
                }
            }
        };
        
        barChart = new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: data_barchart,
            options: options_barchart,
            plugins: [targetPlugin]
        });

    })
    .catch(error => console.error('Error fetching data:', error));
}

function updateChart1(){
    const data = document.getElementById('user_id').value;
    fetch('/Test_Results',{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({id:data})
    })
    .then(response => response.json())
    .then(dataBar => {
        barChart.data.datasets[0].data = dataBar.key;
        barChart.update()
    })
}
document.addEventListener("DOMContentLoaded", function () {
    initializeChart1();
});

document.addEventListener("change", function(){
    updateChart1();
});