 const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = {
    x: canvas.width / 2 - 15,
    y: canvas.height / 2 - 15,
    size: 30,
    speed: 6,
    dx: 0,
    dy: 0
};

const obstacles = [];
let obstacleSpeed = 1;
let gameOver = false;
let startTime = Date.now();
let elapsedTime = 0;
let lastSoundTime = 0;

const pointSound = new Audio('punto.weba');

function drawBox() {
    ctx.fillStyle = 'blue';                                     //color del cubo
    ctx.fillRect(box.x, box.y, box.size, box.size);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newObstacle() {
    const size = 20;
    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) { 
        x = Math.random() * canvas.width;
        y = -size;
    } else if (side === 1) { 
        x = canvas.width;
        y = Math.random() * canvas.height;
    } else if (side === 2) { 
        x = Math.random() * canvas.width;
        y = canvas.height;
    } else { // left
        x = -size;
        y = Math.random() * canvas.height;
    }

    obstacles.push({ x, y, size, dx: 0, dy: 0 });

    if (side === 0) {
        obstacles[obstacles.length - 1].dy = obstacleSpeed;
    } else if (side === 1) {
        obstacles[obstacles.length - 1].dx = -obstacleSpeed;
    } else if (side === 2) {
        obstacles[obstacles.length - 1].dy = -obstacleSpeed;
    } else {
        obstacles[obstacles.length - 1].dx = obstacleSpeed;
    }
}

function drawObstacles() {
    ctx.fillStyle = 'white'; //color del obstáculo
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);

         ctx.shadowColor = 'rgba(250, 255, 255, 0.8)';  // Sombra azul brillante
        ctx.shadowBlur = 25;  // Más difusa y destacada
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
    });
}

function moveObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x += obstacle.dx;
        obstacle.y += obstacle.dy;
    });
}

function detectCollision() {
    obstacles.forEach(obstacle => {
        if (
            box.x < obstacle.x + obstacle.size &&
            box.x + box.size > obstacle.x &&
            box.y < obstacle.y + obstacle.size &&
            box.y + box.size > obstacle.y
        ) {
            gameOver = true;
        }
    });
}

function update() {
    if (gameOver) {
        window.location.replace("GameOver4.html");
        return;
    }

    if (elapsedTime >= 21) {
        window.location.replace("Victoria4.html");
        return;
    }

    clear();
    drawBox();
    drawObstacles();
    moveObstacles();
    detectCollision();

    box.x += box.dx;
    box.y += box.dy;

   
  
if (box.x < 0) box.x = 0;
if (box.x + box.size > canvas.width) box.x = canvas.width - box.size;
if (box.y < 0) box.y = 0;
if (box.y + box.size > canvas.height) box.y = canvas.height - box.size;

 

   
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
     ctx.fillStyle = 'white'; 
    ctx.font = '20px Arial';
    ctx.fillText(`Tiempo: ${elapsedTime}s`, 10, 30);


   
    if (elapsedTime - lastSoundTime >= 20) {
        pointSound.play();
        lastSoundTime = elapsedTime;
    }

    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'w' || e.key === 'ArrowUp') {
        box.dy = -box.speed;
    } else if (e.key === 's' || e.key === 'ArrowDown') {
        box.dy = box.speed;
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        box.dx = -box.speed;
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
        box.dx = box.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'w' || e.key === 'ArrowUp' ||
        e.key === 's' || e.key === 'ArrowDown'
    ) {
        box.dy = 0;
    } else if (
        e.key === 'a' || e.key === 'ArrowLeft' ||
        e.key === 'd' || e.key === 'ArrowRight'
    ) {
        box.dx = 0;
    }
}


document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

setInterval(newObstacle, 110);
update();
