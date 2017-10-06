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

function load_data(id){
    document.getElementById('canvas').style.background = '#004';

    camera_x = 0;
    camera_y = 0;

    var loop_counter = 9;
    do{
        create_fish();
    }while(loop_counter--);

    core_entity_create({
      'properties': {
        'x': core_random_integer({
          'max': canvas_properties['width'],
        }),
      },
      'types': [
        'pillar',
      ],
    });
}

function randomize_fish_movement(id){
    core_entities[id]['dx'] = Math.random() * 10 - 5;
    core_entities[id]['dy'] = Math.random() * (core_entities[id]['dx'] / 2) - core_entities[id]['dx'] / 4;
    core_entities[id]['x'] = core_entities[id]['dx'] < 0
      ? camera_x - core_entities[id]['size']
      : camera_x + core_entities[id]['size'] + canvas_properties['width'];
    core_entities[id]['y'] = camera_y + core_random_integer({
      'max': canvas_properties['height'],
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
