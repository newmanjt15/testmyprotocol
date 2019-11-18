(function(){

    let all = getUrlParam("all", 0);
    let id = '';
    if (all === 0){
        id = get_uuid();
    }else{
        id = all;
    }

    function get_results(){
        let xmlhttp = new XMLHttpRequest();
        let get_url = '/php/get_results.php?id=' + id;
        // let get_url = '/php/get_results.php?id=hello';
        // let get_url = '/php/get_results.php';
        xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                if (this.responseText === "incorrect id"){
                    console.log(this.responseText);
                    console.log("incorrect id");
                }else if (this.responseText === "no id"){
                    alert("Please run a test to see results");
                    window.location.href = "/";
                }else{
                    parse_results(this.responseText);
                }
            }
        };
        xmlhttp.open("GET", get_url);
        xmlhttp.send();
    };

    var data = {
        "h1_bandwidth": [],
        "h1_bw_err": [],
        "h1_concurrent_large": [],
        "h1_concurrent_large_err": [],
        "h1_concurrent_large_total_time": [],
        "h1_concurrent_small": [],
        "h1_concurrent_small_err": [],
        "h1_concurrent_small_total_time": [],
        "h1_lat_err": [],
        "h1_latency": [],
        "h1_successive_large": [],
        "h1_successive_large_err": [],
        "h1_successive_large_total_time": [],
        "h1_successive_small": [],
        "h1_successive_small_err": [],
        "h1_successive_small_total_time": [],
        "h2_bandwidth": [],
        "h2_bw_err": [],
        "h2_concurrent_large": [],
        "h2_concurrent_large_err": [],
        "h2_concurrent_large_total_time": [],
        "h2_lat_err": [],
        "h2_latency": [],
        "h2_successive_large": [],
        "h2_successive_large_err": [],
        "h2_successive_large_total_time": [],
        "h2_successive_small": [],
        "h2_successive_small_err": [],
        "h2_successive_small_total_time": [],
        "h2_concurrent_small": [],
        "h2_concurrent_small_err": [],
        "h2_concurrent_small_total_time": [],
        "platform": [],
        "vendor": [],
        "test_time": []
    };

    function parse_results(results){
        let x = JSON.parse(results);
        let i = 0;
        const keys = Object.keys(data);
        for (i = 0; i < x.length; i++){
            for (const key in keys){
                data[keys[key]].push(parseInt(x[i][keys[key]]));
            }
        }
        document.getElementById("num_runs").innerHTML = x.length;
        console.log(data);
        for (const key in keys){
            if (keys[key] === "platform" || keys[key] === "vendor" || keys[key] === "test_time"){
                continue;
            }
            if (keys[key].indexOf("bandwidth") > -1 || keys[key].indexOf("bw_err") > -1){
                document.getElementById(keys[key] + "_results").innerHTML = humanFileSize(average(data[keys[key]]), true);
            }else{
                document.getElementById(keys[key] + "_results").innerHTML = average(data[keys[key]]);
            }
        }
    };

    get_results();

})();
