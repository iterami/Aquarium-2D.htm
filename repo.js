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
    if(entity_entities[id]['dx'] < 0){
        entity_entities[id]['angle'] += Math.PI;
    }
}

function repo_drawlogic(){
    canvas_setproperties({
      'properties': {
        'fillStyle': '#003',
      },
    });
    entity_group_modify({
      'groups': [
        'pillar',
      ],
      'todo': function(entity){
          canvas_buffer.fillRect(
            entity_entities[entity]['x'],
            0,
            100,
            canvas_properties['height']
          );
      },
    });

    entity_group_modify({
      'groups': [
        'fish',
      ],
      'todo': function(entity){
          canvas_buffer.save();
          canvas_buffer.translate(
            entity_entities[entity]['x'],
            entity_entities[entity]['y']
          );
          canvas_buffer.rotate(entity_entities[entity]['angle']);

          const xoffset = entity_entities[entity]['size'] * (entity_entities[entity]['dx'] > 0
            ? 1
            : -1);

          canvas_draw_path({
            'properties': {
              'fillStyle': entity_entities[entity]['color'],
            },
            'vertices': [
              {
                'type': 'moveTo',
                'y': entity_entities[entity]['size'] / 2,
              },
              {
                'x': xoffset,
              },
              {
                'x': xoffset * 3,
                'y': entity_entities[entity]['size'],
              },
              {
                'x': xoffset * 3,
              },
              {
                'x': xoffset,
                'y': entity_entities[entity]['size'],
              },
            ],
          });

          canvas_buffer.restore();
      },
    });
}

function repo_logic(){
    entity_group_modify({
      'groups': [
        'fish',
      ],
      'todo': function(entity){
          entity_entities[entity]['x'] -= entity_entities[entity]['dx'];
          entity_entities[entity]['y'] -= entity_entities[entity]['dy'];

          const size = entity_entities[entity]['size'] * 4;
          if(entity_entities[entity]['x'] > canvas_properties['width'] + size
            || entity_entities[entity]['x'] < -size){
              entity_entities[entity]['x'] += entity_entities[entity]['dx'] < 0
                ? -canvas_properties['width'] - size
                : canvas_properties['width'] + size;
              entity_entities[entity]['y'] = core_random_integer({
                'max': canvas_properties['height'],
              });

              randomize_fish_movement(entity);
          }
      },
    });

    core_ui_update({
      'ids': {
        'fish': entity_info['fish']['count'],
      },
    });
}

function repo_init(){
    core_repo_init({
      'entities': {
        'fish': {
          'properties': {
            'angle': 0,
            'dx': 0,
            'dy': 0,
          },
        },
        'pillar': {},
      },
      'events': {
        'add-fish': {
          'onclick': create_fish,
        },
        'restart': {
          'onclick': core_repo_reset,
        },
      },
      'info': '<input id=add-fish type=button value="Add Fish [F]"><input id=restart type=button value=Restart>',
      'keybinds': {
        70: {
          'todo': create_fish,
        },
      },
      'reset': canvas_setmode,
      'title': 'Aquarium-2D.htm',
      'ui': '<span id=fish></span> Fish',
    });
    entity_set({
      'type': 'pillar',
    });
    entity_set({
      'properties': {
        'angle': 0,
        'dx': 0,
        'dy': 0,
      },
      'type': 'fish',
    });
    canvas_init();

    canvas_properties['clearColor'] = '#004';
}
