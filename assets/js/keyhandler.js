/*
 * Keyboard input to control the movement of the primitive
 * Matt Finucane 
 * 2013
 */

function KeyHandler(){
    this.client;
}

KeyHandler.prototype.init = function(client){
    this.client = client;
    this.initEvents();
}

KeyHandler.prototype.initEvents = function(){
    var self = this;
    document.onkeydown = function(event){
        self.handleKeyPress(event);
    }
    this.handleTextureChange();
}

KeyHandler.prototype.handleTextureChange = function(){
    var self = this;
    document.querySelectorAll('select[name="texture"]')[0].onchange = function(){
        self.client.initTexture('assets/textures/' + this.value);
    }
}



