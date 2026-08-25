// Загрузчик текстур
const Textures = {
    floor: [],
    ceiling: [],
    walls: [],
    moon: null,
    oak: null,
    buildings: {},
    
    loaded: false,
    totalTextures: 0,
    loadedTextures: 0,
    
    load(callback) {
        // Пол - 6 плиток
        for (let i = 1; i <= 6; i++) {
            this.loadImage(`assets/floor_area_${i}.png`, (img) => {
                this.floor.push(img);
                this.checkLoaded(callback);
            });
        }
        
        // Потолок - 11 плиток
        for (let i = 1; i <= 11; i++) {
            this.loadImage(`assets/ceiling_area_${i}.png`, (img) => {
                this.ceiling.push(img);
                this.checkLoaded(callback);
            });
        }
        
        // Стены - 10 плиток
        for (let i = 1; i <= 10; i++) {
            this.loadImage(`assets/wall_area_${i}.png`, (img) => {
                this.walls.push(img);
                this.checkLoaded(callback);
            });
        }
        
        // Луна
        this.loadImage('assets/area_ceiling_moon.png', (img) => {
            this.moon = img;
            this.checkLoaded(callback);
        });
        
        // Дуб
        this.loadImage('assets/oak_area.png', (img) => {
            this.oak = img;
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
            'Ежедневные': 'daily_quests.png',
            'Настройки': 'settings.png',
        };
        
        this.totalTextures = 6 + 11 + 10 + 1 + 1 + Object.keys(buildingIcons).length;
        
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
    
    checkLoaded(callback) {
        this.loadedTextures++;
        console.log(`Загружено: ${this.loadedTextures}/${this.totalTextures}`);
        
        if (this.loadedTextures >= this.totalTextures) {
            this.loaded = true;
            console.log('Все текстуры загружены!');
            if (callback) callback();
        }
    },
    
    // Получить случайную текстуру для клетки
    getRandomFloor() {
        return this.floor[Math.floor(Math.random() * this.floor.length)];
    },
    
    getRandomCeiling() {
        return this.ceiling[Math.floor(Math.random() * this.ceiling.length)];
    },
    
    getRandomWall() {
        return this.walls[Math.floor(Math.random() * this.walls.length)];
    }
};
