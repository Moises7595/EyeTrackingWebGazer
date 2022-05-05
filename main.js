var exclusions = ["navbarNavDarkDropdown", "navbarDarkDropdownMenuLink"];
var array = {};

const getX = (x) => {
    return x;
};

const getY = (y) => {
    return y;
};

// window.onload = async function () {
//     await webgazer.setRegression('ridge').setTracker('clmtrackr').setGazeListener(function (data, clock) {

//         if (data == null) {
//             return;
//         }

//         var xprediction = data.x;
//         var yprediction = data.y;

//         addElementToArray(getX(xprediction), getY(yprediction));

//     }).saveDataAcrossSessions(true)

//     webgazer.showVideoPreview(true).showPredictionPoints(true).applyKalmanFilter(true).begin();
// };

document.addEventListener('mousemove', function (e) {
    var x = e.clientX;
    var y = e.clientY;

    addElementToArray(x, y);
});

function giveColor() {
    var max;
    var min;
    for (var key in array) {
        if (!exclusions.includes(key)) {
            if (max == undefined) {
                max = array[key];
                min = array[key];
            } else {
                if (array[key] > max) {
                    max = array[key];
                }
                if (array[key] < min) {
                    min = array[key];
                }
            }
        }
    }
    for (var key in array) {
        if (!exclusions.includes(key)) {
            var percent = (array[key] - min) / (max - min);
            var color = getGreenToRed(percent * 100);
            document.getElementById(key).style.setProperty('background-color', color);
        }
    }
}

const addElementToArray = (x, y) => {
    var element = document.elementFromPoint(x, y);
    if (element.id != "") {
        if (array[element.id] == undefined) {
            array[element.id] = 1;
        } else {
            array[element.id]++;
        }
    }
};

const getGreenToRed = (percent) => {
    const r = 255 * percent / 100;
    const g = 255 - (255 * percent / 100);
    return 'rgb(' + r + ',' + g + ',0)';
};

const rgbToHex = (rgb) => {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
};