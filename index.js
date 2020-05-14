$(document).ready(function () {

    let isRunning = false;

    // let intervals = [];
    // let clear = [];
    // let infected = [];
    // let recovered = [];
    let subjects = [];
    let animate;
    let clear = 0;
    let infected = 0;
    let recovered = 0;
    let newModel = true;
    let timer;
    let tDays = 0;

    $('#reset').click(function() {
        location.reload();
    });

    $('#animate').click(function () {
        let rNaught = parseInt($('#r-naught').val());
        let speed = Math.round((rNaught + 100) / rNaught);
        let infectiousPeriod = 5000 * parseInt($('#infectiousPeriod').val());
        let variation = 5000 * parseInt($('#variation').val());

        clear = parseInt($('#numClear').val());
        infected = parseInt($('#numInfected').val());

        if (!isRunning) {
            isRunning = true;
            // createSubjects(isRunning, intervals);
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


                    // $(`#${i}`).css({
                    //     "margin-left": xCoord,
                    //     "margin-top": yCoord
                    // });
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
            }, 5000);

            animate = setInterval(() => {

                $('#t-days').text(tDays);

                let percentInfected = Math.round(infected / subjects.length * 100);
                let percentRecovered = Math.round(recovered / subjects.length * 100);
                let percentNever = Math.round(clear / subjects.length * 100);

                $('#percent-infected').text(percentInfected);
                $('#percent-recovered').text(percentRecovered);
                $('#percent-never').text(percentNever);

                subjects.forEach(function (value, index) {

                    movement(value);

                    if (value.timeSinceInf > 0 && value.status === 'infected') {
                        value.timeSinceInf -= speed;
                        // console.log('timeSinceInf', value.timeSinceInf);
                        // console.log(value.status);
                        // console.log('time since infection was decremented');
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
                                value.status = 'infected';
                                value.timeSinceInf = Math.round(Math.random() * ((infectiousPeriod + variation) - (infectiousPeriod - variation)) + (infectiousPeriod - variation));
                            }
                        }
                        // clear.splice(index, 1);

                        // movement(current);
                    });




                });

            }, speed);

        } else {
            clearInterval(animate);
            clearInterval(timer);
            isRunning = false;
            newModel = false;
            // intervals.forEach(clearInterval);
            // $('#model-container').empty();
            $('#animate').text('Click to start animation');
            // $('#t-days').text(0);
        }
    });
});

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

// let createSubjects = function (isRunning, intervals) {

// let numClear = $('#numClear').val();
// let numInfected = $('#numInfected').val();
//     let numRecovered = 0;
//     let globalX;
//     let globalY;
//     let globalColor;
//     let tdays = 0;

//     for (let i = 0; i < numClear; i++) {
// let xCoord = Math.floor(Math.random() * 980);
// let yCoord = Math.floor(Math.random() * 380);
// let xRightMovement = Math.round(Math.random());
// let yDownMovement = Math.round(Math.random());

//         $('#model-container').append(`<div id="clear-${i}" class="clear"></div>`);

// let animate = setInterval(function () {

// if (xRightMovement) {
//     xCoord++;
// } else {
//     xCoord--;
// }

// if (yDownMovement) {
//     yCoord++;
// } else {
//     yCoord--;
// }

// if (xCoord >= 980) {
//     xRightMovement = false;
// }

// if (xCoord <= 0) {
//     xRightMovement = true;
// }

// if (yCoord <= 0) {
//     yDownMovement = true;
// }

// if (yCoord >= 380) {
//     yDownMovement = false;
// }

// let xDiff = Math.abs(globalX - xCoord);
// let yDiff = Math.abs(globalY - yCoord);
//     let color = $(`#clear-${i}`).css('background-color');

// $(`#clear-${i}`).css({
//     "margin-left": xCoord,
//     "margin-top": yCoord
// });

//             // Contact determination logic

            // if (yDiff < 20 && xDiff < 20 && color === 'rgb(173, 216, 230)' && globalColor !== 'rgb(0, 255, 0)') {
            //     console.log('infection spreading');
            //     console.log('color', color);
            //     $(`#clear-${i}`).css('background-color', 'palevioletred');
            //     numInfected++;
            //     numClear--;

            //     let symptomPeriod = Math.floor(Math.random() * 10000) + 10000;

            //     setTimeout(function () {
            //         $(`#clear-${i}`).css('background-color', 'green');
            //         numRecovered++;
            //         numInfected--;

            //     }, symptomPeriod);
            // }

//             // ******************************************************* 

//         }, 5);

//         intervals.push(animate);
//     }

//     let percentUpdate = setInterval(function () {
//         $('#percent-infected').text(Math.round((numInfected / (numClear + numRecovered + numInfected)) * 100));
//         $('#percent-recovered').text(Math.round((numRecovered / (numRecovered + numClear + numInfected)) * 100));
//     }, 100);

//     intervals.push(percentUpdate);

//     for (let i = 0; i < numInfected; i++) {
//         let xCoord = Math.floor(Math.random() * 980);
//         let yCoord = Math.floor(Math.random() * 380);
//         let xRightMovement = Math.round(Math.random());
//         let yDownMovement = Math.round(Math.random());
//         let symptomPeriod = Math.floor(Math.random() * 10000) + 10000;

//         $('#model-container').append(`<div id="infected-${i}" class="infected"></div>`);

//         setTimeout(function () {
//             $(`#infected-${i}`).css('background-color', 'green');
//             numRecovered++;
//             numInfected--;
//         }, symptomPeriod);

//         let animate = setInterval(function () {

//             if (xRightMovement) {
//                 xCoord++;
//             } else {
//                 xCoord--;
//             }

//             if (yDownMovement) {
//                 yCoord++;
//             } else {
//                 yCoord--;
//             }

//             if (xCoord >= 980) {
//                 xRightMovement = false;
//             }

//             if (xCoord <= 0) {
//                 xRightMovement = true;
//             }

//             if (yCoord <= 0) {
//                 yDownMovement = true;
//             }

//             if (yCoord >= 380) {
//                 yDownMovement = false;
//             }

//             $(`#infected-${i}`).css({
//                 "margin-left": xCoord,
//                 "margin-top": yCoord
//             });

//             globalX = xCoord;
//             globalY = yCoord;
//             globalColor = $(`#infected-${i}`).css('background-color');

//         }, 5);

//         intervals.push(animate);

//     }

//     // ************************************ Refactored method ********************************************************


// }

