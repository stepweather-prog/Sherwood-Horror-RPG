const Textures = {
    floor: [],
    ceiling: [],
    walls: [],
    oak: null,
    buildings: {},
    seamBottom: null,
    seamTop: null,
    
    floorCanvas: null,
    ceilingCanvas: null,
    
    loaded: false,
    totalTextures: 0,
    loadedTextures: 0,
    
    load(callback) {
        // Пол - 6 плиток
        for (let i = 1; i <= 6; i++) {
            this.loadImage(`assets/Sherwood_Square/floor_area_${i}.png`, (img) => {
                this.floor.push(img);
                this.checkLoaded(callback);
            });
        }
        
        // Потолок - 11 обычных + луна
        for (let i = 1; i <= 11; i++) {
            this.loadImage(`assets/Sherwood_Square/ceiling_area_${i}.png`, (img) => {
                this.ceiling.push(img);
                this.checkLoaded(callback);
            });
        }
        
        this.loadImage('assets/Sherwood_Square/area_ceiling_moon.png', (img) => {
            this.ceiling.push(img);
            this.checkLoaded(callback);
        });
        
        // Стены - 5 плиток
        for (let i = 1; i <= 5; i++) {
            this.loadImage(`assets/Sherwood_Square/wall_area_${i}.png`, (img) => {
                this.walls.push(img);
                this.checkLoaded(callback);
            });
        }
        
        // Дуб
        this.loadImage('assets/Sherwood_Square/oak_area.png', (img) => {
            this.oak = img;
            this.checkLoaded(callback);
        });
        
        // Швы
        this.loadImage('assets/game_details/seam_bottom.png', (img) => {
            this.seamBottom = img;
            this.checkLoaded(callback);
        });
        
        this.loadImage('assets/game_details/seam_top.png', (img) => {
            this.seamTop = img;
            this.checkLoaded(callback);
        });
        
        // Иконки зданий
        const buildingIcons = {
            'Чат': 'chat_button.png',
            'Профиль': 'player_profile.png',
            'Арена': 'arena.png',
            'Порталы': 'portal.png',
            'Таверна': 'tavern.png',
            'Подземка': 'subway.png',
            'Кузница': 'forge.png',
            'Тренировка': 'training.png',
            'Бестиарий': 'bestiary.png',
            'Очаг': 'button_hearth.png',
            'Рынок': 'sherwood_market.png',
            'Трофейный зал': 'hero_bag.png',
            'Квесты': 'quest.png',
            'Рейд': 'raid.png',
            'all_stat': 'all_stat.png',
        };
        
        this.totalTextures = 6 + 12 + 5 + 1 + 2 + Object.keys(buildingIcons).length;
        
        for (const [name, file] of Object.entries(buildingIcons)) {
            this.loadImage(`assets/icons/${file}`, (img) => {
                this.buildings[name] = img;
                this.checkLoaded(callback);
            });
        }
    },
    
    loadImage(src, callback) {
        const img = new Image();
        img.onload = () => callback(img);
        img.onerror = () => {
            console.warn('Не удалось загрузить:', src);
            callback(null);
        };
        img.src = src;
    },
    
    createFloorCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024 * 3;
        canvas.height = 1024 * 2;
        const c = canvas.getContext('2d');
        
        for (let i = 0; i < this.floor.length; i++) {
            const x = (i % 3) * 1024;
            const y = Math.floor(i / 3) * 1024;
            c.drawImage(this.floor[i], x, y, 1024, 1024);
        }
        
        return canvas;
    },
    
    createCeilingCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024 * 4;
        canvas.height = 1024 * 3;
        const c = canvas.getContext('2d');
        
        for (let i = 0; i < this.ceiling.length; i++) {
            const x = (i % 4) * 1024;
            const y = Math.floor(i / 4) * 1024;
            c.drawImage(this.ceiling[i], x, y, 1024, 1024);
        }
        
        return canvas;
    },
    
    checkLoaded(callback) {
        this.loadedTextures++;
        
        if (this.loadedTextures >= this.totalTextures) {
            this.loaded = true;
            this.floorCanvas = this.createFloorCanvas();
            this.ceilingCanvas = this.createCeilingCanvas();
            console.log('Все текстуры загружены!');
            if (callback) callback();
        }
    }
};
