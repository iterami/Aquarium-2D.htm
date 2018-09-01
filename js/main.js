'use strict';

function draw_logic(){
    canvas_setproperties({
      'properties': {
        'fillStyle': '#003',
      },
    });
    core_group_modify({
      'groups': [
        'pillar',
      ],
      'todo': function(entity){
          canvas_buffer.fillRect(
            core_entities[entity]['x'],
            0,
            100,
            canvas_properties['height']
          );
      },
    });

    core_group_modify({
      'groups': [
        'fish',
      ],
      'todo': function(entity){
          canvas_buffer.save();

          // Translate and rotate fish.
          canvas_buffer.translate(
            core_entities[entity]['x'],
            core_entities[entity]['y']
          );
          canvas_buffer.rotate(core_entities[entity]['angle']);

          // Calculate vertex based on movement direction.
          let xoffset = core_entities[entity]['size'] * (core_entities[entity]['dx'] > 0
            ? 1
            : -1);

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
                'x': xoffset,
              },
              {
                'x': xoffset * 3,
                'y': core_entities[entity]['size'],
              },
              {
                'x': xoffset * 3,
              },
              {
                'x': xoffset,
                'y': core_entities[entity]['size'],
              },
            ],
          });

          canvas_buffer.restore();
      },
    });
}

function logic(){
    core_group_modify({
      'groups': [
        'fish',
      ],
      'todo': function(entity){
          // Fish move in the direction they are facing.
          core_entities[entity]['x'] -= core_entities[entity]['dx'];
          core_entities[entity]['y'] -= core_entities[entity]['dy'];

          // If a fish travels past the edge of the screen,
          //   move it to the other side.
          let size = core_entities[entity]['size'] * 4;
          if(core_entities[entity]['x'] > canvas_properties['width'] + size
            || core_entities[entity]['x'] < -size){
              core_entities[entity]['x'] += core_entities[entity]['dx'] < 0
                ? -canvas_properties['width'] - size
                : canvas_properties['width'] + size;
              core_entities[entity]['y'] = core_random_integer({
                'max': canvas_properties['height'],
              });

              randomize_fish_movement(entity);
          }
      },
    });

    core_ui_update({
      'ids': {
        'fish': core_entity_info['fish']['count'],
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
        'restart': {
          'onclick': function(){
              canvas_setmode({
                'newgame': true,
              });
          },
        },
      },
      'info': '<input id=restart type=button value=Restart>',
      'keybinds': {
        16: {},
        70: {
          'todo': create_fish,
        },
      },
      'title': 'Aquarium-2D.htm',
      'ui': '<span id=fish></span> Fish',
    });
    canvas_init();

    canvas_properties['clearColor'] = '#004';
}
