'use strict';

function draw_logic(){
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

          // Translate and rotate fish.
          canvas_buffer.translate(
            entity_entities[entity]['x'],
            entity_entities[entity]['y']
          );
          canvas_buffer.rotate(entity_entities[entity]['angle']);

          // Calculate vertex based on movement direction.
          let xoffset = entity_entities[entity]['size'] * (entity_entities[entity]['dx'] > 0
            ? 1
            : -1);

          // Draw fish.
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

function logic(){
    entity_group_modify({
      'groups': [
        'fish',
      ],
      'todo': function(entity){
          // Fish move in the direction they are facing.
          entity_entities[entity]['x'] -= entity_entities[entity]['dx'];
          entity_entities[entity]['y'] -= entity_entities[entity]['dy'];

          // If a fish travels past the edge of the screen,
          //   move it to the other side.
          let size = entity_entities[entity]['size'] * 4;
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
