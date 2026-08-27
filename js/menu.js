// js/menu-html.js
const Menu = {
    buildings: [
        { icon: 'Квесты', name: 'Квесты' },
        { icon: 'Арена', name: 'Арена' },
        { icon: 'Рынок', name: 'Рынок' },
        { icon: 'Таверна', name: 'Таверна' },
        { icon: 'Кузница', name: 'Кузница' },
        { icon: 'Тренировка', name: 'Тренировка' },
        { icon: 'Бестиарий', name: 'Бестиарий' },
        { icon: 'Очаг', name: 'Очаг' },
        { icon: 'Порталы', name: 'Порталы' },
        { icon: 'Чат', name: 'Чат' },
        { icon: 'Профиль', name: 'Профиль' },
        { icon: 'Рейд', name: 'Рейд' },
        { icon: 'Подземка', name: 'Подземка' },
        { icon: 'Сумка', name: 'Сумка' },
        { icon: 'Настройки', name: 'Настройки' },
        { icon: 'Таланты', name: 'Таланты' },
        { icon: 'Ежедневные', name: 'Ежедневные' },
        { icon: 'Кошель', name: 'Кошель' },
    ],
    
    currentIndex: 0,
    screen: null,
    iconContainer: null,
    wallContainer: null,
    
    init() {
        this.screen = document.getElementById('menuScreen');
        this.iconContainer = document.getElementById('menu-icon-container');
        this.wallContainer = document.getElementById('menu-wall');
        
        this.screen.style.display = 'block';
        
        // Потолок
        document.getElementById('menu-ceiling').style.backgroundImage = "url('assets/Sherwood_Square/area_ceiling_moon.png')";
        
        // Пол — три плиты
        const floor = document.getElementById('menu-floor');
        floor.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            const tile = document.createElement('div');
            tile.style.cssText = `width:33.33%;height:100%;background-image:url('assets/Sherwood_Square/floor${i}.png');background-size:cover;background-position:center;`;
            floor.appendChild(tile);
        }
        
        // Стена
        this.wallContainer.style.backgroundImage = "url('assets/Sherwood_Square/wall_area_1.png')";
        
        // Строим карусель иконок
        this.buildCarousel();
        
        // Обработчики
        document.getElementById('menu-left-arrow').addEventListener('click', () => this.prev());
        document.getElementById('menu-right-arrow').addEventListener('click', () => this.next());
        document.getElementById('menu-home-btn').addEventListener('click', () => {
            if (typeof showHomeScreen === 'function') showHomeScreen();
        });
    },
    
    buildCarousel() {
        this.iconContainer.innerHTML = '';
        
        this.buildings.forEach((building, index) => {
            const section = document.createElement('div');
            section.style.cssText = `display:inline-block;width:100%;height:100%;text-align:center;position:relative;`;
            
            const img = new Image();
            img.src = `assets/icons/${this.getIconFile(building.icon)}`;
            img.style.cssText = 'width:25%;height:50%;object-fit:contain;margin-top:10%;';
            img.onclick = () => this.interact(building);
            
            const label = document.createElement('div');
            label.textContent = building.name;
            label.style.cssText = 'color:#e8d8c0;font-size:1.2em;font-weight:bold;';
            
            section.appendChild(img);
            section.appendChild(label);
            this.iconContainer.appendChild(section);
        });
        
        this.updatePosition();
    },
    
    getIconFile(icon) {
        const map = {
            'Квесты': 'quest.png',
            'Арена': 'arena.png',
            'Рынок': 'sherwood_market.png',
            'Таверна': 'tavern.png',
            'Кузница': 'forge.png',
            'Тренировка': 'training.png',
            'Бестиарий': 'bestiary.png',
            'Очаг': 'button_hearth.png',
            'Порталы': 'portal.png',
            'Чат': 'chat_button.png',
            'Профиль': 'player_profile.png',
            'Рейд': 'raid.png',
            'Подземка': 'subway.png',
            'Сумка': 'hero_bag.png',
            'Настройки': 'settings.png',
            'Таланты': 'ranger_skills_button.png',
            'Ежедневные': 'daily_quests.png',
            'Кошель': 'wallet.png',
        };
        return map[icon] || 'arena.png';
    },
    
    updatePosition() {
        const offset = -this.currentIndex * 100;
        this.iconContainer.style.transform = `translateX(${offset}%)`;
        this.iconContainer.style.transition = 'transform 0.4s ease';
    },
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.buildings.length;
        this.updatePosition();
    },
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.buildings.length) % this.buildings.length;
        this.updatePosition();
    },
    
    interact(building) {
        if (building.icon === 'Подземка') {
            if (typeof showDungeonScreen === 'function') showDungeonScreen();
        } else {
            if (typeof showSectionScreen === 'function') showSectionScreen(building);
        }
    },
    
    destroy() {
        if (this.screen) this.screen.style.display = 'none';
    }
};
