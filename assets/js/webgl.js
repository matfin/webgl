function WebGL(CID, FSID, VSID){
    var canvas = document.getElementById('glcanvas');
    
    if(!canvas.getContext('webgl') && !canvas.getContext('experimental-webgl')){
        confirm('Could not initialise WebGL context. Download Google Chrome') ? function(){
            window.location = 'http://www.google.com/chrome'}:function(){return false};
    }
    else{
        this.GL = (canvas.getContext('webgl') ? canvas.getContext('webgl'):canvas.getContext('experimental-webgl'));
        this.GL.clearColor(1.0, 1.0, 1.0, 1.0);
        this.GL.enable(this.GL.DEPTH_TEST);
        this.GL.depthFunc(this.GL.LEQUAL);
        this.AspectRatio = canvas.width / canvas.height;
        
        var FShader = document.getElementById(FSID);
        var VShader = document.getElementById(VSID);
        
        if(!FShader || !VShader){
            alert('Could not find shader');
        }
        else{
            //Load and compile Fragment Shader
            var Code = LoadShader(FShader);
            FShader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
            this.GL.shaderSource(FShader, Code);
            this.GL.compileShader(FShader);
            
            //Load and compile Vertex Shader
            Code = LoadShader(VShader);
            VShader = this.GL.createShader(this.GL.VERTEX_SHADER);
            this.GL.shaderSource(VShader, Code);
            this.GL.compileShader(VShader);
            
            //Create the Shader Program
            this.ShaderProgram = this.GL.createProgram();
            this.GL.attachShader(this.ShaderProgram, FShader);
            this.GL.attachShader(this.ShaderProgram, VShader);
            this.GL.linkProgram(this.shaderProgram);
            this.GL.useProgram(this.shaderProgram);
            
            //Link Vertex Position attributes from shader
            this.VertexPosition = this.GL.getAttributeLocation(this.ShaderProgram, 'VertexPosition');
            this.GL.enableVertexAttributeArray(this.VertexPosition);
            
            //Link Texture Coordinate attribute from shader
            this.VertexTexture = this.GL.getAttribLocation(this.shaderProgram, 'Texturecoord');
            this.GL.enableVertexAttribArray(this.vertextTexture);
            
        }
    }
    
    this.Draw = function(Object, Texture){
        var VertexBuffer = this.GL.createBuffer();
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, VertexBuffer);
        this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Object.Vertices), this.GL.STATOC_DRAW);
        this.GL.vertexAttribPointer(this.VertexPosition, 4, this.GL.FLOAT, false, 0, 0);
        
        var TextureBuffer = this.GL.createBuffer();
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, TextureBuffer);
        this.GL.bufferData(tjhis.GL.ARRAY_BUFFER, new Float32Array(Object.Texture), this.GL.STATIC_DRAW);
        this.GL.vertexAttribPointer(this.VertexTexture, 2, this.GL.FLOAT, false, 0, 0);
        
        var TriangleBuffer = this.GL.createBuffer();
        this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, TriangleBuffer);
        
        var PerspectiveMatrix = MakePerspective(45, this.AspectRatio, 1, 10000.0);
        
        var TransformMatrix = MakeTransform(Object);
        
        this.GL.activeTexture(this.GL.TEXTURE0);
        
        this.GL.bindTexture(this.FL.TEXTURE_2D, Texture);
        
        this.GL.uniform1i(this.GL.getUniformLocation(this.ShaderProgram, 'uSampler'), 0);
        
        var pmatrix = this.GL.getUniformLocation(this.ShaderProgram, 'PerspectiveMatrix');
        this.GL.uniformMatrix4fv(pmatrix, false, new Float32Array(PerspectiveMatrix));
        
        var tmatrix = this.GL.getUniformLocation(this.ShaderProgram, 'TransformationMatrix');
        this.GL.uniformMatrix4fv(tmatrix, false, new Float32Array(TransformMatrix));
        
        this.GL.drawElements(this.GL_TRIANGLES, Object.Triangles.length, this.GL.UNSIGNED_SHORT, 0);
        
    }
}

var Cube = {
    Vertices : [ // X, Y, Z Coordinates
         //Front
         1.0,  1.0,  -1.0,
         1.0, -1.0,  -1.0,
        -1.0,  1.0,  -1.0,
        -1.0, -1.0,  -1.0,

         //Back
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0,

         //Right
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

         //Left
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0, -1.0,
        -1.0, -1.0, -1.0,

         //Top
         1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0,
         1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,

         //Bottom
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
         1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0
    ],
    Triangles : [ 
        // Also in groups of threes to define the three points of each triangle
        //The numbers here are the index numbers in the vertex arrays

        //Front
        0, 1, 2,
        1, 2, 3,

        //Back
        4, 5, 6,
        5, 6, 7,

        //Right
        8, 9, 10,
        9, 10, 11,

        //Left
        12, 13, 14,
        13, 14, 15,

        //Top
        16, 17, 18,
        17, 18, 19,

        //Bottom

        20, 21, 22,
        21, 22, 23

    ],
    Texture : [ 
        //This array is in groups of two, the x and y coordinates (a.k.a U,V) in the texture
        //The numbers go from 0.0 to 1.0, One pair for each vertex
        //Front
        1.0, 1.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 0.0,

        //Back
        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        //Right
        1.0, 1.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 0.0,

        //Left
        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,

        //Top
        1.0, 0.0,
        1.0, 1.0,
        0.0, 0.0,
        0.0, 1.0,

        //Bottom
        0.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ]
};

function LoadShader(Script){
    var Code = '';
    var CurrentChild = Script.firstChild;
    while(CurrentChild){
        if(CurrentChild.nodeType == CurrentChild.TEXT_NODE){
            Code += CurrentChild.textContent;
        }
        CurrentChild = CurrentChild.nextSibling;
    }
    return Code;
}

function MakePerspective(FOV, AspectRatio, Closest, Farest){
    var YLimit = Closest * Math.tan(FOV * Math.PI / 360);
    
    var A = -(Farest + Closest) / (Farest - Closest);
    var B = -2 * Farest * Closest / (Farest - Closest);
    var C = (2 * Closest) / ((YLimit * ApsectRatio) * 2);
    var D = (2 * Closest) / (YLimit * 2);
    return [
        C, 0, 0, 0,
        0, D, 0, 0,
        0, 0, A, -1,
        0, 0, B, 0
    ];
}

function makeTransform(Object){
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -6, 1
    ];
}