<?php

include "../../inc/dbinfo.inc";

error_reporting(E_ALL);

$connection = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD);

if (mysqli_connect_errno()) echo "Failed to connect: " . mysqli_connect_error();

$database = mysqli_select_db($connection, DB_DATABASE);

$matchFound = ( isset($_GET["id"]) );

$id = $matchFound ? trim($_GET["id"]) : '';

/* $id = 'f4f671a8-c4c8-aqualab-01f1-dea3a4f5c1d3'; */

if( $id == ''){
    //no id is specified, notify js to redirect to test
    echo "no id";
}else if( $id == "all" ){
    $query = "SELECT * FROM innodb.test;";
    $result = mysqli_query($connection, $query);
    if (!$result){
        echo ("Error getting data");
    }else{
        if ($result->num_rows > 0){
            $data = array();
            $c = 0;
            while($row = $result->fetch_assoc()){
                $data[$c] = $row;
                $c += 1;
            }
            echo json_encode($data);
        }else{
            echo "no results";
        }
    }
}else{
    //grab data associated with ID
    if (preg_match('#[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-aqualab-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}#', $id, $matches) == 1){
        $query = "SELECT * FROM innodb.test WHERE (UUID = '$id');";
        $result = mysqli_query($connection, $query);
        if (!$result){
            echo ("Error getting data");
        }else{
            if ($result->num_rows > 0){
                $data = array();
                $c = 0;
                while($row = $result->fetch_assoc()){
                    $data[$c] = $row;
                    $c += 1;
                }
                echo json_encode($data);
            }else{
                echo "no results";
            }
        }
    }else{
        echo "incorrect id";
    }
}

?>
