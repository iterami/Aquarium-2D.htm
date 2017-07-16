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

    var id = core_uid();
    core_entity_create({
      'id': id,
      'properties': {
        'color': '#' + core_random_hex(),
        'size': fish_size,
      },
      'types': [
        'fish',
      ],
    });

    randomize_fish_movement(id);
}

function draw_logic(){
    // Save the current buffer state.
    canvas_buffer.save();
    canvas_buffer.translate(
      -camera_x,
      0
    );

    canvas_buffer.fillStyle = '#003';
    core_group_modify({
      'groups': [
        '_pillar',
      ],
      'todo': function(entity){
          canvas_buffer.fillRect(
            core_entities[entity]['x'],
            0,
            100,
            canvas_height
          );
      },
    });

    // Draw stuff relative to center of canvas.
    canvas_buffer.translate(
      0,
      -camera_y
    );

    core_group_modify({
      'groups': [
        '_fish',
      ],
      'todo': function(entity){
          canvas_buffer.save();

          // Translate and rotate fish.
          canvas_buffer.translate(
            core_entities[entity]['x'],
            core_entities[entity]['y']
          );
          canvas_buffer.rotate(core_entities[entity]['angle']);

          // Determine movement direction based on dx.
          var direction = core_entities[entity]['dx'] > 0
            ? 1
            : -1;

          // Draw fish.
          canvas_draw_path({
            'properties': {
              'fillStyle': core_entities[entity]['color'],
            },
            'vertices': [
              {
                'type': 'moveTo',
                'y': core_entities[entity]['size'] / 2,
              },
              {
                'x': core_entities[entity]['size'] * direction,
              },
              {
                'x': core_entities[entity]['size'] * 3 * direction,
                'y': core_entities[entity]['size'],
              },
              {
                'x': core_entities[entity]['size'] * 3 * direction,
              },
              {
                'x': core_entities[entity]['size'] * direction,
                'y': core_entities[entity]['size'],
              },
            ],
          });

          canvas_buffer.restore();
      },
    });

    // Restore the buffer state.
    canvas_buffer.restore();
}

function logic(){
    camera_speed = core_keys[16]['state']
      ? 10
      : 5;

    if(core_keys[65]['state']){
        camera_x -= camera_speed;
    }
    if(core_keys[68]['state']){
        camera_x += camera_speed;
    }
    if(core_keys[83]['state']){
        camera_y += camera_speed;
    }
    if(core_keys[87]['state']){
        camera_y -= camera_speed;
    }

    core_group_modify({
      'groups': [
        '_fish',
      ],
      'todo': function(entity){
          // Fish move in the direction they are facing.
          core_entities[entity]['x'] -= core_entities[entity]['dx'];
          core_entities[entity]['y'] -= core_entities[entity]['dy'];

          // If a fish travels past the edge of the screen,
          //   move it to the other side.
          var size = core_entities[entity]['size'] * 4;
          if(core_entities[entity]['x'] > camera_x + canvas_width + size
            || core_entities[entity]['x'] < camera_x - size){
              core_entities[entity]['x'] += core_entities[entity]['dx'] < 0
                ? -canvas_width - size
                : canvas_width + size;
              core_entities[entity]['y'] = camera_y + core_random_integer({
                'max': canvas_height,
              });

              randomize_fish_movement(entity);
          }
      },
    });

    core_ui_update({
      'ids': {
        //'fish': core_groups['fish'].length,
        'x': camera_x,
        'y': camera_y,
      },
    });
}

function randomize_fish_movement(id){
    core_entities[id]['dx'] = Math.random() * 10 - 5;
    core_entities[id]['dy'] = Math.random() * (core_entities[id]['dx'] / 2) - core_entities[id]['dx'] / 4;
    core_entities[id]['x'] = core_entities[id]['dx'] < 0
      ? camera_x - core_entities[id]['size']
      : camera_x + core_entities[id]['size'] + canvas_width;
    core_entities[id]['y'] = camera_y + core_random_integer({
      'max': canvas_height,
    });

    core_entities[id]['angle'] = math_move_2d({
      'x0': core_entities[id]['x'],
      'x1': core_entities[id]['x'] + core_entities[id]['dx'],
      'y0': core_entities[id]['y'],
      'y1': core_entities[id]['y'] + core_entities[id]['dy'],
    })['angle'];

    if(core_entities[id]['dx'] > 0
      || core_entities[id]['dy'] > 0){
        core_entities[id]['angle'] *= -1;
    }

    if(core_entities[id]['dx'] > 0
      && core_entities[id]['dy'] > 0){
        core_entities[id]['angle'] *= -1;
    }
}

function repo_init(){
    core_repo_init({
      'info': '<input onclick=canvas_setmode({newgame:true}) type=button value=Restart>',
      'keybinds': {
        16: {},
        65: {},
        68: {},
        70: {
          'todo': create_fish,
        },
        72: {
          'todo': function(){
              camera_x = 0;
              camera_y = 0;
          },
        },
        83: {},
        87: {},
      },
      'title': 'Aquarium-2D.htm',
      'ui': '<span id=ui-fish></span> Fish<br><span id=ui-x></span>x, <span id=ui-y></span>y',
    });

    core_entity_set({
      'properties': {
        'angle': 0,
        'dx': 0,
        'dy': 0,
      },
      'type': 'fish',
    });
    core_entity_set({
      'type': 'pillar',
    });

    canvas_init();
}

var camera_speed = 5;
var camera_x = 0;
var camera_y = 0;
