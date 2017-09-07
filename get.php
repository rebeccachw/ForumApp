<?php


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "henry03";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }

try {   
        $sql="SELECT * FROM users_table";
        $query = $conn->prepare($sql);
        $query->execute();
        $rows = $query->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($rows);

    } catch (Exception $e) {
        echo $e->getMessage();
        exit;
    }


?>