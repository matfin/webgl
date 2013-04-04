function gl_experiment(){
    this.canvas;
    this.gl_context;
}

gl_experiment.prototype.init = function(){
    gl_context = null;
    
    if(!this.canvas){
        alert('Looks like canvas needs to be loaded first');
        return false;
    }
    
    try{
        gl_context = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    }
    catch(e){
        //nothing for now
    }
    
    if(!gl_context){
        alert('Could not initialise a WebGL context. Does your browser support WebGL?');
        return false;
    }
    else{
        this.gl_context = gl_context;
    }
}

gl_experiment.prototype.do_something = function(){
    if(this.gl_context){
        this.gl_context.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl_context.enable(this.gl_context.DEPTH_TEST);
        this.gl_context.depthFunc(this.gl_context.LEQUAL);
        this.gl_context.clear(this.gl.COLOUR_BUFFER_BIT|this.gl_context.DEPTH_BUFFER_BIT);
    }
}

gl_experiment.prototype.start = function(){
    console.log('Kicking off WebGL');
    this.canvas = document.getElementById('glcanvas');
    this.init(this.canvas);
    
    
}

