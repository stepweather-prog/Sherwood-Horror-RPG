// ========== ИГРОВОЙ КОД ==========
const MAP_W = 12;
const MAP_H = 12;
const FOV = Math.PI / 2.5;

const map = [];
for (let y = 0; y < MAP_H; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_W; x++) {
        map[y][x] = 1;
    }
}

// Площадь 10x10 (от 1 до 10)
for (let y = 1; y <= 10; y++) {
    for (let x = 1; x <= 10; x++) {
        map[y][x] = 0;
    }
}

// Дуб в центре
const oak = { x: 5.5, y: 5.5 };

// Иконки на стенах — каждая в своей клетке периметра
const buildings = [
    { x: 1, y: 0, icon: 'Квесты', name: 'Квесты' },
    { x: 3, y: 0, icon: 'Арена', name: 'Арена' },
    { x: 5, y: 0, icon: 'Рынок', name: 'Рынок' },
    { x: 7, y: 0, icon: 'Таверна', name: 'Таверна' },
    { x: 9, y: 0, icon: 'Кузница', name: 'Кузница' },
    { x: 10, y: 2, icon: 'Тренировка', name: 'Тренировка' },
    { x: 10, y: 4, icon: 'Бестиарий', name: 'Бестиарий' },
    { x: 10, y: 6, icon: 'Очаг', name: 'Очаг' },
    { x: 10, y: 8, icon: 'Порталы', name: 'Порталы' },
    { x: 9, y: 10, icon: 'Чат', name: 'Чат' },
    { x: 7, y: 10, icon: 'Профиль', name: 'Профиль' },
    { x: 5, y: 10, icon: 'Рейд', name: 'Рейд' },
    { x: 3, y: 10, icon: 'Подземка', name: 'Подземка' },
    { x: 1, y: 10, icon: 'Сумка', name: 'Сумка' },
    { x: 0, y: 8, icon: 'Настройки', name: 'Настройки' },
    { x: 0, y: 6, icon: 'Таланты', name: 'Таланты' },
    { x: 0, y: 4, icon: 'Бестиарий', name: 'Бестиарий' },
    { x: 0, y: 2, icon: 'Ежедневные', name: 'Ежедневные' },
];

const player = {
    x: 5.5,
    y: 8.5,
    angle: -Math.PI / 2,
    moving: false,
    turning: false,
    turnFrom: -Math.PI / 2,
    turnTarget: -Math.PI / 2,
    turnProgress: 0,
    moveFromX: 5.5,
    moveFromY: 8.5,
    targetX: 5.5,
    targetY: 8.5,
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
    
    // Иконки на стенах
    for (const b of buildings) {
        const dx = b.x + 0.5 - player.x;
        const dy = b.y + 0.5 - player.y;
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
        }
        ctx.globalAlpha = 1;
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
    const frontX = Math.round(player.x + Math.cos(player.angle));
    const frontY = Math.round(player.y + Math.sin(player.angle));
    
    const building = buildings.find(b => b.x === frontX && b.y === frontY);
    
    if (building) {
        if (building.icon === 'Подземка') {
            showDungeonScreen();
        } else {
            showSectionScreen(building);
        }
    }
}

