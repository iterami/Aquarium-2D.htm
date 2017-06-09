'use strict';

function create_fish(){
    // Determine fish size.
    var fish_size = Math.random();

    // Chance to be normal sized fish...
    if(fish_size < .6){
        fish_size = core_random_integer({
          'max': 25,
        }) + 25;

    // ...or chance to be a small fish...
    }else if(fish_size < .88){
        fish_size = core_random_integer({
          'max': 10,
        }) + 5;

    // ...else is a giant fish.
    }else{
        fish_size = core_random_integer({
          'max': 500,
        }) + 50;
    }


    fish.push({
      'angle': 0,
      'color': '#' + core_random_hex(),
      'dx': 0,
      'dy': 0,
      'size': fish_size,
      'x': 0,
      'y': 0,
    });

    randomize_fish_movement(fish.length - 1);
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
        canvas_buffer.save();

        // Translate and rotate fish.
        canvas_buffer.translate(
          fish[id]['x'],
          fish[id]['y']
        );
        canvas_buffer.rotate(fish[id]['angle']);

        // Determine movement direction based on dx.
        var direction = fish[id]['dx'] > 0
          ? 1
          : -1;

        // Draw fish.
        canvas_draw_path({
          'properties': {
            'fillStyle': fish[id]['color'],
          },
          'vertices': [
            {
              'type': 'moveTo',
              'x': 0,
              'y': fish[id]['size'] / 2,
            },
            {
              'x': fish[id]['size'] * direction,
              'y': 0,
            },
            {
              'x': fish[id]['size'] * 3 * direction,
              'y': fish[id]['size'],
            },
            {
              'x': fish[id]['size'] * 3 * direction,
              'y': 0,
            },
            {
              'x': fish[id]['size'] * direction,
              'y': fish[id]['size'],
            },
          ],
        });

        canvas_buffer.restore();
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
    camera_speed = core_keys[16]['state']
      ? 10
      : 5;

    if(core_keys[65]['state']){
        camera_x -= camera_speed;
        move_pillar(camera_speed);
    }
    if(core_keys[68]['state']){
        camera_x += camera_speed;
        move_pillar(-camera_speed);
    }
    if(core_keys[83]['state']){
        camera_y += camera_speed;
    }
    if(core_keys[87]['state']){
        camera_y -= camera_speed;
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
            fish[id]['y'] = camera_y + core_random_integer({
              'max': canvas_height,
            });

            randomize_fish_movement(id);
        }
    }
}

function move_pillar(amount){
    pillar += amount;

    if(pillar > canvas_width){
        pillar -= canvas_width + 100;

    }else if(pillar < -100){
        pillar += canvas_width + 100;
    }
}

function randomize_fish_movement(fish_id){
    fish[fish_id]['dx'] = Math.random() * 10 - 5;
    fish[fish_id]['dy'] = Math.random() * (fish[fish_id]['dx'] / 2) - fish[fish_id]['dx'] / 4;
    fish[fish_id]['x'] = fish[fish_id]['dx'] < 0
      ? camera_x - fish[fish_id]['size']
      : camera_x + fish[fish_id]['size'] + canvas_width;
    fish[fish_id]['y'] = camera_y + core_random_integer({
      'max': canvas_height,
    });

    fish[fish_id]['angle'] = math_move_2d({
      'x0': fish[fish_id]['x'],
      'x1': fish[fish_id]['x'] + fish[fish_id]['dx'],
      'y0': fish[fish_id]['y'],
      'y1': fish[fish_id]['y'] + fish[fish_id]['dy'],
    })['angle'];

    if(fish[fish_id]['dx'] > 0
      || fish[fish_id]['dy'] > 0){
        fish[fish_id]['angle'] *= -1;
    }

    if(fish[fish_id]['dx'] > 0
      && fish[fish_id]['dy'] > 0){
        fish[fish_id]['angle'] *= -1;
    }
}

function repo_escape(){
    fish.length = 0;
}

function repo_init(){
    core_repo_init({
      'keybinds': {
        16: {},
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
      },
      'title': 'Aquarium-2D.htm',
    });
    canvas_init();

    document.getElementById('canvas').style.background = '#004';

    var loop_counter = 9;
    do{
        create_fish();
    }while(loop_counter--);
}

function resize_logic(){
    move_pillar(core_random_integer({
      'max': canvas_width,
    }));
}

var camera_speed = 5;
var camera_x = 0;
var camera_y = 0;
var fish = [];
var pillar = 0;
