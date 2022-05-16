var exclusions = ["navbarNavDarkDropdown", "navbarDarkDropdownMenuLink", "webgazerGazeDot"];
var array = {};
var active = false;

// Webgazer initialization
window.onload = async function () {
    await webgazer.setRegression('ridge').setTracker('clmtrackr').setGazeListener(function (data, clock) {

        if (data == null) {
            return;
        }

        if (active) {
            addElementToArray(getNumber(data.x), getNumber(data.y));
        }

    }).saveDataAcrossSessions(true)

    webgazer.showVideoPreview(false).showPredictionPoints(true).applyKalmanFilter(true).begin();
};

//Mousemove event (just for testing)
// document.addEventListener('mousemove', function (e) {
//     var x = e.clientX;
//     var y = e.clientY;

//     addElementToArray(x, y);
// });

function Start() {
    active = true;
}

function getNumber(num) {
    num = Math.round(num);
    return (num < 0) ? 0 : num;
}

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
    if (element != null) {
        if (element.id != "") {
            if (array[element.id] == undefined) {
                array[element.id] = 1;
            } else {
                array[element.id]++;
            }
        }
    }
};

const getGreenToRed = (percent) => {
    let r, g;
    if (percent == 50) {
        r = 255;
        g = 255;
    } else if (percent < 50) {
        g = 255;
        r = Math.round(255 * ((percent * 2) / 100));
    } else {
        r = 255;
        g = Math.round(255 * (((100 - percent) * 2) / 100));
    }
    return `rgb(${r}, ${g}, 0)`;
};

const rgbToHex = (rgb) => {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
};

function Kill() {
    webgazer.pause();
    webgazer.showPredictionPoints(false);
    webgazer.showVideoPreview(false);
    webgazer.end();
    giveColor();
    var data = [];
    for (var key in array) {
        if (!exclusions.includes(key)) {
            data.push({
                "id": key,
                "count": array[key],
                "innerHtml": document.getElementById(key).outerHTML
            });
        }
    }
    download(JSON.stringify(data), "data.json", "text/plain");
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        var a  = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}