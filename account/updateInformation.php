<?php
    session_start();
    $username = $_SESSION["username"];
    $params = array("password", "avatar", "email");
    $sqlArgs = [];
    foreach($_POST as $key => $value) {
        if(in_array($key, $params)) {
            $sqlArgs[] = $key . "='" . $value . "'";
        }
    }
    $sqlArgs = join($sqlArgs, ", ");
    if(strlen($sqlArgs) > 0) {
        require($_SERVER["DOCUMENT_ROOT"] . "/php/connect_db.php");
        $sql = "UPDATE users SET $sqlArgs WHERE username='$username'";
        if ($conn->query($sql) === FALSE) {
            echo "Error updating record: " . $conn->error;
        }
    }
?>