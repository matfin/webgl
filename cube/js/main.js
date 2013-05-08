onload = function(){
    console.log('Body loaded! so lets kick off WebGL');
    
    mygl = new WebGL();

    keyhandler = new KeyHandler();
    keyhandler.init(mygl); 
    
    lightinghandler = new LightingHandler();
    lightinghandler.init(mygl);
    
    mygl.start();
}