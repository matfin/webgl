function gl_experiment(){
    this.canvas;
    this.gl_context;
    this.square_vertices_buffer;
    this.mv_matrix;
    this.shader_program;
    this.vertex_position_attribute;
    this.perspective_matrix;
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
        return false;
    }
    
    if(!gl_context){
        alert('Could not initialise a WebGL context. Does your browser support WebGL?');
        return false;
    }
    else{
        this.gl_context = gl_context;
    }
    return true;
}

gl_experiment.prototype.init_shaders = function(){
    var fragment_shader = this.getShader('shader-fs');
    var vertex_shader = this.getShader('shader-vs');
    
    this.shader_program = this.gl_context.createProgram();
    this.gl_context.attachShader(this.shader_program, vertex_shader);
    this.gl_context.attachShader(this.shader_program, fragment_shader);
    this.gl_context.linkProgram(this.shader_program);
    
    if(!this.gl_context.getProgramParameter(this.shader_program, this.gl_context.LINK_STATUS)){
        alert('Unable to initialise shader program.');
    }
    
    this.gl_context.useProgram(this.shader_program);
    
    this.vertex_position_attribute = this.gl_context.getAttribLocation(this.shader_program, 'aVertexPosition');
    this.gl_context.enableVertexAttribArray(this.vertex_position_attribute);
}

gl_experiment.prototype.init_buffers = function(){
    this.square_vertices_buffer = this.gl_context.createBuffer();
    this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.square_vertices_buffer);
    
    var vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    
    this.gl_context.bufferData(this.gl_context.ARRAY_BUFFER, new Float32Array(vertices), this.gl_context.STATIC_DRAW);
}

gl_experiment.prototype.draw_scene = function(){
    this.gl_context.viewport(0, 0, this.gl_context.viewportWidth, this.gl_context.viewportHeight);
    this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);
    
    mat4.perspective(45, this.gl_context.viewportWidth / this.gl_context.viewportHeight, 0.1, 100);
    mat4.identity(this.mv_matrix);
    mat4.translate(this.mv_matrix, [-0.0, 0.0, -6.0]);
    
    
    //perspective_matrix = makePerspective(45, 640.0 / 480.0, 0.1, 100);
    //loadIdentity();
    //mvTranslate([-0.0, 0.0, -6.0]);
    
    //this.gl_context.bindBuffer(this.gl_context. ARRAY_BUFFER, square_vertices_buffer);
    //this.gl_context.vertextAttribPointer(vertexPositionAttribute, 3, this.gl_context.FLOAT, false, 0, 0);
    //setMatrixUniforms();
    //this.gl_context.drawArrays(this.gl_context.TRIANGLE_STRIP, 0, 4);
}

gl_experiment.prototype.loadIdentity = function(){
    this.mv_matrix = Matrix.I(4);
}

gl_experiment.prototype.multMatrix = function(m){
    this.mv_matrix = this.mv_matrix.x(m);
}

gl_experiment.prototype.mv_translate = function(v){
    this.multMatrix(Matrix.Translation($V(v[0], v[1], v[2])).ensure4x4());
}

gl_experiment.prototype.setMatrixUniforms = function(){
    var p_uniform = this.gl_context.getUniformLocation(this.shader_program, 'uPMatrix');
    this.gl_context.uniformMatrix4fv(p_uniform, false, new Float32Array(perspectiveMatrix.flatten()));
    
    var mv_uniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    this.gl_context.uniformMatrix4fv(mv_uniform, false, new Float32Array(mvMatrix.flatten()));
    //this.gl_context.
}

gl_experiment.prototype.getShader = function(id){
    var shader_script, the_source, current_child, shader;
    
    shader_script = document.getElementById(id);
    if(!shader_script){
        console.log('Cannot get shader script');
        return null;
    }
    
    the_source = '';
    current_child = shader_script.firstChild;
    while(current_child){
        if(current_child.nodeType == current_child.TEXT_NODE){
            the_source += current_child.textContent;
        }
        current_child = current_child.nextSibling;
    }
        
    if(shader_script.type == 'x-shader/x-fragment'){
        console.log('x-shader/x-fragment');
        shader = this.gl_context.createShader(this.gl_context.FRAGMENT_SHADER);
    }
    else if(shader_script.type == 'x-shader/x-vertex'){
        console.log('x-shader/x-vertex');
        shader = this.gl_context.createShader(this.gl_context.VERTEX_SHADER);
    }
    else{
        console.log('Null');
        return null;
    }
    
    this.gl_context.shaderSource(shader, the_source);
    this.gl_context.compileShader(shader);
    
    if(!this.gl_context.getShaderParameter(shader, this.gl_context.COMPILE_STATUS)){
        alert('An error occurred compiling the shaders: ' + this.gl_context.getShaderInfoLog(shader));
        return null;
    }
    
    return shader;
}

gl_experiment.prototype.start = function(){
    console.log('Kicking off WebGL');
    this.canvas = document.getElementById('glcanvas');
    if(this.init()){
        this.gl_context.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl_context.clearDepth(1.0);
        this.gl_context.enable(this.gl_context.DEPTH_TEST);
        this.gl_context.depthFunc(this.gl_context.LEQUAL);
        
        this.init_shaders();
        
        this.init_buffers();
        
        setInterval(this.draw_scene, 15);
    }
}

