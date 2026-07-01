'use strict';

function create_fish(){
    let fish_size = Math.random();

    if(fish_size < .6){
        fish_size = core_random_integer(25) + 25;

    }else if(fish_size < .9){
        fish_size = core_random_integer(10) + 5;

    }else{
        fish_size = core_random_integer(500) + 50;
    }

    randomize_fish_movement(entity_create({
      'properties': {
        'color': '#' + core_random_hex(),
        'size': fish_size,
      },
      'types': ['fish'],
    }));

    core_ui_update({
      'ids': {
        'add': entity_info.fish.count + ' Fish',
      },
    });
}

function draw_fish(entity){
    canvas.save();
    canvas.translate(
      entity.x,
      entity.y
    );
    canvas.rotate(entity.angle);

    const xoffset = entity.size * (entity.dx > 0 ? 1 : -1);
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
}

function draw_pillar(entity){
    canvas.fillRect(
      entity.x,
      0,
      100,
      canvas_properties.height
    );
}

function move_fish(entity){
    entity.x -= entity.dx;
    entity.y -= entity.dy;

    const size = entity.size * 4;
    if(entity.x < -size || entity.x > canvas_properties.width + size){
        randomize_fish_movement(entity);
    }
}

function randomize_fish_movement(fish){
    fish.dx = Math.random() * 10 - 5;
    if(Math.abs(fish.dx) < .1){
        fish.dx = Math.sign(fish.dx);
    }
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
      'groups': ['pillar'],
      'todo': draw_pillar,
    });
    entity_group_modify({
      'groups': ['fish'],
      'todo': draw_fish,
    });
}

function repo_init(){
    core_repo_init({
      'events': {
        'add': {
          'onclick': create_fish,
        },
        'start': {
          'onclick': canvas_setmode,
        },
      },
      'info': '<button class=medium id=start type=button>Start New Tank</button>',
      'title': 'Aquarium-2D.htm',
      'ui': '<button id=add type=button>1 Fish</button>',
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

    canvas_properties.clearColor = '#007';
}

function repo_load(id){
    entity_create({
      'id': 'pillar',
      'properties': {
        'x': core_random_integer(canvas_properties.width) - 50,
      },
      'types': ['pillar'],
    });

    create_fish();
}

function repo_logic(){
    entity_group_modify({
      'groups': ['fish'],
      'todo': move_fish,
    });
}
