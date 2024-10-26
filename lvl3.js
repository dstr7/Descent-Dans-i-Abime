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
    const size = 11; // Tamaño de los obstáculos (más pequeños que el cuadrado principal)
    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) { // top
        x = Math.random() * canvas.width;
        y = -size;
    } else if (side === 1) { // right
        x = canvas.width;
        y = Math.random() * canvas.height;
    } else if (side === 2) { // bottom
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
    obstacles.forEach(obstacle => {
        
        let gradient = ctx.createRadialGradient(
            obstacle.x + obstacle.size, obstacle.y + obstacle.size, 5, // Centro
            obstacle.x + obstacle.size, obstacle.y + obstacle.size, obstacle.size // Radio externo
        );

        // Colores del degradado
        gradient.addColorStop(0, '#FFD700'); 
        gradient.addColorStop(0.5, '#A0522D'); 
        gradient.addColorStop(1, '#5B3A29'); 

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.size, obstacle.y + obstacle.size, obstacle.size, 0, Math.PI * 2); // Dibuja el círculo
        ctx.fill();

     
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
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
        const dx = box.x - (obstacle.x + obstacle.size);
        const dy = box.y - (obstacle.y + obstacle.size);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
      
        if (distance < box.size + obstacle.size) {
            gameOver = true;
        }
    });
}

function update() {
    if (gameOver) {
        localStorage.setItem('elapsedTime', elapsedTime); 
        window.location.replace("GameOver3.html");
        return;
    }

    if (elapsedTime >= 11) {
        window.location.replace("victoria3.html");
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

    // Reproducir sonido cada 20 segundos
    if (elapsedTime - lastSoundTime >= 10) {
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

setInterval(newObstacle, 170);
update();
