onload = function(){
    console.log('Body loaded! so lets kick off WebGL');
    mygl = new WebGL();
    mygl.start();
    
    keyhandler = new KeyHandler();
    keyhandler.init(mygl);
}