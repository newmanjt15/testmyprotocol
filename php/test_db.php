<?php 

include "../../inc/dbinfo.inc";

$connection = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD);

if (mysqli_connect_errno()) echo "Failed to connect: " . mysqli_connect_error();

$database = mysqli_select_db($connection, DB_DATABASE);

$uuid = $_GET["uuid"];
$test_id = uniqid("test_");
$ip = $_SERVER['REMOTE_ADDR'];
$test_time = $_GET["test_time"];
$platform = $_GET["platform"];
$vendor = $_GET["vendor"];
$hit_code = $_GET["hit_code"];
$h1_lat = $_GET["h1_lat"];
$h1_lat_err = $_GET["h1_lat_err"];
$h1_bw = $_GET["h1_bw"];
$h1_bw_err = $_GET["h1_bw_err"];
$h1_successive_large = $_GET["h1_successive_large"];
$h1_successive_large_err = $_GET["h1_successive_large_err"];
$h1_successive_large_total_time = $_GET["h1_successive_large_total_time"];
$h1_concurrent_large = $_GET["h1_concurrent_large"];
$h1_concurrent_large_err = $_GET["h1_concurrent_large_err"];
$h1_concurrent_large_total_time = $_GET["h1_concurrent_large_total_time"];
$h1_successive_small = $_GET["h1_successive_small"];
$h1_successive_small_err = $_GET["h1_successive_small_err"];
$h1_successive_small_total_time = $_GET["h1_successive_small_total_time"];
$h1_concurrent_small = $_GET["h1_concurrent_small"];
$h1_concurrent_small_err = $_GET["h1_concurrent_small_err"];
$h1_concurrent_small_total_time = $_GET["h1_concurrent_small_total_time"];
$h1_iframe_large = $_GET["h1_iframe_large"];
$h1_iframe_large_err = $_GET["h1_iframe_large_err"];
$h1_iframe_large_total_time = $_GET["h1_iframe_large_total_time"];
$h1_iframe_small = $_GET["h1_iframe_small"];
$h1_iframe_small_err = $_GET["h1_iframe_small_err"];
$h1_iframe_small_total_time = $_GET["h1_iframe_small_total_time"];
$h2_lat = $_GET["h2_lat"];
$h2_lat_err = $_GET["h2_lat_err"];
$h2_bw = $_GET["h2_bw"];
$h2_bw_err = $_GET["h2_bw_err"];
$h2_successive_large = $_GET["h2_successive_large"];
$h2_successive_large_err = $_GET["h2_successive_large_err"];
$h2_successive_large_total_time = $_GET["h2_successive_large_total_time"];
$h2_concurrent_large = $_GET["h2_concurrent_large"];
$h2_concurrent_large_err = $_GET["h2_concurrent_large_err"];
$h2_concurrent_large_total_time = $_GET["h2_concurrent_large_total_time"];
$h2_successive_small = $_GET["h2_successive_small"];
$h2_successive_small_err = $_GET["h2_successive_small_err"];
$h2_successive_small_total_time = $_GET["h2_successive_small_total_time"];
$h2_concurrent_small = $_GET["h2_concurrent_small"];
$h2_concurrent_small_err = $_GET["h2_concurrent_small_err"];
$h2_concurrent_small_total_time = $_GET["h2_concurrent_small_total_time"];
$h2_iframe_large = $_GET["h2_iframe_large"];
$h2_iframe_large_err = $_GET["h2_iframe_large_err"];
$h2_iframe_large_total_time = $_GET["h2_iframe_large_total_time"];
$h2_iframe_small = $_GET["h2_iframe_small"];
$h2_iframe_small_err = $_GET["h2_iframe_small_err"];
$h2_iframe_small_total_time = $_GET["h2_iframe_small_total_time"];


/* addTest($connection, $uuid, $lat, $bw); */

addTest($connection, $uuid, $test_id, $ip, $test_time, $platform, $vendor, $hit_code, $h1_lat, $h1_lat_err, $h1_bw, $h1_bw_err, $h1_successive_large, $h1_successive_large_err, $h1_successive_large_total_time, $h1_concurrent_large, $h1_concurrent_large_err, $h1_concurrent_large_total_time, $h1_successive_small, $h1_successive_small_err, $h1_successive_small_total_time, $h1_concurrent_small, $h1_concurrent_small_err, $h1_concurrent_small_total_time, $h1_iframe_large, $h1_iframe_large_err, $h1_iframe_large_total_time, $h1_iframe_small, $h1_iframe_small_err, $h1_iframe_small_total_time, $h2_lat, $h2_lat_err, $h2_bw, $h2_bw_err, $h2_successive_large, $h2_successive_large_err, $h2_successive_large_total_time, $h2_concurrent_large, $h2_concurrent_large_err, $h2_concurrent_large_total_time, $h2_successive_small, $h2_successive_small_err, $h2_successive_small_total_time, $h2_concurrent_small, $h2_concurrent_small_err, $h2_concurrent_small_total_time, $h2_iframe_large, $h2_iframe_large_err, $h2_iframe_large_total_time, $h2_iframe_small, $h2_iframe_small_err, $h2_iframe_small_total_time);

