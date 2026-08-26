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
    { x: 1.5, y: 4.5, icon: 'Квесты', name: 'Квесты' },
    { x: 4.5, y: 1.5, icon: 'Арена', name: 'Арена' },
    { x: 7.5, y: 4.5, icon: 'Рынок', name: 'Рынок' },
    { x: 4.5, y: 7.5, icon: 'Таверна', name: 'Таверна' },
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
    
    // Потолок
    if (Textures.loaded) {
        const mapX = Math.floor(player.x);
        const mapY = Math.floor(player.y);
        const ceilingTex = Textures.getCeilingTexture(mapX, mapY);
        if (ceilingTex) {
            ctx.drawImage(ceilingTex, 0, 0, W, HORIZON);
        }
    } else {
        ctx.fillStyle = '#0d0d0d';
        ctx.fillRect(0, 0, W, HORIZON);
    }
    
    // Пол
    if (Textures.loaded) {
        const mapX = Math.floor(player.x);
        const mapY = Math.floor(player.y);
        const floorTex = Textures.getFloorTexture(mapX, mapY);
        if (floorTex) {
            ctx.drawImage(floorTex, 0, HORIZON, W, H - HORIZON);
        }
    } else {
        ctx.fillStyle = '#2a2218';
        ctx.fillRect(0, HORIZON, W, H - HORIZON);
    }
    
    // Стены
    for (let x = 0; x < W; x++) {
        const cameraX = 2 * x / W - 1;
        const rayAngle = player.angle + Math.atan(cameraX * Math.tan(FOV / 2));
        
        const result = castRay(rayAngle);
        const { distance, side, wallType } = result;
        
        const lineHeight = Math.floor(H / distance);
        const drawStart = Math.max(0, HORIZON - lineHeight / 2);
        const drawEnd = Math.min(H, HORIZON + lineHeight / 2);
        
        if (Textures.loaded && wallType !== 0) {
            const wallTex = Textures.getWallTexture(result.mapX, result.mapY);
            
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
    
    // Швы
    if (Textures.seamBottom && Textures.seamTop) {
        for (let x = 0; x < W; x++) {
            const cameraX = 2 * x / W - 1;
            const rayAngle = player.angle + Math.atan(cameraX * Math.tan(FOV / 2));
            
            const result = castRay(rayAngle);
            const { distance, wallType } = result;
            
            if (wallType === 0) continue;
            
            const lineHeight = Math.floor(H / distance);
            const drawStart = Math.max(0, HORIZON - lineHeight / 2);
            const drawEnd = Math.min(H, HORIZON + lineHeight / 2);
            
            const seamHeight = Math.floor(lineHeight * 0.08);
            
            if (seamHeight > 2) {
                // Нижний шов
                ctx.globalAlpha = 1;
                ctx.drawImage(
                    Textures.seamBottom,
                    0, 0, Textures.seamBottom.width, Textures.seamBottom.height,
                    x, drawEnd - seamHeight, 1, seamHeight
                );
                
                // Верхний шов
                ctx.drawImage(
                    Textures.seamTop,
                    0, 0, Textures.seamTop.width, Textures.seamTop.height,
                    x, drawStart, 1, seamHeight
                );
                ctx.globalAlpha = 1;
            }
        }
    }
    
    // Дуб
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
                    const oakSize = H / oakDist * 3;
                    const sy = HORIZON + oakSize * 0.1;
                    const sx = screenX - oakSize / 2;
                    
                    ctx.globalAlpha = 1;
                    ctx.drawImage(Textures.oak, sx, sy, oakSize, oakSize * 0.8);
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    // Спрайты построек
    for (const b of buildings) {
        const dx = b.x - player.x;
        const dy = b.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 12) continue;
        
        const angle = Math.atan2(dy, dx) - player.angle;
        let na = angle;
        while (na > Math.PI) na -= 2 * Math.PI;
        while (na < -Math.PI) na += 2 * Math.PI;
        
        if (Math.abs(na) > FOV / 2 + 0.3) continue;
        
        const screenX = W / 2 + Math.tan(na) * (W / 2) / Math.tan(FOV / 2);
        if (screenX < 0 || screenX >= W) continue;
        
        if (distance > zBuffer[Math.floor(screenX)] + 0.3) continue;
        
        const size = H / distance * 0.6;
        if (size < 15) continue;
        
        const sy = HORIZON - size / 2;
        const sx = screenX - size / 2;
        
        if (Textures.buildings[b.icon]) {
            ctx.globalAlpha = 1;
            ctx.drawImage(Textures.buildings[b.icon], sx, sy, size, size);
            
            // Табличка с названием
            if (Textures.buildings['all_stat']) {
                const signWidth = size * 1.2;
                const signHeight = size * 0.3;
                const signX = screenX - signWidth / 2;
                const signY = sy - signHeight;
                
                ctx.drawImage(Textures.buildings['all_stat'], signX, signY, signWidth, signHeight);
                
                ctx.fillStyle = '#e8d8c0';
                ctx.font = `bold ${Math.floor(size * 0.12)}px "Times New Roman", serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(b.name, screenX, signY + signHeight / 2);
            }
        }
        ctx.globalAlpha = 1;
    }
    
    // Виньетка
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

function stepForward() {
    if (player.moving || player.turning) return;
    
    const newX = player.x + Math.cos(player.angle);
    const newY = player.y + Math.sin(player.angle);
    
    const tx = Math.round(newX);
    const ty = Math.round(newY);
    
    if (canMoveTo(tx, ty)) {
        player.moving = true;
        player.moveFromX = player.x;
        player.moveFromY = player.y;
        player.targetX = tx;
        player.targetY = ty;
        player.moveProgress = 0;
    }
}

function turnLeft() {
    if (player.moving || player.turning) return;
    player.turning = true;
    player.turnFrom = player.angle;
    player.turnTarget = player.angle - Math.PI / 2;
    player.turnProgress = 0;
}

function turnRight() {
    if (player.moving || player.turning) return;
    player.turning = true;
    player.turnFrom = player.angle;
    player.turnTarget = player.angle + Math.PI / 2;
    player.turnProgress = 0;
}

function interact() {
    for (const b of buildings) {
        const dx = b.x - player.x;
        const dy = b.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 1.5) {
            alert('Вход в: ' + b.name);
            return;
        }
    }
}

function update() {
    if (player.turning) {
        player.turnProgress += TURN_SPEED;
        
        if (player.turnProgress >= 1) {
            player.angle = player.turnTarget;
            player.turning = false;
            player.turnProgress = 0;
        } else {
            const t = player.turnProgress;
            const smoothT = t * t * (3 - 2 * t);
            player.angle = player.turnFrom + (player.turnTarget - player.turnFrom) * smoothT;
        }
    }
    
    if (player.moving) {
        player.moveProgress += MOVE_SPEED;
        
        if (player.moveProgress >= 1) {
            player.x = player.targetX;
            player.y = player.targetY;
            player.moving = false;
            player.moveProgress = 0;
        } else {
            const t = player.moveProgress;
            const smoothT = t * t * (3 - 2 * t);
            player.x = player.moveFromX + (player.targetX - player.moveFromX) * smoothT;
            player.y = player.moveFromY + (player.targetY - player.moveFromY) * smoothT;
        }
    }
}

function gameLoop() {
    if (currentScreen === 'game') {
        update();
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
                player.turning = true;
                player.turnFrom = player.angle;
                player.turnTarget = player.angle + Math.PI;
                player.turnProgress = 0;
            }
            break;
        case 'e': case 'у':
            e.preventDefault();
            interact();
            break;
    }
});

canvas.addEventListener('click', (e) => {
    if (currentScreen !== 'game') return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    if (x < W / 3) {
        turnLeft();
    } else if (x > W * 2 / 3) {
        turnRight();
    } else {
        stepForward();
    }
});

canvas.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (currentScreen === 'game') {
        interact();
    }
});
