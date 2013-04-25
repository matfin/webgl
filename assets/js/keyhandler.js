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
}

KeyHandler.prototype.handleKeyPress = function(event){
    console.log(event.keyCode);
    switch(event.keyCode){
        //Up
        case 38: {
            this.client.x_speed -= 3;
            break;
        }
        //Down
        case 40: {
            this.client.x_speed += 3;
            break;
        }
        //Left
        case 37: {
            this.client.y_speed -= 3;
            break;
        }
        //Right
        case 39: {
            this.client.y_speed += 3;
            break;
        }
        //PageUp
        case 33: {
            this.z > 1.0 ? this.z -= 0.2:this.z;
            break;
        }
        //PageDn
        case 34: {
            this.z < 5.0 ? this.z += 0.2:this.z;
            break;
        }
    }
}




