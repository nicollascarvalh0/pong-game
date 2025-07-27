const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6; // For AI
const BALL_SPEED = 7;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = (Math.random() - 0.5) * BALL_SPEED;

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clear();
    // Left paddle (player)
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#4ecdc4");
    // Right paddle (AI)
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#ff6b6b");
    // Ball
    drawBall(ballX, ballY, BALL_SIZE, "#fff");
}

function update() {
    // Move ball
    ballX += ballVelX;
    ballY += ballVelY;

    // Ball collision with top and bottom
    if (ballY <= 0) {
        ballY = 0;
        ballVelY *= -1;
    }
    if (ballY + BALL_SIZE >= canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballVelY *= -1;
    }

    // Ball collision with player paddle
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH;
        ballVelX *= -1;
        // Add some "spin"
        ballVelY += (ballY + BALL_SIZE/2 - (playerY + PADDLE_HEIGHT/2)) * 0.25;
    }

    // Ball collision with AI paddle
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_SIZE;
        ballVelX *= -1;
        // Add some "spin"
        ballVelY += (ballY + BALL_SIZE/2 - (aiY + PADDLE_HEIGHT/2)) * 0.25;
    }

    // Ball out of bounds: reset
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // AI paddle movement (simple tracking)
    let aiCenter = aiY + PADDLE_HEIGHT/2;
    if (aiCenter < ballY + BALL_SIZE/2 - 10) {
        aiY += PADDLE_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE/2 + 10) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp AI paddle inside canvas
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = (Math.random() - 0.5) * BALL_SPEED;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Player paddle follows mouse Y
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    let y = e.clientY - rect.top;
    playerY = y - PADDLE_HEIGHT/2;
    // Clamp paddle inside canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

gameLoop();
