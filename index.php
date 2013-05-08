<?php
    define('page', $_REQUEST['page']);
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <?php 
            include_once(page . '/meta.php'); 
        ?>
        <script type="text/javascript" src="/assets/js/glMatrix-0.9.5.min.js"></script>
        <script type="text/javascript" src="/assets/js/webgl-debug.js"></script>
        <?php 
            if(strcmp(page, 'landing') != 0){
                include_once(page . '/scripts.php');
                include_once(page . '/shaders/fragment.php'); 
                include_once(page . '/shaders/vertex.php');
            }
        ?>
    </head>
    <body>
        <section class="container">
            <?php include_once(page . '/content.php'); ?>
        </section>
    </body>
</html>