(function(){

    console.log("setting up tests...");

    var data_to_report = {};

    var past_data = [];

    var num_runs = 0;

    var start_button = document.getElementById("start");

    var run_test_button = document.getElementById("reset");

    var info_button = document.getElementById("info");

    var code = get_hit_code();

    start_button.onclick = function(){
        if(!(typeof BOOMR === "undefined")){
            this.hidden = true;
            test_frame.hidden = false;
            main_loop();
        }else{
            alert("It seems you have an adblocker installed, please disable it to run tests");
        }
    };

    run_test_button.onclick = function(){
        let obj = {"http/1.1": [], "h2": []};
        let metric_obj = {"lat": [], "lat_err": [], "bw": [], "bw_err": []};
        let img_obj = {"http1l": [], "http2l": [], "http1cl": [], "http2cl": [], "http1s": [], "http2s": [], "http1cs": [], "http2cs": []};
        const keys = Object.keys(obj);
        for (const key in keys){
            const metric_keys = Object.keys(metric_obj);
            for (const metric_key in metric_keys){
                document.getElementById(display_translator[keys[key]] + "_test_" + display_translator[metric_keys[metric_key]]).innerHTML = '';
            }
        }
        const img_keys = Object.keys(img_obj);
        for (const img_key in img_keys){
            document.getElementById(translator[img_keys[img_key]] + "_total_time").innerHTML = '';
            document.getElementById(translator[img_keys[img_key]] + "_load_time_mean").innerHTML = '';
            document.getElementById(translator[img_keys[img_key]] + "_load_time_std").innerHTML = '';
        }
        this.disabled = true;
        num_runs++;
        main_loop();
    };

    info_button.onclick = function(){
        window.open("/info.html");
    };

    var translator = {
        "http/1.1": "h1_test_results",
        "h2": "h2_test_results",
        "bw": "Bandwidth",
        "lat": "Latency",
        "bw_err": "Bandwidth Variance",
        "lat_err": "Latency Variance",
        "1MB": "map_one_mb.jpg",
        "5KB": "five.jpg",
        "http1l": "h1_successive_large_image_test_results",
        "http2l": "h2_successive_large_image_test_results",
        "http1cl": "h1_concurrent_large_image_test_results",
        "http2cl": "h2_concurrent_large_image_test_results",
        "http1s": "h1_successive_small_image_test_results",
        "http2s": "h2_successive_small_image_test_results",
        "http1cs": "h1_concurrent_small_image_test_results",
        "http2cs": "h2_concurrent_small_image_test_results"

        // "ua.plt": "Platform",
        // "ua.vnd": "Browser Vendor"
    };

    var display_translator = {
        "http/1.1": "h1",
        "h2": "h2",
        "lat": "latency",
        "lat_err": "latency_err",
        "bw": "bandwidth",
        "bw_err": "bandwidth_err"
    };

    var reporting_translator = {
        "http/1.1": "h1",
        "h2": "h2",
        "http1l": "h1_successive_large",
        "http1cl": "h1_concurrent_large",
        "http2l": "h2_successive_large",
        "http2cl": "h2_concurrent_large",
        "http1s": "h1_successive_small",
        "http1cs": "h1_concurrent_small",
        "http2s": "h2_successive_small",
        "http2cs": "h2_concurrent_small"
   };

    var display_metrics = function(o){
        if (typeof o == "string"){
            let data = JSON.parse(o);
            // console.log(data);
            // let p = document.getElementById(translator[data.http_version]);
            let temp = null;
            const keys = Object.keys(data);
            for (const key in keys){
                if (typeof translator[keys[key]] === 'undefined' || translator[keys[key]] === null){
                    continue;
                }
                let p = document.getElementById(display_translator[data.http_version] + "_test_" + display_translator[keys[key]]);

                // temp = document.createElement("a");
                if (translator[keys[key]] ==="Bandwidth" || translator[keys[key]] === "Bandwidth Variance"){
                //     temp.innerHTML = translator[keys[key]] + ": " + humanFileSize(data[keys[key]], true);
                    p.innerHTML = humanFileSize(data[keys[key]], true);
                }else if (translator[keys[key]] === "Latency" || translator[keys[key]] === "Latency Variance"){
                //     temp.innerHTML = translator[keys[key]] + ": " + data[keys[key]] + " ms";
                    p.innerHTML = data[keys[key]]; // + " ms";
                }
                // }else{
                //     temp.innerHTML = translator[keys[key]] + ": " + data[keys[key]];
                // }
                // p.appendChild(temp)
                // p.appendChild(document.createElement("br"));
            }
            //load up data 
            // console.log(data["http_version"]);
            let t = reporting_translator[data["http_version"]];
            let t_lat = t + "_lat";
            data_to_report[t_lat] = data["lat"];
            let t_lat_err = t + "_lat_err";
            data_to_report[t_lat_err] = data["lat_err"];
            let t_bw = t + "_bw";
            data_to_report[t_bw] = data["bw"];
            let t_bw_err = t + "_bw_err";
            data_to_report[t_bw_err] = data["bw_err"];
            if (!(data_to_report["platform"])){
                data_to_report["platform"]  = data["ua.plt"];
            }
            if (!(data_to_report["vendor"])){
                data_to_report["vendor"] = data["ua.vnd"];
            }
        }else{
            console.log("Total time taken: " + o["total_time"]);
            console.log("Average duration: " + average(o["durations"]));
            console.log("Stddev duration: " + standardDeviation(o["durations"]));
            let translated_name = translator[o.http_version];
            document.getElementById(translated_name + "_total_time").innerHTML = precise(o["total_time"]); // + " ms";
            document.getElementById(translated_name + "_load_time_mean").innerHTML = average(o["durations"]);// + " ms";
            document.getElementById(translated_name + "_load_time_std").innerHTML = standardDeviation(o["durations"]);// + " ms"; 
            // let p = document.getElementById(translator[o.http_version]);
            // let total = document.createElement("a");
            // total.innerHTML = "Total Time Taken: " + precise(o["total_time"]) + " ms";
            // p.appendChild(total);
            // p.appendChild(document.createElement("br")); 
            // let ave = document.createElement("a");
            // ave.innerHTML = "Load Time Average: " + average(o["durations"]) + " ms";
            // p.appendChild(ave);
            // p.appendChild(document.createElement("br"));
            // let stddev = document.createElement("a");
            // stddev.innerHTML = "Load Time StdDev: " + standardDeviation(o["durations"]) + " ms";
            // p.appendChild(stddev);
            // p.appendChild(document.createElement("br"));
            //load up data
            let t = reporting_translator[o["http_version"]];
            let t_mean = t 
            data_to_report[t_mean] = parseFloat(average(o["durations"]));
            let t_err = t + "_err";
            data_to_report[t_err] = parseFloat(standardDeviation(o["durations"]));
            let t_tt = t + "_total_time";
            data_to_report[t_tt] = o["total_time"];
        }
    };

    BOOMR.subscribe("before_beacon", function(o){
        document.getElementById(steps[step]).hidden = true;
        display_metrics(JSON.stringify(o));
        step = step + 1;
        setTimeout(main_loop, 2500);
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
        },
        DNS: {
            base_url: './boomerang-master/images/',
            cookie: 'dns_test',
            block_beacon: true
        }
    });

    var h1_tests = function(){
        console.log("Testing network over HTTP/1.1");
        BOOMR.plugins.BW.run(10, "http/1.1");
    };

    var h2_tests = function(){
        console.log("Testing network over HTTP/2");
        BOOMR.plugins.BW.run(10, "h2");
    };

    function getTimings(proto){
        let ts = [];
        let run = "run_" + num_runs;
        let resources = window.performance.getEntriesByType("resource");
        for (let h = 0; h < resources.length; h++){
            if (resources[h].initiatorType == "img"){
                if (resources[h].name.indexOf(proto) !== -1){
                    if (resources[h].name.indexOf(run) !== -1){
                        ts.push(resources[h]);    
                    }
                }
            }
        }
        window.performance.clearResourceTimings();
        return ts;
    }

    var load_img = function(proto, num, size, concurrent = false){
        let base_url = "";
        if (proto.indexOf("http1") > -1){
            base_url = "http://www.testmyprotocol.com/imgs/" + translator[size] + "?type=" + proto;
        }else if (proto.indexOf("http2") > -1){
            base_url = "https://www.testmyprotocol.com/imgs/" + translator[size] + "?type=" + proto;
        }
        let timings = []; 
        let n = num;
        let finish = function(){
            timings = getTimings(proto);
            finish_image_tests(proto, num, size, timings);
            step++;
            setTimeout(main_loop, 1500);
        };
        if (!concurrent){
            //load one after another
            let load_img_helper = function(){
                if (n == 0) {
                    //done loading, collect data
                    finish();
                }else{
                    let temp = document.createElement("img");
                    temp.onload = function(){
                        n--;
                        load_img_helper();
                    };
                    temp.src = base_url + (new Date().getTime()) + "_run_" + num_runs;
                }
            }
            load_img_helper();
        }else{
            //load all at once
            let load_img_helper = function(){
                if (n > 0){
                    return;
                }else{
                    finish();
                }
            };
            let i = 0;
            for (i = 0; i < num; i++){
                let temp = document.createElement("img");
                temp.onload = function(){
                    n--;
                    load_img_helper();
                };
                temp.src = base_url + (new Date().getTime()) + "." + (i * 1234) + "_run_" + num_runs;
            }
        }
    };

    var finish_image_tests = function(proto, num, size, timings){
        console.log("Finished " + proto + " test: " + num + ", " + size);
        document.getElementById(steps[step]).hidden = true;
        // if (proto.indexOf("c") > -1){
        //     console.log(timings);
        // }
        let durations = timings.map(a => a.duration); 
        let fetch_starts = timings.map(a => a.fetchStart);
        // console.log(fetch_starts);
        let response_ends = timings.map(a => a.responseEnd);
        // console.log(response_ends);
        let start = min(fetch_starts);
        // console.log("Start time: " + start);
        let end = max(response_ends);
        // console.log("End time: " + end);
        display_metrics({"durations": durations, "http_version": proto, "total_time": (end - start)});
    };




    // Large Image Test Functions
    var h1_successive_large_image_tests = function(num, size){
        console.log("Testing large images loaded successively over HTTP/1.1....");
        load_img("http1l",image_sizes[image_step],"1MB");
    };

    var h2_successive_large_image_tests = function(num, size){
        console.log("Testing large images loaded successively over HTTP/2....");
        load_img("http2l",image_sizes[image_step],"1MB");
    };

    var h1_concurrent_large_image_tests = function(num, size){
        console.log("Testing large images loaded concurrently over HTTP/1.1....");
        load_img("http1cl",image_sizes[image_step],"1MB", true);
    };

    var h2_concurrent_large_image_tests = function(num, size){
        console.log("Testing large images loaded concurrently over HTTP/2....");
        load_img("http2cl",image_sizes[image_step],"1MB", true);
    };

    // Small Image Test Functions
    var h1_successive_small_image_tests = function(num, size){
        console.log("Testing small images loaded successively over HTTP/1.1....");
        load_img("http1s",image_sizes[image_step],"5KB");
    };

    var h2_successive_small_image_tests = function(num, size){
        console.log("Testing small images loaded successively over HTTP/2....");
        load_img("http2s",image_sizes[image_step],"5KB");
    };

    var h1_concurrent_small_image_tests = function(num, size){
        console.log("Testing small images loaded concurrently over HTTP/1.1....");
        load_img("http1cs",image_sizes[image_step],"5KB", true);
    };

    var h2_concurrent_small_image_tests = function(num, size){
        console.log("Testing small images loaded concurrently over HTTP/2....");
        load_img("http2cs",image_sizes[image_step],"5KB", true);
    };



    
    var tests = {
        "h1_tests": h1_tests,
        "h2_tests": h2_tests,
        "h1_successive_large_image_tests": h1_successive_large_image_tests,
        "h2_successive_large_image_tests": h2_successive_large_image_tests,
        "h1_concurrent_large_image_tests": h1_concurrent_large_image_tests,
        "h2_concurrent_large_image_tests": h2_concurrent_large_image_tests,
        "h1_successive_small_image_tests": h1_successive_small_image_tests,
        "h2_successive_small_image_tests": h2_successive_small_image_tests,
        "h1_concurrent_small_image_tests": h1_concurrent_small_image_tests,
        "h2_concurrent_small_image_tests": h2_concurrent_small_image_tests

    };

    var steps = [
        "h1_tests",
        "h2_tests",
        "h1_successive_large_image_tests",
        "h2_successive_large_image_tests",
        "h1_concurrent_large_image_tests",
        "h2_concurrent_large_image_tests",
        "h1_successive_small_image_tests",
        "h2_successive_small_image_tests",
        "h1_concurrent_small_image_tests",
        "h2_concurrent_small_image_tests"
    ];

    var image_sizes = [
        12,
        6,
        1,
        // 18,
        // 24,
        // 30
    ];

    var step = getUrlParam("step", 0);
    
    var image_step = 0;

    var test_frame = document.getElementById("test_frame");

    var test_steps = document.getElementById("test_steps");

    function report_data(data){
        let xmlhttp = new XMLHttpRequest();
        let post_url = '/php/test_db.php?';
        data["uuid"] = get_uuid();
        data["test_time"] = new Date().toUTCString();
        data["hit_code"] = code;
        const keys = Object.keys(data);
        for (const key in keys){
            post_url = post_url + keys[key] + "=" + data[keys[key]] + "&";
        }
        let url = post_url.substring(0, post_url.length - 1);
        xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                console.log(this.responseText);
            }
        };
        xmlhttp.open("GET", url);
        xmlhttp.send();
        reset();    
    }

    function reset(){
        past_data.push(data_to_report);
        data_to_report = {};
        step = getUrlParam("step", 0);
        image_step = 0;
        run_test_button.disabled = false;
    }
    
    function update_status(){
        document.getElementById("update_div").hidden = false;
        let x = document.getElementById("status_update");
        if (typeof step == "string"){
            x.innerHTML = "Status: " + (parseInt(step) + 1) + "/" + steps.length;
        }else{
            x.innerHTML = "Status: " + (step + 1) + "/" + steps.length;
        }
    }

    var main_loop = function(){
        console.log("Running tests...");
        if (step < steps.length){
            update_status();
            if (step == 0 || step == 1){
                let loader = document.getElementById(steps[step]);
                loader.src = "./imgs/thinking.gif";
                loader.hidden = false;
                tests[steps[step]]();
            }else{
                let loader = document.getElementById(steps[step]);
                loader.src = "./imgs/thinking.gif";
                loader.hidden = false;
                tests[steps[step]]();
            }
        }else{
            console.log("Finished");
            //report data
            report_data(data_to_report);
            // alert("All tests finished, please reload to run again");
            document.getElementById("hit_code").disabled = false;
            toggleColors(['#FFF', '#621e81'], "hit_code");
            document.getElementById("hit_code").onclick = function(){
                document.getElementById("status_update").innerHTML = code;
                this.disabled = true;
            };
        }
    };

})();
