// ========== ИГРОВОЙ КОД ==========
const MAP_W = 10;
const MAP_H = 10;
const FOV = Math.PI / 2.5;
const MOVE_SPEED = 0.08;
const TURN_SPEED = 0.08;

const map = [];
for (let y = 0; y < MAP_H; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_W; x++) {
        map[y][x] = 1;
    }
}

for (let y = 1; y <= 8; y++) {
    for (let x = 1; x <= 8; x++) {
        map[y][x] = 0;
    }
}

const buildings = [
    { x: 1, y: 4, icon: 'Квесты', name: 'Квесты' },
    { x: 4, y: 1, icon: 'Арена', name: 'Арена' },
    { x: 7, y: 4, icon: 'Рынок', name: 'Рынок' },
    { x: 4, y: 7, icon: 'Таверна', name: 'Таверна' },
];

const oak = { x: 4.5, y: 4.5 };

const player = {
    x: 4.5,
    y: 6.5,
    angle: -Math.PI / 2,
    moving: false,
    turning: false,
    turnFrom: -Math.PI / 2,
    turnTarget: -Math.PI / 2,
    turnProgress: 0,
    moveFromX: 4.5,
    moveFromY: 6.5,
    targetX: 4.5,
    targetY: 6.5,
    moveProgress: 0,
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;
let zBuffer = new Float32Array(W);
let gameStarted = false;

function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    zBuffer = new Float32Array(W);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function castRay(rayAngle) {
    const rayDirX = Math.cos(rayAngle);
    const rayDirY = Math.sin(rayAngle);
    
    let mapX = Math.floor(player.x);
    let mapY = Math.floor(player.y);
    
    const deltaDistX = Math.abs(1 / rayDirX);
    const deltaDistY = Math.abs(1 / rayDirY);
    
    let stepX, stepY, sideDistX, sideDistY;
    
    if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (player.x - mapX) * deltaDistX;
    } else {
        stepX = 1;
        sideDistX = (mapX + 1 - player.x) * deltaDistX;
    }
    
    if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (player.y - mapY) * deltaDistY;
    } else {
        stepY = 1;
        sideDistY = (mapY + 1 - player.y) * deltaDistY;
    }
    
    let side = 0;
    let hit = false;
    let distance = 0;
    let wallType = 0;
    
    while (!hit && distance < 20) {
        if (sideDistX < sideDistY) {
            sideDistX += deltaDistX;
            mapX += stepX;
            side = 0;
        } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            side = 1;
        }
        
        if (mapY >= 0 && mapY < MAP_H && mapX >= 0 && mapX < MAP_W) {
            if (map[mapY][mapX] !== 0) {
                hit = true;
                wallType = map[mapY][mapX];
                distance = side === 0 ? sideDistX - deltaDistX : sideDistY - deltaDistY;
            }
        } else {
            hit = true;
            wallType = 1;
            distance = side === 0 ? sideDistX - deltaDistX : sideDistY - deltaDistY;
        }
    }
    
    return { distance, side, wallType, mapX, mapY };
}

