    const data1 = {
    labels: ['Aufgabenorientiert', 'Durchsetzungsfähig', 'Ruhig', 'Pünktlich', 'Direkt', 'Freundlich', 'Spontan', 'Impulsiv'],
    datasets: [{
        data: [7,8,2,0,7,9,9,8]
    }]
};
const options1 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title:{
            display: true,
            text:'Persönlichkeit'
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
const radarChart = new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: data1,
    options: options1
});