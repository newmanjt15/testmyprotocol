var translator = {
    "1": "one.jpg",
    "5": "five.jpg",
    "15": "fifteen.jpg",
    "25": "twenty_five.jpg",
    "50": "fifty.jpg",
    "75": "seventy_five.jpg",
    "100": "hundred.jpg"
};

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

function setup(){
    document.getElementById("start").onclick = Controller.start;
    document.getElementById("start").disabled = false;
    document.getElementById("reset").onclick = Controller.reset;
    document.getElementById("reset").disabled = false;
    document.getElementById("status_update").innerHTML = "Ready";
}

function display_metrics(latency, bandwidth){
    let metric_div = document.getElementById("network_metrics");
    metric_div.innerHTML = '';
    let lat = document.createElement("a");
    lat.innerHTML = "Latency: " + latency + " ms";
    metric_div.appendChild(lat);
    metric_div.appendChild(document.createElement("br"));
    let bw = document.createElement("a");
    bw.innerHTML = "Bandwidth: " + bandwidth;
    metric_div.appendChild(bw);
    metric_div.appendChild(document.createElement("br"));
}

BOOMR.subscribe("before_beacon", function(o){
    Controller.latency.push(o["lat"]);
    Controller.bw.push(o["bw"]);
    Controller.last_latency = o["lat"];
    Controller.last_bw = o["bw"];
    Controller.init.then(function(value){
        Controller.mode = value;
        console.log("Loaded mode, enabling button...");
        setup();
        display_metrics(Controller.last_latency, humanFileSize(Controller.last_bw, true));
    });
});

BOOMR.init({
    user_ip: '10.0.0.1',
    autorun: false,
    BW: {
        base_url: './boomerang-master/images/',
        cookie: 'bw_test',
        block_beacon: true
    },
    RT: {
        cookie: 'rt_test',
    }
});

var throw_boomerang = function(proto = "h2"){
    BOOMR.plugins.BW.run(10, proto);
};


var platform = document.getElementById("testing_platform");

var Controller = {
    size : 0,
    num : 0,
    latency : [],
    last_latency: 0,
    bw : [],
    last_bw: 0,
    running : false,
    report_data : true,
    mode : "",
    timing_data: [],
    resource_data: [],
    init : new Promise(function(resolve, reject) {
        //TODO: in the future request the number of objects to load  
        //          instead of letting users specify it
        resolve("default");
    }),

    start : function(){
        console.log("starting test...");
        let num = document.getElementById("num").value;
        if (num && num <= 100 && num >= 1) {
            platform.innerHTML = '';
            platform.hidden = false;
            platform.style.height = "400px";
            Controller.size = document.getElementById("size").value;
            Controller.num = num;
            let timing_data = [];
            let start = new Date().getTime();
            for (let i = 0; i < Controller.num; i++){
                let el = document.createElement("img");
                el.onload = function(ev){
                    let load = new Date().getTime();
                    let time = load - start;
                    timing_data.push(time);
                    Controller.timing_data.push(time);
                    if (timing_data.length == Controller.num){
                        get_timings();
                    }
                };
                el.src = "imgs/" + translator[Controller.size] + "?" + i;
                platform.appendChild(el);
            }
        }else{
            alert("Please specify a number of objects between 1 and 100");
        }
    },
};

var get_timings = function(){
    var resourceList = window.performance.getEntriesByType("resource");
    for (let h = 0; h < resourceList.length; h++){
        if (resourceList[h].initiatorType == "img"){
            if (resourceList[h].name.indexOf("boomerang") == -1){
                Controller.resource_data.push(resourceList[h]);
            }
        }
    }
    console.log(Controller);
    // report_data();
};

var report_data = function(){
    let uuid=new Date().getTime();
    if (Controller.num <= 5){
        let reported = {"timing": Controller.timing_data, "resource_data": Controller.resource_data, "bw": Controller.bw, "latency": Controller.latency, "mode": Controller.mode, "size": Controller.size, "num": Controller.num, "date_time": uuid};
        send_data(reported);
    }else{
        let i,j,tempresource,temptiming,chunk = 5;
        for (i=0,j=Controller.timing_data.length; i<j; i+=chunk){
            tempresource = Controller.resource_data.slice(i, i+chunk);
            console.log(tempresource);
            temptiming = Controller.timing_data.slice(i, i+chunk);
            console.log(temptiming);
            let reported = {"timing": temptiming, "resource_data": tempresource, "bw": Controller.bw, "latency": Controller.latency, "mode": Controller.mode, "size": Controller.size, "num": Controller.num, "date_time": uuid};
            // send_data(reported);
            setTimeout(send_data, i*10, reported);
        }
    }
};

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

var run_tests = getUrlParam("test", "yes");

var fake_tests = getUrlParam("fake", "no");

if (run_tests == "yes"){
    throw_boomerang();
}else{
    setup();
}

function reset () {
    document.getElementById("status_update").innerHTML = "Testing Network...";
    let metric_div = document.getElementById("network_metrics");
    metric_div.innerHTML = '';
}

document.getElementById("h2_test").onclick = function(){
    reset();
    if (fake_tests == "no") {
        throw_boomerang("h2");
    }else{
        display_metrics("42", "4.2");
    }
};

document.getElementById("h1_test").onclick = function(){
    reset();
    if (fake_tests == "no") {
        throw_boomerang("http/1.1");
    }else{
        display_metrics("42", "4.2");
    }
};

document.getElementById("more_info").onclick = function(){
    // document.getElementById("info").hidden = !document.getElementById("info").hidden;
    window.open("https://testmyprotocol.com/info.html");
};