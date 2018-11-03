<?php
	error_reporting(E_ALL);
	ini_set("display_errors", 1);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $output = "";
    $output["sealed"] = getData("sealed", $conn);
    $output["std"] = getData("constructed", $conn);
    echo json_encode($output);
    $conn->close();

    function getData($format, $conn) {
        $table_name = "grn_" . $format;
    	$sql = "SELECT username, opponents FROM $table_name";
    	$result = $conn->query($sql);
    
    	$output = "";
    
    	if ($result->num_rows > 0) {
    		while($row = $result->fetch_assoc()) {
    			$entry["opponents"] = json_decode($row["opponents"]);
    			$output[$row["username"]] = $entry;
    		}
    		return $output;
    	} else {
            return "null";
    	}
    }
?>