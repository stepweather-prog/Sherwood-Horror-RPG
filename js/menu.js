// ========== МЕНЮ ГОРОДА ==========
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
    
    init() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.canvas.width = this.W;
        this.canvas.height = this.H;
        
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
    },
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.buildings.length) % this.buildings.length;
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
        if (x < 80) {
            this.prev();
            return;
        }
        if (x > this.W - 80) {
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
        
        ctx.fillStyle = '#0a0805';
        ctx.fillRect(0, 0, W, H);
        
        const skyHeight = Math.floor(H * 0.25);
        if (Textures.loaded && Textures.ceilingCanvas) {
            ctx.drawImage(Textures.ceilingCanvas, 0, 0, W, skyHeight);
        }
        
        const wallHeight = Math.floor(H * 0.4);
        const wallY = skyHeight;
        const wallTex = Textures.walls[this.currentIndex % Textures.walls.length];
        if (wallTex) {
            ctx.drawImage(wallTex, 0, wallY, W, wallHeight);
        }
        
        const floorY = wallY + wallHeight;
        if (Textures.loaded && Textures.floorCanvas) {
            ctx.drawImage(Textures.floorCanvas, 0, floorY, W, H - floorY);
        }
        
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, wallY - 2, W, 4);
        ctx.fillRect(0, floorY - 2, W, 4);
        
        const building = this.buildings[this.currentIndex];
        const iconSize = Math.min(H * 0.3, W * 0.3);
        const sx = W / 2 - iconSize / 2;
        const sy = wallY + wallHeight / 2 - iconSize / 2;
        
        this.iconRect = { x: sx, y: sy, w: iconSize, h: iconSize };
        
        if (building.icon === 'oak') {
            if (Textures.oak) {
                ctx.drawImage(Textures.oak, sx, sy, iconSize, iconSize);
            }
        } else if (Textures.buildings[building.icon]) {
            ctx.drawImage(Textures.buildings[building.icon], sx, sy, iconSize, iconSize);
        }
        
        if (Textures.buildings['all_stat']) {
            const signW = iconSize * 1.2;
            const signH = iconSize * 0.25;
            const signX = W / 2 - signW / 2;
            const signY = sy + iconSize + 5;
            
            ctx.drawImage(Textures.buildings['all_stat'], signX, signY, signW, signH);
            ctx.fillStyle = '#e8d8c0';
            ctx.font = `bold ${Math.floor(signH * 0.5)}px "Times New Roman", serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(building.name, W / 2, signY + signH / 2);
        }
        
        const arrowSize = Math.min(W * 0.08, 60);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(10, H / 2 - arrowSize / 2, arrowSize, arrowSize);
        ctx.fillRect(W - 10 - arrowSize, H / 2 - arrowSize / 2, arrowSize, arrowSize);
        ctx.fillStyle = '#c8a050';
        ctx.font = `${arrowSize * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('◀', 10 + arrowSize / 2, H / 2);
        ctx.fillText('▶', W - 10 - arrowSize / 2, H / 2);
        
        requestAnimationFrame(() => this.render());
    },
    
    destroy() {
        this.running = false;
    }
};
