$(document).ready(function () {

    let isRunning = false;
    let subjects = [];
    let animate;
    let clear = 0;
    let infected = 0;
    let recovered = 0;
    let newModel = true;
    let timer;
    let tDays = 0;
    let days = [];
    let dailyCount = 0;

    $('#reset').click(function () {
        location.reload();
    });

    $('#animate').click(function () {
        let rNaught = parseFloat($('#r-naught').val());
        let speed = Math.round((rNaught + 100) / rNaught);
        let infectiousPeriod = 5000 * parseInt($('#infectiousPeriod').val());
        let variation = 5000 * parseInt($('#variation').val());
        let message = '';
        let inputClear = $('#numClear').val();
        let inputInfected = $('#numInfected').val();
        let inputPeriod = parseInt($('#infectiousPeriod').val());
        let inputVariation = parseInt($('#variation').val());

        clear = parseInt($('#numClear').val());
        infected = parseInt($('#numInfected').val());
        $('#numClear').attr('disabled', 'true');
        $('#numInfected').attr('disabled', 'true');
        $('#r-naught').attr('disabled', 'true');
        $('#infectiousPeriod').attr('disabled', 'true');
        $('#variation').attr('disabled', 'true');
        $('#animate').removeClass('btn-success').addClass('btn-danger');

        if (rNaught < 1 || rNaught > 10) {
            message = 'Please choose a Spread Rate between 1 and 10.';
        } else if (inputClear < 1 || inputClear > 100) {
            message = 'Please choose a Number of Non-infected between 1 and 100.';
        } else if (inputInfected < 1 || inputInfected > 100) {
            message = 'Please choose a Number of Infected between 1 and 100.';
        } else if (inputPeriod < 1 || inputPeriod > 100) {
            message = 'Please choose an Infectious Period between 1 and 100.';
        } else if (inputVariation < 0 || inputVariation > 100) {
            message = 'Please choose a Variation in Infectious Period between 0 and 100.';
        }

        if (!message) {

            if (!isRunning) {
                isRunning = true;
                $('#animate').text('Click to stop animation');

                if (newModel) {

                    for (let i = 0; i < clear; i++) {
                        let xCoord = Math.floor(Math.random() * 980);
                        let yCoord = Math.floor(Math.random() * 380);
                        let xRightMovement = Math.round(Math.random());
                        let yDownMovement = Math.round(Math.random());
                        $('#model-container').append(`<div id=${i} class="clear"></div>`);

                        let clrSub = {
                            id: i,
                            xCoord,
                            yCoord,
                            xRightMovement,
                            yDownMovement,
                            timeSinceInf: 1,
                            status: 'clear'
                        };

                        subjects.push(clrSub);

                    }

                    for (let i = 0; i < infected; i++) {
                        let xCoord = Math.floor(Math.random() * 980);
                        let yCoord = Math.floor(Math.random() * 380);
                        let xRightMovement = Math.round(Math.random());
                        let yDownMovement = Math.round(Math.random());
                        $('#model-container').append(`<div id=${i + 100} class="infected"></div>`);

                        let infSub = {
                            id: i + 100,
                            xCoord,
                            yCoord,
                            xRightMovement,
                            yDownMovement,
                            timeSinceInf: Math.round(Math.random() * infectiousPeriod),
                            status: 'infected'
                        };

                        subjects.push(infSub);

                    }
                }

                timer = setInterval(() => {
                    tDays++;
                    let dailyTotal = {
                        day: tDays,
                        dailyCount
                    };

                    days.push(dailyTotal);
                    $('#dailyCount').text(dailyCount);
                    dailyCount = 0;
                }, 5000);

                animate = setInterval(() => {

                    $('#t-days').text(tDays);

                    let percentInfected = Math.round(infected / subjects.length * 100);
                    let percentRecovered = Math.round(recovered / subjects.length * 100);
                    let percentNever = Math.round(clear / subjects.length * 100);

                    $('#percent-infected').text(percentInfected);
                    $('#percent-recovered').text(percentRecovered);
                    $('#percent-never').text(percentNever);
                    $('#numberInfected').text(infected);
                    $('#numberRecovered').text(recovered);
                    $('#numberNever').text(clear);

                    subjects.forEach(function (value, index) {

                        movement(value);

                        if (value.timeSinceInf > 0 && value.status === 'infected') {
                            value.timeSinceInf -= speed;
                        }

                        if (value.timeSinceInf <= 0 && value.status === 'infected') {

                            value.status = 'recovered';

                            $(`#${value.id}`).removeClass('infected').addClass('recovered');
                            recovered++;
                            infected--;
                        }

                        subjects.forEach(function (current, ind) {

                            if (index !== ind && value.status === 'clear') {
                                let xDiff = Math.abs(current.xCoord - value.xCoord);
                                let yDiff = Math.abs(current.yCoord - value.yCoord);

                                if (yDiff < 20 && xDiff < 20 && current.status === 'infected') {

                                    $(`#${value.id}`).removeClass('clear').addClass('infected');
                                    clear--;
                                    infected++;
                                    dailyCount++;
                                    value.status = 'infected';
                                    value.timeSinceInf = Math.round(Math.random() * ((infectiousPeriod + variation) - (infectiousPeriod - variation)) + (infectiousPeriod - variation));
                                }
                            }
                        });
                    });
                }, speed);
            } else {
                clearInterval(animate);
                clearInterval(timer);
                isRunning = false;
                newModel = false;

                $('#animate').text('Click to start animation').removeClass('btn-danger').addClass('btn-success');
                createChart(days)
            }
        } else {
            $('#message').text(message);
            $('#myModal').modal('show');
            $('#close').click(() => {
                location.reload();
            });
        }
    });
});

function createChart(arrayOfObj) {
    let myLabels = [];
    let myData = [];
    arrayOfObj.forEach((value, index) => {
        myLabels.push(value.day);
        myData.push(value.dailyCount);
    });
    let ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset

        data: {
            labels: myLabels,
            datasets: [{
                label: 'Number of New Daily Infections',
                backgroundColor: 'rgb(219, 112, 147)',
                borderColor: 'rgb(219, 112, 147)',
                data: myData
            }]
        },

        // Configuration options go here

        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of New Infections'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Days'
                    }
                }]
            }
        }
    });
}

function movement(value) {
    if (value.xRightMovement) {
        value.xCoord++;
    } else {
        value.xCoord--;
    }

    if (value.yDownMovement) {
        value.yCoord++;
    } else {
        value.yCoord--;
    }

    if (value.xCoord >= 980) {
        value.xRightMovement = false;
    }

    if (value.xCoord <= 0) {
        value.xRightMovement = true;
    }

    if (value.yCoord <= 0) {
        value.yDownMovement = true;
    }

    if (value.yCoord >= 380) {
        value.yDownMovement = false;
    }

    $(`#${value.id}`).css({
        "margin-left": value.xCoord,
        "margin-top": value.yCoord
    });
}



