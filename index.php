<!DOCTYPE html>
<html lang="en">
    <head>
        <?php 
            include_once('cube/meta.php'); 
        ?>
        <script type="text/javascript" src="/assets/js/glMatrix-0.9.5.min.js"></script>
        <script type="text/javascript" src="/assets/js/webgl-debug.js"></script>
        <?php 
            include_once('cube/scripts.php');
            include_once('cube/shaders/fragment.php'); 
            include_once('cube/shaders/vertex.php');
        ?>
    </head>
    <body>
        <section class="container">
            <?php include_once('cube/content.php'); ?>
        </section>
    </body>
</html>