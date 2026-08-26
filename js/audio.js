// js/audio.js
const AudioManager = {
    cityTracks: [
        'assets/music/city_theme1.ogg',
        'assets/music/city_theme2.ogg',
        'assets/music/city_theme3.ogg',
        'assets/music/city_theme4.ogg',
        'assets/music/city_theme5.ogg',
    ],
    currentTrackIndex: 0,
    currentMusic: null,
    
    init() {
        this.currentTrackIndex = 0;
    },
    
    playCityTheme() {
        this.stopCityTheme();
        
        const trackSrc = this.cityTracks[this.currentTrackIndex];
        this.currentMusic = new Audio(trackSrc);
        this.currentMusic.loop = true;
        this.currentMusic.volume = 0.5;
        this.currentMusic.play().catch(() => {});
        
        // Переключаем на следующий трек для следующего входа
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.cityTracks.length;
    },
    
    stopCityTheme() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }
};

AudioManager.init();
