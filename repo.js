'use strict';

function create_fish(){
    let fish_size = Math.random();

    if(fish_size < .6){
        fish_size = core_random_integer(25) + 25;

    }else if(fish_size < .87){
        fish_size = core_random_integer(10) + 5;

    }else{
        fish_size = core_random_integer(500) + 50;
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
    entity_create({
      'id': 'pillar',
      'properties': {
        'x': core_random_integer(canvas_properties.width),
      },
      'types': [
        'pillar',
      ],
    });

    create_fish();
}

function randomize_fish_movement(fish){
    fish.dx = Math.random() * 10 - 5;
    fish.dy = Math.random() * (fish.dx / 2) - fish.dx / 4;
    fish.x = fish.dx < 0
      ? -fish.size
      : fish.size + canvas_properties.width;
    fish.y = core_random_integer(canvas_properties.height);

    fish.angle = math_move_2d({
      'x0': fish.x,
      'x1': fish.x + fish.dx,
      'y0': fish.y,
      'y1': fish.y + fish.dy,
    }).angle;
    if(fish.dx < 0){
        fish.angle += Math.PI;
    }
}

function repo_drawlogic(){
    canvas_setproperties({
      'fillStyle': '#003',
    });
    entity_group_modify({
      'groups': [
        'pillar',
      ],
      'todo': function(entity){
          canvas.fillRect(
            entity.x,
            0,
            100,
            canvas_properties.height
          );
      },
    });

    entity_group_modify({
      'groups': [
        'fish',
      ],
      'todo': function(entity){
          canvas.save();
          canvas.translate(
            entity.x,
            entity.y
          );
          canvas.rotate(entity.angle);

          const xoffset = entity.size * (entity.dx > 0
            ? 1
            : -1);

          canvas_draw_path({
            'properties': {
              'fillStyle': entity.color,
            },
            'vertices': [
              [
                'moveTo',
                0,
                entity.size / 2,
              ],
              [
                'lineTo',
                xoffset,
                0,
              ],
              [
                'lineTo',
                xoffset * 3,
                entity.size,
              ],
              [
                'lineTo',
                xoffset * 3,
                0,
              ],
              [
                'lineTo',
                xoffset,
                entity.size,
              ],
            ],
          });

          canvas.restore();
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
        'add': {
          'onclick': create_fish,
        },
        'start': {
          'onclick': canvas_setmode,
        },
      },
      'info': '<button id=start type=button>Start New Tank</button>',
      'keybinds': {
        'KeyF': {
          'todo': create_fish,
        },
      },
      'title': 'Aquarium-2D.htm',
      'ui': '<button id=add type=button>Add Fish [F]</button> <span id=fish></span>',
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

    canvas_properties.clearColor = '#004';
}

function repo_logic(){
    entity_group_modify({
      'groups': [
        'fish',
      ],
      'todo': function(entity){
          entity.x -= entity.dx;
          entity.y -= entity.dy;

          const size = entity.size * 4;
          if(entity.x > canvas_properties.width + size
            || entity.x < -size){
              entity.x += entity.dx < 0
                ? -canvas_properties.width - size
                : canvas_properties.width + size;
              entity.y = core_random_integer(canvas_properties.height);

              randomize_fish_movement(entity);
          }
      },
    });

    core_ui_update({
      'ids': {
        'fish': entity_info.fish.count,
      },
    });
}
