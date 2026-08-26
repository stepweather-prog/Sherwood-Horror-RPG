const Textures = {
    floor: [],
    ceiling: [],
    walls: [],
    oak: null,
    buildings: {},
    seamBottom: null,
    seamTop: null,
    
    floorTiles: [],
    ceilingTiles: [],
    wallTiles: [],
    
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
    
    generateTileMaps() {
        this.floorTiles = this.generateMap(6);
        this.ceilingTiles = this.generateMap(12);
        this.wallTiles = this.generateMap(5);
        
        // Луна — в центре карты (клетка 4,4)
        this.ceilingTiles[4][4] = 11; // Индекс 11 = луна (12-я текстура)
    },
    
    generateMap(textureCount) {
        const tiles = [];
        for (let y = 0; y < 10; y++) {
            tiles[y] = [];
            for (let x = 0; x < 10; x++) {
                tiles[y][x] = Math.floor(Math.random() * textureCount);
            }
        }
        return tiles;
    },
    
    getFloorTexture(mapX, mapY) {
        if (mapY >= 0 && mapY < 10 && mapX >= 0 && mapX < 10) {
            const idx = this.floorTiles[mapY]?.[mapX];
            if (idx !== undefined && this.floor[idx]) {
                return this.floor[idx];
            }
        }
        return this.floor[0] || null;
    },
    
    getCeilingTexture(mapX, mapY) {
        if (mapY >= 0 && mapY < 10 && mapX >= 0 && mapX < 10) {
            const idx = this.ceilingTiles[mapY]?.[mapX];
            if (idx !== undefined && this.ceiling[idx]) {
                return this.ceiling[idx];
            }
        }
        return this.ceiling[0] || null;
    },
    
    getWallTexture(mapX, mapY) {
        if (this.walls.length > 0) {
            return this.walls[0];
        }
        return null;
    },
    
    checkLoaded(callback) {
        this.loadedTextures++;
        
        if (this.loadedTextures >= this.totalTextures) {
            this.loaded = true;
            this.generateTileMaps();
            console.log('Все текстуры загружены!');
            if (callback) callback();
        }
    }
};
