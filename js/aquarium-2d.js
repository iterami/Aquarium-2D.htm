function create_fish(){
    // determine fish class
    var fish_class = Math.random();

    var fish_size = 0;
    // 60% chance to be normal sized fish
    if(fish_class < .6){
        fish_size = random_number(25) + 25;

    // 70% chance to be a small fish, if not a normal sized fish
    }else if(fish_class < .88){
        fish_size = random_number(10) + 5;

    // else is a giant fish
    }else{
        fish_size = random_number(500) + 50;
    }

    var fish_speed = Math.random() * 10 - 5;

    fish.push([
        fish_speed < 0// x
          ? camera_x - x - fish_size
          : camera_x + x + fish_size,
        camera_y + random_number(height) - y,// y
        fish_speed,
        '#' + hex() + hex() + hex(),// color
        fish_size
    ]);
}

function draw(){
    if(key_left){
        camera_x -= 5 * key_sprint;
    }
    if(key_right){
        camera_x += 5 * key_sprint;
    }
    if(key_down){
        camera_y += 5 * key_sprint;
    }
    if(key_up){
        camera_y -= 5 * key_sprint;
    }

    buffer.clearRect(
        0,
        0,
        width,
        height
    );

    i = fish.length - 1;
    if(i >= 0){
        // set position now to simplify fish placement math
        buffer.translate(
            x - camera_x,
            y - camera_y
        );

        do{
            // fish move in the direction they are facing
            fish[i][0] -= fish[i][2];

            // if a fish travels past the edge of the screen, swap it to the other edge
            if(fish[i][0] > camera_x + x + fish[i][4] * 4 || fish[i][0] < camera_x - x - fish[i][4] * 4){
                fish[i][0] = camera_x + (fish[i][0] > camera_x + x ? -x - fish[i][4] * 4 : x + fish[i][4] * 4);

                // replace fish
                fish.splice(
                  i,
                  1
                );
                create_fish();

            }else{
                // determine movement direction based on speed
                var dir = fish[i][2] > 0 ? 1 : -1;

                // draw fish
                buffer.beginPath();
                buffer.moveTo(
                    fish[i][0],
                    fish[i][1] + fish[i][4] / 2
                );
                buffer.lineTo(
                    fish[i][0] + fish[i][4] * dir,
                    fish[i][1]
                );
                buffer.lineTo(
                    fish[i][0] + fish[i][4] * 3 * dir,
                    fish[i][1] + fish[i][4]
                );
                buffer.lineTo(
                    fish[i][0] + fish[i][4] * 3 * dir,
                    fish[i][1]
                );
                buffer.lineTo(
                    fish[i][0] + fish[i][4] * dir,
                    fish[i][1] + fish[i][4]
                );
                buffer.closePath();

                buffer.fillStyle = fish[i][3];
                buffer.fill();
            }
        }while(i--);

        // reset fish placement
        buffer.translate(
            camera_x - x,
            camera_y - y
        )
    }

    // draw toolbar buttons
    buffer.fillStyle = '#444';
    buffer.strokeStyle = '#000';
    buffer.lineWidth = 2;
    i = 1;
    do{
        buffer.beginPath();
        buffer.rect(
            0,
            50 * i,
            50,
            50
        );
        buffer.closePath();
        buffer.fill();
        buffer.stroke();
    }while(i--);

    // draw create fish button +
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

    // draw current camera position
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

    // draw clear button X
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
}

function hex(){
    return '0123456789abcdef'.charAt(random_number(16))
}

function random_number(i){
    return Math.floor(Math.random() * i)
}

function resize(){
    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;

    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;

    x = width / 2;
    y = height / 2;
}

var buffer = document.getElementById('buffer').getContext('2d');
var camera_x = 0;
var camera_y = 0;
var canvas = document.getElementById('canvas').getContext('2d');
var fish = [];
var height = 0;
var i = 9;
var key = 0;
var key_down = 0;
var key_left = 0;
var key_right = 0;
var key_sprint = 1;
var key_up = 0;
var width = 0;
var x = 0;
var y = 0;

resize();

// create 10 randomly placed fish
do{
    create_fish();
}while(i--);

setInterval(
    'draw()',
    30
);

window.onresize = resize;

window.onkeydown = function(e){
    key = window.event ? event : e;
    key = key.charCode ? key.charCode : key.keyCode;

    if(key == 65){// A
        key_left = 1;

    }else if(key == 68){// D
        key_right = 1;

    }else if(key == 83){// S
        key_down = 1;

    }else if(key == 87){// W
        key_up = 1;

    }else if(key == 16){// shift
        key_sprint = 2;

    }else if(key == 72){// H
        camera_x = 0;
        camera_y = 0;

    }else if(key == 70){// F
        create_fish();

    }else if(key == 67){// C
        fish.length = 0;
    }
};

window.onkeyup = function(e){
    key = window.event ? event : e;
    key = key.charCode ? key.charCode : key.keyCode;

    if(key == 65){// A
        key_left = 0;

    }else if(key == 68){// D
        key_right = 0;

    }else if(key == 83){// S
        key_down = 0;

    }else if(key == 87){// W
        key_up = 0;

    }else if(key == 16){// shift
        key_sprint = 1;
    }
};

window.onmousedown = function(e){
    e.preventDefault();

    // check if clicked on a UI button
    if(e.pageX < 50){
        // create fish button
        if(e.pageY < 50){
            create_fish();

        // clear all fish button
        }else if(e.pageY < 100){
            fish.length = 0;
        }
    }
};
