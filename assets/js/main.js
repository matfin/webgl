var GL;
var Texture;

$('document').ready(function(){
    GL = new WebGL('glcanvas', 'FragmentShader', 'VertexShader');
    TextureImage = new Image();
    TextureImage.onload = function(){
        Texture = GL.LoadTexture(TextureImage);
        GL.Draw(Cube, Texture);
    };
    TextureImage.src = '/assets/textures/Texture.png';
});