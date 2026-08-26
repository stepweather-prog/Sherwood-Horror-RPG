// js/menu.js
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
        { icon: 'oak', name: 'Домой' },
    ],
    
    currentIndex: 0,
    canvas: null,
    ctx: null,
    W: 0,
    H: 0,
    iconRect: { x: 0, y: 0, w: 0, h: 0 },
    running: false,
    leftArrow: null,
    rightArrow: null,
    wallImage: null,
    ceilingImage: null,
    floorImage: null,
    stepVideo: null,
    
    init() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.canvas.width = this.W;
        this.canvas.height = this.H;
        
        this.leftArrow = new Image();
        this.leftArrow.src = 'assets/icons/left.png';
        this.rightArrow = new Image();
        this.rightArrow.src = 'assets/icons/right.png';
        this.wallImage = new Image();
        this.wallImage.src = 'assets/Sherwood_Square/wall_area_1.png';
        this.ceilingImage = new Image();
        this.ceilingImage.src = 'assets/Sherwood_Square/area_ceiling_moon.png';
        this.floorImage = new Image();
        this.floorImage.src = 'assets/Sherwood_Square/floor_area_1.png';
        
        this.stepVideo = document.createElement('video');
        this.stepVideo.src = 'assets/animation/step_up.webm';
        this.stepVideo.loop = true;
        this.stepVideo.muted = true;
        this.stepVideo.playsInline = true;
        
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
        
        this.running = true;
        this.render();
    },
    
    resize() {
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.canvas.width = this.W;
        this.canvas.height = this.H;
    },
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.buildings.length;
        this.playStepAnimation();
    },
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.buildings.length) % this.buildings.length;
        this.playStepAnimation();
    },
    
    playStepAnimation() {
        if (this.stepVideo) {
            this.stepVideo.currentTime = 0;
            this.stepVideo.play().catch(() => {});
        }
    },
    
    interact() {
        const building = this.buildings[this.currentIndex];
        if (building.icon === 'oak') {
            if (typeof showHomeScreen === 'function') showHomeScreen();
        } else if (building.icon === 'Подземка') {
            if (typeof showDungeonScreen === 'function') showDungeonScreen();
        } else {
            if (typeof showSectionScreen === 'function') showSectionScreen(building);
        }
    },
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.processTap(x, y);
    },
    
    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        this.processTap(x, y);
    },
    
    processTap(x, y) {
        const arrowSize = Math.min(this.W * 0.1, 70);
        if (x < arrowSize + 20) {
            this.prev();
            return;
        }
        if (x > this.W - arrowSize - 20) {
            this.next();
            return;
        }
        if (x >= this.iconRect.x && x <= this.iconRect.x + this.iconRect.w &&
            y >= this.iconRect.y && y <= this.iconRect.y + this.iconRect.h) {
            this.interact();
        }
    },
    
    render() {
        if (!this.running) return;
        
        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        
        // Потолок — луна
        const skyHeight = Math.floor(H * 0.25);
        if (this.ceilingImage && this.ceilingImage.complete && this.ceilingImage.naturalWidth > 0) {
            ctx.drawImage(this.ceilingImage, 0, 0, W, skyHeight);
        } else {
            ctx.fillStyle = '#1a1208';
            ctx.fillRect(0, 0, W, skyHeight);
        }
        
        // Стена — статичная
        const wallHeight = Math.floor(H * 0.5);
        const wallY = skyHeight;
        if (this.wallImage && this.wallImage.complete && this.wallImage.naturalWidth > 0) {
            ctx.drawImage(this.wallImage, 0, wallY, W, wallHeight);
        } else {
            ctx.fillStyle = '#3a2a1a';
            ctx.fillRect(0, wallY, W, wallHeight);
        }
        
        // Пол
        const floorY = wallY + wallHeight;
        if (this.floorImage && this.floorImage.complete && this.floorImage.naturalWidth > 0) {
            ctx.drawImage(this.floorImage, 0, floorY, W, H - floorY);
        } else {
            ctx.fillStyle = '#2a1a0a';
            ctx.fillRect(0, floorY, W, H - floorY);
        }
        
        // Разделители
        if (Textures.seamTop) {
            ctx.drawImage(Textures.seamTop, 0, wallY - 10, W, 20);
        }
        if (Textures.seamBottom) {
            ctx.drawImage(Textures.seamBottom, 0, floorY - 10, W, 20);
        }
        
        // Анимация шага на полу
        if (this.stepVideo && this.stepVideo.readyState >= 2 && !this.stepVideo.paused) {
            const videoSize = Math.min(W * 0.3, H * 0.3);
            ctx.drawImage(this.stepVideo, W/2 - videoSize/2, floorY - videoSize/2, videoSize, videoSize);
        }
        
        // Иконка
        const building = this.buildings[this.currentIndex];
        const iconSize = Math.min(H * 0.3, W * 0.3);
        const sx = W / 2 - iconSize / 2;
        const sy = wallY + wallHeight / 2 - iconSize / 2;
        this.iconRect = { x: sx, y: sy, w: iconSize, h: iconSize };
        
        if (building.icon === 'oak' && Textures.oak) {
            ctx.drawImage(Textures.oak, sx, sy, iconSize, iconSize);
        } else if (Textures.buildings[building.icon]) {
            ctx.drawImage(Textures.buildings[building.icon], sx, sy, iconSize, iconSize);
        }
        
        // Табличка
        if (Textures.buildings['all_stat']) {
            const signW = iconSize * 1.2;
            const signH = iconSize * 0.25;
            ctx.drawImage(Textures.buildings['all_stat'], W/2 - signW/2, sy + iconSize + 5, signW, signH);
            ctx.fillStyle = '#e8d8c0';
            ctx.font = `bold ${Math.floor(signH*0.5)}px "Times New Roman", serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(building.name, W/2, sy + iconSize + 5 + signH/2);
        }
        
        // Стрелки
        const arrowSize = Math.min(W * 0.1, 70);
        if (this.leftArrow && this.leftArrow.complete) {
            ctx.drawImage(this.leftArrow, 20, H/2 - arrowSize/2, arrowSize, arrowSize);
        }
        if (this.rightArrow && this.rightArrow.complete) {
            ctx.drawImage(this.rightArrow, W - 20 - arrowSize, H/2 - arrowSize/2, arrowSize, arrowSize);
        }
        
        requestAnimationFrame(() => this.render());
    },
    
    destroy() {
        this.running = false;
        if (this.stepVideo) {
            this.stepVideo.pause();
        }
    }
};
