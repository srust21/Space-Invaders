<?php
if(isset($_POST['name']))
{
    $playerName = $_POST['name'];
    $score = $_POST['score']
    $conn = mysqli_connect("revature.c6srifull5t5.us-east-2.rds.amazonaws.com:3306", "srust21", "", "spaceInvaders");
    $sql = "INSERT INTO highScores (playerName, score) VALUES ($playerName, $score);";

    $conn->query($sql);
}
mysqli_close($conn);
?>