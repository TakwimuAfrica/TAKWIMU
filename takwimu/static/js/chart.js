var barChartData = {
    labels: ['2015', '2016', '2017'],
    datasets: [{
        label: 'Youth Unemployment',
        backgroundColor: 'rgb(54, 162, 235)', //Blue
        data: [
            11,
            25,
            33
        ]
    }, {
        label: 'Unemployment',
        backgroundColor: 'rgb(153, 102, 255)', //Purple
        data: [
            8,
            11,
            18
        ],
        
    }]
};
window.onload = function () {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            title: {
                display: true,
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                    barThickness: 50
                }],
                yAxes: [{
                    stacked: true,
                }]
            }
        }
    });
};
