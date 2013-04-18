/* 
 *  WebGL in object orient JS
 *  Matt Finucane
 *  2013 
 */

function WebGL(){
    this.gl;
    this.gl_debugger;
    this.shader_program;
    this.mv_matrix;
    this.p_matrix;
    this.pyramid_vertex_position_buffer;
    this.pyramid_vertex_color_buffer;
    this.cube_vertex_position_buffer;
    this.cube_vertex_color_buffer;
    this.cube_vertex_index_buffer;
    this.r_pyramid;
    this.r_cube;
    this.last_time;
    this.mv_matrix_stack;
    this.animation_frame_id;
}

WebGL.prototype.initGL = function(canvas){
    try{
        this.gl = canvas.getContext('experimental-webgl');
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
        
        this.mv_matrix = mat4.create();
        this.p_matrix = mat4.create();
        this.mv_matrix_stack = [];
        
        this.r_pyramid = 0;
        this.r_cube = 0;
        this.last_time = 0;
                
        this.gl_debugger = WebGLDebugUtils.makeDebugContext(this.gl);
    }
    catch(e){
        alert('Exception: Could not initGL() canvas');
    }
    if(!this.gl){
        alert('No support for WebGL here. Download Google Chrome');
    }
}

WebGL.prototype.getShader = function(id){
    var shader_script = document.getElementById(id);
    if(!shader_script){
        alert('Could not load shader script by id: ' + id);
        return false;
    }
    
    var shader_src = '';
    var k = shader_script.firstChild;
    while(k){
        if(k.nodeType == 3){
            shader_src += k.textContent;
        }
        k = k.nextSibling;
    }
    
    var shader;
    if(shader_script.type == 'x-shader/x-fragment'){
        shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    }
    else if(shader_script.type == 'x-shader/x-vertex'){
        shader = this.gl.createShader(this.gl.VERTEX_SHADER);
    }
    else{
        return false;
    }
    
    this.gl.shaderSource(shader, shader_src);
    this.gl.compileShader(shader);
    
    if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
        alert('Exception: Compiling shader - ' + this.gl.getShaderInfoLog(shader));
        return false;
    }
    return shader;
}

WebGL.prototype.initShaders = function(){
    var fragment_shader = this.getShader('shader-fs');
    var vertex_shader = this.getShader('shader-vs');
    
    this.shader_program = this.gl.createProgram();
    
    this.gl.attachShader(this.shader_program, vertex_shader);
    this.gl.attachShader(this.shader_program, fragment_shader);
    this.gl.linkProgram(this.shader_program);
    
    if(!this.gl.getProgramParameter(this.shader_program, this.gl.LINK_STATUS)){
        alert('Excpetion: Linking shader');
        return false;
    }
    
    this.gl.useProgram(this.shader_program);
    
    this.shader_program.vertexPositionAttribute = this.gl.getAttribLocation(this.shader_program, 'aVertexPosition');
    this.gl.enableVertexAttribArray(this.shader_program.vertexPositionAttribute);
    
    this.shader_program.vertexColorAttribute = this.gl.getAttribLocation(this.shader_program, 'aVertexColor');
    this.gl.enableVertexAttribArray(this.shader_program.vertexColorAttribute);
    
    this.shader_program.pMatrixUniform = this.gl.getUniformLocation(this.shader_program, 'uPMatrix');
    this.shader_program.mvMatrixUniform = this.gl.getUniformLocation(this.shader_program, 'uMVMatrix'); 
}

WebGL.prototype.setMatrixUniforms = function(){    
    this.gl.uniformMatrix4fv(this.shader_program.pMatrixUniform, false, this.p_matrix);
    this.gl.uniformMatrix4fv(this.shader_program.mvMatrixUniform, false, this.mv_matrix);
}

WebGL.prototype.mvPushMatrix = function(){
    var copy = mat4.create();
    mat4.set(this.mv_matrix, copy);
    this.mv_matrix_stack.push(copy);
}

WebGL.prototype.mvPopMatrix = function(){
    if(this.mv_matrix_stack.length == 0){
        throw 'Invalid pop of matrix stack';
    }
    this.mv_matrix = this.mv_matrix_stack.pop();
}

WebGL.prototype.degToRad = function(degrees){
    return degrees * Math.PI / 180;
}


