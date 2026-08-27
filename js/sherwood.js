// js/sherwood.js
const Sherwood = {
    player: {
        level: 1,
        exp: 0,
        resources: {
            gold: 1000,
            silver: 5000,
            scrolls: 0,
        },
        stats: {
            hp: 100,
            maxHp: 100,
            attack: 10,
            defense: 5,
        },
        talents: {},
        tavern: {
            questsCompleted: 0,
            dailyQuestsDone: 0,
            cooldownEnd: 0,
            secretUnlocked: false,
            currentQuest: null,
            contractStartTime: 0,
            contractEndTime: 0,
            contractResult: null,
        },
    },
    
    getPlayer() {
        return this.player;
    },
    
    addExp(amount) {
        this.player.exp += amount;
        const needed = this.player.level * 100;
        while (this.player.exp >= needed) {
            this.player.exp -= needed;
            this.player.level++;
            this.player.stats.maxHp += 20;
            this.player.stats.hp = this.player.stats.maxHp;
            this.player.stats.attack += 3;
            this.player.stats.defense += 2;
        }
        this.saveGame();
    },
    
    addResource(type, amount) {
        if (!this.player.resources[type]) this.player.resources[type] = 0;
        this.player.resources[type] += amount;
        this.saveGame();
    },
    
    calculateDamage(attack, defense) {
        const dmg = attack - defense;
        return Math.max(1, Math.floor(dmg * (0.9 + Math.random() * 0.2)));
    },
    
    saveGame() {
        localStorage.setItem('sherwood_save', JSON.stringify(this.player));
    },
    
    loadGame() {
        const saved = localStorage.getItem('sherwood_save');
        if (saved) {
            try {
                this.player = JSON.parse(saved);
            } catch(e) {
                console.warn('Ошибка загрузки сохранения');
            }
        }
    },
    
    dispatch(action) {
        console.log('Dispatch:', action);
    }
};

Sherwood.loadGame();
