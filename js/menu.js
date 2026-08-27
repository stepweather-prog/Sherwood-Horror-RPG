// js/menu.js — ПОЛНЫЙ, с исправлениями
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
        this.screen.style.display = 'block';
        this.screen.innerHTML = '';
        
        // Потолок
        const ceiling = document.createElement('div');
        ceiling.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:25%;background:url("assets/Sherwood_Square/area_ceiling_moon.png") center/cover no-repeat;';
        this.screen.appendChild(ceiling);
        
        // Стена
        const wall = document.createElement('div');
        wall.style.cssText = 'position:absolute;top:25%;left:0;width:100%;height:50%;background:url("assets/Sherwood_Square/wall_area_1.png") center/cover no-repeat;';
        this.screen.appendChild(wall);
        
        // Пол
        const floor = document.createElement('div');
        floor.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:25%;display:flex;';
        for (let i = 1; i <= 3; i++) {
            const tile = document.createElement('div');
            tile.style.cssText = `width:33.33%;height:100%;background:url('assets/Sherwood_Square/floor${i}.png') center/cover no-repeat;`;
            floor.appendChild(tile);
        }
        this.screen.appendChild(floor);
        
        // Разделители — ПО 3 ШТУКИ, исходный размер
        for (let i = 0; i < 3; i++) {
            const seamTop = document.createElement('img');
            seamTop.src = 'assets/game_details/seam_top.png';
            seamTop.style.cssText = `position:absolute;top:25%;left:${i * 33.33}%;transform:translate(-50%,-50%);z-index:5;`;
            this.screen.appendChild(seamTop);
            
            const seamBottom = document.createElement('img');
            seamBottom.src = 'assets/game_details/seam_bottom.png';
            seamBottom.style.cssText = `position:absolute;top:75%;left:${i * 33.33}%;transform:translate(-50%,-50%);z-index:5;`;
            this.screen.appendChild(seamBottom);
        }
        
        // Иконки
        this.iconContainer = document.createElement('div');
        this.iconContainer.style.cssText = 'position:absolute;top:25%;left:0;width:100%;height:50%;white-space:nowrap;overflow:hidden;z-index:3;';
        this.screen.appendChild(this.iconContainer);
        this.buildCarousel();
        
        // Анимация — в 2 раза крупнее чем было, но не перекрывает
        this.stepVideo = document.createElement('video');
        this.stepVideo.src = 'assets/animation/step_up.webm';
        this.stepVideo.loop = false;
        this.stepVideo.muted = true;
        this.stepVideo.playsInline = true;
        this.stepVideo.style.cssText = 'position:absolute;bottom:1%;left:50%;transform:translateX(-50%);width:20vw;max-width:120px;height:auto;z-index:4;pointer-events:none;';
        this.screen.appendChild(this.stepVideo);
        
        // Кнопка домой
        const homeBtn = document.createElement('img');
        homeBtn.src = 'assets/Sherwood_Square/oak_area.png';
        homeBtn.style.cssText = 'position:absolute;top:2%;left:2%;width:8vw;max-width:50px;height:auto;cursor:pointer;z-index:10;';
        homeBtn.onclick = () => { if (typeof showHomeScreen === 'function') showHomeScreen(); };
        this.screen.appendChild(homeBtn);
        
        // Стрелки
        const leftArrow = document.createElement('img');
        leftArrow.src = 'assets/icons/left.png';
        leftArrow.style.cssText = 'position:absolute;left:2%;top:50%;transform:translateY(-50%);width:8vw;max-width:50px;height:auto;cursor:pointer;z-index:10;';
        leftArrow.onclick = () => this.prev();
        this.screen.appendChild(leftArrow);
        
        const rightArrow = document.createElement('img');
        rightArrow.src = 'assets/icons/right.png';
        rightArrow.style.cssText = 'position:absolute;right:2%;top:50%;transform:translateY(-50%);width:8vw;max-width:50px;height:auto;cursor:pointer;z-index:10;';
        rightArrow.onclick = () => this.next();
        this.screen.appendChild(rightArrow);
    },
    
    buildCarousel() {
        this.iconContainer.innerHTML = '';
        
        this.buildings.forEach((building) => {
            const section = document.createElement('div');
            section.style.cssText = 'display:inline-block;width:100%;height:100%;text-align:center;vertical-align:top;cursor:pointer;';
            
            const img = new Image();
            img.src = `assets/icons/${this.getIconFile(building.icon)}`;
            img.style.cssText = 'width:auto;height:60%;max-width:40%;object-fit:contain;margin-top:5%;pointer-events:none;';
            
            const label = document.createElement('div');
            label.textContent = building.name;
            label.style.cssText = 'color:#e8d8c0;font-size:1.1em;font-weight:bold;pointer-events:none;';
            
            section.appendChild(img);
            section.appendChild(label);
            section.onclick = () => this.interact(building);
            
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
            }, 400);
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
