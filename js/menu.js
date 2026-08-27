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
    ],
    
    currentIndex: 0,
    canvas: null,
    ctx: null,
    W: 0,
    H: 0,
    iconRect: { x: 0, y: 0, w: 0, h: 0 },
    homeRect: { x: 0, y: 0, w: 0, h: 0 },
    running: false,
    leftArrow: null,
    rightArrow: null,
    wallImage: null,
    ceilingImage: null,
    floorImages: [],
    stepVideo: null,
    stepTimer: null,
    wallOffset: 0,
    targetWallOffset: 0,
    
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
        
        this.floorImages = [];
        for (let i = 1; i <= 3; i++) {
            const img = new Image();
            img.src = `assets/Sherwood_Square/floor${i}.png`;
            this.floorImages.push(img);
        }
        
        this.stepVideo = document.createElement('video');
        this.stepVideo.src = 'assets/animation/step_up.webm';
        this.stepVideo.loop = false;
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
        this.targetWallOffset = -this.currentIndex * this.W;
        this.playStepAnimation();
    },
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.buildings.length) % this.buildings.length;
        this.targetWallOffset = -this.currentIndex * this.W;
        this.playStepAnimation();
    },
    
    playStepAnimation() {
        if (this.stepVideo) {
            this.stepVideo.currentTime = 0;
            this.stepVideo.play().catch(() => {});
            
            clearTimeout(this.stepTimer);
            this.stepTimer = setTimeout(() => {
                this.stepVideo.pause();
                // Замирает на последнем кадре
                if (this.stepVideo.duration) {
                    this.stepVideo.currentTime = this.stepVideo.duration;
                }
            }, 600);
        }
    },
    
    interact() {
        const building = this.buildings[this.currentIndex];
        if (building.icon === 'Подземка') {
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
        if (this.homeRect && 
            x >= this.homeRect.x && x <= this.homeRect.x + this.homeRect.w &&
            y >= this.homeRect.y && y <= this.homeRect.y + this.homeRect.h) {
            if (typeof showHomeScreen === 'function') showHomeScreen();
            return;
        }
        
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
        
        const skyHeight = Math.floor(H * 0.25);
        const wallHeight = Math.floor(H * 0.5);
        const floorY = skyHeight + wallHeight;
        const tileHeight = H - floorY;
        const tileWidth = W / 3;
        const sectionWidth = W;
        
        this.wallOffset += (this.targetWallOffset - this.wallOffset) * 0.08;
        
        // Потолок
        if (this.ceilingImage && this.ceilingImage.complete) {
            ctx.drawImage(this.ceilingImage, 0, 0, W, skyHeight);
        }
        
        // Кнопка домой
        if (typeof Textures !== 'undefined' && Textures.oak) {
            const homeSize = Math.min(W * 0.1, H * 0.1);
            ctx.drawImage(Textures.oak, 20, 20, homeSize, homeSize);
            this.homeRect = { x: 20, y: 20, w: homeSize, h: homeSize };
        }
        
        // Пол — три плиты
        if (this.floorImages && this.floorImages.length === 3) {
            for (let i = 0; i < 3; i++) {
                const img = this.floorImages[i];
                if (img && img.complete) {
                    ctx.drawImage(img, i * tileWidth, floorY, tileWidth, tileHeight);
                }
            }
        }
        
        // Стена и иконки — карусель
        const wallY = skyHeight;
        
        if (this.wallImage && this.wallImage.complete) {
            const totalWidth = this.buildings.length * sectionWidth;
            let scrollX = this.wallOffset % totalWidth;
            if (scrollX > 0) scrollX -= totalWidth;
            
            for (let i = 0; i < this.buildings.length; i++) {
                let wallX = i * sectionWidth + scrollX;
                
                if (wallX + sectionWidth < -sectionWidth) wallX += totalWidth;
                if (wallX > W + sectionWidth) wallX -= totalWidth;
                
                if (wallX + sectionWidth >= 0 && wallX <= W) {
                    ctx.drawImage(this.wallImage, wallX, wallY, sectionWidth, wallHeight);
                    
                    const building = this.buildings[i];
                    const iconSize = Math.min(wallHeight * 0.7, W * 0.35);
                    const drawX = wallX + sectionWidth / 2 - iconSize / 2;
                    const sy = wallY + wallHeight / 2 - iconSize / 2 - 20;
                    
                    if (i === this.currentIndex) {
                        this.iconRect = { x: drawX, y: sy, w: iconSize, h: iconSize };
                    }
                    
                    if (typeof Textures !== 'undefined' && Textures.buildings && Textures.buildings[building.icon]) {
                        ctx.drawImage(Textures.buildings[building.icon], drawX, sy, iconSize, iconSize);
                    }
                    
                    if (typeof Textures !== 'undefined' && Textures.buildings && Textures.buildings['all_stat']) {
                        const signW = iconSize * 1.2;
                        const signH = iconSize * 0.3;
                        const signX = drawX + iconSize / 2 - signW / 2;
                        const signY = sy + iconSize + 15;
                        
                        ctx.drawImage(Textures.buildings['all_stat'], signX, signY, signW, signH);
                        ctx.fillStyle = '#e8d8c0';
                        ctx.font = `bold ${Math.floor(signH * 0.5)}px "Times New Roman", serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(building.name, drawX + iconSize / 2, signY + signH / 2);
                    }
                }
            }
        }
        
        // Разделители — крупнее
        const seamHeight = 80;
        
        if (typeof Textures !== 'undefined' && Textures.seamTop && Textures.seamTop.complete) {
            const img = Textures.seamTop;
            for (let i = 0; i < 3; i++) {
                ctx.drawImage(img, i * tileWidth, wallY - seamHeight/2, tileWidth, seamHeight);
            }
        }
        
        if (typeof Textures !== 'undefined' && Textures.seamBottom && Textures.seamBottom.complete) {
            const img = Textures.seamBottom;
            for (let i = 0; i < 3; i++) {
                ctx.drawImage(img, i * tileWidth, floorY - seamHeight/2, tileWidth, seamHeight);
            }
        }
        
        // Анимация — крупнее, замирает
        if (this.stepVideo && this.stepVideo.readyState >= 2) {
            const videoSize = Math.min(W * 0.35, H * 0.35);
            const videoX = W / 2 - videoSize / 2;
            const videoY = H - videoSize;
            ctx.drawImage(this.stepVideo, videoX, videoY, videoSize, videoSize);
        }
        
        // Стрелки
        const arrowSize = Math.min(W * 0.1, 70);
        if (this.leftArrow && this.leftArrow.complete) {
            ctx.drawImage(this.leftArrow, 20, H / 2 - arrowSize / 2, arrowSize, arrowSize);
        }
        if (this.rightArrow && this.rightArrow.complete) {
            ctx.drawImage(this.rightArrow, W - 20 - arrowSize, H / 2 - arrowSize / 2, arrowSize, arrowSize);
        }
        
        requestAnimationFrame(() => this.render());
    },
    
    destroy() {
        this.running = false;
        clearTimeout(this.stepTimer);
        if (this.stepVideo) this.stepVideo.pause();
    }
};
