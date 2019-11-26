(function(){

    console.log("setting up tests...");

    var data_to_report = {};

    var past_data = [];

    var all_test_time = 0;

    var num_runs = 0;

    var start_button = document.getElementById("start");

    var run_test_button = document.getElementById("reset");

    var info_button = document.getElementById("info");

    var code = get_hit_code();

    var do_not_run = getUrlParam("donotrun", false);

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
        for (const key in proto_keys){
            for(const metric_key in network_test_keys){
                console.log(key);
                console.log(metric_key);
                document.getElementById(display_translator[proto_keys[key]] + "_test_" + display_translator[network_test_keys[metric_key]]).innerHTML = '';
            }
        }
        for (const img_key in object_test_keys){
            document.getElementById(translator[object_test_keys[img_key]] + "_total_time").innerHTML = '';
            document.getElementById(translator[object_test_keys[img_key]] + "_load_time_mean").innerHTML = '';
            document.getElementById(translator[object_test_keys[img_key]] + "_load_time_std").innerHTML = '';
        }
        this.disabled = true;
        num_runs++;
        step = 0;
        main_loop();
    };

    info_button.onclick = function(){
        window.open("/info.html");
    };

    var main_loop = function(){
        if (!do_not_run){
            console.log("Running tests...");
            if (fake_run == 0){
                if (mode < modes.length){
                    if (step < steps[modes[mode]].length){
                        if (step == 0){
                            all_test_time = (new Date().getTime());
                        }
                        update_status();
                        // if (step == 0 || step == 1){
                        if (mode == 0){
                            let loader = document.getElementById(steps[modes[mode]][step]);
                            loader.src = "./imgs/thinking.gif";
                            loader.hidden = false;
                            tests[steps[modes[mode]][step]]();
                        }else{
                            if (iteration == num_iterations){
                                step++;
                                iteration = 0;
                                intermediary_data = [];
                                main_loop();
                            }else{
                                let loader = document.getElementById(steps[modes[mode]][step]);
                                loader.src = "./imgs/thinking.gif";
                                loader.hidden = false;
                                if (steps[modes[mode]][step] in flex_info){ 
                                    let info = flex_info[steps[modes[mode]][step]];
                                    tests[steps[modes[mode]][step]](info["proto"], info["resource_type"], info["resource_num"], info["resource_size"], info["reporting_name"], info["key"]);
                                }else{
                                    tests[steps[modes[mode]][step]]();
                                }
                            }
                        }
                    }else{
                        console.log("Finished " + modes[mode] + " tests, moving on");
                        mode++;
                        past_steps = step;
                        step = 0;
                        main_loop();
                    }
                }else{
                    console.log("Finished");
                    let all_test_total_time = (new Date().getTime()) - all_test_time;
                    console.log("Total time taken: " + all_test_total_time);
                    //report data
                    report_data(data_to_report);
                    document.getElementById("hit_code").disabled = false;
                    toggleColors(['#FFF', '#621e81'], "hit_code");
                    document.getElementById("hit_code").onclick = function(){
                        document.getElementById("status_update").innerHTML = code;
                        this.disabled = true;
                    };
                }
            }else{
                step = 10;
                const keys = Object.keys(key_translator);
                for (const key in keys){
                    if (keys[key].indexOf("iframe") > -1){
                        data_to_report[keys[key]] = -1;
                    }else{
                        data_to_report[keys[key]] = -11;
                    }
                }
                display_all_metrics(data_to_report);
            }
        }
    };

    var display_metrics = function(o){
        if (typeof o == "string"){
            let data = JSON.parse(o);
            let temp = null;
            const keys = Object.keys(data);
            for (const key in keys){
                if (typeof translator[keys[key]] === 'undefined' || translator[keys[key]] === null){
                    continue;
                }
                let p = document.getElementById(display_translator[data.http_version] + "_test_" + display_translator[keys[key]]);

                if (translator[keys[key]] ==="Bandwidth" || translator[keys[key]] === "Bandwidth Variance"){
                    p.innerHTML = humanFileSize(data[keys[key]], true);
                }else if (translator[keys[key]] === "Latency" || translator[keys[key]] === "Latency Variance"){
                    p.innerHTML = data[keys[key]]; // + " ms";
                }
            }
            //load up data 
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
            console.log("Total time taken: " + average(o["total_time"]));
            console.log("Average duration: " + average(o["durations"]));
            console.log("Stddev duration: " + standardDeviation(o["durations"]));
            let translated_name = translator[o.http_version];
            console.log(translated_name);
            document.getElementById(translated_name + "_total_time").innerHTML = average(o["total_time"]);//precise(o["total_time"]); // + " ms";
            document.getElementById(translated_name + "_load_time_mean").innerHTML = average(o["durations"]);// + " ms";
            document.getElementById(translated_name + "_load_time_std").innerHTML = standardDeviation(o["durations"]);// + " ms"; 
            //load up data
            let t = reporting_translator[o["http_version"]];
            let t_mean = t 
            data_to_report[t_mean] = parseFloat(average(o["durations"]));
            let t_err = t + "_err";
            data_to_report[t_err] = parseFloat(standardDeviation(o["durations"]));
            let t_tt = t + "_total_time";
            data_to_report[t_tt] = parseFloat(average(o["total_time"]));
        }
    };

    BOOMR.subscribe("before_beacon", function(o){
        document.getElementById(steps[modes[mode]][step]).hidden = true;
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

    function getTimings(proto, iframe=false){
        let ts = [];
        let run = "run_" + num_runs;
        let resources = {};
        let w = null;
        if (!iframe){
            w = window;
        }else{
            w = document.getElementById("test_iframe").contentWindow;
        }
        resources = w.performance.getEntriesByType("resource");
        for (let h = 0; h < resources.length; h++){
            if (resources[h].initiatorType == "img"){
                if (resources[h].name.indexOf(proto) !== -1){
                    ts.push(resources[h]);
                }
            }
        }
        w.performance.clearResourceTimings();
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
            iteration++;
            finish_image_tests(proto, num, size, timings);
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

    var intermediary_data = [];

    var finish_image_tests = function(proto, num, size, timings){
        console.log("Finished " + proto + " test: " + num + ", " + size);
        let durations = timings.map(a => a.duration); 
        let fetch_starts = timings.map(a => a.fetchStart);
        let response_ends = timings.map(a => a.responseEnd);
        let start = min(fetch_starts);
        let end = max(response_ends);
        intermediary_data.push({"durations": durations, "http_version": proto, "total_time": (end - start)});
        if (iteration == num_iterations){
            let all_durations = [];
            let all_total_times = [];
            intermediary_data.forEach(function(el){
                el.durations.forEach(function(d){
                    all_durations.push(d);
                });
                all_total_times.push(el.total_time);
            });
            console.log(intermediary_data);
            console.log(all_durations);
            console.log(all_total_times);
            document.getElementById(steps[modes[mode]][step]).hidden = true;
            display_metrics({"durations": all_durations, "http_version": proto, "total_time": all_total_times});
        }
    };

    // Large Image Test Functions
    var h1_successive_large_image_tests = function(num, size){
        console.log("Testing large images loaded successively over HTTP/1.1....");
        load_img("http1l",image_nums[image_step],"1MB");
    };

    var h2_successive_large_image_tests = function(num, size){
        console.log("Testing large images loaded successively over HTTP/2....");
        load_img("http2l",image_nums[image_step],"1MB");
    };

    var h1_concurrent_large_image_tests = function(num, size){
        console.log("Testing large images loaded concurrently over HTTP/1.1....");
        load_img("http1cl",image_nums[image_step],"1MB", true);
    };

    var h2_concurrent_large_image_tests = function(num, size){
        console.log("Testing large images loaded concurrently over HTTP/2....");
        load_img("http2cl",image_nums[image_step],"1MB", true);
    };

    // Small Image Test Functions
    var h1_successive_small_image_tests = function(num, size){
        console.log("Testing small images loaded successively over HTTP/1.1....");
        load_img("http1s",image_nums[image_step],"5KB");
    };

    var h2_successive_small_image_tests = function(num, size){
        console.log("Testing small images loaded successively over HTTP/2....");
        load_img("http2s",image_nums[image_step],"5KB");
    };

    var h1_concurrent_small_image_tests = function(num, size){
        console.log("Testing small images loaded concurrently over HTTP/1.1....");
        load_img("http1cs",image_nums[image_step],"5KB", true);
    };

    var h2_concurrent_small_image_tests = function(num, size){
        console.log("Testing small images loaded concurrently over HTTP/2....");
        load_img("http2cs",image_nums[image_step],"5KB", true);
    };

    var h1_iframe_large_image_tests = function(){
        //This method loads |num| files of |type| and of size |size| in an iframe
        //      - load in the iframe to see if there's any difference in teh time of resources when loaded 
        //      - Load secure php file in iframe that then requests content over HTTP to use HTTP/1.1
        //      - this way we don't have to redirect and we can dynamically serve content
       let html_page = "https://www.testmyprotocol.com/php/generate_html_page.php?proto=h1&type={type}&num={num}&size={size}&tag={tag}".replace("{type}", "image").replace("{num}", "12").replace("{size}", "1MB").replace("{tag}", "h1_large_iframe"); 
       test_iframe.onload = function(){
           timings = getTimings("h1_large_iframe", true);
           iteration++;
           finish_image_tests("http1il", 12, "1MB", timings);  
           setTimeout(main_loop, 1000);
       };
       test_iframe.src = html_page;
    };

    var h1_iframe_small_image_tests = function(){
        //here we are already on http from the large image tests so we proceed without switching href
        let html_page = "https://www.testmyprotocol.com/php/generate_html_page.php?proto=h1&type={type}&num={num}&size={size}&tag={tag}".replace("{type}", "image").replace("{num}", "12").replace("{size}", "5KB").replace("{tag}", "h1_small_iframe");
        test_iframe.onload = function(){
            timings = getTimings("h1_small_iframe", true);
            iteration++;
            finish_image_tests("http1is", 12, "5KB", timings);
            setTimeout(main_loop, 1000);
        };
        test_iframe.src = html_page;
    };

    var h2_iframe_large_image_tests = function(type, num, size){
        //This method loads |num| files of |type| and of size |size| in an iframe
        // - load in the iframe to see if there's any difference in teh time of resources when loaded
        //      based on the browser's scheduler versus designed js loading
       let html_page = "https://www.testmyprotocol.com/php/generate_html_page.php?proto=h2&type={type}&num={num}&size={size}&tag={tag}".replace("{type}", "image").replace("{num}", "12").replace("{size}", "1MB").replace("{tag}", "h2_large_iframe"); 
        test_iframe.onload = function(){
            timings = getTimings("h2_large_iframe", true);
            iteration++;
            finish_image_tests("http2il", 12, "1MB", timings);
            setTimeout(main_loop, 1000);
        };
        test_iframe.src = html_page;
    };

    var h2_iframe_small_image_tests = function(type, num, size){
        //here we are already on https from the large image tests so we proceed without switching href
        let html_page = "https://www.testmyprotocol.com/php/generate_html_page.php?proto=h1&type={type}&num={num}&size={size}&tag={tag}".replace("{type}", "image").replace("{num}", "12").replace("{size}", "5KB").replace("{tag}", "h2_small_iframe");
        test_iframe.onload = function(){
            timings = getTimings("h2_small_iframe", true);
            iteration++;
            finish_image_tests("http2is", 12, "5KB", timings);

            setTimeout(main_loop, 1000);
        };
        test_iframe.src = html_page;
    };

    //**********
    //functions similar to previous tests but will load the resources with flexibility
    // - FUNCTION TYPES:
    //     - flex_js_tests: this will load resources by appending script tags to the original HTML page. this
    //                      can be done regardless of the original page's protocol scheme
    //     - flex_iframe_tests: this will load a new HTML page into a hidden iframe. to do this over HTTP, the 
    //                          domain must be changed from HTTPS to HTTP otherwise the browser won't allow it
    //              - I'm currently including variables in the url but as the flexibility increases it will have to be
    //                done a different way.
    // - TYPES:
    //     - Javascript: create and load script tag
    //     - image: create and load img tag
    //     - css: create and load link tag of rel="stylesheet"
    //     - font: load font tag
    // - NUM:
    //     - num of resources to load. this is passed to the php script to create continually "new" resource tags
    // - SIZE: 
    //     - size of the resources. this requires some knowledge of what we have on the server side, cannot be any size
    //     - current options:
    //          - imgs: 5kb, 1mb
    //          - js: ?
    //          - css: ?
    //          - font: ?
    //**********
    //js tests
    var flex_js_tests = function(proto, type, num, size){
            
    };
    //iframe tests
    var flex_iframe_tests = function(proto, type, num, size, tag, key){
        let html_page = "https://www.testmyprotocol.com/php/generate_html_page.php?proto={proto}&type={type}&num={num}&size={size}&tag={tag}".replace("{type}", type).replace("{num}", num).replace("{size}", size).replace("{tag}", tag).replace("{proto}", proto_translator[proto]);
        console.log(html_page);
        test_iframe.onload = function(){
            timings = getTimings(tag, true);
            iteration++;
            finish_image_tests(key, num, size, timings);
            setTimeout(main_loop, 1000);
        };
        test_iframe.src = html_page;

    }

    var step = getUrlParam("step", 0);

    var mode = getUrlParam("mode", 0);

    var past_steps = 0;

    let u = 0;
    for (u = 0; u < mode; u++){
        past_steps += steps[modes[u]].length;
    }

    var num_iterations = getUrlParam("iterations", 5);

    var fake_run = getUrlParam("fake", 0);

    var iteration = 0;
    
    var image_step = 0;

    var test_frame = document.getElementById("test_frame");

    var test_iframe = document.getElementById("test_iframe");

    var test_steps = document.getElementById("test_steps");

    var cont = getUrlParam("cont", 0);

    var cont_translator = {
        "lat": "test_latency",
        "lat_err": "test_latency_err",
        "bw": "test_bandwidth",
        "bw_err": "test_bandwidth_err",
        "successive_large": "successive_large_image_test_results_load_time_mean",
        "successive_large_err": "successive_large_image_test_results_load_time_std",
        "successive_large_total_time": "successive_large_image_test_results_total_time",
        "concurrent_large": "concurrent_large_image_test_results_load_time_mean",
        "concurrent_large_err": "concurrent_large_image_test_results_load_time_std",
        "concurrent_large_total_time": "concurrent_large_image_test_results_total_time",
        "successive_small": "successive_small_image_test_results_load_time_mean",
        "successive_small_err": "successive_small_image_test_results_load_time_std",
        "successive_small_total_time": "successive_small_image_test_results_total_time",
        "concurrent_small": "concurrent_small_image_test_results_load_time_mean",
        "concurrent_small_err": "concurrent_small_image_test_results_load_time_std",
        "concurrent_small_total_time": "concurrent_small_image_test_results_total_time",
        "iframe_large": "iframe_large_image_test_results_load_time_mean",
        "iframe_large_err": "iframe_large_image_test_results_load_time_std",
        "iframe_large_total_time": "iframe_large_image_test_results_total_time",
        "iframe_small": "iframe_small_image_test_results_load_time_mean",
        "iframe_small_err": "iframe_small_image_test_results_load_time_std",
        "iframe_small_total_time": "iframe_small_image_test_results_total_time"
    };

    function display_all_metrics(data){
        const keys = Object.keys(data);
        for(const key in keys){
            if (keys[key] == "platform" || keys[key] == "vendor"){
                continue;
            }else{
                let proto = keys[key].substring(0, 2);
                let rest = keys[key].substring(3, keys[key].length);
                if (data[keys[key]] !== -1){
                    if (keys[key].indexOf("bw") > -1){
                        document.getElementById(proto + "_" + cont_translator[rest]).innerHTML = humanFileSize(data[keys[key]], true);
                    }else{
                        document.getElementById(proto + "_" + cont_translator[rest]).innerHTML = data[keys[key]]; 
                    }
                }
            }
        }
        //continue running iframe tests
        num_runs = 0;
        fake_run = 0;
        main_loop();
    }

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
        let len = 0;
        const mode_keys = Object.keys(modes);
        for (const mode in mode_keys){
            len += steps[modes[mode]].length;
        }
        if (typeof step == "string"){
            x.innerHTML = "Status: " + (parseInt(step) + 1 + past_steps) + "/" + len
        }else{
            x.innerHTML = "Status: " + (step + 1 + past_steps) + "/" + len;
        }
    }

    function add_row(table, test, proto, name, results_name){
        //test name cell
        let test_cell = document.createElement("td");
        let test_label = document.createElement("label");
        test_label.classList.add("loader");
        test_label.innerHTML = test;
        test_cell.appendChild(test_label);
        //proto name cell
        let proto_cell = document.createElement("td"); 
        let proto_label = document.createElement("label");
        proto_label.innerHTML = proto;
        proto_cell.appendChild(proto_label);
        //test total time cell
        let total_time_cell = document.createElement("td");
        //  loader tag for gif
        let loader_tag = document.createElement("img");
        loader_tag.classList.add("loader");
        loader_tag.id = name;
        loader_tag.hidden = true;
        //  paragraph tag for results text
        let total_time_p = document.createElement("p");
        total_time_p.id = results_name + "_total_time";
        total_time_p.classList.add("test_results");
        //append total time contents
        total_time_cell.appendChild(loader_tag);
        total_time_cell.appendChild(total_time_p);
        //load time mean cell
        let mean_cell = document.createElement("td");
        //   paragraph tag for load time mean
        let mean_p = document.createElement("p");
        mean_p.id = results_name + "_load_time_mean";
        mean_p.classList.add("test_results");
        //append mean p
        mean_cell.appendChild(mean_p);
        //std deviation load time cell
        let std_cell = document.createElement("td");
        let std_p = document.createElement("p");
        std_p.id = results_name + "_load_time_std";
        std_p.classList.add("test_results");
        std_cell.appendChild(std_p);
        let row = document.createElement("tr");
        row.appendChild(test_cell);
        row.appendChild(proto_cell);
        row.appendChild(total_time_cell);
        row.appendChild(mean_cell);
        row.appendChild(std_cell);
        let t = document.getElementById(table);
        t.appendChild(row);
    }

    function parse_flex_tests(data){
        const keys = Object.keys(data);
        for (const key in keys){
            let obj = data[keys[key]];
            //check if object is empty
            if (Object.entries(obj).length == 0 && obj.constructor === Object)
                continue
            object_test_keys.push(obj["key"]);
            translator[obj["key"]] = obj["results_name"];
            reporting_translator[obj["key"]] = obj["reporting_name"];
            key_translator[obj["key_name"]] = obj["key"];
            steps[obj["mode"]].push(obj["name"]);
            //set the right function to run and add the row in the proper table
            if(obj["mode"] === "js"){
                //loading resources with Javascript
                tests[obj["name"]] = flex_js_tests;
                //adding row to js table
                add_row("http_object_table", obj["test_name"], obj["proto"], obj["name"], obj["results_name"]);
            }else if(obj["mode"] === "iframe"){
                //loading resources wihin an iframe
                tests[obj["name"]] = flex_iframe_tests;
                //adding row to iframe table
                add_row("iframe_tests_table", obj["test_name"], obj["proto"], obj["name"], obj["results_name"]);
            }else if(obj["mode"] === "network"){
                //running network tests
            }
            //add object to flex_info to later get the parameters for the function
            flex_info[obj["name"]] = obj;
        }
    }

    var flex_config_file = "flex_config.json";

    function init(){
        console.log("loading flex tests...");
        fetch(flex_config_file)
            .then(response => {
                return response.text();
            }).then(text => {
                parse_flex_tests(JSON.parse(text));
            });
    }

    init();

    //this could be in translators but will get undefined errors on the methods
    //  leaving it here for now
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
        "h2_concurrent_small_image_tests": h2_concurrent_small_image_tests,
        "h1_iframe_large_image_tests": h1_iframe_large_image_tests,
        "h1_iframe_small_image_tests": h1_iframe_small_image_tests,
        "h2_iframe_large_image_tests": h2_iframe_large_image_tests,
        "h2_iframe_small_image_tests": h2_iframe_small_image_tests
    };

    if (cont == 1){
        //we are continueing from https based tests
        //   we need to grab data from url and display it
        start_button.hidden = true;
        test_frame.hidden = false;
        const keys = Object.keys(key_translator); 
        let t = "";
        for (const key in keys){
            t = getUrlParam(key_translator[keys[key]], -1);
            if (keys[key] == "platform" || keys[key] == "vendor"){
                data_to_report[keys[key]] = decodeURI(t); 
            }else{
                data_to_report[keys[key]] = parseFloat(t);
            }
        }
        display_all_metrics(data_to_report);
    }

})();
