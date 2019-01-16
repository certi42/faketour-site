<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    require($_SERVER['DOCUMENT_ROOT'] . "/php/connect_db.php");
    $table_name = $set . "_matches";
    $sql = "SELECT format, round, player_one, player_two, score FROM $table_name";
    $result = $conn->query($sql);

    $output = "";

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $entry["playerOne"] = $row["player_one"];
            $entry["playerTwo"] = $row["player_two"];
            $entry["record"] = $row["score"];
            $output[$row["format"]][$row["round"]][] = $entry;
#            echo $row["round"] . "<br>";
        }
        echo json_encode($output);
    } else {
        echo "0 results";
    }
    $conn->close();
?>