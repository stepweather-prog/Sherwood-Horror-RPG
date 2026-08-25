const AudioManager = {
    cityMusic: null,
    
    init() {
        this.cityMusic = new Audio('assets/music/city_theme.ogg');
        this.cityMusic.loop = true;
        this.cityMusic.volume = 0.5;
    },
    
    playCityTheme() {
        if (this.cityMusic) {
            this.cityMusic.play().catch(() => {});
        }
    },
    
    stopCityTheme() {
        if (this.cityMusic) {
            this.cityMusic.pause();
            this.cityMusic.currentTime = 0;
        }
    }
};

AudioManager.init();
