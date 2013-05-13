/*
 *  Applies modified lighting values to the WebGL scene 
 *  with the range input types.
 *  Matt Finucane. April 2013.
 */

function LightingHandler(){
    this.range_inputs;
    this.client;
}

LightingHandler.prototype.init = function(client){
    this.range_inputs = document.querySelectorAll('input[type="range"]');
    this.client = client;
    this.attachBehaviours();
}

LightingHandler.prototype.attachBehaviours = function(){
    var self = this;
    for(range_input_index in this.range_inputs){
        range_input = this.range_inputs[range_input_index];
        /*
         *  Set the values for mygl initially.
         *  Lighting (directional, ambient) and
         *  Directional lighting position.
         */
        self.client[range_input.name] = range_input.value;
        range_input.onchange = function(){
            /*
             *  Then set the values on change.
             */
            self.client[this.name] = this.value;
        }
    }
}