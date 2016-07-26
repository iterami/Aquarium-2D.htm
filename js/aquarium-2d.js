'use strict';

function create_fish(){
    // Determine fish class.
    var fish_class = Math.random();

    var fish_size = 0;
    // 60% chance to be normal sized fish...
    if(fish_class < .6){
        fish_size = random_integer(25) + 25;

    // 88% chance to be a small fish...
    }else if(fish_class < .88){
        fish_size = random_integer(10) + 5;

    // ...else is a giant fish.
    }else{
        fish_size = random_integer(500) + 50;
    }

    var fish_dx = Math.random() * 10 - 5;

    fish.push({
      'color': random_hex(),
      'dx': fish_dx,
      'dy': Math.random() * (fish_dx / 2) - fish_dx / 4,
      'size': fish_size,
      'x': fish_dx < 0
        ? camera_x - fish_size
        : camera_x + fish_size + canvas_width,
      'y': camera_y + random_integer(canvas_height),
    });
}

function draw_logic(){
    canvas_buffer.fillStyle = '#003';
    canvas_buffer.fillRect(
      pillar,
      0,
      100,
      canvas_height
    );

    // Save the current buffer state.
    canvas_buffer.save();

    // Draw stuff relative to center of canvas.
    canvas_buffer.translate(
      -camera_x,
      -camera_y
    );

    for(var id in fish){
        // Determine movement direction based on dx.
        var direction = fish[id]['dx'] > 0
          ? 1
          : -1;

        // Draw fish.
        canvas_buffer.beginPath();
        canvas_buffer.moveTo(
          fish[id]['x'],
          fish[id]['y'] + fish[id]['size'] / 2
        );
        canvas_buffer.lineTo(
          fish[id]['x'] + fish[id]['size'] * direction,
          fish[id]['y']
        );
        canvas_buffer.lineTo(
          fish[id]['x'] + fish[id]['size'] * 3 * direction,
          fish[id]['y'] + fish[id]['size']
        );
        canvas_buffer.lineTo(
          fish[id]['x'] + fish[id]['size'] * 3 * direction,
          fish[id]['y']
        );
        canvas_buffer.lineTo(
          fish[id]['x'] + fish[id]['size'] * direction,
          fish[id]['y'] + fish[id]['size']
        );
        canvas_buffer.closePath();

        canvas_buffer.fillStyle = fish[id]['color'];
        canvas_buffer.fill();
    }

    // Restore the buffer state.
    canvas_buffer.restore();

    // Draw current camera position.
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.fillText(
      camera_x + 'x ' + camera_y + 'y',
      0,
      25
    );
    canvas_buffer.fillText(
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
        fish[id]['x'] -= fish[id]['dx'];
        fish[id]['y'] -= fish[id]['dy'];

        // If a fish travels past the edge of the screen,
        //   move it to the other side.
        var size = fish[id]['size'] * 4;
        if(fish[id]['x'] > camera_x + canvas_width + size
          || fish[id]['x'] < camera_x - size){
            fish[id]['x'] += fish[id]['dx'] < 0
              ? -canvas_width - size
              : canvas_width + size;
            fish[id]['y'] = camera_y + random_integer(canvas_height);
        }
    }
}

function move_pillar(amount){
    pillar += amount * sprint_modifier;

    if(pillar > canvas_width){
        pillar -= canvas_width + 100;

    }else if(pillar < -100){
        pillar += canvas_width + 100;
    }
}

function resize_logic(){
    move_pillar(random_integer(canvas_width));
}

var camera_speed = 5;
var camera_x = 0;
var camera_y = 0;
var fish = [];
var pillar = 0;
var sprint_modifier = 1;

window.onload = function(){
    canvas_init();
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
