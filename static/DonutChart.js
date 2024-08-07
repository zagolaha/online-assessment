let donutChart;
function initializeChart2(){
    const id = localStorage.getItem('user_id')
    fetch('/Test_Results',{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({id:id})
    })
    .then(response => response.json())
    .then(dataDonut => {
        const DoughnutTarget = {
            id: 'doughnutTarget',
            afterDatasetsDraw(chart, args, plugins){
                const {ctx, data} = chart;
        
                ctx.save();
                //x und y Mitte vom Donut
                const x = chart.getDatasetMeta(0).data[0].x;
                const y = chart.getDatasetMeta(0).data[0].y;
                //Radius und dicke zum platzieren
                const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
                const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
                const thickness = outerRadius -innerRadius;
                //Zielwert 
                const value = plugins.pointerTarget;
                const angle = Math.PI / 180;
        
                //addData
                function sumArray(array){
                    return array.reduce((acc, current) => acc + current, 0);
                }
                const dataPointArray = data.datasets[0].data.map((datapoint) =>{
                    return datapoint
                })
                const sum = sumArray(dataPointArray);
                
                const valueRotation = value / sum *360;
        
                ctx.font = '50px';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.baseline = 'middle';
                ctx.fillText('x / 60',x,y)
        
                ctx.translate(x,y);
                //PLatzierung dann
                ctx.rotate(angle * valueRotation );
                
        
                ctx.beginPath();
                ctx.fillStyle = 'black';
                ctx.roundRect(0, -outerRadius-5, 2, thickness +10, 0);
                ctx.fill();
        
                ctx.restore();
            }
        };
        
        const data = {
            labels: ['Richtig', 'Unbearbeitet'],
            datasets:[{
                data: dataDonut.key,
                backgroundColor:['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor:['#FF6384', '#36A2EB', '#FFCE56']
            }]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins:{
                title:{
                    display: true,
                    text:'Placeholder'
                },
                legend:{
                    display: true,
                    position: 'bottom',
                    labels:{
                        usePointStyle: true,
                        padding: 20,
                        color: '#4A5568',
                        boxWidth: 15
                    }
                },
                doughnutTarget:{
                    pointerTarget: 10
                }
            }
        };
        donutChart = new Chart(document.getElementById('donutChart'), {
            type: 'doughnut',
            data: data,
            options: options,
            plugins:[DoughnutTarget]
        });
    })
};
function updateChart2(){
    const data = document.getElementById('user_id').value;
    fetch('/Test_Results',{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({id:data})
    })
    .then(response => response.json())
    .then(dataDonut => {
        donutChart.data.datasets[0].data = dataDonut.pattern;
        donutChart.update()
    })
};
document.addEventListener("DOMContentLoaded", function () {
    initializeChart2();
});

document.addEventListener("change", function(){
    updateChart2();
});
