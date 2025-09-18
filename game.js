const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_RADIUS = 10;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;
const PADDLE_COLOR = '#f9d923';
const AI_COLOR = '#5fa8d3';
const BALL_COLOR = '#ff6363';

// Game state
let playerY = canvas.height/2 - PADDLE_HEIGHT/2;
let aiY = canvas.height/2 - PADDLE_HEIGHT/2;
let ballX = canvas.width/2;
let ballY = canvas.height/2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

// Mouse controls
canvas.addEventListener('mousemove', evt => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT/2;
    // Keep paddle inside canvas
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#fff2";
    ctx.setLineDash([8, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Net
    drawNet();

    // Player paddle
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

    // AI paddle
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, AI_COLOR);

    // Ball
    drawCircle(ballX, ballY, BALL_RADIUS, BALL_COLOR);
}

function updateAI() {
    // Simple AI: follow the ball, with some "slowness"
    const target = ballY - PADDLE_HEIGHT/2;
    const diff = target - aiY;
    aiY += diff * 0.08;
    // Keep paddle inside canvas
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom collision
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballSpeedY = -ballSpeedY;
    }
    if (ballY + BALL_RADIUS > canvas.height) {
        ballY = canvas.height - BALL_RADIUS;
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision
    if (
        ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ballY > playerY && ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ballSpeedX = -ballSpeedX;
        // Add some spin based on hit location
        let collidePoint = (ballY - (playerY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
        ballSpeedY += collidePoint * 2;
    }

    // Right paddle collision (AI)
    if (
        ballX + BALL_RADIUS > AI_X &&
        ballY > aiY && ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_RADIUS;
        ballSpeedX = -ballSpeedX;
        let collidePoint = (ballY - (aiY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
        ballSpeedY += collidePoint * 2;
    }

    // Out of bounds (score)
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }
}

function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
