// js/menu.js — полный, рабочий
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
    isAnimating: false,
    stepVideo: null,
    stepTimer: null,
    
    init() {
        this.screen = document.getElementById('menuScreen');
        this.iconContainer = document.getElementById('menu-icon-container');
        
        this.screen.style.display = 'block';
        
        // Потолок
        document.getElementById('menu-ceiling').style.backgroundImage = "url('assets/Sherwood_Square/area_ceiling_moon.png')";
        
        // Пол
        const floor = document.getElementById('menu-floor');
        floor.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            const tile = document.createElement('div');
            tile.style.cssText = `width:33.33%;height:100%;background-image:url('assets/Sherwood_Square/floor${i}.png');background-size:cover;`;
            floor.appendChild(tile);
        }
        
        // Стена
        document.getElementById('menu-wall').style.backgroundImage = "url('assets/Sherwood_Square/wall_area_1.png')";
        
        // Разделители
        const wallY = window.innerHeight * 0.25;
        const floorY = window.innerHeight * 0.75;
        
        const seamTop = document.createElement('div');
        seamTop.style.cssText = `position:absolute;top:${wallY - 30}px;left:0;width:100%;height:60px;background-image:url('assets/game_details/seam_top.png');background-size:100% 100%;z-index:5;`;
        this.screen.appendChild(seamTop);
        
        const seamBottom = document.createElement('div');
        seamBottom.style.cssText = `position:absolute;top:${floorY - 30}px;left:0;width:100%;height:60px;background-image:url('assets/game_details/seam_bottom.png');background-size:100% 100%;z-index:5;`;
        this.screen.appendChild(seamBottom);
        
        // Анимация
        this.stepVideo = document.createElement('video');
        this.stepVideo.src = 'assets/animation/step_up.webm';
        this.stepVideo.loop = false;
        this.stepVideo.muted = true;
        this.stepVideo.playsInline = true;
        this.stepVideo.style.cssText = 'position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:30vw;height:30vw;z-index:6;object-fit:contain;';
        this.screen.appendChild(this.stepVideo);
        
        // Карусель
        this.buildCarousel();
        
        document.getElementById('menu-left-arrow').addEventListener('click', () => this.prev());
        document.getElementById('menu-right-arrow').addEventListener('click', () => this.next());
        document.getElementById('menu-home-btn').addEventListener('click', () => {
            if (typeof showHomeScreen === 'function') showHomeScreen();
        });
    },
    
    buildCarousel() {
        this.iconContainer.innerHTML = '';
        
        this.buildings.forEach((building) => {
            const section = document.createElement('div');
            section.style.cssText = 'display:inline-block;width:100%;height:100%;text-align:center;vertical-align:top;';
            
            const img = new Image();
            img.src = `assets/icons/${this.getIconFile(building.icon)}`;
            img.style.cssText = 'width:25%;height:60%;object-fit:contain;margin-top:5%;';
            img.onclick = () => this.interact(building);
            
            const label = document.createElement('div');
            label.textContent = building.name;
            label.style.cssText = 'color:#e8d8c0;font-size:1.2em;font-weight:bold;';
            
            section.appendChild(img);
            section.appendChild(label);
            this.iconContainer.appendChild(section);
        });
        
        this.updatePosition(false);
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
    
    updatePosition(animate = true) {
        const offset = -this.currentIndex * 100;
        this.iconContainer.style.transition = animate ? 'transform 0.4s ease' : 'none';
        this.iconContainer.style.transform = `translateX(${offset}%)`;
    },
    
    next() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex + 1) % this.buildings.length;
        this.updatePosition();
        this.playStepAnimation();
    },
    
    prev() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex - 1 + this.buildings.length) % this.buildings.length;
        this.updatePosition();
        this.playStepAnimation();
    },
    
    playStepAnimation() {
        if (this.stepVideo) {
            this.isAnimating = true;
            this.stepVideo.currentTime = 0;
            this.stepVideo.play().catch(() => {});
            
            clearTimeout(this.stepTimer);
            this.stepTimer = setTimeout(() => {
                this.stepVideo.pause();
                this.isAnimating = false;
            }, 600);
        }
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
        clearTimeout(this.stepTimer);
        if (this.stepVideo) this.stepVideo.pause();
    }
};
