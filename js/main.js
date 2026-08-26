// js/main.js
const loadingScreen = document.getElementById('loadingScreen');
const homeScreen = document.getElementById('homeScreen');
const playButton = document.getElementById('playButton');
const hero = document.getElementById('hero');
const gameCanvas = document.getElementById('game');

let currentScreen = 'loading';

playButton.addEventListener('click', () => {
    loadingScreen.style.display = 'none';
    homeScreen.style.display = 'block';
    currentScreen = 'home';
    
    const video = document.getElementById('videoBackground');
    video.play().catch(() => {});
});

hero.addEventListener('click', () => {
    homeScreen.style.display = 'none';
    gameCanvas.style.display = 'block';
    currentScreen = 'game';
    
    AudioManager.playCityTheme();
    
    if (Textures.loaded) {
        Menu.init();
    } else {
        Textures.load(() => {
            Menu.init();
        });
    }
});

function showHomeScreen() {
    Menu.destroy();
    homeScreen.style.display = 'block';
    gameCanvas.style.display = 'none';
    currentScreen = 'home';
    
    const video = document.getElementById('videoBackground');
    video.play().catch(() => {});
}

function showSectionScreen(building) {
    const backgrounds = {
        'Таверна': 'assets/backgrounds/section_tavern.png',
        'Порталы': 'assets/backgrounds/portal.png',
        'Чат': 'assets/backgrounds/chat_background.png',
        'Рейд': 'assets/backgrounds/background_raid.png',
        'Арена': 'assets/backgrounds/pvp_arena.png',
        'Квесты': 'assets/backgrounds/quest.png',
        'Ежедневные': 'assets/backgrounds/tasks_day.png',
        'Кузница': 'assets/backgrounds/forge.png',
        'Тренировка': 'assets/backgrounds/training.png',
        'Бестиарий': 'assets/backgrounds/bestiary_visual.png',
        'Очаг': 'assets/backgrounds/fireplace_visual.png',
        'Профиль': 'assets/backgrounds/profile_visual.png',
        'Сумка': 'assets/backgrounds/bag.png',
        'Настройки': 'assets/backgrounds/settings_visual.png',
        'Таланты': 'assets/backgrounds/visual_talents.png',
        'Рынок': 'assets/backgrounds/market.png',
        'Кошель': 'assets/backgrounds/wallet_vis.png',
    };
    
    const bg = backgrounds[building.icon] || '';
    
    const screenHTML = `
    <div id="section-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;background:url('${bg}') center/cover no-repeat;display:flex;flex-direction:column;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,0.5);">
            <button onclick="closeSectionScreen()" style="background:transparent;border:none;cursor:pointer;padding:0;width:50px;height:50px;">
                <img src="assets/icons/back.png" style="width:100%;height:100%;object-fit:contain;">
            </button>
            <span style="color:#e0c080;font-size:1.2em;text-shadow:0 0 10px #000;">${building.name}</span>
        </div>
        <div style="flex:1;overflow-y:auto;padding:20px;">
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', screenHTML);
}

function closeSectionScreen() {
    const screen = document.getElementById('section-screen');
    if (screen) screen.remove();
}

function showDungeonScreen() {
    const screenHTML = `
    <div id="dungeon-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;background:url('assets/backgrounds/sherwood_thicket.png') center/cover no-repeat;display:flex;flex-direction:column;overflow:hidden;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;flex-shrink:0;background:rgba(0,0,0,0.5);">
            <button onclick="closeDungeonScreen()" style="background:transparent;border:none;cursor:pointer;padding:0;width:50px;height:50px;">
                <img src="assets/icons/back.png" style="width:100%;height:100%;object-fit:contain;">
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
