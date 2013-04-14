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
    this.triangle_vertex_position_buffer;
    this.triangle_vertex_color_buffer;
    this.square_vertex_position_buffer;
    this.square_vertex_color_buffer;
}

WebGL.prototype.initGL = function(canvas){
    try{
        this.gl = canvas.getContext('experimental-webgl');
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
        
        this.mv_matrix = mat4.create();
        this.p_matrix = mat4.create();
        
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
    
    this.shader_program.vertexPostionAttribute = this.gl.getAttribLocation(this.shader_program, 'aVertexPosition');
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

WebGL.prototype.initBuffers = function(){
    this.triangle_vertex_position_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangle_vertex_position_buffer);
    var triangle_vertices = [
        0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangle_vertices), this.gl.STATIC_DRAW);
    this.triangle_vertex_position_buffer.itemSize = 3;
    this.triangle_vertex_position_buffer.numItems = 3;
    
    this.triangle_vertex_color_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangle_vertex_color_buffer);
    var triangle_colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangle_colors), this.gl.STATIC_DRAW);
    this.triangle_vertex_color_buffer.itemSize = 4;
    this.triangle_vertex_color_buffer.numItems = 3;
    
    this.square_vertex_position_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.square_vertex_position_buffer);
    var square_vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(square_vertices), this.gl.STATIC_DRAW);
    this.square_vertex_position_buffer.itemSize = 3;
    this.square_vertex_position_buffer.numItems = 4;
    
    this.square_vertex_color_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.square_vertex_color_buffer);
    var square_colors = [];
    for(var i = 0; i < 4; i++){
        square_colors = square_colors.concat([0.5, 0.5, 1.0, 1.0]);
    }
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(square_colors), this.gl.STATIC_DRAW);
    this.square_vertex_color_buffer.itemSize = 4;
    this.square_vertex_color_buffer.numItems = 4;
}

WebGL.prototype.drawScene = function(){
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.p_matrix);
    
    mat4.identity(this.mv_matrix);
    
    mat4.translate(this.mv_matrix, [-1.5, 0.0, -7.0]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangle_vertex_position_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexPositionAttribute, this.triangle_vertex_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangle_vertex_color_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexColorAttribute, this.triangle_vertex_color_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    
    
    this.setMatrixUniforms();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangle_vertex_position_buffer.numItems);
    
    mat4.translate(this.mv_matrix, [3.0, 0.0, 0.0]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.square_vertex_position_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexPositionAttribute, this.square_vertex_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.square_vertex_color_buffer);
    this.gl.vertexAttribPointer(this.shader_program.vertexColorAttribute, this.square_vertex_color_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    
    this.setMatrixUniforms();
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.square_vertex_position_buffer.numItems);
    
}

WebGL.prototype.start = function(){
    var canvas = document.getElementById('glcanvas');
    this.initGL(canvas);
    this.initShaders();
    this.initBuffers();
    
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    
    this.drawScene();
    console.log(WebGLDebugUtils.glEnumToString(this.gl_debugger.getError()));
    
    var error = this.gl.getError();
    console.log(error);
}



