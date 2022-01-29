'use strict';

function create_fish(){
    let fish_size = Math.random();

    if(fish_size < .6){
        fish_size = core_random_integer({
          'max': 25,
        }) + 25;

    }else if(fish_size < .88){
        fish_size = core_random_integer({
          'max': 10,
        }) + 5;

    }else{
        fish_size = core_random_integer({
          'max': 500,
        }) + 50;
    }

    randomize_fish_movement(entity_create({
      'properties': {
        'color': '#' + core_random_hex(),
        'size': fish_size,
      },
      'types': [
        'fish',
      ],
    }));
}

function load_data(id){
    let loop_counter = 9;
    do{
        create_fish();
    }while(loop_counter--);

    entity_create({
      'id': 'pillar',
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
    entity_entities[id]['dx'] = Math.random() * 10 - 5;
    entity_entities[id]['dy'] = Math.random() * (entity_entities[id]['dx'] / 2) - entity_entities[id]['dx'] / 4;
    entity_entities[id]['x'] = entity_entities[id]['dx'] < 0
      ? -entity_entities[id]['size']
      : entity_entities[id]['size'] + canvas_properties['width'];
    entity_entities[id]['y'] = core_random_integer({
      'max': canvas_properties['height'],
    });

    entity_entities[id]['angle'] = math_move_2d({
      'x0': entity_entities[id]['x'],
      'x1': entity_entities[id]['x'] + entity_entities[id]['dx'],
      'y0': entity_entities[id]['y'],
      'y1': entity_entities[id]['y'] + entity_entities[id]['dy'],
    })['angle'];

    if(entity_entities[id]['dx'] > 0
      || entity_entities[id]['dy'] > 0){
        entity_entities[id]['angle'] *= -1;
    }

    if(entity_entities[id]['dx'] > 0
      && entity_entities[id]['dy'] > 0){
        entity_entities[id]['angle'] *= -1;
    }
}
