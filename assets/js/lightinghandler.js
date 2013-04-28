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
    for(range_input_index in this.range_inputs){
        range_input = this.range_inputs[range_input_index];
        range_input.onchange = function(){
            console.log(this.name + ': ' + this.value);
        }
    }
    /*
    this.range_inputs.forEach(function(range_input){
       range_input.onchange = function(){
           console.log(this.value);
       } 
    });
    */
}

