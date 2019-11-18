function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    let params = window.location.href.split(".com")[1]
    // if(window.location.href.indexOf(parameter) > -1){
    if(params.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes +  B;
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

var timer;
var miliseconds = 500;

/**
* Function to toggle bgColor
* @param array colors Array of colors to set
**/
function toggleColors( colors, button ){
    clearTimeout(timer);
    var counter = 0
    var change = function(){
        // document.bgColor = colors[ counter%colors.length ];// Change the color
        document.getElementById(button).style = "background-color: " + colors[ counter%colors.length ];
        counter ++;
        if (counter == 6){
            clearTimeout(timer);
            return;
        }
        if( colors.length > 1 )
            timer = setTimeout(change, miliseconds); // Call the changer
    };

    change();
}

function send_data(json){
    let xmlhttp = new XMLHttpRequest();
    let post_url = '/php/post.php?json=' + encodeURI(JSON.stringify(json));
    console.log(post_url);
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
        }
    };
    xmlhttp.open("GET", post_url);
    xmlhttp.send();
}


function diffs(values){
    var temp_diffs = values.map(function(value){
        var diff = value - avg;
        return diff;
    });
    return temp_diffs;
}

function squareDiffs(values){
    var temp_squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqr = diff *diff;
        return sqr;
    });
    return temp_squareDiffs;
}

function precise(num){
    return Number.parseFloat(num).toPrecision(4);
}

function average(data){
    var sum = data.reduce(function(sum, value){
        return sum + value;
    }, 0);

    var avg = sum /data.length;

    return precise(avg);
}

function standardDeviation(values){
    var avg = average(values);

    var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return precise(stdDev);
}

function min(values){
    let m = values[0];
    let i = 1;
    for (i; i < values.length; i++){
        if (m > values[i]){
            m = values[i];
        }
    }
    return m;
}

function max(values){
    let m = values[0];
    let i = 1;
    for(i; i < values.length; i++){
        if (m < values[i]){
            m = values[i];
        }
    }
    return m;
}

function uuid()
{
    var seed = Date.now();
    if (window.performance && typeof window.performance.now === "function") {
                seed += performance.now();
            }

    var uuid = 'xxxxxxxx-xxxx-aqualab-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (seed + Math.random() * 16) % 16 | 0;
                seed = Math.floor(seed/16);

                return (c === 'x' ? r : r & (0x3|0x8)).toString(16);
            });

    return uuid;
}

function get_uuid(){
    let c = BOOMR.utils.getCookie("uuid");
    if (c){
        return c.split("=")[1];
    }else{
        let id = uuid();
        BOOMR.utils.setCookie("uuid", {"id": id});
        return id;
    }
    return null;
}

function hit_code(){
    return getRandomInt(25000, 99999);
}

function get_hit_code(){
    let c = BOOMR.utils.getCookie("hit_code");
    if (c){
        return c.split("=")[1];
    }else{
        let code = hit_code();
        BOOMR.utils.setCookie("hit_code", {"hit_code": code});
        return code;
    }
}

/**
 *  * Returns a random integer between min (inclusive) and max (inclusive)
 *   * Using Math.round() will give you a non-uniform distribution!
 *    */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

