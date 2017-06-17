'use strict';

function load_data(id){
    fish.length = 0;

    document.getElementById('canvas').style.background = '#004';

    var loop_counter = 9;
    do{
        create_fish();
    }while(loop_counter--);
}
