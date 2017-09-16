<?php
    require_once __DIR__ . '/../!script/php/client_handler/check_blocked_client.script.php';
?>
<!DOCTYPE HTML>
<html>
<head>
    <title>Unitgreen.com - Spiel der Könige</title>
    <meta name="description" content="BreakBall::123 play the Game"/>
    <meta name="robots" content="index,follow"/>
    <link rel="icon" href="/favicon.png" type="image/png" />
    <link href='http://fonts.googleapis.com/css?family=Fjalla+One' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="//pool.unitgreen.com/layout_games/layout.css">
    <meta charset="utf-8">
    <?php require_once __DIR__.'/../../!class/php/google/analytics.php';?>
    <script src="/!script/js/ajax/ajax_loader.class.js" type="text/javascript"></script>
    <script type="text/javascript">
        var Obj1 = new AJAXLOADER_CLASS;
        Obj1.loadInLoop(2000,'/!script/php/score_handler/score_loader.script.js.php','table=breakball123_highScore','ajaxReturnBreak');
    </script>
</head>
<body>
<div id="header">
    <div class="inside">
        <h1>BreakBall::123</h1>
    </div>
</div>
<div id="main">
    <div id="container">
        <div class="inside">
            <div id="game_object">
                <canvas id="breakball_canvas" width="680" height="370"></canvas>
            </div>
            <div id="SCORE">
                <div class="score_box">
                    <h2>Score:</h2>
                    <div id="ajaxReturnBreak"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="files/js/breakball123.js"></script>
</body>
</html>