mysqli_close($connection);

/* echo "UUID: ".$uuid."\n\tLatency: ".$lat."\n\tBandwidth: ".$bw; */
echo "finished";

function addTest($connection, 
        $uuid, 
		$test_id,
		$ip,
		$test_time,
        $platform,
        $vendor,
        $hit_code,
        $h1_lat, 
        $h1_lat_err, 
        $h1_bw, 
        $h1_bw_err, 
        $h1_successive_large, 
        $h1_successive_large_err, 
        $h1_successive_large_total_time, 
        $h1_concurrent_large, 
        $h1_concurrent_large_err, 
        $h1_concurrent_large_total_time, 
		$h1_successive_small, 
        $h1_successive_small_err, 
        $h1_successive_small_total_time, 
        $h1_concurrent_small, 
        $h1_concurrent_small_err, 
        $h1_concurrent_small_total_time, 
        $h1_iframe_large,
        $h1_iframe_large_err,
        $h1_iframe_large_total_time,
        $h1_iframe_small,
        $h1_iframe_small_err,
        $h1_iframe_small_total_time,
        $h2_lat, 
        $h2_lat_err, 
        $h2_bw, 
        $h2_bw_err, 
        $h2_successive_large, 
        $h2_successive_large_err, 
        $h2_successive_large_total_time, 
        $h2_concurrent_large, 
        $h2_concurrent_large_err, 
		$h2_concurrent_large_total_time,
		$h2_successive_small, 
        $h2_successive_small_err, 
        $h2_successive_small_total_time, 
        $h2_concurrent_small, 
        $h2_concurrent_small_err, 
        $h2_concurrent_small_total_time,
        $h2_iframe_large,
        $h2_iframe_large_err,
        $h2_iframe_large_total_time,
        $h2_iframe_small,
        $h2_iframe_small_err,
        $h2_iframe_small_total_time){
    $u = mysqli_real_escape_string($connection, $uuid);
	$ti = mysqli_real_escape_string($connection, $test_id);
	$eyep = mysqli_real_escape_string($connection, $ip);
	$tt = mysqli_real_escape_string($connection, $test_time);
    $p = mysqli_real_escape_string($connection, $platform);
    $v = mysqli_real_escape_string($connection, $vendor);
    $hc = mysqli_real_escape_string($connection, $hit_code);
    $h1l = mysqli_real_escape_string($connection, $h1_lat);
	$h1le = mysqli_real_escape_string($connection, $h1_lat_err);
    $h1b = mysqli_real_escape_string($connection, $h1_bw);
	$h1be = mysqli_real_escape_string($connection, $h1_bw_err);
	$h1sl = mysqli_real_escape_string($connection, $h1_successive_large);
	$h1sle = mysqli_real_escape_string($connection, $h1_successive_large_err);
	$h1sltt = mysqli_real_escape_string($connection, $h1_successive_large_total_time);
	$h1cl = mysqli_real_escape_string($connection, $h1_concurrent_large);
	$h1cle = mysqli_real_escape_string($connection, $h1_concurrent_large_err);
	$h1cltt = mysqli_real_escape_string($connection, $h1_concurrent_large_total_time);
	$h1ss = mysqli_real_escape_string($connection, $h1_successive_small);
	$h1sse = mysqli_real_escape_string($connection, $h1_successive_small_err);
	$h1sstt = mysqli_real_escape_string($connection, $h1_successive_small_total_time);
	$h1cs = mysqli_real_escape_string($connection, $h1_concurrent_small);
	$h1cse = mysqli_real_escape_string($connection, $h1_concurrent_small_err);
	$h1cstt = mysqli_real_escape_string($connection, $h1_concurrent_small_total_time);
    $h1il = mysqli_real_escape_string($connection, $h1_iframe_large);
    $h1ile = mysqli_real_escape_string($connection, $h1_iframe_large_err);
    $h1iltt = mysqli_real_escape_string($connection, $h1_iframe_large_total_time);
    $h1is = mysqli_real_escape_string($connection, $h1_iframe_small);
    $h1ise = mysqli_real_escape_string($connection, $h1_iframe_small_err);
    $h1istt = mysqli_real_escape_string($connection, $h1_iframe_small_total_time);
	$h2l = mysqli_real_escape_string($connection, $h2_lat);
	$h2le = mysqli_real_escape_string($connection, $h2_lat_err);
    $h2b = mysqli_real_escape_string($connection, $h2_bw);
	$h2be = mysqli_real_escape_string($connection, $h2_bw_err);
	$h2sl = mysqli_real_escape_string($connection, $h2_successive_large);
	$h2sle = mysqli_real_escape_string($connection, $h2_successive_large_err);
	$h2sltt = mysqli_real_escape_string($connection, $h2_successive_large_total_time);
	$h2cl = mysqli_real_escape_string($connection, $h2_concurrent_large);
	$h2cle = mysqli_real_escape_string($connection, $h2_concurrent_large_err);
	$h2cltt = mysqli_real_escape_string($connection, $h2_concurrent_large_total_time);
	$h2ss = mysqli_real_escape_string($connection, $h2_successive_small);
	$h2sse = mysqli_real_escape_string($connection, $h2_successive_small_err);
	$h2sstt = mysqli_real_escape_string($connection, $h2_successive_small_total_time);
	$h2cs = mysqli_real_escape_string($connection, $h2_concurrent_small);
	$h2cse = mysqli_real_escape_string($connection, $h2_concurrent_small_err);
	$h2cstt = mysqli_real_escape_string($connection, $h2_concurrent_small_total_time);
    $h2il = mysqli_real_escape_string($connection, $h2_iframe_large);
    $h2ile = mysqli_real_escape_string($connection, $h2_iframe_large_err);
    $h2iltt = mysqli_real_escape_string($connection, $h2_iframe_large_total_time);
    $h2is = mysqli_real_escape_string($connection, $h2_iframe_small);
    $h2ise = mysqli_real_escape_string($connection, $h2_iframe_small_err);
    $h2istt = mysqli_real_escape_string($connection, $h2_iframe_small_total_time);


	$query = "INSERT INTO innodb.test (UUID, TEST_ID, CLIENT_IP, TEST_TIME, PLATFORM, VENDOR, HIT_CODE, H1_LATENCY, H1_LAT_ERR, H1_BANDWIDTH, H1_BW_ERR, H1_SUCCESSIVE_LARGE, H1_SUCCESSIVE_LARGE_ERR, H1_SUCCESSIVE_LARGE_TOTAL_TIME, H1_CONCURRENT_LARGE, H1_CONCURRENT_LARGE_ERR, H1_CONCURRENT_LARGE_TOTAL_TIME, H1_SUCCESSIVE_SMALL, H1_SUCCESSIVE_SMALL_ERR, H1_SUCCESSIVE_SMALL_TOTAL_TIME, H1_CONCURRENT_SMALL, H1_CONCURRENT_SMALL_ERR, H1_CONCURRENT_SMALL_TOTAL_TIME, H1_IFRAME_LARGE, H1_IFRAME_LARGE_ERR, H1_IFRAME_LARGE_TOTAL_TIME, H1_IFRAME_SMALL, H1_IFRAME_SMALL_ERR, H1_IFRAME_SMALL_TOTAL_TIME, H2_LATENCY, H2_LAT_ERR, H2_BANDWIDTH, H2_BW_ERR, H2_SUCCESSIVE_LARGE, H2_SUCCESSIVE_LARGE_ERR, H2_SUCCESSIVE_LARGE_TOTAL_TIME, H2_CONCURRENT_LARGE, H2_CONCURRENT_LARGE_ERR, H2_CONCURRENT_LARGE_TOTAL_TIME, H2_SUCCESSIVE_SMALL, H2_SUCCESSIVE_SMALL_ERR, H2_SUCCESSIVE_SMALL_TOTAL_TIME, H2_CONCURRENT_SMALL, H2_CONCURRENT_SMALL_ERR, H2_CONCURRENT_SMALL_TOTAL_TIME, H2_IFRAME_LARGE, H2_IFRAME_LARGE_ERR, H2_IFRAME_LARGE_TOTAL_TIME, H2_IFRAME_SMALL, H2_IFRAME_SMALL_ERR, H2_IFRAME_SMALL_TOTAL_TIME) VALUES ('$u', '$ti', '$eyep', '$tt', '$p', '$v', '$hc', '$h1l', '$h1le', '$h1b', '$h1be', '$h1sl', '$h1sle', '$h1sltt', '$h1cl', '$h1cle', '$h1cltt', '$h1ss', '$h1sse', '$h1sstt', '$h1cs', '$h1cse', '$h1cstt', '$h1il', '$h1ile', '$h1iltt', '$h1is', '$h1ise', '$h1istt',  '$h2l', '$h2le', '$h2b', '$h2be', '$h2sl', '$h2sle', '$h2sltt', '$h2cl', '$h2cle', '$h2cltt', '$h2ss', '$h2sse', '$h2sstt', '$h2cs', '$h2cse', '$h2cstt', '$h2il', '$h2ile', '$h2iltt', '$h2is', '$h2ise', '$h2istt');";

	if (!mysqli_query($connection, $query)) {
		echo ("<p>Error adding data</p>");
		printf("Error: %s\n", mysqli_error($connection));
	}
}

function VerifyTestTable($connection, $dbName) {
    if(!TableExists("test", $connection, $dbName)){
        
    }
}

function TableExists($tableName, $connection, $dbName){
    $t = mysqli_real_escape_string($connection, $tableName);
    $d = mysqli_real_escape_string($connection, $dbName);

    $checktable = mysqli_query($connection, "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_NAME = '$t' AND TABLE_SCHEMA = '$d'");

    if(mysqli_num_rows($checktable) > 0) return true;

    return false;
}
  
?>