// ========== ЭКРАНЫ РАЗДЕЛОВ ==========
function showSectionScreen(building) {
    const backgrounds = {
        'Таверна': 'assets/backgrounds/section_tavern.png',
        'Порталы': 'assets/backgrounds/portal.png',
        'Чат': 'assets/backgrounds/chat_background.png',
        'Рейд': 'assets/backgrounds/background_raid.png',
        'Арена': 'assets/backgrounds/pvp_arena.png',
        'Квесты': 'assets/backgrounds/quest.png',
        'Ежедневные': 'assets/backgrounds/tasks_day.png',
    };
    
    const bg = backgrounds[building.icon] || 'assets/backgrounds/sherwood_thicket.png';
    
    const screenHTML = `
    <div id="section-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;background:url('${bg}') center/cover no-repeat;display:flex;flex-direction:column;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,0.5);">
            <button onclick="closeSectionScreen()" style="background:transparent;border:none;cursor:pointer;padding:0;width:50px;height:50px;">
                <img src="assets/all_buttons/back.png" style="width:100%;height:100%;object-fit:contain;">
            </button>
            <span style="color:#e0c080;font-size:1.2em;text-shadow:0 0 10px #000;">${building.name}</span>
        </div>
        <div style="flex:1;overflow-y:auto;padding:20px;">
            <!-- Контент раздела -->
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', screenHTML);
}

function closeSectionScreen() {
    const screen = document.getElementById('section-screen');
    if (screen) screen.remove();
}

// ========== ЭКРАН ПОДЗЕМОК ==========
function showDungeonScreen() {
    const screenHTML = `
    <div id="dungeon-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;background:url('assets/backgrounds/sherwood_thicket.png') center/cover no-repeat;display:flex;flex-direction:column;overflow:hidden;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;flex-shrink:0;background:rgba(0,0,0,0.5);">
            <button onclick="closeDungeonScreen()" style="background:transparent;border:none;cursor:pointer;padding:0;width:50px;height:50px;">
                <img src="assets/all_buttons/back.png" style="width:100%;height:100%;object-fit:contain;">
            </button>
            <span style="color:#e0c080;font-size:1.2em;text-shadow:0 0 10px #000;">Подземелья</span>
        </div>
        <div style="flex:1;overflow-y:auto;overflow-x:hidden;padding:20px;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;">
            <div style="display:flex;flex-direction:column;align-items:center;gap:30px;padding-bottom:40px;">
                <div onclick="enterDungeon('forest')" style="text-align:center;cursor:pointer;">
                    <img src="assets/icons/the_cursed_thicket.png" style="width:180px;height:180px;object-fit:contain;display:block;margin:0 auto;">
                    <div style="color:#e0c080;font-size:1.1em;font-weight:bold;margin-top:8px;text-shadow:0 0 10px #000;">Проклятая чаща</div>
                </div>
                <div onclick="enterDungeon('swamp')" style="text-align:center;cursor:pointer;">
                    <img src="assets/icons/primordial_swamp.png" style="width:180px;height:180px;object-fit:contain;display:block;margin:0 auto;">
                    <div style="color:#e0c080;font-size:1.1em;font-weight:bold;margin-top:8px;text-shadow:0 0 10px #000;">Первородное болото</div>
                </div>
                <div onclick="enterDungeon('cave')" style="text-align:center;cursor:pointer;">
                    <img src="assets/icons/basalt_grotto.png" style="width:180px;height:180px;object-fit:contain;display:block;margin:0 auto;">
                    <div style="color:#e0c080;font-size:1.1em;font-weight:bold;margin-top:8px;text-shadow:0 0 10px #000;">Базальтовый грот</div>
                </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', screenHTML);
}

function closeDungeonScreen() {
    const screen = document.getElementById('dungeon-screen');
    if (screen) screen.remove();
}

function enterDungeon(dungeonId) {
    closeDungeonScreen();
    alert('Вход в подземку: ' + dungeonId);
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

// Кнопки управления
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
document.getElementById('city-left').addEventListener('touchstart', (e) => { e.preventDefault(); turnLeft(); });
document.getElementById('city-left').addEventListener('click', turnLeft);
document.getElementById('city-right').addEventListener('touchstart', (e) => { e.preventDefault(); turnRight(); });
document.getElementById('city-right').addEventListener('click', turnRight);
document.getElementById('city-back').addEventListener('touchstart', (e) => { e.preventDefault(); player.angle += Math.PI; });
document.getElementById('city-back').addEventListener('click', () => { player.angle += Math.PI; });

canvas.addEventListener('click', (e) => {
    if (currentScreen !== 'game') return;
    interact();
});

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