function render() {
    const HORIZON = Math.floor(H * 0.35);
    
    if (Textures.loaded && Textures.ceilingCanvas) {
        ctx.drawImage(Textures.ceilingCanvas, 0, 0, W, HORIZON);
    } else {
        ctx.fillStyle = '#0d0d0d';
        ctx.fillRect(0, 0, W, HORIZON);
    }
    
    if (Textures.loaded && Textures.floorCanvas) {
        ctx.drawImage(Textures.floorCanvas, 0, HORIZON, W, H - HORIZON);
    } else {
        ctx.fillStyle = '#2a2218';
        ctx.fillRect(0, HORIZON, W, H - HORIZON);
    }
    
    for (let x = 0; x < W; x++) {
        const cameraX = 2 * x / W - 1;
        const rayAngle = player.angle + Math.atan(cameraX * Math.tan(FOV / 2));
        
        const result = castRay(rayAngle);
        const { distance, side, wallType } = result;
        
        const lineHeight = Math.floor(H / distance);
        const drawStart = Math.max(0, HORIZON - lineHeight / 2);
        const drawEnd = Math.min(H, HORIZON + lineHeight / 2);
        
        if (Textures.loaded && wallType !== 0) {
            const wallTex = Textures.walls[0];
            
            if (wallTex) {
                let wallX;
                if (side === 0) {
                    wallX = player.y + distance * Math.sin(rayAngle);
                } else {
                    wallX = player.x + distance * Math.cos(rayAngle);
                }
                wallX -= Math.floor(wallX);
                
                const texX = Math.floor(wallX * wallTex.width) % wallTex.width;
                
                ctx.globalAlpha = 1;
                ctx.drawImage(
                    wallTex,
                    texX, 0, 1, wallTex.height,
                    x, drawStart, 1, drawEnd - drawStart
                );
                
                const fog = Math.max(0.15, 1 - distance / 15);
                ctx.fillStyle = `rgba(0,0,0,${1 - fog})`;
                ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
            }
        } else {
            ctx.fillStyle = '#1a2a1a';
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }
        
        zBuffer[x] = distance;
    }
    
    if (Textures.seamBottom && Textures.seamTop) {
        for (let x = 0; x < W; x++) {
            const cameraX = 2 * x / W - 1;
            const rayAngle = player.angle + Math.atan(cameraX * Math.tan(FOV / 2));
            
            const result = castRay(rayAngle);
            const { distance, wallType, side } = result;
            
            if (wallType === 0) continue;
            
            const lineHeight = Math.floor(H / distance);
            const drawStart = Math.max(0, HORIZON - lineHeight / 2);
            const drawEnd = Math.min(H, HORIZON + lineHeight / 2);
            
            let wallX;
            if (side === 0) {
                wallX = player.y + distance * Math.sin(rayAngle);
            } else {
                wallX = player.x + distance * Math.cos(rayAngle);
            }
            wallX -= Math.floor(wallX);
            
            const texX = Math.floor(wallX * 1024) % 1024;
            
            ctx.globalAlpha = 1;
            ctx.drawImage(
                Textures.seamBottom,
                texX, 0, 1, 1024,
                x, drawStart, 1, drawEnd - drawStart
            );
            
            ctx.drawImage(
                Textures.seamTop,
                texX, 0, 1, 1024,
                x, drawStart, 1, drawEnd - drawStart
            );
            ctx.globalAlpha = 1;
        }
    }
    
    if (Textures.loaded && Textures.oak) {
        const oakDist = Math.sqrt((oak.x - player.x) ** 2 + (oak.y - player.y) ** 2);
        
        if (oakDist > 0.5 && oakDist < 10) {
            const oakAngle = Math.atan2(oak.y - player.y, oak.x - player.x) - player.angle;
            let na = oakAngle;
            while (na > Math.PI) na -= 2 * Math.PI;
            while (na < -Math.PI) na += 2 * Math.PI;
            
            if (Math.abs(na) < FOV / 2) {
                const screenX = W / 2 + Math.tan(na) * (W / 2) / Math.tan(FOV / 2);
                
                if (screenX >= 0 && screenX < W && oakDist < zBuffer[Math.floor(screenX)] + 0.5) {
                    const oakSize = H / oakDist * 6;
                    const sy = HORIZON + oakSize * 0.3;
                    const sx = screenX - oakSize / 2;
                    
                    ctx.globalAlpha = 1;
                    ctx.drawImage(Textures.oak, sx, sy, oakSize, oakSize * 0.8);
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    const nearBuilding = buildings.find(b => {
        const dist = Math.sqrt((b.x + 0.5 - player.x) ** 2 + (b.y + 0.5 - player.y) ** 2);
        return dist < 1.5;
    });
    
    if (nearBuilding && Textures.buildings[nearBuilding.icon]) {
        const size = H * 0.4;
        const sx = W / 2 - size / 2;
        const sy = HORIZON - size / 2;
        
        ctx.globalAlpha = 1;
        ctx.drawImage(Textures.buildings[nearBuilding.icon], sx, sy, size, size);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = '#e8d8c0';
        ctx.font = 'bold 20px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(nearBuilding.name, W / 2, sy + size + 30);
    }
    
    const v = ctx.createRadialGradient(W/2, H/2, H/4, W/2, H/2, H * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
}

function canMoveTo(x, y) {
    const mx = Math.floor(x);
    const my = Math.floor(y);
    
    if (mx < 0 || mx >= MAP_W || my < 0 || my >= MAP_H) return false;
    
    const oakDx = mx + 0.5 - oak.x;
    const oakDy = my + 0.5 - oak.y;
    if (Math.sqrt(oakDx * oakDx + oakDy * oakDy) < 1.5) return false;
    
    return map[my][mx] === 0;
}

function animateStep(targetX, targetY) {
    const startX = player.x;
    const startY = player.y;
    const duration = 800;
    const startTime = performance.now();
    
    function stepLoop() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const smoothT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        player.x = startX + (targetX - startX) * smoothT;
        player.y = startY + (targetY - startY) * smoothT;
        
        if (t < 1) {
            requestAnimationFrame(stepLoop);
        } else {
            player.x = targetX;
            player.y = targetY;
            player.moving = false;
        }
    }
    
    stepLoop();
}

function animateTurn(targetAngle) {
    const startAngle = player.angle;
    const duration = 500;
    const startTime = performance.now();
    player.turning = true;
    
    function turnLoop() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const smoothT = t * t * (3 - 2 * t);
        
        player.angle = startAngle + (targetAngle - startAngle) * smoothT;
        
        if (t < 1) {
            requestAnimationFrame(turnLoop);
        } else {
            player.angle = targetAngle;
            player.turning = false;
        }
    }
    
    turnLoop();
}

function stepForward() {
    if (player.moving || player.turning) return;
    
    const newX = player.x + Math.cos(player.angle);
    const newY = player.y + Math.sin(player.angle);
    
    const tx = Math.round(newX);
    const ty = Math.round(newY);
    
    if (canMoveTo(tx, ty)) {
        player.moving = true;
        animateStep(tx, ty);
    }
}

function turnLeft() {
    if (player.moving || player.turning) return;
    animateTurn(player.angle - Math.PI / 2);
}

function turnRight() {
    if (player.moving || player.turning) return;
    animateTurn(player.angle + Math.PI / 2);
}

function interact() {
    const nearBuilding = buildings.find(b => {
        const dist = Math.sqrt((b.x + 0.5 - player.x) ** 2 + (b.y + 0.5 - player.y) ** 2);
        return dist < 1.5;
    });
    
    if (nearBuilding) {
        alert('Вход в: ' + nearBuilding.name);
    }
}

function gameLoop() {
    if (currentScreen === 'game') {
        render();
    }
    requestAnimationFrame(gameLoop);
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        Textures.load(() => {
            console.log('Игра запущена!');
            gameLoop();
        });
    }
}

// Кнопки на экране
const joystickHTML = `
<div id="city-joystick" style="position:fixed;bottom:50px;left:50%;transform:translateX(-50%);width:180px;height:180px;z-index:30;pointer-events:auto;">
    <div class="arrow-btn" id="city-forward" style="position:absolute;top:0;left:62px;width:56px;height:56px;background:rgba(10,8,5,0.9);border:2px solid #6b5a3a;border-radius:50%;color:#c8a050;font-size:24px;display:flex;align-items:center;justify-content:center;pointer-events:auto;-webkit-tap-highlight-color:transparent;text-shadow:0 0 8px #8b6b3a;box-shadow:0 0 10px rgba(139,107,58,0.3);">▲</div>
    <div class="arrow-btn" id="city-left" style="position:absolute;top:62px;left:0;width:56px;height:56px;background:rgba(10,8,5,0.9);border:2px solid #6b5a3a;border-radius:50%;color:#c8a050;font-size:24px;display:flex;align-items:center;justify-content:center;pointer-events:auto;-webkit-tap-highlight-color:transparent;text-shadow:0 0 8px #8b6b3a;box-shadow:0 0 10px rgba(139,107,58,0.3);">◀</div>
    <div class="arrow-btn" id="city-right" style="position:absolute;top:62px;left:124px;width:56px;height:56px;background:rgba(10,8,5,0.9);border:2px solid #6b5a3a;border-radius:50%;color:#c8a050;font-size:24px;display:flex;align-items:center;justify-content:center;pointer-events:auto;-webkit-tap-highlight-color:transparent;text-shadow:0 0 8px #8b6b3a;box-shadow:0 0 10px rgba(139,107,58,0.3);">▶</div>
    <div class="arrow-btn" id="city-back" style="position:absolute;top:124px;left:62px;width:56px;height:56px;background:rgba(10,8,5,0.9);border:2px solid #6b5a3a;border-radius:50%;color:#c8a050;font-size:24px;display:flex;align-items:center;justify-content:center;pointer-events:auto;-webkit-tap-highlight-color:transparent;text-shadow:0 0 8px #8b6b3a;box-shadow:0 0 10px rgba(139,107,58,0.3);">▼</div>
</div>`;

document.body.insertAdjacentHTML('beforeend', joystickHTML);

document.getElementById('city-forward').addEventListener('touchstart', (e) => { e.preventDefault(); stepForward(); });
document.getElementById('city-forward').addEventListener('click', stepForward);
document.getElementById('city-back').addEventListener('touchstart', (e) => { e.preventDefault(); player.angle += Math.PI; });
document.getElementById('city-back').addEventListener('click', () => { player.angle += Math.PI; });
document.getElementById('city-left').addEventListener('touchstart', (e) => { e.preventDefault(); turnLeft(); });
document.getElementById('city-left').addEventListener('click', turnLeft);
document.getElementById('city-right').addEventListener('touchstart', (e) => { e.preventDefault(); turnRight(); });
document.getElementById('city-right').addEventListener('click', turnRight);

document.addEventListener('keydown', (e) => {
    if (currentScreen !== 'game') return;
    
    switch(e.key.toLowerCase()) {
        case 'w': case 'ц': case 'arrowup':
            e.preventDefault();
            stepForward();
            break;
        case 'a': case 'ф': case 'arrowleft':
            e.preventDefault();
            turnLeft();
            break;
        case 'd': case 'в': case 'arrowright':
            e.preventDefault();
            turnRight();
            break;
        case 's': case 'ы': case 'arrowdown':
            e.preventDefault();
            if (!player.turning && !player.moving) {
                player.angle += Math.PI;
            }
            break;
        case 'e': case 'у':
            e.preventDefault();
            interact();
            break;
    }
});
