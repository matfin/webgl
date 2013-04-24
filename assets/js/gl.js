/* 
 *  WebGL in object oriented JS
 *  Matt Finucane
 *  2013 
 */

function WebGL(){
    this.gl;
    this.gl_debugger;
    this.shader_program;
    this.mv_matrix;
    this.p_matrix;
    this.cube_vertex_position_buffer;
    this.cube_vertex_texture_coord_buffer;
    this.cube_vertex_index_buffer;
    this.r_cube;
    this.last_time;
    this.mv_matrix_stack;
    this.animation_frame_id;
    this.textures;
    
    this.x_rot;
    this.x_speed;
    this.y_rot;
    this.y_speed;
    this.z;
    this.filter;
}

WebGL.prototype.initGL = function(canvas){
    try{
        this.gl = canvas.getContext('experimental-webgl');
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
        
        this.mv_matrix = mat4.create();
        this.p_matrix = mat4.create();
        this.mv_matrix_stack = [];
        
        this.textures = Array();
        
        this.r_cube = 0;
        this.last_time = 0;
        
        this.x_rot = 0;
        this.x_speed = 0;
        
        this.y_rot = 0;
        this.y_speed = 0;
        
        this.z = -5.0;
        
        this.filter = 0;
                
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
    
    this.shader_program.textureCoordAttribute = this.gl.getAttribLocation(this.shader_program, 'aTextureCoord');
    this.gl.enableVertexAttribArray(this.shader_program.textureCoordAttribute);
    
    this.shader_program.pMatrixUniform = this.gl.getUniformLocation(this.shader_program, 'uPMatrix');
    this.shader_program.mvMatrixUniform = this.gl.getUniformLocation(this.shader_program, 'uMVMatrix'); 
    this.shader_program.samplerUniform = this.gl.getUniformLocation(this.shader_program, 'uSampler');
}

WebGL.prototype.handleLoadedTexture = function(textures){
    this.textures = textures;
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textures[0].image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, textures[1]);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textures[1].image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, textures[2]);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textures[2].image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
}   

WebGL.prototype.initTexture = function(texture_img_src){
    var texture_image = new Image();
    var textures = Array();
    for(var i = 0; i < 3; i++){
       var texture = this.gl.createTexture();
       texture.image = texture_image;
       textures.push(texture);
    }
    var self = this;
    texture_image.onload = function(){
        self.handleLoadedTexture(textures);
    }
    texture_image.src = texture_img_src;
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
    
    this.cube_vertex_texture_coord_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cube_vertex_texture_coord_buffer);
    var texture_coords = [
        //Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        
        //Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        
        //Top face
        0.0, 1.0,
        0.0, 0.0, 
        1.0, 0.0,
        1.0, 1.0,
        
        //Bottom face
        1.0, 1.0, 
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        
        //Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        
        //Left face
        0.0, 0.0, 
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texture_coords), this.gl.STATIC_DRAW);
    this.cube_vertex_texture_coord_buffer.itemSize = 2;
    this.cube_vertex_texture_coord_buffer.numItems = 24;
    
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
    
    mat4.translate(this.mv_matrix, [0.0, 0.0, -5.0]);
    
    //mat4.rotate(this.mv_matrix, this.degToRad(this.r_cube), [1, 0, 0]);
    mat4.rotate(this.mv_matrix, this.degToRad(this.r_cube), [0, 1, 0]);
    mat4.rotate(this.mv_matrix, this.degToRad(this.r_cube), [0, 0, 1]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cube_vertex_position_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexPositionAttribute, this.cube_vertex_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
   
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cube_vertex_texture_coord_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexTextureCoordAttribute, this.cube_vertex_texture_coord_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[this.filter]);
    this.gl.uniform1i(this.shader_program.sampleUniform, 0);
    
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cube_vertex_index_buffer);
    this.setMatrixUniforms();
    this.gl.drawElements(this.gl.TRIANGLES, this.cube_vertex_index_buffer.numItems, this.gl.UNSIGNED_SHORT, 0);   
}

WebGL.prototype.animate = function(){
    var time_now = new Date().getTime();
    if(this.last_time != 0){
        var elapsed = time_now - this.last_time;
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
    this.initTexture('/assets/textures/woodenfloor.png');
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    
    this.tick();
}



