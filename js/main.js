const loadingScreen = document.getElementById('loadingScreen');
const homeScreen = document.getElementById('homeScreen');
const playButton = document.getElementById('playButton');
const hero = document.getElementById('hero');
const gameCanvas = document.getElementById('game');

let currentScreen = 'loading';

playButton.addEventListener('click', () => {
    loadingScreen.style.display = 'none';
    homeScreen.style.display = 'block';
    currentScreen = 'home';
    
    const video = document.getElementById('videoBackground');
    video.play().catch(() => {});
});

hero.addEventListener('click', () => {
    homeScreen.style.display = 'none';
    gameCanvas.style.display = 'block';
    currentScreen = 'game';
    
    AudioManager.playCityTheme();
    
    if (typeof startGame === 'function') {
        startGame();
    }
});
