const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = {
    x: canvas.width / 2 - 15,
    y: canvas.height / 2 - 15,
    size: 30, // Tamaño del cuadrado principal
    speed: 6,
    dx: 0,
    dy: 0
};

const obstacles = [];
let obstacleSpeed = 7;
let gameOver = false;
let startTime = Date.now();
let elapsedTime = 0;
let lastSoundTime = 0;

const pointSound = new Audio('punto.weba');

function drawBox() {
    ctx.fillStyle = 'blue'; // Color del cuadrado principal
    ctx.fillRect(box.x, box.y, box.size, box.size);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newObstacle() {
    const width = 30; // Ancho de los obstáculos
    const height = 10; // Alto de los obstáculos
    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) { // top
        x = Math.random() * (canvas.width - width);
        y = -height;
    } else if (side === 1) { // right
        x = canvas.width;
        y = Math.random() * (canvas.height - height);
    } else if (side === 2) { // bottom
        x = Math.random() * (canvas.width - width);
        y = canvas.height;
    } else { // left
        x = -width;
        y = Math.random() * (canvas.height - height);
    }

    obstacles.push({ x, y, width, height, dx: 0, dy: 0 });

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
    obstacles.forEach(obstacle => {
        let gradient = ctx.createRadialGradient(
            obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, 5,
            obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width
        );

        // Azules más brillantes
        gradient.addColorStop(0, '#33CCFF');  // Azul más brillante (DeepSkyBlue claro)
        gradient.addColorStop(0.5, '#1E90FF'); // DodgerBlue más brillante
        gradient.addColorStop(1, '#4682FF');   // RoyalBlue más brillante

        ctx.fillStyle = gradient;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height); // Dibujar como rectángulo

        // Sombra brillante
        ctx.shadowColor = 'rgba(50, 150, 255, 0.7)';  // Sombra azul brillante
        ctx.shadowBlur = 25;  // Más difusa y destacada
        ctx.shadowOffsetX = 8;
        ctx.shadowOffsetY = 8;
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
            box.x < obstacle.x + obstacle.width &&
            box.x + box.size > obstacle.x &&
            box.y < obstacle.y + obstacle.height &&
            box.y + box.size > obstacle.y
        ) {
            gameOver = true;
        }
    });
}

function update() {
    if (gameOver) {
        window.location.replace("GameOver2.html");
        return;
    }

    if (elapsedTime >= 21) {
        window.location.replace("Victoria2.html");
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

    obstacleSpeed += 0.001;

     // Calcular el tiempo transcurrido
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

setInterval(newObstacle, 300);
update();
