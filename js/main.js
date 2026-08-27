// js/main.js
const loadingScreen = document.getElementById('loadingScreen');
const homeScreen = document.getElementById('homeScreen');
const playButton = document.getElementById('playButton');
const hero = document.getElementById('hero');
const gameCanvas = document.getElementById('game');

let currentScreen = 'loading';

playButton.addEventListener('click', () => {
    loadingScreen.style.display = 'none';
    homeScreen.style.display = 'flex';
    currentScreen = 'home';
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
    homeScreen.style.display = 'flex';
    gameCanvas.style.display = 'none';
    currentScreen = 'home';
}

function showSectionScreen(building) {
    if (building.icon === 'Подземка') {
        showDungeonScreen();
        return;
    }
    if (building.icon === 'Таверна') {
        showTavernScreen();
        return;
    }
    if (building.icon === 'Таланты') {
        showLearnedTalentsScreen();
        return;
    }
    
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
    <div id="section-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;background:url('${bg}') center/cover no-repeat;display:flex;flex-direction:column;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,0.5);">
            <button onclick="closeSectionScreen()" style="background:transparent;border:none;cursor:pointer;padding:0;width:60px;height:60px;">
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
            <button onclick="closeDungeonScreen()" style="background:transparent;border:none;cursor:pointer;padding:0;width:60px;height:60px;">
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

// ========== ТАВЕРНА ==========
function showTavernScreen() {
    if (typeof Sherwood !== 'undefined' && Sherwood.Tavern) {
        Sherwood.Tavern.init();
    }
    
    const screenHTML = `
    <div id="tavern-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;background:url('assets/backgrounds/section_tavern.png') center/cover no-repeat;display:flex;flex-direction:column;overflow:hidden;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;flex-shrink:0;background:rgba(0,0,0,0.5);">
            <button onclick="closeTavernScreen()" style="background:transparent;border:none;cursor:pointer;padding:0;width:60px;height:60px;">
                <img src="assets/icons/back.png" style="width:100%;height:100%;object-fit:contain;">
            </button>
            <span style="color:#e0c080;font-size:1.2em;">Таверна</span>
        </div>
        <div style="flex:1;overflow-y:auto;padding:20px;scrollbar-width:none;">
            <div id="tavern-content"></div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', screenHTML);
    renderTavernContent();
}

function renderTavernContent() {
    const content = document.getElementById('tavern-content');
    if (!content) return;
    
    let html = '<div style="display:flex;gap:10px;margin-bottom:20px;">';
    html += `<button onclick="switchTavernTab(1)" style="flex:1;background:#c9a040;border:none;border-radius:8px;padding:12px;color:#000;font-weight:bold;cursor:pointer;">Контракты</button>`;
    html += `<button onclick="switchTavernTab(2)" style="flex:1;background:#555;border:none;border-radius:8px;padding:12px;color:#fff;font-weight:bold;cursor:pointer;">Таланты</button>`;
    html += '</div><div id="tavern-tab-content"></div>';
    
    content.innerHTML = html;
    
    if (Sherwood.Tavern._tab === 2) {
        renderTavernTalents();
    } else {
        renderTavernQuests();
    }
}

function switchTavernTab(tab) {
    if (Sherwood.Tavern) Sherwood.Tavern._tab = tab;
    renderTavernContent();
}

function renderTavernQuests() {
    const container = document.getElementById('tavern-tab-content');
    if (!container) return;
    
    const tavern = Sherwood.Tavern;
    let html = '';
    
    html += `<div style="text-align:center;color:#e0c080;margin-bottom:20px;">Контракты сегодня: ${tavern.getDailyQuestsDone()}/${tavern.getMaxDailyQuests()}</div>`;
    
    const current = tavern.getCurrentQuest();
    
    if (current) {
        const quest = current.quest;
        const remaining = tavern.getContractTimeRemaining();
        const ready = tavern.isContractReady();
        
        html += `<div style="background:rgba(0,0,0,0.7);border:2px solid #c9a040;border-radius:10px;padding:15px;margin-bottom:20px;">
            <div style="color:#ffd700;font-weight:bold;margin-bottom:10px;">${quest.name}</div>
            <div style="color:#ccc;margin-bottom:10px;">${quest.desc}</div>
            <div style="color:#aaa;font-size:0.9em;margin-bottom:10px;">Противник: ${quest.enemy.name}</div>`;
        
        if (!ready) {
            const mins = Math.ceil(remaining / 60);
            html += `<div style="color:#ff9800;font-weight:bold;">⏳ Осталось: ${mins} мин.</div>`;
        } else {
            html += `<button onclick="claimTavernContract()" style="background:#4caf50;border:none;border-radius:8px;padding:12px;color:#fff;font-weight:bold;cursor:pointer;width:100%;margin-bottom:10px;">Забрать награду</button>`;
            html += `<button onclick="attackTavernQuest()" style="background:#f44336;border:none;border-radius:8px;padding:12px;color:#fff;font-weight:bold;cursor:pointer;width:100%;">Атаковать</button>`;
        }
        
        html += '</div>';
    } else {
        html += `<button onclick="startTavernQuest()" style="background:#c9a040;border:none;border-radius:8px;padding:15px;color:#000;font-weight:bold;cursor:pointer;width:100%;margin-bottom:20px;">Взять контракт</button>`;
    }
    
    container.innerHTML = html;
}

function startTavernQuest() {
    const result = Sherwood.Tavern.startQuest();
    if (result.success) {
        renderTavernQuests();
    } else {
        alert(result.reason);
    }
}

function claimTavernContract() {
    const result = Sherwood.Tavern.claimContractReward();
    if (result.success && result.mode === 'battle') {
        attackTavernQuest();
    } else if (result.success) {
        renderTavernQuests();
    } else {
        alert(result.reason);
    }
}

function attackTavernQuest() {
    const result = Sherwood.Tavern.attackQuest();
    if (result.win) {
        alert('Победа!');
        renderTavernQuests();
    } else if (result.lose) {
        alert('Поражение...');
        renderTavernQuests();
    } else {
        renderTavernQuests();
    }
}

function renderTavernTalents() {
    const container = document.getElementById('tavern-tab-content');
    if (!container) return;
    
    let html = '<div style="display:flex;flex-direction:column;gap:15px;padding-bottom:20px;">';
    
    for (const talent of Talents.list) {
        const level = Talents.getLevel(talent.id);
        const cost = Talents.getCost(talent.id, level);
        const isLearned = level > 0;
        
        html += `
        <div style="display:flex;align-items:center;gap:10px;background:rgba(0,0,0,0.7);border:1px solid #c9a040;border-radius:8px;padding:10px;">
            <img src="assets/talents/${talent.icon}" style="width:50px;height:50px;object-fit:contain;">
            <div style="flex:1;">
                <div style="color:#ffd700;font-weight:bold;">${talent.name}</div>
                <div style="color:#ccc;font-size:0.8em;">${talent.desc}</div>
                ${isLearned ? `<div style="color:#aaa;font-size:0.7em;">Уровень: ${level}/${talent.maxLevel}</div>` : ''}
            </div>
            ${!isLearned ? 
                `<button onclick="learnTalent('${talent.id}')" style="background:#4caf50;border:none;border-radius:5px;padding:8px;color:#fff;font-weight:bold;cursor:pointer;">Изучить ${cost} зол.</button>` :
                level < talent.maxLevel ? 
                `<button onclick="upgradeTalent('${talent.id}')" style="background:#ff9800;border:none;border-radius:5px;padding:8px;color:#fff;font-weight:bold;cursor:pointer;">Улучшить ${cost} зол.</button>` :
                `<div style="color:#4caf50;">MAX</div>`
            }
        </div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function learnTalent(id) {
    const result = Talents.learn(id);
    if (!result.success) alert(result.reason);
    renderTavernTalents();
}

function upgradeTalent(id) {
    const result = Talents.upgrade(id);
    if (!result.success) alert(result.reason);
    renderTavernTalents();
}

function closeTavernScreen() {
    const screen = document.getElementById('tavern-screen');
    if (screen) screen.remove();
}

// ========== ЭКРАН ТАЛАНТОВ ==========
function showLearnedTalentsScreen() {
    let html = '<div style="display:flex;flex-direction:column;gap:15px;padding:20px;">';
    
    for (const talent of Talents.list) {
        const level = Talents.getLevel(talent.id);
        if (level === 0) continue;
        
        const enabled = Talents.isEnabled(talent.id);
        
        html += `
        <div style="display:flex;align-items:center;gap:10px;background:rgba(0,0,0,0.7);border:1px solid #c9a040;border-radius:8px;padding:10px;">
            <img src="assets/talents/${talent.icon}" style="width:50px;height:50px;object-fit:contain;">
            <div style="flex:1;">
                <div style="color:#ffd700;font-weight:bold;">${talent.name}</div>
                <div style="color:#ccc;font-size:0.8em;">${talent.desc}</div>
                <div style="color:#aaa;font-size:0.7em;">Уровень: ${level}/${talent.maxLevel}</div>
            </div>
            <button onclick="toggleTalent('${talent.id}')" style="background:${enabled ? '#4caf50' : '#f44336'};border:none;border-radius:5px;padding:8px;color:#fff;font-weight:bold;cursor:pointer;">${enabled ? 'Выключить' : 'Включить'}</button>
        </div>`;
    }
    
    html += '</div>';
    
    const screenHTML = `
    <div id="talents-screen" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;background:url('assets/backgrounds/visual_talents.png') center/cover no-repeat;display:flex;flex-direction:column;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,0.5);">
            <button onclick="closeTalentsScreen()" style="background:transparent;border:none;cursor:pointer;width:60px;height:60px;">
                <img src="assets/icons/back.png" style="width:100%;height:100%;object-fit:contain;">
            </button>
            <span style="color:#e0c080;font-size:1.2em;">Таланты</span>
        </div>
        <div style="flex:1;overflow-y:auto;scrollbar-width:none;">${html}</div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', screenHTML);
}

function closeTalentsScreen() {
    const screen = document.getElementById('talents-screen');
    if (screen) screen.remove();
}

function toggleTalent(id) {
    Talents.toggle(id);
    closeTalentsScreen();
    showLearnedTalentsScreen();
}
