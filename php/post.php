<?php
    $json = json_decode($_GET['json'], TRUE);
    $unique = uniqid("h2_test_") . '.json';
    $myfile = fopen('logs/' . $unique, "w+");
    fwrite($myfile, json_encode($json));
    fclose($myfile);
    echo json_encode($json) . $unique;
?>
