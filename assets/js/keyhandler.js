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
            this.client.z -=0.05;
            break;
        }
        //PageDn
        case 34: {
            this.client.z +=0.05;
            break;
        }
    }
}




