function create_fish(){
    // Determine fish class.
    var fish_class = Math.random();

    var fish_size = 0;
    // 60% chance to be normal sized fish.
    if(fish_class < .6){
        fish_size = Math.floor(Math.random() * 25) + 25;

    // 70% chance to be a small fish, if not a normal sized fish.
    }else if(fish_class < .88){
        fish_size = Math.floor(Math.random() * 10) + 5;

    // Else is a giant fish.
    }else{
        fish_size = Math.floor(Math.random() * 500) + 50;
    }

    var fish_speed = Math.random() * 10 - 5;

    fish.push([
      fish_speed < 0
        ? camera_x - x - fish_size
        : camera_x + x + fish_size,// X
      camera_y + Math.floor(Math.random() * height) - y,// Y
      fish_speed,
      random_hex(),// Color
      fish_size,
    ]);
}

function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    buffer.fillStyle = '#003';
    buffer.fillRect(
        pillar,
        0,
        100,
        height
    );

    // Save the current buffer state.
    buffer.save();

    // Draw stuff relative to center of canvas.
    buffer.translate(
      x - camera_x,
      y - camera_y
    );

    var loop_counter = fish.length - 1;
    if(loop_counter >= 0){
        do{
            // Determine movement direction based on speed.
            var direction = fish[loop_counter][2] > 0
              ? 1
              : -1;

            // Draw fish.
            buffer.beginPath();
            buffer.moveTo(
              fish[loop_counter][0],
              fish[loop_counter][1] + fish[loop_counter][4] / 2
            );
            buffer.lineTo(
              fish[loop_counter][0] + fish[loop_counter][4] * direction,
              fish[loop_counter][1]
            );
            buffer.lineTo(
              fish[loop_counter][0] + fish[loop_counter][4] * 3 * direction,
              fish[loop_counter][1] + fish[loop_counter][4]
            );
            buffer.lineTo(
              fish[loop_counter][0] + fish[loop_counter][4] * 3 * direction,
              fish[loop_counter][1]
            );
            buffer.lineTo(
              fish[loop_counter][0] + fish[loop_counter][4] * direction,
              fish[loop_counter][1] + fish[loop_counter][4]
            );
            buffer.closePath();

            buffer.fillStyle = fish[loop_counter][3];
            buffer.fill();
        }while(loop_counter--);
    }

    // Restore the buffer state.
    buffer.restore();

    // Draw toolbar buttons.
    buffer.fillStyle = '#444';
    buffer.strokeStyle = '#000';
    buffer.lineWidth = 2;
    loop_counter = 1;
    do{
        buffer.beginPath();
        buffer.rect(
          0,
          50 * loop_counter,
          50,
          50
        );
        buffer.closePath();
        buffer.fill();
        buffer.stroke();
    }while(loop_counter--);

    // Draw create fish button +.
    buffer.fillStyle = '#fff';
    buffer.fillRect(
      10,
      20,
      30,
      10
    );
    buffer.fillRect(
      20,
      10,
      10,
      30
    );

    // Draw current camera position.
    buffer.font = '23pt sans-serif';
    buffer.fillText(
      camera_x + 'x ' + camera_y + 'y',
      0,
      height - 10
    );
    buffer.fillText(
      fish.length + ' fish',
      0,
      height - 40
    );

    // Draw clear button X.
    buffer.beginPath();
    buffer.moveTo(
      10,
      60
    );
    buffer.lineTo(
      40,
      90
    );
    buffer.moveTo(
      40,
      60
    );
    buffer.lineTo(
      10,
      90
    );
    buffer.closePath();
    buffer.strokeStyle = '#f00';
    buffer.lineWidth = 5;
    buffer.stroke();

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    window.requestAnimationFrame(draw);
}

function init(){
    resize();

    // Randomize pillar X.
    move_pillar(Math.floor(Math.random() * width));

    // Create 10 randomly placed fish.
    var loop_counter = 9;
    do{
        create_fish();
    }while(loop_counter--);

    window.requestAnimationFrame(draw);
    setInterval(
      'logic()',
      30
    );
}

function logic(){
    if(key_left){
        camera_x -= 5 * sprint_modifier;
        move_pillar(5);
    }
    if(key_right){
        camera_x += 5 * sprint_modifier;
        move_pillar(-5);
    }
    if(key_down){
        camera_y += 5 * sprint_modifier;
    }
    if(key_up){
        camera_y -= 5 * sprint_modifier;
    }

    var loop_counter = fish.length - 1;
    if(loop_counter >= 0){
        do{
            // Fish move in the direction they are facing.
            fish[loop_counter][0] -= fish[loop_counter][2];

            // If a fish travels past the edge of the screen, swap it to the other edge.
            if(fish[loop_counter][0] > camera_x + x + fish[loop_counter][4] * 4
              || fish[loop_counter][0] < camera_x - x - fish[loop_counter][4] * 4){
                fish[loop_counter][0] =
                  camera_x
                  + (fish[loop_counter][0] > camera_x + x
                    ? -x - fish[loop_counter][4] * 4
                    : x + fish[loop_counter][4] * 4
                  );

                // Replace fish.
                fish.splice(
                  loop_counter,
                  1
                );
                create_fish();
            }
        }while(loop_counter--);
    }
}

function move_pillar(amount){
    pillar += amount * sprint_modifier;

    if(pillar > width){
        pillar -= width + 100;
    }
    if(pillar < -100){
        pillar += width + 100;
    }
}

function random_hex(){
    var choices = '0123456789abcdef';
    return '#'
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16));
}

function resize(){
    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;
}

var buffer = document.getElementById('buffer').getContext('2d');
var camera_x = 0;
var camera_y = 0;
var canvas = document.getElementById('canvas').getContext('2d');
var fish = [];
var height = 0;
var key_down = false;
var key_left = false;
var key_right = false;
var key_up = false;
var pillar = 0;
var sprint_modifier = 1;
var width = 0;
var x = 0;
var y = 0;

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    // A: move left.
    if(key == 65){
        key_left = true;

    // D: move right.
    }else if(key == 68){
        key_right = true;

    // S: move down.
    }else if(key == 83){
        key_down = true;

    // W: move up.
    }else if(key == 87){
        key_up = true;

    // Shift: move faster.
    }else if(key == 16){
        sprint_modifier = 2;

    // H: reset camera position.
    }else if(key == 72){
        move_pillar(camera_x);
        camera_x = 0;
        camera_y = 0;

    // F: create new fish.
    }else if(key == 70){
        create_fish();

    // C: clear all fish.
    }else if(key == 67){
        fish.length = 0;
    }
};

window.onkeyup = function(e){
    var key = e.keyCode || e.which;

    if(key == 65){// A
        key_left = false;

    }else if(key == 68){// D
        key_right = false;

    }else if(key == 83){// S
        key_down = false;

    }else if(key == 87){// W
        key_up = false;

    }else if(key == 16){// shift
        sprint_modifier = 1;
    }
};

window.onload = init;

window.onmousedown = function(e){
    e.preventDefault();

    // Check if clicked on a UI button.
    if(e.pageX >= 50){
        return;
    }

    // Create fish button.
    if(e.pageY < 50){
        create_fish();

    // Clear all fish button.
    }else if(e.pageY < 100){
        fish.length = 0;
    }
};

window.onresize = resize;
