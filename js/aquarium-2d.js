'use strict';

function create_fish(){
    // Determine fish class.
    var fish_class = Math.random();

    var fish_size = 0;
    // 60% chance to be normal sized fish...
    if(fish_class < .6){
        fish_size = Math.floor(Math.random() * 25) + 25;

    // 88% chance to be a small fish...
    }else if(fish_class < .88){
        fish_size = Math.floor(Math.random() * 10) + 5;

    // ...else is a giant fish.
    }else{
        fish_size = Math.floor(Math.random() * 500) + 50;
    }

    var fish_speed = Math.random() * 10 - 5;

    fish.push({
      'color': random_hex(),
      'size': fish_size,
      'speed': fish_speed,
      'x': fish_speed < 0
        ? camera_x - fish_size
        : camera_x + fish_size + width,
      'y': camera_y + Math.floor(Math.random() * height),
    });
}

function draw_logic(){
    buffer.fillStyle = '#003';
    buffer.fillRect(
      pillar,
      0,
      100,
      height
    );

    // Save the current buffer state.
    buffer.save();

    // Draw stuff relative to center of canvas.
    buffer.translate(
      -camera_x,
      -camera_y
    );

    for(var id in fish){
        // Determine movement direction based on speed.
        var direction = fish[id]['speed'] > 0
          ? 1
          : -1;

        // Draw fish.
        buffer.beginPath();
        buffer.moveTo(
          fish[id]['x'],
          fish[id]['y'] + fish[id]['size'] / 2
        );
        buffer.lineTo(
          fish[id]['x'] + fish[id]['size'] * direction,
          fish[id]['y']
        );
        buffer.lineTo(
          fish[id]['x'] + fish[id]['size'] * 3 * direction,
          fish[id]['y'] + fish[id]['size']
        );
        buffer.lineTo(
          fish[id]['x'] + fish[id]['size'] * 3 * direction,
          fish[id]['y']
        );
        buffer.lineTo(
          fish[id]['x'] + fish[id]['size'] * direction,
          fish[id]['y'] + fish[id]['size']
        );
        buffer.closePath();

        buffer.fillStyle = fish[id]['color'];
        buffer.fill();
    }

    // Restore the buffer state.
    buffer.restore();

    // Draw current camera position.
    buffer.fillStyle = '#fff';
    buffer.fillText(
      camera_x + 'x ' + camera_y + 'y',
      0,
      25
    );
    buffer.fillText(
      fish.length,
      0,
      50
    );
}

function logic(){
    if(input_keys[65]['state']){
        camera_x -= camera_speed * sprint_modifier;
        move_pillar(camera_speed);
    }
    if(input_keys[68]['state']){
        camera_x += camera_speed * sprint_modifier;
        move_pillar(-camera_speed);
    }
    if(input_keys[83]['state']){
        camera_y += camera_speed * sprint_modifier;
    }
    if(input_keys[87]['state']){
        camera_y -= camera_speed * sprint_modifier;
    }

    for(var id in fish){
        // Fish move in the direction they are facing.
        fish[id]['x'] -= fish[id]['speed'];

        // If a fish travels past the edge of the screen,
        //   move it to the other side.
        var size = fish[id]['size'] * 4;
        if(fish[id]['x'] > camera_x + width + size
          || fish[id]['x'] < camera_x - size){
            fish[id]['x'] += fish[id]['speed'] < 0
              ? -width - size
              : width + size;
            fish[id]['y'] = camera_y + Math.floor(Math.random() * height);
        }
    }
}

function move_pillar(amount){
    pillar += amount * sprint_modifier;

    if(pillar > width){
        pillar -= width + 100;

    }else if(pillar < -100){
        pillar += width + 100;
    }
}

function random_hex(){
    var choices = '0123456789abcdef';
    return '#'
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16));
}

function resize_logic(){
    // Randomize pillar X.
    move_pillar(Math.floor(Math.random() * width));
}

var camera_speed = 5;
var camera_x = 0;
var camera_y = 0;
var fish = [];
var pillar = 0;
var sprint_modifier = 1;

window.onload = function(){
    init_canvas();
    input_init(
      {
        16: {
          'todo': function(){
              sprint_modifier = input_keys[16]['state']
                ? 2
                : 1;
          },
        },
        27: {
          'todo': function(){
              fish.length = 0;
          },
        },
        65: {},
        68: {},
        70: {
          'todo': create_fish,
        },
        72: {
          'todo': function(){
              move_pillar(camera_x);
              camera_x = 0;
              camera_y = 0;
          },
        },
        83: {},
        87: {},
      }
    );

    document.getElementById('canvas').style.background = '#004';

    // Create 10 randomly placed fish.
    var loop_counter = 9;
    do{
        create_fish();
    }while(loop_counter--);
};
