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
    
        $username = $_POST['username'];
        $image = $_POST['image'];
        $country = $_POST['country'];
        $post = $_POST['post'];
    
        $sql="INSERT INTO users_table (username, image, country, post) 
        VALUES (:username,:image,:country,:post)";
        $query = $conn->prepare($sql);
        $query ->bindParam(':username',$username);
        $query ->bindParam(':image',$image);
        $query ->bindParam(':country',$country);
        $query ->bindParam(':post',$post);
        $query->execute();

    } catch (Exception $e) {
        echo $e->getMessage();
        exit;
    }


?>