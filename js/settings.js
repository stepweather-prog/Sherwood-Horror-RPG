// js/settings.js
const Settings = {
    data: {
        musicEnabled: true,
        soundEnabled: true,
    },
    
    init() {
        const saved = localStorage.getItem('sherwood_settings');
        if (saved) {
            try {
                this.data = JSON.parse(saved);
            } catch(e) {
                console.warn('Ошибка загрузки настроек');
            }
        }
    },
    
    save() {
        localStorage.setItem('sherwood_settings', JSON.stringify(this.data));
    },
    
    get(key) {
        return this.data[key];
    },
    
    set(key, value) {
        this.data[key] = value;
        this.save();
    },
    
    toggleMusic() {
        this.data.musicEnabled = !this.data.musicEnabled;
        this.save();
        return this.data.musicEnabled;
    },
    
    toggleSound() {
        this.data.soundEnabled = !this.data.soundEnabled;
        this.save();
        return this.data.soundEnabled;
    },
    
    isMusicEnabled() {
        return this.data.musicEnabled;
    },
    
    isSoundEnabled() {
        return this.data.soundEnabled;
    }
};

Settings.init();