WebGL.prototype.initBuffers = function(){
    this.pyramid_vertex_position_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pyramid_vertex_position_buffer);
    var vertices = [
        //Front face
        0.0, 1.0, 0.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        
        //Right face
        0.0, 1.0, 0.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,
        
        //Back face
        0.0, 1.0, 0.0,
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
    
        //Left face
        0.0, 1.0, 0.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.pyramid_vertex_position_buffer.itemSize = 3;
    this.pyramid_vertex_position_buffer.numItems = 12;
    
    this.pyramid_vertex_color_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pyramid_vertex_color_buffer);
    var colors = [
        //Front face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        
        //Right face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        
        //Back Face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        
        //Left Face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    this.pyramid_vertex_color_buffer.itemSize = 4;
    this.pyramid_vertex_color_buffer.numItems = 12;
    
    this.cube_vertex_position_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cube_vertex_position_buffer);
    vertices = [
        //Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        
        //Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        
        //Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        
        //Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
    
        //Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        
        //Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.cube_vertex_position_buffer.itemSize = 3;
    this.cube_vertex_position_buffer.numItems = 24;
    
    this.cube_vertex_color_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cube_vertex_color_buffer);
    colors = [
        [1.0, 0.0, 0.0, 1.0], //Front face
        [1.0, 1.0, 0.0, 1.0], //Back face
        [0.0, 1.0, 0.0, 1.0], //Top face
        [1.0, 0.5, 0.5, 1.0], //Bottom face
        [1.0, 0.0, 1.0, 1.0], //Right face
        [0.0, 0.0, 1.0, 1.0] //Left face
    ];
    
    var unpacked_colors = [];
    for(var i in colors){
        var color = colors[i];
        for(var j = 0; j < 4; j++){
            unpacked_colors = unpacked_colors.concat(color);
        }
    }
    
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(unpacked_colors), this.gl.STATIC_DRAW);
    this.cube_vertex_color_buffer.itemSize = 4;
    this.cube_vertex_color_buffer.numItems = 24;
    
    this.cube_vertex_index_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cube_vertex_index_buffer);
    var cube_vertex_indices = [
        0, 1, 2,        0, 2, 3,    //Front face
        4, 5, 6,        4, 6, 7,    //Back face
        8, 9, 10,       8, 10, 11,  //Top face
        12, 13, 14,     12, 14, 15, //Bottom face
        16, 17, 18,     16, 18, 19, //Right face
        20, 21, 22,     20, 22, 23  //Left face
    ];
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_vertex_indices), this.gl.STATIC_DRAW);
    this.cube_vertex_index_buffer.itemSize = 1;
    this.cube_vertex_index_buffer.numItems = 36;
}

WebGL.prototype.drawScene = function(){
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.p_matrix);
    
    mat4.identity(this.mv_matrix);
    
    mat4.translate(this.mv_matrix, [-1.5, 0.0, -8.0]);
    
    this.mvPushMatrix();
    mat4.rotate(this.mv_matrix, this.degToRad(this.r_pyramid), [0, 1, 0]);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pyramid_vertex_position_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexPositionAttribute, this.pyramid_vertex_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pyramid_vertex_color_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexColorAttribute, this.pyramid_vertex_color_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    
    this.setMatrixUniforms();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.pyramid_vertex_position_buffer.numItems);
    
    this.mvPopMatrix();   
    
    
    mat4.translate(this.mv_matrix, [3.0, 0.0, 0.0]);
    
    this.mvPushMatrix();
    mat4.rotate(this.mv_matrix, this.degToRad(this.r_cube), [1, 1, 1]);
    
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cube_vertex_position_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexPositionAttribute, this.cube_vertex_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
   
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cube_vertex_color_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexColorAttribute, this.cube_vertex_color_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cube_vertex_index_buffer);
    this.setMatrixUniforms();
    this.gl.drawElements(this.gl.TRIANGLES, this.cube_vertex_index_buffer.numItems, this.gl.UNSIGNED_SHORT, 0);   
    
    this.mvPopMatrix();
}

WebGL.prototype.animate = function(){
    var time_now = new Date().getTime();
    if(this.last_time != 0){
        var elapsed = time_now - this.last_time;
        this.r_pyramid += (90 * elapsed) / 1000.0;
        this.r_cube -= (75 * elapsed) / 1000.0;
    }
    this.last_time = time_now;
}

WebGL.prototype.tick = function(){
    this.animation_frame_id = this.requestAnimationFrame(this.tick.bind(this));      
    this.drawScene();
    this.animate();
}

WebGL.prototype.untick = function(){
    window.cancelAnimationFrame(this.animation_frame_id);
}

WebGL.prototype.requestAnimationFrame = function(fn){ 
    if(typeof(window.requestAnimationFrame) != 'undefined'){
        return window.requestAnimationFrame(fn);
    }
    else if(typeof(window.webkitRequestAnimationFrame) != 'undefined'){
        return window.webkitRequestAnimationFrame(fn);
    }
    else if(typeof(window.mozRequestAnimationFrame) != 'undefined'){
        return window.mozRequestAnimationFrame(fn);
    }
    else if(typeof(window.oRequestAnimationFrame) != 'undefined'){
        return window.oRequestAnimationFrame(fn);
    }
    else if(typeof(window.msRequestAnimationFrame) != 'undefined'){
        return window.msRequestAnimationFrame(fn);
    }
    else{
        return window.setTimeout(fn, 1000 / 60);
    }
}

WebGL.prototype.start = function(){
    var canvas = document.getElementById('myglcanvas');
    this.initGL(canvas);
    this.initShaders();
    this.initBuffers();
    
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    
    this.tick();
}



