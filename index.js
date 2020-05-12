$(document).ready(function () {

    let isRunning = false;
    let intervals = [];
    let clear = [];
    let infected = [];
    let recovered = [];

    $('button').click(function () {

        if (!isRunning) {
            isRunning = true;
            createSubjects(isRunning, intervals);
            $('button').text('Click to stop animation');

        } else {

            isRunning = false;
            intervals.forEach(clearInterval);
            $('#model-container').empty();
            $('button').text('Click to start animation');
        }
    });
});

let createSubjects = function (isRunning, intervals) {

    let numClear = $('#numClear').val();
    let numInfected = $('#numInfected').val();
    let numRecovered = 0;
    let globalX;
    let globalY;
    let tdays = 0;

    for (let i = 0; i < numClear; i++) {
        let xCoord = Math.floor(Math.random() * 980);
        let yCoord = Math.floor(Math.random() * 380);
        let xRightMovement = Math.round(Math.random());
        let yDownMovement = Math.round(Math.random());

        $('#model-container').append(`<div id="clear-${i}" class="clear"></div>`);

        let animate = setInterval(function () {

            if (xRightMovement) {
                xCoord++;
            } else {
                xCoord--;
            }

            if (yDownMovement) {
                yCoord++;
            } else {
                yCoord--;
            }

            if (xCoord >= 980) {
                xRightMovement = false;
            }

            if (xCoord <= 0) {
                xRightMovement = true;
            }

            if (yCoord <= 0) {
                yDownMovement = true;
            }

            if (yCoord >= 380) {
                yDownMovement = false;
            }

            let xDiff = Math.abs(globalX - xCoord);
            let yDiff = Math.abs(globalY - yCoord);
            let color = $(`#clear-${i}`).css('background-color');
            
            $(`#clear-${i}`).css({
                "margin-left": xCoord,
                "margin-top": yCoord
            });

            if (yDiff < 20 && xDiff < 20 && color === 'rgb(173, 216, 230)') {
                console.log('infection spreading');
                console.log('color', color);
                $(`#clear-${i}`).css('background-color', 'palevioletred');
                numInfected++;
                numClear--;

                let symptomPeriod = Math.floor(Math.random() * 10000) + 10000;

                setTimeout(function () {
                    $(`#clear-${i}`).css('background-color', 'green');
                    numRecovered++;
                    numInfected--;
                    
                }, symptomPeriod);
            }

        }, 5);

        intervals.push(animate);
    }

    let percentUpdate = setInterval(function () {
        $('#percent-infected').text(Math.round((numInfected / (numClear + numRecovered + numInfected)) * 100));
        $('#percent-recovered').text(Math.round((numRecovered/(numRecovered + numClear + numInfected)) * 100));
    }, 100);

    intervals.push(percentUpdate);

    for (let i = 0; i < numInfected; i++) {
        let xCoord = Math.floor(Math.random() * 980);
        let yCoord = Math.floor(Math.random() * 380);
        let xRightMovement = Math.round(Math.random());
        let yDownMovement = Math.round(Math.random());
        let symptomPeriod = Math.floor(Math.random() * 10000) + 10000;

        $('#model-container').append(`<div id="infected-${i}" class="infected"></div>`);

        setTimeout(function () {
            $(`#infected-${i}`).css('background-color', 'green');
            numRecovered++;
            numInfected--;
        }, symptomPeriod);

        let animate = setInterval(function () {

            if (xRightMovement) {
                xCoord++;
            } else {
                xCoord--;
            }

            if (yDownMovement) {
                yCoord++;
            } else {
                yCoord--;
            }

            if (xCoord >= 980) {
                xRightMovement = false;
            }

            if (xCoord <= 0) {
                xRightMovement = true;
            }

            if (yCoord <= 0) {
                yDownMovement = true;
            }

            if (yCoord >= 380) {
                yDownMovement = false;
            }

            $(`#infected-${i}`).css({
                "margin-left": xCoord,
                "margin-top": yCoord
            });

            globalX = xCoord;
            globalY = yCoord;

        }, 5);

        intervals.push(animate);

    }
}

