<html>
<head>
</head>
<body>
<?php

$sizes = array( "1MB" => "map_one_mb.jpg", "5KB" => "five.jpg" );

$filetype = $_GET["type"];
$num = $_GET["num"];
$size = $_GET["size"];
$proto = $_GET["proto"];
$tag = $_GET["tag"];
$scheme = "";
if ($proto == "h1"){
    $scheme = "http://"; 
}else if ($proto == "h2"){
    $scheme = "https://";
}

for ($x = 0; $x < $num; $x++){
    if ($filetype == "image"){
        $u = uniqid();
        echo '<img src="'.$scheme.'www.testmyprotocol.com/imgs/'.$sizes[$size].'?.'.$u.'_'.$tag.'"/>';
        echo "\n";
    }else if ($filetype == "css"){

    }else if ($filetype == "js"){

    }else if ($filetype == "font"){
        //for now using an average font file from the httparchive
        $u = uniqid();
        echo '<link href="'.$scheme.'www.testmyprotocol.com/fonts/Lato-Bold.ttf?'.$u.'_'.$tag.'" rel="stylesheet">';
        echo "\n";
    }
}

?>
</body>
</html>
