// js/main.js
const loadingScreen = document.getElementById('loadingScreen');
const homeScreen = document.getElementById('homeScreen');
const playButton = document.getElementById('playButton');
const hero = document.getElementById('hero');
const menuScreen = document.getElementById('menuScreen');

let currentScreen = 'loading';

playButton.addEventListener('click', () => {
    loadingScreen.style.display = 'none';
    homeScreen.style.display = 'flex';
    currentScreen = 'home';
});

hero.addEventListener('click', () => {
    homeScreen.style.display = 'none';
    menuScreen.style.display = 'block';
    currentScreen = 'menu';
    
    AudioManager.playCityTheme();
    
    showLoadingOverlay();
    
    const startMenu = () => {
        hideLoadingOverlay();
        Menu.init();
    };
    
    if (Textures.loaded) {
        startMenu();
    } else {
        Textures.load(startMenu);
    }
});

function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        z-index: 1000;
        background: url('assets/backgrounds/loading_screen_with_logo.png') center/cover no-repeat;
        display: flex; justify-content: center; align-items: center;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 60px; height: 60px;
        border: 4px solid #c9a040; border-top: 4px solid transparent;
        border-radius: 50%; animation: spin 1s linear infinite;
    `;
    
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
    
    if (!document.getElementById('spin-keyframes')) {
        const style = document.createElement('style');
        style.id = 'spin-keyframes';
        style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();
}

function showHomeScreen() {
    Menu.destroy();
    homeScreen.style.display = 'flex';
    menuScreen.style.display = 'none';
    currentScreen = 'home';
}

function showSectionScreen(building) {
    if (building.icon === 'Подземка') { showDungeonScreen(); return; }
    if (building.icon === 'Таверна') { showTavernScreen(); return; }
    if (building.icon === 'Таланты') { showLearnedTalentsScreen(); return; }
    
    const backgrounds = {
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
        'Рынок': 'assets/backgrounds/market.png',
        'Кошель': 'assets/backgrounds/wallet_vis.png',
    };
    
    const bg = backgrounds[building.icon] || '';
    
    const screenHTML = `
    <div id="section-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:300;background:url('${bg}') center/cover no-repeat;display:flex;flex-direction:column;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,0.5);">
            <button onclick="closeSectionScreen()" style="background:transparent;border:none;cursor:pointer;padding:0;width:60px;height:60px;">
                <img src="assets/icons/back.png" style="width:100%;height:100%;object-fit:contain;">
            </button>
            <span style="color:#e0c080;font-size:1.2em;">${building.name}</span>
        </div>
        <div style="flex:1;overflow-y:auto;padding:20px;"></div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', screenHTML);
}

function closeSectionScreen() {
    const screen = document.getElementById('section-screen');
    if (screen) screen.remove();
}

// ... все остальные функции (таверна, таланты, подземка) без изменений
