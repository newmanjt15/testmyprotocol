<?php

$data = $_POST['json'];

$file = uniqid("test_");
$fh = fopen($file, 'w') or die("can't open file");
fwrite($fh, $data);
fclose($fh);
echo "success";


?>
