<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    $format = $_REQUEST["format"];
    $round = $_REQUEST["round"];
    $player_one = $_REQUEST["playerOne"];
    $player_two = $_REQUEST["playerTwo"];
    $id = $_REQUEST["id"];
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $table_name = $set . "_matches";
    $sql = "UPDATE $table_name (format, round, player_one, player_two) VALUES ('$format', '$round', '$player_one', '$player_two') WHERE id='$id'";
    if ($conn->query($sql) === FALSE) {
        die("Error updating record: " . $conn->error);
    }
?>	